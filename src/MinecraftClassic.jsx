import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Box, Compass } from 'lucide-react';

export default function MinecraftClassic() {
    const [started, setStarted] = useState(true);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("mc-game-wrapper");
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
        <div id="mc-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '440px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#55aa55', fontFamily: 'monospace' }}>MINECRAFT CLASSIC</h2>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Original 2009 Creative Build
                        </p>
                        
                        <div style={{ background: 'rgba(85, 170, 85, 0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(85, 170, 85, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#55aa55', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Box size={16} /> CONTROLS / KONTROLLER:
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li><strong>WASD:</strong> Move / Hareket et</li>
                                <li><strong>Space:</strong> Jump / Zıpla</li>
                                <li><strong>Left Click:</strong> Destroy / Build blocks / Blok kır & yerleştir</li>
                                <li><strong>Right Click:</strong> Toggle mine & build mode / Mod değiştir</li>
                                <li><strong>B:</strong> Choose blocks menu / Blok seçme menüsü</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#888' }}>
                            <p style={{ margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                                TR: Minecraft'ın efsanevi ilk alpha sürümü! Hayal gücünüzü serbest bırakın ve 32 farklı blok türü ile inşa edin.<br />
                                EN: Minecraft's legendary first alpha release! Unleash your imagination and build using 32 block types.
                            </p>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#55aa55', color: '#fff', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(85, 170, 85, 0.3)' }}
                        >
                            GENERATE WORLD / BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://classic.minecraft.net/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Minecraft Classic"
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
