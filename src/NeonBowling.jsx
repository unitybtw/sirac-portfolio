import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonBowling = ({ onGameOver }) => {
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
    

    let phase = 'angle'; // angle, power, roll
    let angle = 0, angleOsc = 0, pwr = 0, pwrOsc = 0;
    let ball = {x: 300, y: 350, r: 12, vx:0, vy:0};
    let pins = [];
    
    const reset = () => {
        phase = 'angle'; ball = {x: 300, y: 350, r: 12, vx:0, vy:0};
        pins = [];
        let rows = 4, spacing = 25, offX = 300, offY = 100;
        for(let r=0; r<rows; r++){
            for(let c=0; c<=r; c++){
                pins.push({x: offX - r*(spacing/2) + c*spacing, y: offY + r*spacing, r: 8, up: true});
            }
        }
    };
    reset();
    
    const clk = () => {
        if(phase === 'angle') phase = 'power';
        else if(phase === 'power') {
            phase = 'roll'; { setScore(s=>s+1); playSound('coin'); };
            let rad = angle - Math.PI/2;
            let force = pwr * 15;
            ball.vx = Math.cos(rad) * force;
            ball.vy = Math.sin(rad) * force;
        } else if(ball.y < -50 || (ball.vx===0 && ball.vy===0)) {
            reset(); // new throw
        }
    };
    canvas.addEventListener('mousedown', clk);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // Lane
        ctx.fillStyle = '#111'; ctx.fillRect(200, 0, 200, canvas.height);
        
        if(phase === 'angle') {
            angleOsc += 0.05; angle = Math.sin(angleOsc) * 0.5;
            ctx.strokeStyle = '#00f0ff'; ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x + Math.cos(angle-Math.PI/2)*50, ball.y + Math.sin(angle-Math.PI/2)*50);
            ctx.stroke();
        } else if (phase === 'power') {
            pwrOsc += 0.1; pwr = (Math.sin(pwrOsc)+1)/2; // 0 to 1
            ctx.fillStyle = '#ff003c'; ctx.fillRect(20, 350, 20, -100);
            ctx.fillStyle = '#00ff00'; ctx.fillRect(20, 350, 20, -pwr*100);
        } else {
            ball.x += ball.vx; ball.y += ball.vy;
            ball.vx *= 0.98; ball.vy *= 0.98; // friction
            if(Math.hypot(ball.vx, ball.vy) < 0.2) { ball.vx=0; ball.vy=0; }
            
            pins.forEach(p => {
                if(p.up && Math.hypot(ball.x - p.x, ball.y - p.y) < ball.r + p.r) {
                    p.up = false; // knocked string
                }
            });
        }
        
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffaa00';
        pins.forEach(p => { if(p.up) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill(); } });
        
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon Bowling</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default NeonBowling;
