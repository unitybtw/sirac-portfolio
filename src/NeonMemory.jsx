import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonMemory = ({ onGameOver }) => {
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
    

    let colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#fff', '#888'];
    let deck = [...colors, ...colors].sort(()=>Math.random()-0.5);
    let cards = [];
    for(let r=0; r<4; r++){
        for(let c=0; c<4; c++){
            cards.push({r, c, col: deck.pop(), state: 'down'}); // down, up, matched
        }
    }
    
    let picks = [], matches=0, clicks=0;
    
    const clk = (e) => {
        if(picks.length >= 2) return;
        let rect = canvas.getBoundingClientRect();
        let cx = (e.clientX-rect.left)*(canvas.width/rect.width);
        let cy = (e.clientY-rect.top)*(canvas.height/rect.height);
        
        let pad = 10, size = 60, offX = 170, offY = 60;
        for(let cd of cards) {
            let x = offX + cd.c*(size+pad), y = offY + cd.r*(size+pad);
            if(cx > x && cx < x+size && cy > y && cy < y+size && cd.state === 'down') {
                cd.state = 'up'; picks.push(cd); clicks++; setScore(clicks);
                
                if(picks.length === 2) {
                    if(picks[0].col === picks[1].col) {
                        picks[0].state = 'matched'; picks[1].state = 'matched';
                        picks = []; matches++;
                        if(matches === 8) if (onGameOver) onGameOver(score); setIsPlaying(false);
                    } else {
                        setTimeout(() => {
                            picks[0].state = 'down'; picks[1].state = 'down'; picks = [];
                        }, 800);
                    }
                }
                break;
            }
        }
    };
    canvas.addEventListener('mousedown', clk);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let pad = 10, size = 60, offX = 170, offY = 60;
        for(let cd of cards) {
            let x = offX + cd.c*(size+pad), y = offY + cd.r*(size+pad);
            if(cd.state === 'down') { ctx.fillStyle = '#333'; ctx.fillRect(x,y,size,size); }
            else { 
                ctx.fillStyle = cd.col; ctx.fillRect(x,y,size,size); 
                if(cd.state === 'matched') { ctx.strokeStyle = '#fff'; ctx.lineWidth=3; ctx.strokeRect(x,y,size,size); }
            }
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Neon Memory</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default NeonMemory;
