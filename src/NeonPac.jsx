import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonPac = ({ onGameOver }) => {
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

            switch (type) {
                case 'pew': // High pitch short ping
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                    break;
                case 'bump': // Low pitch thud
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                    break;
                case 'coin': // point sound
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                    osc.frequency.setValueAtTime(1600, audioCtx.currentTime + 0.05);
                    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // reduced volume for spam
                    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                    break;
                case 'boom': // explosion or fail
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
                    break;
                case 'click': // simple UI click
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
                    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
                    break;
                case 'power':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
                    osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.5);
                    break;
                case 'eat_ghost':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                    osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
                    break;
            }
        } catch (e) { }
    };

    useEffect(() => {
        if (!isPlaying) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let anim, _lastFrameTime = 0;

        // 30x20 grid at 20px per cell = 600x400
        // 1: wall, 0: dot, 2: empty, 3: power pellet
        let gridStr = [
            "111111111111111111111111111111",
            "100000000000001100000000000001",
            "131111011111101101111110111131",
            "101111011111101101111110111101",
            "100000000000000000000000000001",
            "101111011011111111110110111101",
            "100000011000001100000110000001",
            "111111011111121121111110111111",
            "222221011222222222222110122222",
            "111111011211122221112110111111",
            "222222022212222222212220222222",
            "111111011211111111112110111111",
            "222221011222222222222110122222",
            "111111011211111111112110111111",
            "100000000000001100000000000001",
            "101111011111101101111110111101",
            "130011000000000000000000110031",
            "111011011011111111110110110111",
            "100000011000001100000110000001",
            "111111111111111111111111111111"
        ];
        let map = gridStr.map(r => r.split('').map(Number));

        let scoreVal = 0;
        let dotsLeft = 0;
        map.forEach(r => r.forEach(c => { if (c === 0 || c === 3) dotsLeft++; }));

        const CELL = 20;

        let p = {
            x: 14 * CELL, y: 14 * CELL,
            dx: -2, dy: 0,
            nextDx: -2, nextDy: 0,
            speed: 2,
            mouthOpen: 0,
            frightMode: 0 // fright timer
        };

        // Ghosts
        let ghosts = [
            { x: 13 * CELL, y: 8 * CELL, dx: 2, dy: 0, color: '#ff003c', startX: 13 * CELL, startY: 8 * CELL },
            { x: 14 * CELL, y: 8 * CELL, dx: -2, dy: 0, color: '#f0f', startX: 14 * CELL, startY: 8 * CELL },
            { x: 15 * CELL, y: 8 * CELL, dx: 2, dy: 0, color: '#00f0ff', startX: 15 * CELL, startY: 8 * CELL },
            { x: 16 * CELL, y: 8 * CELL, dx: -2, dy: 0, color: '#ffaa00', startX: 16 * CELL, startY: 8 * CELL }
        ];

        const isWall = (gx, gy) => {
            if (gy < 0 || gy >= 20) return false; // tunnel vertical
            if (gx < 0 || gx >= 30) return false; // tunnel horizontal
            return map[gy][gx] === 1;
        };

        const kd = (e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "s", "a", "d"].includes(e.key) || ["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (e.key === 'ArrowLeft' || e.key === 'a') { p.nextDx = -p.speed; p.nextDy = 0; }
            if (e.key === 'ArrowRight' || e.key === 'd') { p.nextDx = p.speed; p.nextDy = 0; }
            if (e.key === 'ArrowUp' || e.key === 'w') { p.nextDx = 0; p.nextDy = -p.speed; }
            if (e.key === 'ArrowDown' || e.key === 's') { p.nextDx = 0; p.nextDy = p.speed; }
        };
        window.addEventListener('keydown', kd, { passive: false });

        let frame = 0;

        const draw = () => {
            let _now = Date.now(); if (_now - _lastFrameTime < 15) { anim = window.requestAnimationFrame(draw); return; } _lastFrameTime = _now;

            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Movement logic for Pacman (aligns to grid)
            if (p.x % CELL === 0 && p.y % CELL === 0) {
                let gx = p.x / CELL;
                let gy = p.y / CELL;

                // Collect
                if (gx >= 0 && gx < 30 && gy >= 0 && gy < 20) {
                    if (map[gy][gx] === 0) {
                        map[gy][gx] = 2; scoreVal += 10; setScore(scoreVal); dotsLeft--;
                        if (frame % 4 === 0) playSound('coin');
                    } else if (map[gy][gx] === 3) {
                        map[gy][gx] = 2; scoreVal += 50; setScore(scoreVal); dotsLeft--;
                        playSound('power');
                        p.frightMode = 500; // frames
                    }
                }

                // Test turn based on next intention
                let nextGx = gx + Math.sign(p.nextDx);
                let nextGy = gy + Math.sign(p.nextDy);
                if (!isWall(nextGx, nextGy)) {
                    // Allows us to turn
                    p.dx = p.nextDx; p.dy = p.nextDy;
                } else {
                    // If can't turn, continue straight or stop
                    let straightGx = gx + Math.sign(p.dx);
                    let straightGy = gy + Math.sign(p.dy);
                    if (isWall(straightGx, straightGy)) {
                        p.dx = 0; p.dy = 0;
                    }
                }
            }

            p.x += p.dx; p.y += p.dy;

            // Horizontal Tunnel wrapping
            if (p.x < -CELL) p.x = 30 * CELL;
            if (p.x > 30 * CELL) p.x = -CELL;

            if (p.frightMode > 0) p.frightMode--;

            // Draw Map
            ctx.strokeStyle = '#2222ff';
            ctx.lineWidth = 2;
            for (let r = 0; r < 20; r++) {
                for (let c = 0; c < 30; c++) {
                    let px = c * CELL, py = r * CELL;
                    let val = map[r][c];
                    if (val === 1) {
                        ctx.fillStyle = 'rgba(0,0,80,0.5)';
                        ctx.fillRect(px, py, CELL, CELL);
                        ctx.strokeRect(px, py, CELL, CELL);
                    } else if (val === 0) {
                        ctx.fillStyle = '#ffaa00';
                        ctx.fillRect(px + CELL / 2 - 2, py + CELL / 2 - 2, 4, 4);
                    } else if (val === 3) {
                        ctx.fillStyle = '#fff';
                        ctx.beginPath(); ctx.arc(px + CELL / 2, py + CELL / 2, 6, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }

            // Handle and Draw Ghosts
            for (let i = 0; i < ghosts.length; i++) {
                let g = ghosts[i];

                // Pathfinding decisions at intersections
                if (g.x % CELL === 0 && g.y % CELL === 0) {
                    let gx = g.x / CELL; let gy = g.y / CELL;

                    let dirs = [
                        { dx: g.dx ? Math.abs(g.dx) : 2, dy: 0 }, // Right
                        { dx: g.dx ? -Math.abs(g.dx) : -2, dy: 0 },// Left
                        { dx: 0, dy: g.dy ? Math.abs(g.dy) : 2 }, // Down
                        { dx: 0, dy: g.dy ? -Math.abs(g.dy) : -2 } // Up
                    ];

                    let possible = [];
                    for (let d = 0; d < dirs.length; d++) {
                        let dir = dirs[d];
                        // don't reverse
                        if (dir.dx === -g.dx && dir.dx !== 0) continue;
                        if (dir.dy === -g.dy && dir.dy !== 0) continue;

                        if (!isWall(gx + Math.sign(dir.dx), gy + Math.sign(dir.dy))) {
                            possible.push(dir);
                        }
                    }

                    if (possible.length === 0) {
                        // Turn around (dead end)
                        g.dx = -g.dx; g.dy = -g.dy;
                    } else {
                        let speed = p.frightMode > 0 ? 1 : 2;
                        // Pick random valid direction
                        let choice = possible[Math.floor(Math.random() * possible.length)];
                        g.dx = Math.sign(choice.dx) * speed;
                        g.dy = Math.sign(choice.dy) * speed;
                    }
                }
                g.x += g.dx; g.y += g.dy;

                // Ghost Tunnels
                if (g.x < -CELL) g.x = 30 * CELL;
                if (g.x > 30 * CELL) g.x = -CELL;

                // Collision with Player
                let dist = Math.hypot(p.x - g.x, p.y - g.y);
                if (dist < CELL - 4) {
                    if (p.frightMode > 0) {
                        // Eat ghost
                        scoreVal += 200; setScore(scoreVal); playSound('eat_ghost');
                        g.x = g.startX; g.y = g.startY; // send back to start
                    } else {
                        playSound('boom'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return; // Die
                    }
                }

                // Draw Ghost
                ctx.fillStyle = p.frightMode > 0 ? (p.frightMode < 100 && frame % 10 < 5 ? '#fff' : '#0000ff') : g.color;
                ctx.beginPath();
                let cx = g.x + CELL / 2;
                let cy = g.y + CELL / 2;
                let r = CELL / 2 - 2;
                ctx.arc(cx, cy, r, Math.PI, 0); // top half
                ctx.lineTo(cx + r, cy + r);     // bottom right
                ctx.lineTo(cx, cy + r - 4);     // bottom middle zigzag
                ctx.lineTo(cx - r, cy + r);     // bottom left
                ctx.fill();

                // Eyes
                if (p.frightMode === 0) {
                    ctx.fillStyle = '#fff';
                    ctx.beginPath(); ctx.arc(cx - 3, cy - 2, 2.5, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 3, cy - 2, 2.5, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#000';
                    let pupilOffX = Math.sign(g.dx);
                    let pupilOffY = Math.sign(g.dy);
                    ctx.beginPath(); ctx.arc(cx - 3 + pupilOffX, cy - 2 + pupilOffY, 1, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 3 + pupilOffX, cy - 2 + pupilOffY, 1, 0, Math.PI * 2); ctx.fill();
                }
            }

            // Draw Pacman
            let angBase = 0;
            if (p.dx > 0) angBase = 0;
            else if (p.dx < 0) angBase = Math.PI;
            else if (p.dy > 0) angBase = Math.PI / 2;
            else if (p.dy < 0) angBase = -Math.PI / 2;
            // if stationary, keep last angle visually or 0
            if (p.dx === 0 && p.dy === 0) p.mouthOpen = 0;

            p.mouthOpen += 0.2;
            let mouthPulse = (Math.sin(p.mouthOpen) + 1) / 2 * 0.7; // 0 to 0.7 radians

            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(p.x + CELL / 2, p.y + CELL / 2, CELL / 2 - 2, angBase + mouthPulse, angBase + Math.PI * 2 - mouthPulse);
            ctx.lineTo(p.x + CELL / 2, p.y + CELL / 2);
            ctx.fill();

            // Check Win Condition
            if (dotsLeft === 0) {
                playSound('pew'); if (onGameOver) onGameOver(scoreVal); setIsPlaying(false); return;
            }

            frame++;
            anim = window.requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', kd); };

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
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>SCORE: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)', flexDirection: 'column' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Pac</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace', maxWidth: '80%', textAlign: 'center' }}>
                    Navigate the grid, collect dots, and avoid the rogue AI ghost programs.<br />Grab the large super-nodes to turn the tables! Eat the ghosts!
                </p>
                <button className="btn btn-primary" onClick={() => { playSound('click'); setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY GAME</button>
            </div>}
    </div>;
};
export default NeonPac;
