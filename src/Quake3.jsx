import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, RotateCcw, Info, MousePointer2 } from 'lucide-react';

export default function Quake3() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("quake-game-wrapper");
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
        <div id="quake-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#ffcc00', fontFamily: 'monospace' }}>QUAKE III ARENA</h2>

                        <div style={{ background: 'rgba(255, 204, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 204, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MousePointer2 size={16} /> CONTROLS:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                                <li><strong>Mouse Click:</strong> Focus and Lock Mouse</li>
                                <li><strong>WASD:</strong> Movement</li>
                                <li><strong>Mouse Left:</strong> Fire Weapon</li>
                                <li><strong>Space:</strong> Jump</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ffcc00', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}
                        >
                            DÖVÜŞE BAŞLA
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://www.gameflare.com/embed/quake-3-arena/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Quake 3 Web"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                        allow="keyboard-map *; pointer-lock *; fullscreen *"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '5px', borderRadius: '5px', cursor: 'pointer', zIndex: 100 }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
