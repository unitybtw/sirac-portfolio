import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonMinesweeper = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState('');
    const [score, setScore] = useState(0);


    // --- Audio Helper ---
    const playSound = (type) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            switch (type) {
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
        } catch (e) { }
    };

    useEffect(() => {
        if (!isPlaying) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let grid = [], w = 10, h = 10, bw = 40, bh = 40, mines = 15, revealed = 0;
        for (let r = 0; r < h; r++) {
            let row = [];
            for (let c = 0; c < w; c++) row.push({ m: false, r: false, f: false, n: 0 });
            grid.push(row);
        }

        let placed = 0;
        while (placed < mines) {
            let r = Math.floor(Math.random() * h), c = Math.floor(Math.random() * w);
            if (!grid[r][c].m) { grid[r][c].m = true; placed++; }
        }

        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                if (grid[r][c].m) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let nr = r + i, nc = c + j;
                        if (nr >= 0 && nr < h && nc >= 0 && nc < w && grid[nr][nc].m) count++;
                    }
                }
                grid[r][c].n = count;
            }
        }

        const reveal = (r, c) => {
            if (r < 0 || r >= h || c < 0 || c >= w || grid[r][c].r || grid[r][c].f) return;
            grid[r][c].r = true; revealed++;
            if (grid[r][c].n === 0 && !grid[r][c].m) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        reveal(r + i, c + j);
                    }
                }
            }
        }

        const mdown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const bx = e.clientX - rect.left - (canvas.width / 2 - (w * bw) / 2);
            const by = e.clientY - rect.top - (canvas.height / 2 - (h * bh) / 2);

            let c = Math.floor(bx / bw), r = Math.floor(by / bh);
            if (r >= 0 && r < h && c >= 0 && c < w) {
                if (e.button === 2) {
                    if (!grid[r][c].r) grid[r][c].f = !grid[r][c].f;
                } else if (e.button === 0) {
                    if (!grid[r][c].f) {
                        if (grid[r][c].m) {
                            // Game Over
                            for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) grid[i][j].r = true;
                            setStatus("KABOOM!");
                            setTimeout(() => setIsPlaying(false), 2000);
                        } else {
                            reveal(r, c);
                            setScore(revealed * 10);
                            if (revealed === w * h - mines) {
                                setStatus("YOU WIN!");
                                setTimeout(() => setIsPlaying(false), 2000);
                            }
                        }
                    }
                }
            }
        };
        canvas.addEventListener('mousedown', mdown);
        canvas.addEventListener('contextmenu', e => e.preventDefault());

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

            const ox = canvas.width / 2 - (w * bw) / 2;
            const oy = canvas.height / 2 - (h * bh) / 2;

            // grid outline
            ctx.strokeStyle = '#00f0ff';
            ctx.strokeRect(ox, oy, w * bw, h * bh);

            for (let r = 0; r < h; r++) {
                for (let c = 0; c < w; c++) {
                    let cell = grid[r][c];
                    let cx = ox + c * bw, cy = oy + r * bh;

                    if (cell.r) {
                        ctx.fillStyle = '#111116';
                        ctx.fillRect(cx, cy, bw, bh);
                        ctx.strokeRect(cx, cy, bw, bh);

                        if (cell.m) {
                            ctx.fillStyle = '#ff003c';
                            ctx.beginPath(); ctx.arc(cx + bw / 2, cy + bh / 2, bw / 3, 0, Math.PI * 2); ctx.fill();
                        } else if (cell.n > 0) {
                            ctx.fillStyle = '#00ff00'; ctx.font = '20px monospace';
                            ctx.fillText(cell.n, cx + bw / 3, cy + bh / 1.5);
                        }
                    } else {
                        ctx.fillStyle = '#22222a';
                        ctx.fillRect(cx, cy, bw, bh);
                        ctx.strokeRect(cx, cy, bw, bh);
                        if (cell.f) {
                            ctx.fillStyle = '#ffaa00';
                            ctx.beginPath(); ctx.moveTo(cx + bw / 3, cy + bh / 1.5); ctx.lineTo(cx + bw / 3, cy + bh / 3); ctx.lineTo(cx + bw * 0.7, cy + bh / 2); ctx.fill();
                        }
                    }
                }
            }

            ctx.fillStyle = '#fff'; ctx.font = '24px monospace';
            ctx.fillText(status, ox, oy - 20);

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', mdown); };
    }, [isPlaying]);

    return <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508' }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onContextMenu={(e) => e.preventDefault()} />
        {!isPlaying && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Cyber Sweeper</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Left Click: Reveal. Right Click: Flag.</p>
                {status && <p style={{ color: status === 'YOU WIN!' ? '#00ff00' : '#ff003c', marginBottom: '1rem' }}>{status}</p>}
                <button className="btn btn-primary" onClick={() => { setStatus(''); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>
        )}
    </div>;
};
export default NeonMinesweeper;
