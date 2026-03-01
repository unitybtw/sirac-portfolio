import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Info, Gamepad2 } from 'lucide-react';

export default function Mario64() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("mario-game-wrapper");
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
        <div id="mario-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffcc00' }}>SUPER MARIO 64</h2>
                        <div style={{ background: 'rgba(255, 204, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 204, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Gamepad2 size={16} /> KONTROLLER:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                                <li><strong>Enter:</strong> START (Menüleri Geçer)</li>
                                <li><strong>WASD / Ok Tuşları:</strong> Hareket</li>
                                <li><strong>Space / X:</strong> Zıplama (A)</li>
                                <li><strong>C:</strong> Vurma (B)</li>
                                <li><strong>Z / L:</strong> Kamera / Eğilme</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ffcc00', color: '#000', fontWeight: 'bold', borderRadius: '12px', border: 'none' }}
                        >
                            OYUNU BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://64.js.org/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Super Mario 64"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals allow-popups"
                        allow="keyboard-map *; pointer-lock *; fullscreen *; keyboard-lock *"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '5px', borderRadius: '5px', cursor: 'pointer', zIndex: 10 }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
