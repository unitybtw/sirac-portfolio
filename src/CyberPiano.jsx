import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberPiano = ({ onGameOver }) => {
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
    

    let keys = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK'];
    let freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    let active = Array(8).fill(false);
    let ripples = [];
    
    // Simplistic web audio
    let audioCtx = null;
    const playSrc = (i) => {
        try {
            if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.value = freqs[i];
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
            osc.connect(gainNode); gainNode.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + 1);
            
            ripples.push({x: 100 + i*50 + 20, y: 200, r: 10});
            { setScore(s=>s+1); playSound('coin'); };
        } catch(e) {}
    };
    
    const kd = (e) => {
        let idx = keys.indexOf(e.code);
        if(idx !== -1 && !active[idx]) { active[idx] = true; playSrc(idx); }
    };
    const ku = (e) => {
        let idx = keys.indexOf(e.code);
        if(idx !== -1) { active[idx] = false; }
    };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let w = 40, offX = 100, offY = 150;
        for(let i=0; i<8; i++){
            ctx.fillStyle = active[i] ? '#00f0ff' : '#222';
            ctx.fillRect(offX + i*50, offY, w, 150);
            ctx.fillStyle='#fff'; ctx.font='16px monospace';
            ctx.fillText(keys[i].replace('Key',''), offX + i*50 + 15, offY + 130);
        }
        
        ctx.strokeStyle = '#f0f'; ctx.lineWidth=2;
        for(let i=ripples.length-1; i>=0; i--){
            let r=ripples[i]; r.r+=3;
            ctx.globalAlpha = Math.max(0, 1 - r.r/100);
            ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI*2); ctx.stroke();
            if(r.r > 100) ripples.splice(i,1);
        }
        ctx.globalAlpha = 1;
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown',kd); window.removeEventListener('keyup',ku); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Piano</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberPiano;
