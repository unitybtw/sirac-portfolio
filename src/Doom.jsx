import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, RotateCcw, Info, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Doom() {
    const { t } = useTranslation();
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("doom-game-wrapper");
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
        <div id="doom-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>



            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ff0000', fontFamily: 'monospace' }}>DOOM</h2>

                        <div style={{ background: 'rgba(255, 0, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 0, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ff0000', fontWeight: 'bold', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MousePointer2 size={16} /> {t('game_common.controls')}
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: '1.6' }}>
                                <li>{t('game_launch.doom_note')}</li>
                                <li><strong>WASD / {t('game_common.controls').includes('K') ? 'Ok Tuşları' : 'Arrow Keys'}:</strong> {t('game_launch.doom_wasd')}</li>
                                <li><strong>ENTER:</strong> {t('game_launch.doom_fire')}</li>
                                <li><strong>SPACE:</strong> {t('game_launch.doom_open')}</li>
                                <li><strong>Sayılar (1-7):</strong> {t('game_launch.doom_weapon')}</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ff0000', color: '#fff', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(230, 0, 0, 0.3)' }}
                        >
                            {t('game_launch.doom_btn')}
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://diekmann.github.io/wasm-fizzbuzz/doom/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="DOOM WASM"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals"
                        allow="autoplay; fullscreen; keyboard-lock; pointer-lock"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                </div>
            )}
        </div>
    );
}
