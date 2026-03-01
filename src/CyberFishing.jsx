import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberFishing = ({ onGameOver }) => {
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
    

    let hook = {y: 50, vy: 0, state: 'idle'}; // idle, dropping, reeling
    let fish = [];
    let scoreVal = 0;
    
    const md = () => { if(hook.state === 'idle') hook.state = 'dropping'; };
    canvas.addEventListener('mousedown', md);
    
    let frame=0;
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // Water
        ctx.fillStyle = 'rgba(0, 50, 150, 0.3)'; ctx.fillRect(0, 100, canvas.width, canvas.height-100);
        
        if(frame++%60===0) {
            let ry = Math.random()*(canvas.height - 150) + 120;
            let spd = Math.random()*2 + 1;
            fish.push({x: canvas.width, y: ry, w: 30, h: 15, vx: -spd});
        }
        
        if(hook.state === 'dropping') { hook.y += 5; if(hook.y >= canvas.height-10) hook.state = 'reeling'; }
        else if(hook.state === 'reeling') { hook.y -= 3; if(hook.y <= 50) hook.state = 'idle'; }
        
        // Boat & Hook
        ctx.fillStyle = '#fff'; ctx.fillRect(280, 40, 40, 10);
        ctx.strokeStyle = '#aaa'; ctx.beginPath(); ctx.moveTo(300, 50); ctx.lineTo(300, hook.y); ctx.stroke();
        ctx.fillStyle = '#ffaa00'; ctx.beginPath(); ctx.arc(300, hook.y, 5, 0, Math.PI*2); ctx.fill();
        
        ctx.fillStyle = '#00f0ff';
        for(let i=fish.length-1; i>=0; i--){
            let f = fish[i]; f.x += f.vx;
            ctx.beginPath(); ctx.ellipse(f.x, f.y, f.w/2, f.h/2, 0, 0, Math.PI*2); ctx.fill();
            
            // Check catch only if reeling up
            if(hook.state === 'reeling') {
                if(300 > f.x-f.w/2 && 300 < f.x+f.w/2 && hook.y > f.y-f.h/2 && hook.y < f.y+f.h/2) {
                    scoreVal++; setScore(scoreVal); playSound('coin'); fish.splice(i,1);
                }
            }
            if(f.x < -f.w) fish.splice(i,1);
        }
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', md); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Fishing</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberFishing;
