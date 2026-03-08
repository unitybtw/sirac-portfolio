import React, { useState, useEffect } from 'react';

const KonamiGame = ({ onClose }) => {
    const [snake, setSnake] = useState([[10, 10]]);
    const [food, setFood] = useState([15, 15]);
    const [dir, setDir] = useState([0, -1]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const handleKey = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            switch (e.key) {
                case 'ArrowUp': if (dir[1] === 0) setDir([0, -1]); break;
                case 'ArrowDown': if (dir[1] === 0) setDir([0, 1]); break;
                case 'ArrowLeft': if (dir[0] === 0) setDir([-1, 0]); break;
                case 'ArrowRight': if (dir[0] === 0) setDir([1, 0]); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [dir]);

    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setSnake(s => {
                const h = s[0];
                const newH = [h[0] + dir[0], h[1] + dir[1]];
                if (newH[0] < 0 || newH[0] >= 30 || newH[1] < 0 || newH[1] >= 30) {
                    setGameOver(true); return s;
                }
                if (s.some(seg => seg[0] === newH[0] && seg[1] === newH[1])) {
                    setGameOver(true); return s;
                }
                const newSnake = [newH, ...s];
                if (newH[0] === food[0] && newH[1] === food[1]) {
                    setScore(sc => sc + 10);
                    setFood([Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)]);
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [dir, food, gameOver]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: '#0f0', fontFamily: 'monospace', textShadow: '0 0 10px #0f0' }}>NEON SNAKE</h1>
            <p style={{ color: '#0f0', fontFamily: 'monospace' }}>SCORE: {score}</p>
            <div style={{ width: '300px', height: '300px', border: '2px solid #0f0', position: 'relative', boxShadow: '0 0 20px #0f0' }}>
                {snake.map((seg, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${seg[0] * 10}px`, top: `${seg[1] * 10}px`, width: '10px', height: '10px', background: i === 0 ? '#fff' : '#0f0', boxShadow: '0 0 5px #0f0' }} />
                ))}
                <div style={{ position: 'absolute', left: `${food[0] * 10}px`, top: `${food[1] * 10}px`, width: '10px', height: '10px', background: '#f0f', boxShadow: '0 0 10px #f0f' }} />
            </div>
            {gameOver && <h2 style={{ color: 'red', fontFamily: 'monospace', marginTop: '1rem' }}>GAME OVER</h2>}
            <button onClick={onClose} style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #0f0', color: '#0f0', fontFamily: 'monospace', cursor: 'pointer' }}>EXIT SIMULATION</button>
        </div>
    );
};

export default KonamiGame;
