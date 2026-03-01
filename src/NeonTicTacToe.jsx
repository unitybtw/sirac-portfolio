import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonTicTacToe = ({ onGameOver }) => {
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
    

    let board = [0,0,0, 0,0,0, 0,0,0]; // 0=empty, 1=player, 2=ai
    let turn = 1, wins=0;
    
    const checkWin = (b) => {
        let wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for(let w of wins) if(b[w[0]] && b[w[0]]===b[w[1]] && b[w[0]]===b[w[2]]) return b[w[0]];
        return 0;
    };
    
    const aiMove = () => {
         let empty = []; board.forEach((v,i) => {if(v===0) empty.push(i)});
         if(empty.length===0) return;
         let m = empty[Math.floor(Math.random()*empty.length)];
         board[m] = 2;
         let w = checkWin(board);
         if(w !== 0 || empty.length===1) {
             if(w===1) wins++;
             setTimeout(() => { board=[0,0,0,0,0,0,0,0,0]; setScore(wins); turn=1; }, 1000);
         } else turn = 1;
    };
    
    const clk = (e) => {
        if(turn !== 1) return;
        let rect = canvas.getBoundingClientRect();
        let cx = (e.clientX-rect.left)*(canvas.width/rect.width);
        let cy = (e.clientY-rect.top)*(canvas.height/rect.height);
        
        let pad=10, size=80, offX=160, offY=60;
        for(let i=0; i<9; i++) {
            let r = Math.floor(i/3), c = i%3;
            let x = offX + c*(size+pad), y = offY + r*(size+pad);
            if(cx > x && cx < x+size && cy > y && cy < y+size && board[i]===0) {
                board[i] = 1; turn = 2;
                let w = checkWin(board);
                if(w !== 0 || !board.includes(0)) {
                    if(w===1) wins++;
                    setTimeout(() => { board=[0,0,0,0,0,0,0,0,0]; setScore(wins); turn=1; }, 1000);
                } else setTimeout(aiMove, 500);
                break;
            }
        }
    };
    canvas.addEventListener('mousedown', clk);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let pad=10, size=80, offX=160, offY=60;
        for(let i=0; i<9; i++){
            let r = Math.floor(i/3), c = i%3;
            let x = offX + c*(size+pad), y = offY + r*(size+pad);
            ctx.fillStyle = '#222'; ctx.fillRect(x,y,size,size);
            
            if(board[i] === 1) { ctx.strokeStyle='#00f0ff'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(x+20, y+20); ctx.lineTo(x+60, y+60); ctx.moveTo(x+60, y+20); ctx.lineTo(x+20, y+60); ctx.stroke(); }
            if(board[i] === 2) { ctx.strokeStyle='#ff003c'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(x+40, y+40, 20, 0, Math.PI*2); ctx.stroke(); }
        }
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', clk); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon TicTacToe</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default NeonTicTacToe;
