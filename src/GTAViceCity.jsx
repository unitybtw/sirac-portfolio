import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Map, Car } from 'lucide-react';

export default function GTAViceCity() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("gta-game-wrapper");
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
        <div id="gta-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#1a0b1c' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '450px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ff66b2', fontFamily: 'serif', fontStyle: 'italic', letterSpacing: '2px', textShadow: '0 0 10px #ff66b2' }}>Vice City</h2>
                        <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>Welcome to the 80s</p>
                        <div style={{ background: 'rgba(255, 102, 178, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 102, 178, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ff66b2', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Map size={16} /> BİLGİ & KONTROLLER:
                            </p>
                            <p style={{ color: '#ffcc00', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                ⚠️ Uyarı: Oyun ilk açılışta yaklaşık 800MB veri indirecektir. (İnternet hızınıza göre 1-3 dk sürebilir). Siyah ekranda kalırsa lütfen bekleyin.
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem' }}>
                                <li><strong>Ekrana tıklayarak</strong> fareyi oyun içine kilitleyin.</li>
                                <li><strong>WASD:</strong> Yürüme / Araç Kullanma</li>
                                <li><strong>Fare:</strong> Kamera Yönü / Nişan</li>
                                <li><strong>Sol Tık:</strong> Ateş Et / Yumruk At</li>
                                <li><strong>F / Enter:</strong> Araca Bin / İkincil Etkileşim</li>
                                <li><strong>ESC:</strong> Menü / Duraklat</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: 'linear-gradient(45deg, #ff66b2, #00f0ff)', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(255,102,178,0.5)', textTransform: 'uppercase' }}
                        >
                            <Car size={20} style={{ display: 'inline', marginRight: '8px' }} /> OYUNU BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://script.google.com/macros/s/AKfycbxjL1dXRpsB3hVcnPpO9-FkJwFwGMHUo_eOgEOGZLkCwpgizuA1r-9nkuqJVDO5d8XwUA/exec"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="GTA Vice City Web"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
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
