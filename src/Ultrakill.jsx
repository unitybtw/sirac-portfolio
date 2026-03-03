import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Zap, Crosshair } from 'lucide-react';

export default function Ultrakill() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("ultrakill-game-wrapper");
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
        <div id="ultrakill-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#110000' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.8rem', marginBottom: '0.5rem', color: '#ff3300', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '4px' }}>ULTRAKILL</h2>
                        <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>Mankind is dead. Blood is fuel. Hell is full.</p>
                        <div style={{ background: 'rgba(255, 51, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 51, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ff3300', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Crosshair size={16} /> BİLGİ & KONTROLLER:
                            </p>
                            <p style={{ color: '#ff6666', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                ⚠️ Uyarı: Yüksek grafik detaylı Unity oyunudur. Yüklenmesi internet hızına göre sürebilir.
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem' }}>
                                <li><strong>Oyun başlayınca:</strong> Fareyi kilitlemek için ekrana tıkla.</li>
                                <li><strong>WASD:</strong> Hareket</li>
                                <li><strong>Sol Tık:</strong> Ateş Et</li>
                                <li><strong>Sağ Tık / Q:</strong> Özel Güç / Silah Fonksiyonu</li>
                                <li><strong>Space:</strong> Zıplama / Dash</li>
                                <li><strong>ESC / P:</strong> Duraklat / Menü</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: '#ff3300', color: '#fff', fontWeight: 'bold', borderRadius: '4px', border: 'none', boxShadow: '0 0 20px rgba(255,51,0,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}
                        >
                            <Zap size={20} style={{ display: 'inline', marginRight: '8px' }} /> CEHENNEME İN
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://raw.githack.com/genizy/web-port/main/ultrakill/index.html"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Ultrakill Web"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals blob: *"
                        allow="autoplay; fullscreen; keyboard-lock; pointer-lock"
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
