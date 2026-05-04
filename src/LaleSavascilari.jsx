import React, { useState } from 'react';
import { Download, MonitorPlay, XCircle } from 'lucide-react';

const LaleSavascilari = ({ onGameOver }) => {
    const [view, setView] = useState('menu'); // menu, watch

    return (
        <div style={{ width: '100%', height: '100%', background: '#000', color: '#0f0', fontFamily: 'monospace', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* CRT Effects */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%',
                pointerEvents: 'none',
                zIndex: 10
            }} />
            
            {view === 'menu' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', zIndex: 5, position: 'relative' }}>
                    <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', textShadow: '0 0 10px #0f0' }}>İSTANBUL EFSANELERİ: LALE SAVAŞÇILARI</h1>
                    <h2 style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '3rem' }}>SiliconWorx (1994) - DOS / Amiga</h2>
                    
                    <div style={{ maxWidth: '600px', textAlign: 'center', marginBottom: '3rem', lineHeight: '1.6' }}>
                        <p>
                            Türkiye'nin ilk ve en efsanevi yerli RPG oyunu. Orijinal dosyaların devasa boyutu (326MB) ve platform sınırlamaları nedeniyle doğrudan web tarayıcısında çalıştırılamamaktadır. Ancak orijinal arşive ulaşabilir veya oyunun tam deneyimini izleyebilirsiniz.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <button 
                            onClick={() => setView('watch')}
                            style={{ 
                                background: 'transparent', border: '2px solid #0f0', color: '#0f0', padding: '1rem 2rem', 
                                fontFamily: 'monospace', fontSize: '1.2rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 15px rgba(0,255,0,0.3)',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#0f0'; e.currentTarget.style.color = '#000'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0f0'; }}
                        >
                            <MonitorPlay size={24} /> OYUNU İZLE
                        </button>

                        <button 
                            onClick={() => window.open('https://archive.org/download/istanbulefsanelerilalesavascilari/istanbulefsanelerilalesavascilari.zip', '_blank')}
                            style={{ 
                                background: 'transparent', border: '2px solid #00f0ff', color: '#00f0ff', padding: '1rem 2rem', 
                                fontFamily: 'monospace', fontSize: '1.2rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 15px rgba(0,240,255,0.3)',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#00f0ff'; e.currentTarget.style.color = '#000'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00f0ff'; }}
                        >
                            <Download size={24} /> DOSYALARI İNDİR (.ZIP)
                        </button>
                    </div>
                </div>
            )}

            {view === 'watch' && (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span>LALE SAVAŞÇILARI OYNANIŞ (YOUTUBE STREAM)</span>
                        <button 
                            onClick={() => setView('menu')}
                            style={{ background: 'transparent', border: '1px solid #0f0', color: '#0f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <XCircle size={16} /> GERİ DÖN
                        </button>
                    </div>
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/Q4Xz6C3k4eI?autoplay=1" 
                        title="İstanbul Efsaneleri Lale Savaşçıları" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        style={{ border: '2px solid #333' }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default LaleSavascilari;
