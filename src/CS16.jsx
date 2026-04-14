import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Target, Wifi } from 'lucide-react';

export default function CS16() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("cs16-game-wrapper");
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen && document.exitFullscreen();
        }
    };

    useEffect(() => {
        if (started && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [started]);

    return (
        <div
            id="cs16-game-wrapper"
            style={{
                width: '100%',
                height: '100%',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {!started ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '20px',
                    background: '#0a0f0a',
                    overflowY: 'auto',
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', width: '100%', maxWidth: '480px', paddingBottom: '20px' }}
                    >
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '0.3rem',
                            color: '#ffd700',
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                            textShadow: '0 0 10px #ffd700',
                        }}>Kirka.io (CS:GO)</h2>
                        <p style={{ color: '#fff', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '4px' }}>
                            Multiplayer Web Shooter
                        </p>

                        {/* Controls - compact 2-column grid */}
                        <div style={{
                            background: 'rgba(255, 215, 0, 0.05)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            marginBottom: '1rem',
                            textAlign: 'left',
                        }}>
                            <p style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                <Target size={14} /> GAME CONTROLS
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                                {[
                                    ['Mouse', 'Look & Aim'],
                                    ['Left Click', 'Fire'],
                                    ['Right Click', 'Scope'],
                                    ['WASD', 'Move'],
                                    ['Space', 'Jump'],
                                    ['Ctrl', 'Duck'],
                                    ['R', 'Reload'],
                                    ['B', 'Buy Menu'],
                                ].map(([key, val]) => (
                                    <span key={key} style={{ color: '#bbb', fontSize: '0.75rem' }}>
                                        <strong style={{ color: '#fff' }}>{key}:</strong> {val}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Network info - concise */}
                        <div style={{
                            background: 'rgba(0, 255, 100, 0.05)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 100, 0.2)',
                            marginBottom: '1.2rem',
                            textAlign: 'left',
                        }}>
                            <p style={{ color: '#00ff66', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                <Wifi size={14} /> NETWORK PLAY
                            </p>
                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.78rem', lineHeight: '1.5' }}>
                                CS:GO inspired browser FPS. Join public servers or create private matches with friends instantly.
                            </p>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                background: 'linear-gradient(45deg, #cc9900, #ffcc00)',
                                color: '#000',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 0 20px rgba(255,204,0,0.5)',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            }}
                        >
                            ▶ PLAY
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://kirka.io/"
                        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                        title="Kirka Web FPS"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                        allow="autoplay; fullscreen; microphone; camera; keyboard-lock; pointer-lock"
                        allowFullScreen
                        onLoad={() => { if (iframeRef.current) iframeRef.current.focus(); }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{
                            position: 'absolute', bottom: '10px', right: '10px',
                            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff', padding: '8px', borderRadius: '6px',
                            cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(5px)',
                        }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
