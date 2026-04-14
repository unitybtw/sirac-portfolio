import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Target, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CS16() {
    const { t } = useTranslation();
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("cs16-game-wrapper");
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
        <div id="cs16-game-wrapper" style={{ width: '100%', height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#0a0f0a' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '450px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffd700', fontFamily: 'monospace', letterSpacing: '1px', textShadow: '0 0 10px #ffd700' }}>CS 1.6 Web</h2>
                        <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>Multiplayer / LAN Port</p>
                        
                        <div style={{ background: 'rgba(255, 215, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Target size={16} /> GAME CONTROLS
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem' }}>
                                <li><strong>Mouse:</strong> Look & Aim</li>
                                <li><strong>Left Click:</strong> Fire Weapon</li>
                                <li><strong>Right Click:</strong> Scope / Alternative Fire</li>
                                <li><strong>WASD:</strong> Movement</li>
                                <li><strong>Space:</strong> Jump</li>
                                <li><strong>Ctrl:</strong> Duck</li>
                                <li><strong>Shift:</strong> Walk (Silent)</li>
                                <li><strong>R:</strong> Reload</li>
                                <li><strong>B:</strong> Buy Menu</li>
                                <li><strong>ESC:</strong> Menu / Settings</li>
                            </ul>
                        </div>
                        
                        <div style={{ background: 'rgba(0, 255, 100, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 100, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#00ff66', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wifi size={16} /> NETWORK PLAY
                            </p>
                            <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5' }}>
                                This emulator supports full real-time multiplayer. You can join existing web servers or create your own custom lobbies to play with friends natively in the browser.
                            </p>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: 'linear-gradient(45deg, #cc9900, #ffcc00)', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(255,204,0,0.5)', textTransform: 'uppercase' }}
                        >
                            PLAY (CONNECT TO SERVER)
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://play-cs.com"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="CS 1.6 Web"
                        allow="autoplay; fullscreen; microphone; camera; keyboard-lock; pointer-lock"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '5px', borderRadius: '5px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(5px)' }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
