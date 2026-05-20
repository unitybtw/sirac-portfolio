import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Zap, Sparkles } from 'lucide-react';

export default function CookieClicker() {
    const [started, setStarted] = useState(true);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("cookie-game-wrapper");
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
        <div id="cookie-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '440px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ff8800', fontFamily: 'monospace' }}>COOKIE CLICKER</h2>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            The Ultimate Idle Clicker
                        </p>
                        
                        <div style={{ background: 'rgba(255, 136, 0, 0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255, 136, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#ff8800', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} /> HOW TO PLAY / OYNANIŞ:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li><strong>Mouse Left Click:</strong> Click the giant cookie to bake cookies / Dev kurabiyeye tıklayarak kurabiye üret</li>
                                <li><strong>Upgrades:</strong> Spend cookies to buy grandmas, farms, factories and upgrades / Kazandığın kurabiyelerle büyükanne, çiftlik ve fabrikalar satın al</li>
                                <li><strong>Achievements:</strong> Unlock powerful cookie multipliers / Çarpanları artırmak için başarımların kilidini aç</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#888' }}>
                            <p style={{ margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                                TR: Dev kurabiyeye tıklayarak başla. Otomatik tıklayıcılar al, fabrikalar kur ve trilyonlarca kurabiye üret!<br />
                                EN: Start by clicking the giant cookie. Buy auto-clickers, build factories, and bake trillions of cookies!
                            </p>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ff8800', color: '#fff', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(255, 136, 0, 0.3)' }}
                        >
                            BAKE COOKIES / BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://htmlxm.github.io/h/cookie-clicker/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Cookie Clicker"
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
