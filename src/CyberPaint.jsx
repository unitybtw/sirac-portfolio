import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberPaint = ({ onGameOver }) => {
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
    

    let grid = Array(5).fill().map(()=>Array(8).fill(false));
    let p = {r: 2, c: 4, moving: false, dr:0, dc:0};
    grid[p.r][p.c] = true;
    let scoreVal=1;
    
    const kd = (e) => {
        if(p.moving) return;
        if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "s", "a", "d"].includes(e.key) || ["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
        if(e.key==='ArrowLeft'||e.key==='a') { p.dc=-1; p.dr=0; p.moving=true; }
        if(e.key==='ArrowRight'||e.key==='d') { p.dc=1; p.dr=0; p.moving=true; }
        if(e.key==='ArrowUp'||e.key==='w') { p.dc=0; p.dr=-1; p.moving=true; }
        if(e.key==='ArrowDown'||e.key==='s') { p.dc=0; p.dr=1; p.moving=true; }
    };
    window.addEventListener('keydown', kd, {passive: false});
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let pad=10, size = 60, offX=60, offY=30;
        
        if(p.moving) {
            let nr = p.r+p.dr, nc = p.c+p.dc;
            if(nr>=0 && nr<5 && nc>=0 && nc<8) {
                p.r = nr; p.c = nc;
                if(!grid[p.r][p.c]) { grid[p.r][p.c]=true; scoreVal++; setScore(scoreVal); playSound('coin'); }
            }
            p.moving = false;
        }
        
        for(let r=0; r<5; r++) {
            for(let c=0; c<8; c++) {
                ctx.fillStyle = grid[r][c] ? '#ffaa00' : '#222';
                ctx.fillRect(offX + c*(size+pad), offY + r*(size+pad), size, size);
            }
        }
        
        // Player
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(offX + p.c*(size+pad) + size/2, offY + p.r*(size+pad) + size/2, 15, 0, Math.PI*2); ctx.fill();
        
        if(scoreVal >= 40) { { playSound('boom'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return; } } // Win
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown',kd); };

    
  }, [isPlaying]);

  
    // --- Score Persistence ---
    const scoreRef = useRef(0);
    useEffect(() => { scoreRef.current = scoreVal; }, [scoreVal]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return <div style={{position:'relative', width:'100%', height:'100%', background:'#050508'}}>
    <canvas ref={canvasRef} width={600} height={400} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
    {isPlaying ? <div style={{position:'absolute',top:10,left:10,color:'#fff',fontFamily:'monospace'}}>Score/Stat: {score}</div> : 
      <div style={{position:'absolute',inset:0,display:'flex',justifyContent:'center',alignItems:'center',background:'rgba(0,0,0,0.8)',flexDirection:'column'}}>
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Paint</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberPaint;
