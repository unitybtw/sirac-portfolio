import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, ExternalLink, Info } from 'lucide-react';

const VoxelWorld = ({ onGameOver }) => {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("minecraft-game-wrapper");
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
        <div id="minecraft-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>

            {/* Minimal Header inside the game area */}
            <div style={{
                padding: '8px 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#111',
                borderBottom: '1px solid #1ba51b'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={14} color="#1ba51b" />
                    <span style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>Minecraft 1.8.8 WebRTC Edition</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={toggleFullScreen}
                        style={{
                            background: 'transparent', color: '#fff', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem'
                        }}
                    >
                        <Maximize size={14} /> FULLSCREEN
                    </button>
                </div>
            </div>

            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1ba51b' }}>MINECRAFT 1.8.8</h2>

                        <div style={{ background: 'rgba(27, 165, 27, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(27, 165, 27, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <p style={{ color: '#1ba51b', fontWeight: 'bold', marginBottom: '0.3rem' }}>🎮 Multiplayer:</p>
                            <p style={{ color: '#bbb' }}>ESC menüsünden <strong>"Invite"</strong> diyerek kod oluşturabilir ve arkadaşlarınla beraber oynayabilirsin.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <button
                                onClick={() => setStarted(true)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', background: '#1ba51b', color: '#000', fontWeight: 'bold', borderRadius: '8px' }}
                            >
                                SİTE İÇİNDE BAŞLAT
                            </button>

                            <button
                                onClick={() => window.open(`${import.meta.env.BASE_URL}minecraft_1_8_8_singleplayer.html`, "_blank")}
                                style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.9rem' }}
                            >
                                <ExternalLink size={16} /> HARİCİ PENCEREDE AÇ
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src={`${import.meta.env.BASE_URL}minecraft_1_8_8_singleplayer.html`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Minecraft WebRTC"
                        allow="keyboard-map *; pointer-lock *; fullscreen *"
                        allowFullScreen
                        tabIndex="0"
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default VoxelWorld;
