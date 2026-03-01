import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberSort = ({ onGameOver }) => {
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
    

    let items = []; let scoreVal = 0; let frame=0;
    
    const kd = (e)=>{
        if(["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
        if(items.length===0) return;
        let it = items[0];
        if(e.code==='ArrowLeft' && it.type==='L') { items.shift(); scoreVal++; setScore(scoreVal); playSound('coin'); }
        else if(e.code==='ArrowRight' && it.type==='R') { items.shift(); scoreVal++; setScore(scoreVal); playSound('coin'); }
        else if(e.code==='ArrowLeft' || e.code==='ArrowRight') { { playSound('boom'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return; } } // Wrong
    };
    window.addEventListener('keydown', kd, {passive:false});
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // Bins
        ctx.fillStyle='#ff003c'; ctx.fillRect(50, 300, 100, 100); ctx.fillStyle='#fff'; ctx.fillText('LEFT', 80, 350);
        ctx.fillStyle='#00f0ff'; ctx.fillRect(450, 300, 100, 100); ctx.fillStyle='#fff'; ctx.fillText('RIGHT', 475, 350);
        
        if(items.length < 5 && frame++%30===0) { items.push({type: Math.random()>0.5?'L':'R', y: 0}); }
        
        for(let i=0; i<items.length; i++) {
            let it = items[i];
            let targetY = 200 - i*60;
            it.y += (targetY - it.y)*0.2;
            ctx.fillStyle = it.type==='L' ? '#ff003c' : '#00f0ff';
            ctx.fillRect(270, it.y, 60, 40);
        }
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown',kd); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Sort</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberSort;
