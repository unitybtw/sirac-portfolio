import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VoxelWorld = ({ onGameOver }) => {
    const [started, setStarted] = useState(false);

    const toggleFullScreen = () => {
        const elem = document.getElementById("minecraft-container");
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
        <div id="minecraft-container" style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
            {/* Header for controls */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                background: 'rgba(0,0,0,0.8)', padding: '10px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 10, borderBottom: '1px solid #1ba51b'
            }}>
                <h1 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-white">
                    MINECRAFT 1.8.8
                    <span className="block text-lg md:text-xl text-green-400 mt-2 font-sans font-normal opacity-80">
                        (SINGLEPLAYER & AĞ/LAN ÜZERİNDEN OYUN - WEBRTC)
                    </span>
                </h1>
                <button
                    onClick={toggleFullScreen}
                    style={{
                        background: '#2b65ec', color: 'white', border: 'none',
                        padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace',
                        marginRight: '10px'
                    }}
                >
                    FULLSCREEN
                </button>
                <button
                    onClick={() => {
                        if (document.fullscreenElement) document.exitFullscreen();
                        if (onGameOver) onGameOver(100); // Give them 100 points as a reward
                    }}
                    style={{
                        background: '#ff3333', color: 'white', border: 'none',
                        padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace'
                    }}
                >
                    EXIT
                </button>
            </div>

            {!started ? (
                <div style={{
                    position: 'absolute', top: '50px', left: 0, width: '100%', height: 'calc(100% - 50px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    background: 'url(https://minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.png) center/cover',
                    zIndex: 5
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid #1ba51b', textAlign: 'center', background: 'rgba(0,0,0,0.9)' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1ba51b' }}>MINECRAFT ONLINE</h2>
                        <p style={{ color: "#bbb", marginBottom: "2rem", maxWidth: "400px" }}>
                            Minecraft 1.8.8 versiyonu ile oyun içinde <strong>(ESC menüsünden "Invite")</strong> diyerek kod oluşturabilir ve arkadaşlarının doğrudan senin dünyana bağlanmasını sağlayabilirsin.
                            <i>Not: Bunun için Singleplayer destekli (yaklaşık 30-40 MB) 1.8.8 Offline HTML dosyası gereklidir.</i>
                        </p>

                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                            <button
                                onClick={() => setStarted(true)}
                                className="btn btn-primary"
                                style={{
                                    padding: "1rem 2rem",
                                    fontSize: "1.2rem",
                                    background: "#1ba51b",
                                    border: "none",
                                    color: "#000",
                                    fontWeight: "bold",
                                }}
                            >
                                PLAY IN BROWSER
                            </button>

                            <button
                                onClick={() => window.open(`${import.meta.env.BASE_URL}minecraft_1_8_8_singleplayer.html`, "_blank")}
                                className="btn btn-secondary"
                                style={{
                                    padding: "1rem 2rem",
                                    fontSize: "1.2rem",
                                    background: "#2b65ec",
                                    border: "none",
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                PLAY IN NEW TAB
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <iframe
                    src={`${import.meta.env.BASE_URL}minecraft_1_8_8_singleplayer.html`}
                    style={{ width: "100%", height: "calc(100% - 40px)", border: "none", marginTop: "40px" }}
                    title="Minecraft WebRTC"
                    allow="keyboard-map *"
                    allowFullScreen
                    tabIndex="0"
                    onLoad={(e) => e.target.focus()}
                    onPointerEnter={(e) => e.target.focus()}
                />
            )}
        </div>
    );
};

export default VoxelWorld;
