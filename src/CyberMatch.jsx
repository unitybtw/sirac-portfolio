import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberMatch = ({ onGameOver }) => {
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
    

    let grid = Array(6).fill().map(()=>Array(8).fill(0));
    let colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f'];
    for(let r=0; r<6; r++) for(let c=0; c<8; c++) grid[r][c] = Math.floor(Math.random()*5);
    
    let sel = null; let scoreVal=0;
    
    const clk = (e) => {
        let rect = canvas.getBoundingClientRect();
        let cx = (e.clientX-rect.left)*(canvas.width/rect.width);
        let cy = (e.clientY-rect.top)*(canvas.height/rect.height);
        
        let size = 50, pad=5, offX=80, offY=35;
        let c = Math.floor((cx-offX)/(size+pad));
        let r = Math.floor((cy-offY)/(size+pad));
        
        if(r>=0 && r<6 && c>=0 && c<8) {
            if(!sel) sel = {r,c};
            else {
                if(Math.abs(sel.r-r)+Math.abs(sel.c-c) === 1) {
                    let tmp = grid[r][c]; grid[r][c] = grid[sel.r][sel.c]; grid[sel.r][sel.c] = tmp;
                    // Simple clear check
                    let cleared = false;
                    for(let rr=0;rr<6;rr++){
                        for(let cc=0;cc<6;cc++){
                            if(grid[rr][cc]!== -1 && grid[rr][cc]===grid[rr][cc+1] && grid[rr][cc]===grid[rr][cc+2]) {
                                grid[rr][cc]=-1; grid[rr][cc+1]=-1; grid[rr][cc+2]=-1; cleared=true;
                            }
                        }
                    }
                    if(cleared) { scoreVal+=10; setScore(scoreVal); playSound('coin'); for(let rr=0;rr<6;rr++)for(let cc=0;cc<8;cc++)if(grid[rr][cc]===-1)grid[rr][cc]=Math.floor(Math.random()*5); }
                    else { tmp = grid[r][c]; grid[r][c] = grid[sel.r][sel.c]; grid[sel.r][sel.c] = tmp; } // revert
                }
                sel = null;
            }
        }
    };
    canvas.addEventListener('mousedown', clk);
    
    const draw = () => {
        let _now=Date.now(); if(_now-_lastFrameTime<15){anim=window.requestAnimationFrame(draw);return;} _lastFrameTime=_now;
        ctx.fillStyle = '#050508'; ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let size = 50, pad=5, offX=80, offY=35;
        for(let r=0; r<6; r++) {
            for(let c=0; c<8; c++) {
                if(grid[r][c] === -1) continue;
                ctx.fillStyle = colors[grid[r][c]];
                ctx.fillRect(offX + c*(size+pad), offY + r*(size+pad), size, size);
                if(sel && sel.r===r && sel.c===c) { ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.strokeRect(offX + c*(size+pad), offY + r*(size+pad), size, size); }
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
         <h2 className="text-gradient" style={{marginBottom:'1rem'}}>Cyber Match</h2>
         <button className="btn btn-primary" onClick={()=>{playSound('click'); setScore(0);setIsPlaying(true);}}><Play size={18}/> PLAY</button>
      </div>}
  </div>;
};
export default CyberMatch;
