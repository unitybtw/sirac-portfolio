import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberInvaders = ({ onGameOver }) => {
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
    

    let player = {x: 280, y: 360, w: 40, h: 20, dx: 0};
    let bullets = [];
    let enemies = [];
    let enemyDir = 2, enemySpeed = 1, scoreVal = 0;
    
    // Init enemies
    const initEnemies = () => {
        enemies = [];
        for(let r=0; r<4; r++) {
            for(let c=0; c<8; c++) {
                enemies.push({x: 50 + c*50, y: 40 + r*40, w: 30, h: 20, alive: true});
            }
        }
    };
    initEnemies();
    
    const keyd = (e) => {
        if(["ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
        if(e.code === 'ArrowLeft') player.dx = -5;
        if(e.code === 'ArrowRight') player.dx = 5;
        if(e.code === 'Space') playSound('pew'); bullets.push({x: player.x+18, y: player.y, w: 4, h: 10, dy: -8});
    };
    const keyu = (e) => {
        if(['ArrowLeft', 'ArrowRight'].includes(e.code)) player.dx = 0;
    };
    window.addEventListener('keydown', keyd, {passive: false});
    window.addEventListener('keyup', keyu);
    
    let frame = 0;
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // Player
        player.x += player.dx;
        if(player.x < 0) player.x = 0; if(player.x > canvas.width - player.w) player.x = canvas.width - player.w;
        ctx.fillStyle = '#00f0ff'; ctx.fillRect(player.x, player.y, player.w, player.h);
        
        // Bullets
        ctx.fillStyle = '#ffaa00';
        for(let i=bullets.length-1; i>=0; i--) {
            let b = bullets[i]; b.y += b.dy; ctx.fillRect(b.x, b.y, b.w, b.h);
            if(b.y < 0) { bullets.splice(i,1); continue; }
            
            // Collision with enemies
            let hit = false;
            for(let j=0; j<enemies.length; j++) {
                let e = enemies[j];
                if(e.alive && b.x > e.x && b.x < e.x+e.w && b.y > e.y && b.y < e.y+e.h) {
                    e.alive = false; hit = true; scoreVal+=10; setScore(scoreVal); playSound('coin');
                    break;
                }
            }
            if(hit) bullets.splice(i,1);
        }
        
        // Enemies
        ctx.fillStyle = '#ff003c';
        let edge = false;
        let anyAlive = false;
        enemies.forEach(e => {
            if(!e.alive) return;
            anyAlive = true;
            e.x += enemyDir;
            if(e.x < 10 || e.x > canvas.width - e.w - 10) edge = true;
            ctx.fillRect(e.x, e.y, e.w, e.h);
        });
        
        if(!anyAlive) { enemySpeed += 0.5; initEnemies(); }
        
        if(edge) {
            enemyDir *= -1;
            enemies.forEach(e => {
                if(e.alive) { e.y += 20; if(e.y > 340) { { playSound('boom'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return; } } } // Game over
            });
        }
        
        anim = window.requestAnimationFrame(draw);
    }; draw();
    
    return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', keyd); window.removeEventListener('keyup', keyu); };

    
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Invaders</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberInvaders;
