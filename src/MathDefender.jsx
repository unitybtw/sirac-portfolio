import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const MathDefender = ({ onGameOver }) => {
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
        const ctx = canvas.getContext('2d');

        let enemies = [], currScore = 0, frame = 0;
        let currentInput = "";

        const generateProblem = () => {
            let a = Math.floor(Math.random() * 10) + 1;
            let b = Math.floor(Math.random() * 10) + 1;
            let op = Math.random() > 0.5 ? '+' : '-';
            let ans = op === '+' ? a + b : a - b;
            return { text: `${a} ${op} ${b}`, ans: ans.toString() };
        };

        const key = (e) => {
            if (e.key === 'Backspace') { e.preventDefault(); currentInput = currentInput.slice(0, -1); }
            else if (e.key === 'Enter') {
                for (let i = 0; i < enemies.length; i++) {
                    if (enemies[i].ans === currentInput) {
                        enemies.splice(i, 1);
                        currScore += 10;
                        setScore(currScore);
                        currentInput = "";
                        return;
                    }
                }
                currentInput = ""; // if wrong, clear
            }
            else if (e.key.length === 1 && /[0-9\-]/.test(e.key)) currentInput += e.key;
        };
        window.addEventListener('keydown', key);

        let anim;
        
    let _lastFrameTime = 0;
    const draw = () => {
      let _now = Date.now();
      if (_now - _lastFrameTime < 15) {
          anim = window.requestAnimationFrame(draw);
          return;
      }
      _lastFrameTime = _now;
            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (frame++ % Math.max(60, 150 - Math.floor(currScore * 2)) === 0) {
                let prob = generateProblem();
                enemies.push({ x: Math.random() * (canvas.width - 100) + 50, y: -20, text: prob.text, ans: prob.ans, speed: 0.5 + currScore / 200 });
            }

            ctx.font = 'bold 20px monospace';
            for (let i = enemies.length - 1; i >= 0; i--) {
                let en = enemies[i];
                en.y += en.speed;

                ctx.fillStyle = '#ffaa00';
                ctx.fillText(en.text, en.x, en.y);

                if (en.y > canvas.height) {
                    { playSound('boom'); if (onGameOver) onGameOver(score); setIsPlaying(false); return; }
                }
            }

            // Draw Input
            ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
            ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
            ctx.fillStyle = '#00f0ff';
            ctx.fillText(`Answer & Enter: ${currentInput}_`, 20, canvas.height - 15);

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', key); };
    }, [isPlaying]);

    
    // --- Score Persistence ---
    const scoreRef = useRef(0);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508' }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Score: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Math Defender</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Solve the equations before they hit the bottom.</p>
                {score > 0 && <p style={{ color: '#ffaa00', marginBottom: '1rem' }}>Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default MathDefender;
