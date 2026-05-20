import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Gamepad2, Navigation } from 'lucide-react';

export default function MotoX3M() {
    const [started, setStarted] = useState(true);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("motox3m-game-wrapper");
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
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
        <div id="motox3m-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '440px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffcc00', fontFamily: 'monospace' }}>MOTO X3M</h2>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Extreme Trial Bike Racing
                        </p>
                        
                        <div style={{ background: 'rgba(255, 204, 0, 0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255, 204, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Gamepad2 size={16} /> CONTROLS / KONTROLLER:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li><strong>W / Up Arrow:</strong> Accelerate / Gaz ver</li>
                                <li><strong>S / Down Arrow:</strong> Brake & reverse / Fren & geri git</li>
                                <li><strong>A / Left Arrow:</strong> Tilt backward (flips) / Arkaya yat (takla at)</li>
                                <li><strong>D / Right Arrow:</strong> Tilt forward (flips) / Öne yat (takla at)</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#888' }}>
                            <p style={{ margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                                TR: Engellerden kaçın, taklalar atarak havada süre bonusu kazan ve bitişe en hızlı şekilde ulaş!<br />
                                EN: Dodge obstacles, perform stunts in the air to gain time bonuses, and reach the finish line as fast as possible!
                            </p>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ffcc00', color: '#000', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(255, 204, 0, 0.3)' }}
                        >
                            START RACE / BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://htmlxm.github.io/h/moto-x3m/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Moto X3M"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals"
                        allow="autoplay; fullscreen; keyboard-lock; pointer-lock"
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
