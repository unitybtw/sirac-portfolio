import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, RotateCcw, ExternalLink, Info } from 'lucide-react';

export default function CS16({ onGameOver }) {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("cs-game-wrapper");
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

    // Focus the iframe to prevent black screen/input issues
    useEffect(() => {
        if (started && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [started]);

    return (
        <div id="cs-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>



            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ff9900' }}>CS 1.6 BROWSER</h2>

                        <div style={{ background: 'rgba(255, 153, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 153, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#ff9900', fontWeight: 'bold', marginBottom: '0.3rem' }}>💡 Öneri:</p>
                            <p style={{ color: '#bbb' }}>Eğer doğrulama sonrası ekran kararırsa <strong>RESTART</strong> butonunu veya aşağıdaki butonu kullanın.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <button
                                onClick={() => setStarted(true)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', background: '#ff9900', color: '#000', fontWeight: 'bold', borderRadius: '8px' }}
                            >
                                SİTE İÇİNDE BAŞLAT
                            </button>

                            <button
                                onClick={() => window.open('https://play-cs.com/en/', '_blank')}
                                style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.9rem' }}
                            >
                                <ExternalLink size={16} /> HARİCİ PENCEREDE AÇ
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://play-cs.com/en/"
                        style={{
                            width: '100%',
                            height: 'calc(100% + 15px)', // Small crop for play-cs
                            border: 'none',
                            marginTop: '-5px'
                        }}
                        title="Counter Strike 1.6"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                        allow="keyboard-map *; pointer-lock *; fullscreen *"
                        allowFullScreen
                        tabIndex="0"
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                    {/* Fixed bottom cover to hide site labels */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10px', background: '#000', zIndex: 5 }}></div>
                </div>
            )}
        </div>
    );
}
