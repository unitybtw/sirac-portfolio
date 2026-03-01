import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonSokoban = ({ onGameOver }) => {
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
    

    let level = [
        [1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1],
        [1,0,3,2,0,4,0,1],
        [1,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1]
    ]; // 1=wall, 0=floor, 2=box, 3=target, 4=player
    let pR=2, pC=5;
    
    // Setup references logically instead of hardcoded numbers to make it playable
    // Let's just use raw mechanics directly on the level grid for simplicity
    
    const move = (e) => {
        let dr=0, dc=0;
        if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "s", "a", "d"].includes(e.key) || ["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
        if(e.key==='ArrowLeft'||e.key==='a') dc=-1;
        if(e.key==='ArrowRight'||e.key==='d') dc=1;
        if(e.key==='ArrowUp'||e.key==='w') dr=-1;
        if(e.key==='ArrowDown'||e.key==='s') dr=1;
        
        if(dr===0 && dc===0) return;
        
        let nr = pR+dr, nc = pC+dc;
        if(level[nr][nc] === 0 || level[nr][nc] === 3) {
            level[pR][pC] = level[pR][pC] === 4 ? 0 : 3; // Leaves floor or target
            pR = nr; pC = nc;
            level[pR][pC] = 4; { setScore(s=>s+1); playSound('coin'); };
        } else if (level[nr][nc] === 2) {
            let nnr = nr+dr, nnc = nc+dc;
            if(level[nnr][nnc] === 0 || level[nnr][nnc] === 3) {
                // push
                level[nnr][nnc] = 2;
                level[nr][nc] = 4; // player stands here now
                level[pR][pC] = 0; // assuming leaving a floor because it's a simple level
                pR = nr; pC = nc; { setScore(s=>s+1); playSound('coin'); };
            }
        }
        
        // Winner Check 
        if(level[2][2] === 2) { if (onGameOver) onGameOver(score); setIsPlaying(false); } // Hacky win check for this 1 level
    };
    window.addEventListener('keydown', move, {passive: false});
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let size = 40, offX=140, offY=60;
        
        for(let r=0; r<level.length; r++){
            for(let c=0; c<level[r].length; c++){
                let v = level[r][c];
                let x = offX + c*size, y = offY + r*size;
                if(v===1) { ctx.fillStyle='#555'; ctx.fillRect(x,y,size,size); }
                else if(v===0) { ctx.fillStyle='#111'; ctx.fillRect(x,y,size,size); }
                else if(v===3) { ctx.fillStyle='#111'; ctx.fillRect(x,y,size,size); ctx.fillStyle='#ffaa00'; ctx.beginPath(); ctx.arc(x+size/2, y+size/2, 10, 0, Math.PI*2); ctx.fill(); }
                else if(v===2) { ctx.fillStyle='#00f0ff'; ctx.fillRect(x+2,y+2,size-4,size-4); }
                else if(v===4) { ctx.fillStyle='#111'; ctx.fillRect(x,y,size,size); ctx.fillStyle='#f0f'; ctx.beginPath(); ctx.arc(x+size/2, y+size/2, 12, 0, Math.PI*2); ctx.fill(); }
            }
        }
        
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon Sokoban</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default NeonSokoban;
