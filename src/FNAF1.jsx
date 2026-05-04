import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Eye, AlertTriangle } from 'lucide-react';

export default function FNAF1() {
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("fnaf1-game-wrapper");
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen && document.exitFullscreen();
        }
    };

    useEffect(() => {
        if (started && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [started]);

    return (
        <div
            id="fnaf1-game-wrapper"
            style={{
                width: '100%',
                height: '100%',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {!started ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '20px',
                    background: 'linear-gradient(180deg, #0a0000 0%, #1a0000 100%)',
                    overflowY: 'auto',
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', width: '100%', maxWidth: '480px', paddingBottom: '20px' }}
                    >
                        {/* Animated eye icon */}
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            style={{ marginBottom: '0.5rem' }}
                        >
                            <Eye size={48} color="#ff2200" style={{ filter: 'drop-shadow(0 0 15px #ff2200)' }} />
                        </motion.div>

                        <h2 style={{
                            fontSize: '1.6rem',
                            marginBottom: '0.2rem',
                            color: '#ff2200',
                            fontFamily: 'monospace',
                            letterSpacing: '2px',
                            textShadow: '0 0 20px #ff2200, 0 0 40px #ff000088',
                        }}>FIVE NIGHTS AT FREDDY'S</h2>
                        <p style={{
                            color: '#888',
                            fontSize: '0.75rem',
                            marginBottom: '1.2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                        }}>Fan-Made HTML5 Port · Night 1</p>

                        {/* Warning box */}
                        <div style={{
                            background: 'rgba(255, 34, 0, 0.08)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 34, 0, 0.3)',
                            marginBottom: '1rem',
                            textAlign: 'left',
                        }}>
                            <p style={{ color: '#ff4400', fontWeight: 'bold', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                                <AlertTriangle size={14} /> HOW TO SURVIVE
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                                {[
                                    ['Camera', 'Monitor cameras'],
                                    ['Left Door', 'Close left door'],
                                    ['Right Door', 'Close right door'],
                                    ['Lights', 'Check corridors'],
                                    ['Power', 'Don\'t waste it'],
                                    ['6 AM', 'Survive till dawn'],
                                ].map(([key, val]) => (
                                    <span key={key} style={{ color: '#bbb', fontSize: '0.73rem' }}>
                                        <strong style={{ color: '#ff6644' }}>{key}:</strong> {val}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Story teaser */}
                        <div style={{
                            background: 'rgba(0,0,0,0.4)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            marginBottom: '1.2rem',
                            textAlign: 'left',
                        }}>
                            <p style={{
                                color: '#777',
                                margin: 0,
                                fontSize: '0.76rem',
                                lineHeight: '1.6',
                                fontStyle: 'italic',
                            }}>
                                "Welcome to your new job at Freddy Fazbear's Pizza! Your shift is midnight to 6 AM. 
                                The animatronics... they move at night. 
                                <span style={{ color: '#ff4400' }}> Don't let them reach you.</span>"
                            </p>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                background: 'linear-gradient(45deg, #880000, #ff2200)',
                                color: '#fff',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 0 25px rgba(255,34,0,0.5)',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                letterSpacing: '2px',
                            }}
                        >
                            ▶ START NIGHT SHIFT
                        </button>

                        <p style={{ color: '#444', fontSize: '0.65rem', marginTop: '0.6rem' }}>
                            Fan-made port · Original game by Scott Cawthon
                        </p>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://html-classic.itch.zone/html/6346238/index.html"
                        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                        title="Five Nights at Freddy's HTML5 Fan Port"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        onLoad={() => { if (iframeRef.current) iframeRef.current.focus(); }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{
                            position: 'absolute', bottom: '10px', right: '10px',
                            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,34,0,0.5)',
                            color: '#ff2200', padding: '8px', borderRadius: '6px',
                            cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(5px)',
                        }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
