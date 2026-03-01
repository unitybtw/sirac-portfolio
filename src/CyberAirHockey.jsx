import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberAirHockey = ({ onGameOver }) => {
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
    

    let p1 = {x: 300, y: 350, r: 25};
    let p2 = {x: 300, y: 50,  r: 25};
    let puck = {x: 300, y: 200, r: 15, vx: 0, vy: 0};
    
    // Mouse control for p1
    const move = (e) => {
        let rect = canvas.getBoundingClientRect();
        p1.x = (e.clientX - rect.left) * (canvas.width/rect.width);
        p1.y = (e.clientY - rect.top) * (canvas.height/rect.height);
        if(p1.y < 200) p1.y = 200; // Can't cross center
    };
    canvas.addEventListener('mousemove', move);
    
    let scorePlayer = 0, scoreAI = 0;
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // Center line
        ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(600, 200); ctx.stroke();
        
        // AI Logic
        p2.x += (puck.x - p2.x) * 0.05;
        if(p2.x < p2.r) p2.x = p2.r; if(p2.x > canvas.width - p2.r) p2.x = canvas.width - p2.r;
        
        // Physics
        puck.x += puck.vx; puck.y += puck.vy;
        puck.vx *= 0.99; puck.vy *= 0.99; // friction
        
        // Bounds
        if(puck.x < puck.r || puck.x > canvas.width - puck.r) { puck.vx *= -1; playSound('bump'); }
        if(puck.y < puck.r) { scorePlayer++; setScore(scorePlayer*10); puck.x=300; puck.y=200; puck.vx=0; puck.vy=0; }
        if(puck.y > canvas.height - puck.r) { scoreAI++; puck.x=300; puck.y=200; puck.vx=0; puck.vy=0; }
        
        // Collision Math
        [p1, p2].forEach(p => {
            let dx = puck.x - p.x, dy = puck.y - p.y;
            let dist = Math.hypot(dx, dy);
            if(dist < p.r + puck.r) {
                let angle = Math.atan2(dy, dx);
                let speed = Math.hypot(puck.vx, puck.vy) + 2; 
                puck.vx = Math.cos(angle) * speed;
                puck.vy = Math.sin(angle) * speed;
            }
        });
        
        ctx.fillStyle='#00f0ff'; ctx.beginPath(); ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#ff003c'; ctx.beginPath(); ctx.arc(p2.x, p2.y, p2.r, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(puck.x, puck.y, puck.r, 0, Math.PI*2); ctx.fill();
        
        ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='20px monospace';
        ctx.fillText("AI: " + scoreAI, 10, 30);
        ctx.fillText("YOU: " + scorePlayer, 10, 380);
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousemove', move); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Air Hockey</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberAirHockey;
