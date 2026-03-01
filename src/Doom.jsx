import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, RotateCcw, Info, MousePointer2 } from 'lucide-react';

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



            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#ff0000', fontFamily: 'monospace' }}>DOOM</h2>

                        <div style={{ background: 'rgba(255, 0, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 0, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#ff0000', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MousePointer2 size={16} /> MOUSE & KLAVYE:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                                <li>Oyun başlayınca <strong>ekrana tıkla</strong> (Mouse kilitlenir).</li>
                                <li><strong>ESC:</strong> Mouse kilidini açar.</li>
                                <li><strong>WASD:</strong> Hareket</li>
                                <li><strong>Mouse Sol:</strong> Ateş</li>
                                <li><strong>Mouse Hareket:</strong> Bakış</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#e60000', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(230, 0, 0, 0.3)' }}
                        >
                            OYUNU BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://wasm.continuation-labs.com/doom/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="DOOM WASM"
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
