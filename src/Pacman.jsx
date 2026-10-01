import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2 } from 'lucide-react';

export default function Pacman() {
    const [started, setStarted] = useState(true);
    const iframeRef = useRef(null);


    useEffect(() => {
        if (started && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [started]);

    return (
        <div id="pacman-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#050508' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffcc00', fontFamily: 'monospace' }}>PAC-MAN</h2>
                        <div style={{ background: 'rgba(255, 204, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 204, 0, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MousePointer2 size={16} /> CONTROLS / KONTROLLER
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: '1.6' }}>
                                <li><strong>ARROW KEYS / YÖN TUŞLARI:</strong> Move / Hareket Et</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ffcc00', color: '#000', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(255, 204, 0, 0.3)' }}
                        >
                            START GAME / BAŞLAT
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        src="https://macek.github.io/google_pacman/"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Pac-Man Classic"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals"
                        allow="autoplay; fullscreen"
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                </div>
            )}
        </div>
    );
}
