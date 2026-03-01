import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, ExternalLink, Info } from 'lucide-react';

export default function Slope() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("slope-game-wrapper");
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
        <div id="slope-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#00ff00' }}>SLOPE</h2>
                        <div style={{ background: 'rgba(0, 255, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '0.3rem' }}>🎯 AMAÇ:</p>
                            <p style={{ color: '#bbb' }}>Neon yeşili bir topu kontrol ederek engellerden kaç ve platformdan düşme! Hızlandıkça reflekslerini konuştur.</p>
                            <p style={{ color: '#00ff00', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.3rem' }}>🕹️ KONTROLLER:</p>
                            <p style={{ color: '#bbb' }}>SAĞ/SOL ok tuşları veya A/D tuşları.</p>
                        </div>
                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#00ff00', color: '#000', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
                        >
                            OYUNU BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://tr.y8.com/embed/slope"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="SLOPE"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                        allow="keyboard-map *; pointer-lock *; fullscreen *"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
