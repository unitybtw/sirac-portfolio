import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonSlicer = ({ onGameOver }) => {
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
    

    let fruits = []; let trail=[]; let isDown=false; let scoreVal=0; let frame=0;
    
    const dwn = ()=>{ isDown=true; trail=[]; };
    const mv = (e)=>{
        if(!isDown) return;
        let rect = canvas.getBoundingClientRect();
        trail.push({x:(e.clientX-rect.left)*(canvas.width/rect.width), y:(e.clientY-rect.top)*(canvas.height/rect.height)});
        if(trail.length > 5) trail.shift();
    };
    const up = ()=>{ isDown=false; trail=[]; };
    canvas.addEventListener('mousedown', dwn); window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        if(frame++%60===0) { fruits.push({x:Math.random()*(canvas.width-100)+50, y:canvas.height+20, vx:(Math.random()-0.5)*4, vy:-12 - Math.random()*5, r: 20, cut: false}); }
        
        for(let i=fruits.length-1; i>=0; i--){
            let f = fruits[i]; f.x+=f.vx; f.vy+=0.3; f.y+=f.vy;
            if(!f.cut) {
                ctx.fillStyle='#00ff00'; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
                if(isDown && trail.length>1) {
                    let last = trail[trail.length-1];
                    if(Math.hypot(last.x-f.x, last.y-f.y) < f.r+10) { f.cut=true; scoreVal++; setScore(scoreVal); playSound('coin'); }
                }
                if(f.y > canvas.height+50) { { playSound('boom'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return; } }
            } else {
                ctx.fillStyle='#ff003c'; ctx.beginPath(); ctx.arc(f.x-10,f.y,f.r/2,0,Math.PI*2); ctx.arc(f.x+10,f.y,f.r/2,0,Math.PI*2); ctx.fill();
                if(f.y > canvas.height+50) fruits.splice(i,1);
            }
        }
        
        if(isDown && trail.length>1) {
            ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
            for(let i=1; i<trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
            ctx.stroke();
        }
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown',dwn); window.removeEventListener('mousemove',mv); window.removeEventListener('mouseup',up); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon Slicer</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default NeonSlicer;
