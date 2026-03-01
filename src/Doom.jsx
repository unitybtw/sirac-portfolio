import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, RotateCcw, Info, Keyboard } from 'lucide-react';

export default function Doom() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("doom-game-wrapper");
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        if (started && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [started]);

    return (
        <div id="doom-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>

            {/* Minimal Header */}
            <div style={{
                padding: '8px 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#1a1a1a',
                borderBottom: '1px solid #ff0000'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={14} color="#ff0000" />
                    <span style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>DOOM Classic (Shareware)</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {started && (
                        <button
                            onClick={() => { setStarted(false); setTimeout(() => setStarted(true), 50); }}
                            style={{
                                background: 'transparent', color: '#ff0000', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem'
                            }}
                        >
                            <RotateCcw size={14} /> RESTART
                        </button>
                    )}

                    <button
                        onClick={toggleFullScreen}
                        style={{
                            background: 'transparent', color: '#fff', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem'
                        }}
                    >
                        <Maximize size={14} /> FULLSCREEN
                    </button>
                </div>
            </div>

            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: '#ff0000', fontFamily: 'monospace' }}>DOOM</h2>

                        <div style={{ background: 'rgba(255, 0, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 0, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#ff0000', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Keyboard size={16} /> CONTROLS:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem' }}>
                                <li><strong>Arrows:</strong> Move</li>
                                <li><strong>CTRL:</strong> Fire</li>
                                <li><strong>Space:</strong> Use / Open Door</li>
                                <li><strong>Shift:</strong> Run</li>
                                <li><strong>1-7:</strong> Weapons</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#e60000', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(230, 0, 0, 0.3)' }}
                        >
                            START GAME
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://js-dos.com/games/doom.exe.html"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="DOOM Classic"
                        allow="keyboard-map *; pointer-lock *; fullscreen *"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                        onPointerEnter={(e) => e.target.focus()}
                    />
                </div>
            )}
        </div>
    );
}
