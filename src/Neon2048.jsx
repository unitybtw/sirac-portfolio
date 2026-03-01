import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const Neon2048 = ({ onGameOver }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);


// --- Audio Helper ---
const playSound = (type) => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        switch(type) {
            case 'pew': // High pitch short ping (shooting, selecting)
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                break;
            case 'bump': // Low pitch thud (hitting wall, bouncing)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                break;
            case 'coin': // classic arcade coin/point sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                osc.frequency.setValueAtTime(1600, audioCtx.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
                osc.start(); osc.stop(audioCtx.currentTime + 0.2);
                break;
            case 'boom': // explosion or fail
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start(); osc.stop(audioCtx.currentTime + 0.3);
                break;
            case 'jump': // ascending slide
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
                osc.start(); osc.stop(audioCtx.currentTime + 0.15);
                break;
            case 'click': // simple UI click
                osc.type = 'square';
                osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                osc.start(); osc.stop(audioCtx.currentTime + 0.05);
                break;
        }
    } catch(e) {}
};

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let anim, _lastFrameTime = 0;
    

    let grid = Array(4).fill().map(()=>Array(4).fill(0));
    let scoreVal = 0;
    
    const addRandom = () => {
        let empty = [];
        for(let r=0; r<4; r++) for(let c=0; c<4; c++) if(grid[r][c]===0) empty.push({r,c});
        if(empty.length > 0) {
            let pos = empty[Math.floor(Math.random()*empty.length)];
            grid[pos.r][pos.c] = Math.random() > 0.1 ? 2 : 4;
        }
    };
    addRandom(); addRandom();
    
    const slide = (row) => {
        let arr = row.filter(val => val);
        for(let i=0; i<arr.length-1; i++) {
            if(arr[i] === arr[i+1]) { arr[i]*=2; scoreVal+=arr[i]; arr.splice(i+1,1); }
        }
        while(arr.length<4) arr.push(0);
        return arr;
    };
    
    const move = (e) => {
        let moved = false;
        if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "s", "a", "d"].includes(e.key) || ["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
        
        if(e.key==='ArrowLeft'||e.key==='a') {
            for(let r=0; r<4; r++){ let row = grid[r]; let newR = slide(row); if(row.join(',')!==newR.join(',')) moved=true; grid[r]=newR;}
        }
        else if(e.key==='ArrowRight'||e.key==='d') {
            for(let r=0; r<4; r++){ let row = grid[r]; let newR = slide(row.reverse()).reverse(); if(row.reverse().join(',')!==newR.join(',')) moved=true; grid[r]=newR;}
        }
        else if(e.key==='ArrowUp'||e.key==='w') {
            for(let c=0; c<4; c++){ let col=[grid[0][c],grid[1][c],grid[2][c],grid[3][c]]; let newC=slide(col); if(col.join(',')!==newC.join(',')) moved=true; for(let r=0;r<4;r++) grid[r][c]=newC[r];}
        }
        else if(e.key==='ArrowDown'||e.key==='s') {
            for(let c=0; c<4; c++){ let col=[grid[0][c],grid[1][c],grid[2][c],grid[3][c]]; let newC=slide(col.reverse()).reverse(); if(col.reverse().join(',')!==newC.join(',')) moved=true; for(let r=0;r<4;r++) grid[r][c]=newC[r];}
        }
        
        if(moved) { addRandom(); setScore(scoreVal); playSound('coin'); }
    };
    window.addEventListener('keydown', move, {passive: false});
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let pad = 10, size = (400 - pad*5) / 4;
        let startX = 100;
        
        for(let r=0; r<4; r++){
            for(let c=0; c<4; c++){
                let val = grid[r][c];
                ctx.fillStyle = val===0 ? '#111' : `hsl(${Math.log2(val)*30}, 80%, 50%)`;
                ctx.fillRect(startX + pad + c*(size+pad), pad + r*(size+pad), size, size);
                
                if(val > 0) {
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px monospace';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(val.toString(), startX + pad + c*(size+pad) + size/2, pad + r*(size+pad) + size/2);
                }
            }
        }
        ctx.textAlign = 'left';
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', move); };

    
  }, [isPlaying]);

  
    // --- Score Persistence ---
    const scoreRef = useRef(0);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return <div style={{position:'relative', width:'100%', height:'100%', background:'#050508'}}>
    <canvas ref={canvasRef} width={600} height={400} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
    {isPlaying ? <div style={{position:'absolute',top:10,left:10,color:'#fff',fontFamily:'monospace'}}>Score/Stat: {score}</div> : 
      <div style={{position:'absolute',inset:0,display:'flex',justifyContent:'center',alignItems:'center',background:'rgba(0,0,0,0.8)',flexDirection:'column'}}>
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon 2048</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default Neon2048;
