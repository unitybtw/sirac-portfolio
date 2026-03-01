import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonTetris = ({ onGameOver }) => {
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

        const COLS = 10, ROWS = 20, BLOCK = 20;
        let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        const colors = [null, '#00f0ff', '#ff00ff', '#00ff00', '#ffff00', '#ffaa00', '#ff003c', '#8a2be2'];
        const shapes = [
            [],
            [[1, 1, 1, 1]], // I
            [[2, 0, 0], [2, 2, 2]], // J
            [[0, 0, 3], [3, 3, 3]], // L
            [[4, 4], [4, 4]], // O
            [[0, 5, 5], [5, 5, 0]], // S
            [[0, 6, 0], [6, 6, 6]], // T
            [[7, 7, 0], [0, 7, 7]] // Z
        ];

        let piece = null, currScore = 0, frame = 0, dropSpeed = 30;

        const newPiece = () => {
            let type = Math.floor(Math.random() * 7) + 1;
            piece = { shape: shapes[type], x: 3, y: 0, color: type };
            if (collide(0, 0, piece.shape)) if (onGameOver) onGameOver(score); setIsPlaying(false);
        };

        const collide = (dx, dy, shape) => {
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c]) {
                        let nx = piece.x + c + dx; let ny = piece.y + r + dy;
                        if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && grid[ny][nx])) return true;
                    }
                }
            }
            return false;
        };

        const rotate = () => {
            let newShape = piece.shape[0].map((_, i) => piece.shape.map(row => row[i])).reverse();
            if (!collide(0, 0, newShape)) piece.shape = newShape;
        };

        const merge = () => {
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c] && piece.y + r >= 0) grid[piece.y + r][piece.x + c] = piece.color;
                }
            }
            let lines = 0;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (grid[r].every(v => v !== 0)) {
                    grid.splice(r, 1);
                    grid.unshift(Array(COLS).fill(0));
                    lines++; r++; // check same row again
                }
            }
            if (lines > 0) {
                currScore += lines * 100; setScore(currScore);
                dropSpeed = Math.max(5, 30 - Math.floor(currScore / 500) * 2);
            }
            newPiece();
        };

        const key = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) e.preventDefault();
            if (!piece) return;
            if (e.key === 'ArrowLeft' && !collide(-1, 0, piece.shape)) piece.x--;
            if (e.key === 'ArrowRight' && !collide(1, 0, piece.shape)) piece.x++;
            if (e.key === 'ArrowUp') rotate();
            if (e.key === 'ArrowDown' && !collide(0, 1, piece.shape)) piece.y++;
        };
        window.addEventListener('keydown', key, { passive: false });

        newPiece();
        let anim;

        const drawBlock = (x, y, colorCode) => {
            ctx.fillStyle = colors[colorCode];
            ctx.shadowBlur = 10; ctx.shadowColor = colors[colorCode];
            ctx.fillRect(x * BLOCK + 1, y * BLOCK + 1, BLOCK - 2, BLOCK - 2);
        };

        
    let _lastFrameTime = 0;
    const draw = () => {
      let _now = Date.now();
      if (_now - _lastFrameTime < 15) {
          anim = window.requestAnimationFrame(draw);
          return;
      }
      _lastFrameTime = _now;
            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Center the grid horizontally
            ctx.save();
            ctx.translate(canvas.width / 2 - (COLS * BLOCK) / 2, 0);

            // Outline
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.strokeRect(0, 0, COLS * BLOCK, ROWS * BLOCK);

            if (frame++ % dropSpeed === 0) {
                if (!collide(0, 1, piece.shape)) piece.y++;
                else merge();
            }

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (grid[r][c]) drawBlock(c, r, grid[r][c]);
                }
            }
            if (piece) {
                for (let r = 0; r < piece.shape.length; r++) {
                    for (let c = 0; c < piece.shape[r].length; c++) {
                        if (piece.shape[r][c]) drawBlock(piece.x + c, piece.y + r, piece.color);
                    }
                }
                // Ghost piece
                let gy = piece.y;
                while (!collide(0, gy - piece.y + 1, piece.shape)) gy++;
                for (let r = 0; r < piece.shape.length; r++) {
                    for (let c = 0; c < piece.shape[r].length; c++) {
                        if (piece.shape[r][c]) {
                            ctx.fillStyle = 'rgba(255,255,255,0.2)';
                            ctx.fillRect((piece.x + c) * BLOCK, (gy + r) * BLOCK, BLOCK, BLOCK);
                        }
                    }
                }
            }
            ctx.restore();
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
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Tetris</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Classic Block Stacking.</p>
                {score > 0 && <p style={{ color: '#8a2be2', marginBottom: '1rem' }}>Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default NeonTetris;
