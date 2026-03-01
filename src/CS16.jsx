import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CS16() {
    const [started, setStarted] = useState(false);
    const toggleFullScreen = () => {
        const elem = document.getElementById("cs-container");
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

    return (
        <div
            id="cs-container"
            className="flex-1 overflow-hidden w-full h-full bg-black/90"
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 100000, width: '100vw', height: '100vh', padding: '20px' }}>

            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 10, borderBottom: '1px solid #ff9900', paddingBottom: '1rem'
            }}>
                <h1 className="text-xl md:text-3xl font-bold font-mono tracking-tight text-white m-0">
                    COUNTER-STRIKE 1.6
                </h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={toggleFullScreen}
                        style={{
                            background: '#2b65ec', color: 'white', border: 'none',
                            padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        FULLSCREEN
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#ff3333', color: 'white', border: 'none',
                            padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        EXIT / RESTART
                    </button>
                </div>
            </div>

            {!started ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid #ff9900', textAlign: 'center', background: 'rgba(0,0,0,0.95)', maxWidth: '600px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#ff9900' }}>CS 1.6 BROWSER</h2>
                        <p style={{ color: '#bbb', marginBottom: '1rem', lineHeight: '1.6' }}>
                            Efsanevi Counter-Strike 1.6 oyununu indirmeden doğrudan tarayıcında oyna.
                        </p>

                        <div style={{ background: 'rgba(255, 153, 0, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px dashed #ff9900', marginBottom: '2rem', color: '#ff9900', fontSize: '0.9rem' }}>
                            ⚠️ <strong>ÖNEMLİ:</strong> Eğer aşağıda "Doğrulama Hatası" (Cloudflare/CAPTCHA) alırsan, lütfen yandaki <strong>"YENİ SEKMEDE AÇ"</strong> butonunu kullan.
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setStarted(true)}
                                className="btn btn-primary"
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: '#ff9900', border: 'none', color: '#000', fontWeight: 'bold' }}
                            >
                                SİTE İÇİNDE OYNA
                            </button>

                            <button
                                onClick={() => window.open('https://play-cs.com/en/', '_blank')}
                                className="btn btn-secondary"
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: '#2b65ec', border: 'none', color: '#fff', fontWeight: 'bold' }}
                            >
                                YENİ SEKMEDE AÇ
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div style={{ width: '100%', height: 'calc(100vh - 120px)', marginTop: '20px', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '2px solid #ff9900' }}>
                    <iframe
                        src="https://play-cs.com/en/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Counter Strike 1.6"
                        allow="keyboard-map *; pointer-lock *; fullscreen *"
                        allowFullScreen
                        tabIndex="0"
                        onLoad={(e) => e.target.focus()}
                        onPointerEnter={(e) => e.target.focus()}
                    />
                </div>
            )}
        </div>
    );
}
