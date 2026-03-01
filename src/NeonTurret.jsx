import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonTurret = ({ onGameOver }) => {
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
    

    let turret = {x: 300, y: 200, angle: 0};
    let bullets = []; let enemies = [];
    let scoreVal = 0; let frame = 0;
    
    const mm = (e)=>{
        let rect = canvas.getBoundingClientRect();
        let mx = (e.clientX-rect.left)*(canvas.width/rect.width);
        let my = (e.clientY-rect.top)*(canvas.height/rect.height);
        turret.angle = Math.atan2(my-turret.y, mx-turret.x);
    };
    const clk = ()=>{
        playSound('pew'); bullets.push({x: turret.x+Math.cos(turret.angle)*20, y: turret.y+Math.sin(turret.angle)*20, vx: Math.cos(turret.angle)*10, vy: Math.sin(turret.angle)*10});
    };
    canvas.addEventListener('mousemove', mm); canvas.addEventListener('mousedown', clk);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        if(frame++ % Math.max(30, 80-scoreVal) === 0) {
            let ang = Math.random()*Math.PI*2;
            enemies.push({x: Math.cos(ang)*400+300, y: Math.sin(ang)*400+200, spd: 1+scoreVal*0.05, r: 15});
        }
        
        ctx.fillStyle='#ffaa00';
        for(let i=bullets.length-1; i>=0; i--){
            let b=bullets[i]; b.x+=b.vx; b.y+=b.vy;
            ctx.beginPath(); ctx.arc(b.x,b.y,5,0,Math.PI*2); ctx.fill();
            if(b.x<0||b.x>canvas.width||b.y<0||b.y>canvas.height) { bullets.splice(i,1); continue; }
            for(let j=enemies.length-1; j>=0; j--){
                let e=enemies[j];
                if(Math.hypot(b.x-e.x, b.y-e.y) < e.r+5) { bullets.splice(i,1); enemies.splice(j,1); scoreVal++; setScore(scoreVal); playSound('coin'); break; }
            }
        }
        
        ctx.fillStyle='#ff003c';
        for(let i=enemies.length-1; i>=0; i--){
            let e=enemies[i];
            let ang = Math.atan2(turret.y-e.y, turret.x-e.x);
            e.x += Math.cos(ang)*e.spd; e.y += Math.sin(ang)*e.spd;
            ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill();
            if(Math.hypot(turret.x-e.x, turret.y-e.y) < 20) { { playSound('boom'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return; } }
        }
        
        // Turret
        ctx.fillStyle='#00ccff'; ctx.beginPath(); ctx.arc(turret.x, turret.y, 20, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle='#00ccff'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(turret.x, turret.y); ctx.lineTo(turret.x+Math.cos(turret.angle)*35, turret.y+Math.sin(turret.angle)*35); ctx.stroke();
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousemove',mm); canvas.removeEventListener('mousedown',clk); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon Turret</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default NeonTurret;
