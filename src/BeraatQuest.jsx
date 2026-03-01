import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const playScareSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create multiple oscillators for a dissonant, screeching chord
        const playOsc = (type, freq, detune) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.detune.setValueAtTime(detune, audioCtx.currentTime);

            // Sudden loud attack, then decay
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(3, audioCtx.currentTime + 0.05); // LOUD
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.5);
        };

        playOsc('sawtooth', 800, 0);
        playOsc('square', 850, 50);
        playOsc('sawtooth', 750, -50);
        playOsc('triangle', 200, 0); // Bass rumble
    } catch (e) {
        console.log("Audio not supported");
    }
};

const BeraatQuest = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isJumpscare, setIsJumpscare] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!isPlaying || isJumpscare) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        // Player (Beraat)
        let p = { x: canvas.width / 2 - 30, y: canvas.height - 40, w: 60, h: 30, dx: 0, speed: 6 };
        let items = [];
        let frame = 0;
        let currentScore = 0;

        const goodMemes = ['DOGE', 'STONKS', 'SIGMA', 'CHAD', 'PEPE', 'SKIBIDI'];
        const badMemes = ['CRINGE', 'TOXIC', 'LAG', 'NOOB'];

        // Randomize the scare moment (e.g. anywhere between 50 and 100 points)
        const scareThreshold = Math.floor(Math.random() * 50) + 50;

        const spawnItem = () => {
            const isGood = Math.random() > 0.3;
            const text = isGood ? goodMemes[Math.floor(Math.random() * goodMemes.length)] : badMemes[Math.floor(Math.random() * badMemes.length)];
            items.push({
                x: Math.random() * (canvas.width - 60),
                y: -30,
                text: text,
                isGood: isGood,
                speed: Math.random() * 2 + 3 + (currentScore / 50)
            });
        };

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.code) || ["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.key)) e.preventDefault();
            if (["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (e.key === 'ArrowLeft' || e.key === 'a') p.dx = -p.speed;
            if (e.key === 'ArrowRight' || e.key === 'd') p.dx = p.speed;
        };
        const handleKeyUp = (e) => {
            if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) p.dx = 0;
        };
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);


        let _lastFrameTime = 0;
        const draw = () => {
            let _now = Date.now();
            if (_now - _lastFrameTime < 15) {
                animationId = window.requestAnimationFrame(draw);
                return;
            }
            _lastFrameTime = _now;
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Matrix-like background effect
            ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
            ctx.font = '10px monospace';
            for (let i = 0; i < 10; i++) {
                ctx.fillText("B E R A A T", Math.random() * canvas.width, Math.random() * canvas.height);
            }

            p.x += p.dx;
            if (p.x < 0) p.x = 0;
            if (p.x + p.w > canvas.width) p.x = canvas.width - p.w;

            // Draw Player
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 10; ctx.shadowColor = '#00f0ff';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px monospace';
            ctx.shadowBlur = 0;
            ctx.fillText('BERAAT', p.x + 8, p.y + 20);

            frame++;
            if (frame % Math.max(20, 60 - Math.floor(currentScore / 10)) === 0) spawnItem();

            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i];
                item.y += item.speed;

                ctx.fillStyle = item.isGood ? '#00ff00' : '#ff003c';
                ctx.shadowBlur = 10; ctx.shadowColor = item.isGood ? '#00ff00' : '#ff003c';
                ctx.font = 'bold 14px monospace';
                ctx.fillText(item.text, item.x, item.y);

                // Collision logic
                if (p.x < item.x + 40 && p.x + p.w > item.x && p.y < item.y && p.y + p.h > item.y - 14) {
                    if (item.isGood) {
                        currentScore += 10;
                        setScore(currentScore);

                        // JUMPSCARE TRIGGER
                        if (currentScore >= scareThreshold) {
                            playScareSound();
                            setIsJumpscare(true);
                            if (onGameOver) onGameOver(currentScore);
                            setIsPlaying(false);
                            return; // Stop animation loop immediately
                        }

                    } else {
                        if (onGameOver) onGameOver(currentScore);
                        setIsPlaying(false); // Game over if bad meme is caught
                        return;
                    }
                    items.splice(i, 1);
                    continue;
                }

                if (item.y > canvas.height + 20) {
                    items.splice(i, 1);
                }
            }

            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPlaying, isJumpscare]);

    // Jumpscare recovery timer
    useEffect(() => {
        if (isJumpscare) {
            const timeout = setTimeout(() => {
                setIsJumpscare(false);
                setScore(0);
            }, 1800); // Wait 1.8 seconds matching sound
            return () => clearTimeout(timeout);
        }
    }, [isJumpscare]);

    
    // --- Score Persistence ---
    const scoreRef = useRef(0);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508', overflow: 'hidden' }}>

            {/* Intense CSS Jumpscare Overlay */}
            {isJumpscare && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 99999, background: 'black',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    animation: 'shake 0.1s infinite', border: '30px solid red', boxSizing: 'border-box',
                    backgroundImage: 'url(https://i.imgflip.com/2s9cbl.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                }}>
                    <style>{`
                  @keyframes shake {
                      0% { transform: translate(15px, 15px) rotate(0deg); filter: invert(0); background: black; }
                      10% { transform: translate(-15px, -30px) rotate(-2deg); filter: invert(1); background: red; }
                      20% { transform: translate(-45px, 0px) rotate(2deg); filter: invert(0); }
                      30% { transform: translate(45px, 30px) rotate(0deg); filter: invert(1); background: red; }
                      40% { transform: translate(15px, -15px) rotate(2deg); filter: invert(0); }
                      50% { transform: translate(-15px, 30px) rotate(-2deg); filter: invert(1); background: red; }
                      60% { transform: translate(-45px, 15px) rotate(0deg); filter: invert(0); }
                      70% { transform: translate(45px, 15px) rotate(-2deg); filter: invert(1); background: red; }
                      80% { transform: translate(-15px, -15px) rotate(2deg); filter: invert(0); }
                      90% { transform: translate(15px, 30px) rotate(0deg); filter: invert(1); background: red; }
                      100% { transform: translate(15px, -30px) rotate(-2deg); filter: invert(0); background: black; }
                  }
              `}</style>
                    <h1 style={{ fontSize: '4rem', color: 'red', margin: 0, textShadow: '0 0 50px red', fontFamily: 'monospace', letterSpacing: '8px', zIndex: 10, position: 'absolute', bottom: '20px' }}>BERAAT</h1>
                </div>
            )}

            <canvas ref={canvasRef} width={400} height={500} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            {isPlaying && !isJumpscare ? (
                <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Meme Score: {score}</div>
            ) : (!isJumpscare && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                    <h2 className="text-gradient" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Beraat's Meme Quest</h2>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem', fontFamily: 'monospace', textAlign: 'center', padding: '0 1rem' }}>
                        Help Beraat collect the <span style={{ color: '#00ff00' }}>DANK MEMES</span>.<br />Avoid the <span style={{ color: '#ff003c' }}>CRINGE</span>!
                    </p>
                    {score > 0 && <p style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', fontSize: '1.2rem' }}>Final Score: {score}</p>}
                    <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); setIsJumpscare(false); }}><Play size={18} /> START QUEST</button>
                </div>
            ))}
        </div>
    );
};
export default BeraatQuest;
