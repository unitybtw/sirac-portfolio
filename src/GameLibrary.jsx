import React, { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Gamepad2, Rocket, Zap, Navigation, Shield, Ghost, Crosshair, Target, Activity, Box, Trophy, User, Save, List, Gem, Compass, Eye, Play } from 'lucide-react';
import { playClick, playHover, playSuccess, playArcadeOpen } from './soundEffects';
import { gamesList, categoryLabels, getGameCategory, RANDOM_PREFIXES, RANDOM_SUFFIXES } from './gamesData';

const GameLibrary = ({ isOpen, setIsOpen, activeGameId, setActiveGameId }) => {
    const { t } = useTranslation();
    const [nickname, setNickname] = useState(localStorage.getItem('arcade_nickname') || '');
    const [tempName, setTempName] = useState('');
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [localScores, setLocalScores] = useState(() => {
        const saved = localStorage.getItem('arcade_scores');
        return saved ? JSON.parse(saved) : {};
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [scoreboardGameFilter, setScoreboardGameFilter] = useState('all');
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollRef = useRef(null);
    const gridRef = useRef(null);
    const isScrollingRef = useRef(false);
    const scrollTimerRef = useRef(null);

    // Attach scroll listener once — never re-attaches on state changes
    // Uses direct DOM classList manipulation (zero React overhead)
    useEffect(() => {
        const getScrollContainer = () => scrollRef.current;
        const getGrid = () => gridRef.current;

        const onScroll = () => {
            const grid = getGrid();
            if (!grid) return;

            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
                grid.classList.add('is-scrolling');
            }
            clearTimeout(scrollTimerRef.current);
            scrollTimerRef.current = setTimeout(() => {
                isScrollingRef.current = false;
                if (grid) grid.classList.remove('is-scrolling');
            }, 200);
        };

        // Re-attach whenever the modal opens (scrollRef re-mounts)
        const attach = () => {
            const el = getScrollContainer();
            if (el) el.addEventListener('scroll', onScroll, { passive: true });
        };

        attach();
        return () => {
            const el = getScrollContainer();
            if (el) el.removeEventListener('scroll', onScroll);
            clearTimeout(scrollTimerRef.current);
        };
    // Only re-run when view that contains the grid changes
    }, [isOpen, activeGameId, showScoreboard, nickname]);

    const generateRandomNickname = () => {
        const p = RANDOM_PREFIXES[Math.floor(Math.random() * RANDOM_PREFIXES.length)];
        const s = RANDOM_SUFFIXES[Math.floor(Math.random() * RANDOM_SUFFIXES.length)];
        const num = Math.floor(100 + Math.random() * 899);
        setTempName(`${p}${s}${num}`);
    };

    const activeGame = gamesList.find(g => g.id === activeGameId);

    const saveNickname = () => {
        const trimmed = tempName.trim();
        if (trimmed.length >= 3) {
            setNickname(trimmed);
            localStorage.setItem('arcade_nickname', trimmed);
        }
    };

    // Memoize filtered games list — avoids re-filtering 75+ items on every render
    const filteredGames = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return gamesList.filter(game => {
            const matchesSearch = !q || game.title.toLowerCase().includes(q);
            const matchesTab = activeTab === 'all' || getGameCategory(game.id) === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab]);

    const [globalScores, setGlobalScores] = useState([]);
    const FIREBASE_DB = 'https://sirac-portfolio-default-rtdb.europe-west1.firebasedatabase.app';

    // Wrap in useCallback so it can be safely added to useEffect deps
    const fetchGlobalScores = useCallback(async () => {
        try {
            // Try optimized query first (requires ".indexOn": "score" in Firebase rules)
            let res = await fetch(`${FIREBASE_DB}/scores.json?orderBy="score"&limitToLast=100`);
            let data = await res.json();
            
            // Fall back to unoptimized query if index is not defined yet on remote database
            if (data && data.error && data.error.includes("Index not defined")) {
                res = await fetch(`${FIREBASE_DB}/scores.json`);
                data = await res.json();
            }

            if (data) {
                const scoresArray = Object.values(data);
                scoresArray.sort((a, b) => b.score - a.score);
                setGlobalScores(scoresArray.slice(0, 100));
            } else {
                setGlobalScores([]);
            }
        } catch (e) {
            console.error("Score fetch failed", e);
        }
    }, [FIREBASE_DB]);

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => {
                fetchGlobalScores();
            }, 0);
            return () => clearTimeout(t);
        }
    }, [isOpen, fetchGlobalScores]);

    // Freeze everything behind the modal when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            // Fully pause Lenis RAF processing (not just stop scrolling)
            if (window.lenisRafPause) window.lenisRafPause();
            else if (window.lenis) window.lenis.stop();
            // Hide portal card completely — removes it from GPU render tree
            // This eliminates its backdrop-filter, animations, and compositing cost
            const portalCard = document.querySelector('.arcade-portal-card');
            if (portalCard) portalCard.style.display = 'none';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            // Resume Lenis RAF
            if (window.lenisRafResume) window.lenisRafResume();
            else if (window.lenis) window.lenis.start();
            // Show portal card again
            const portalCard = document.querySelector('.arcade-portal-card');
            if (portalCard) portalCard.style.display = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (window.lenisRafResume) window.lenisRafResume();
            else if (window.lenis) window.lenis.start();
        };
    }, [isOpen]);

    const handleGameOver = useCallback(async (score, gameId) => {
        const id = gameId || activeGameId;
        if (!id) return;

        // 1. Local Save
        setLocalScores(prev => {
            const currentBest = prev[id] || 0;
            if (score > currentBest) {
                const newScores = { ...prev, [id]: score };
                localStorage.setItem('arcade_scores', JSON.stringify(newScores));
                return newScores;
            }
            return prev;
        });

        // 2. Global Firebase Sync
        if (score > 0) {
            try {
                // Key format: nick_gameId to update existing scores instead of duplicating
                const scoreKey = `${nickname}_${id}`.replace(/[.#$[\]]/g, '_'); 
                const scoreData = {
                    name: nickname,
                    gameId: id,
                    score: score,
                    date: new Date().toISOString()
                };

                await fetch(`${FIREBASE_DB}/scores/${scoreKey}.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scoreData)
                });
                
                fetchGlobalScores(); // Refresh list
            } catch (e) {
                console.error("Cloud sync failed", e);
            }
        }
    }, [activeGameId, nickname]);

    return (
        <>
            <div
            onClick={() => { setIsOpen(true); playArcadeOpen(); }}
            onMouseEnter={playHover}
            className="arcade-portal-card"
        >
                {/* Scanner Beam / Scanline Effect */}
                <div className="arcade-portal-scanline" />

                {/* Rotating bg glow — CSS instead of JS */}
                <div className="arcade-portal-bg-rotate" />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div className="arcade-portal-icon">
                        <Gamepad2 size={46} color="#fff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
                    </div>
                    
                    <h3 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', textShadow: '0 0 20px rgba(0,240,255,0.1)' }}>
                        {t('arcade_btn') || 'Launch Arcade'}
                    </h3>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginTop: '0.8rem', maxWidth: '500px', lineHeight: 1.6 }}>
                        Explore 50+ fully playable web simulations, arcade games, and strategy challenges. Submit high scores to the global database.
                    </p>

                    <div className="arcade-portal-stats">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>50+</span>
                            <span style={{ color: 'var(--text-muted)' }}>Simulations</span>
                        </div>
                        <div className="arcade-portal-divider" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 8px #00ff66', animation: 'bar-pulse 2s infinite' }} />
                            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="arcade-modal-overlay"
                            data-lenis-prevent
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header */}
                        <div className="arcade-modal-header">
                            <div className="arcade-modal-header-left">
                                <div>
                                    <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '-0.02em', fontWeight: 800 }}>{t('arcade_inside_title')}</h2>
                                    {nickname && (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Connected as <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{nickname}</span>
                                            <button 
                                                onClick={() => { playClick(); setTempName(nickname); setNickname(''); }}
                                                style={{ background: 'none', border: 'none', color: 'var(--accent-violet)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 600 }}
                                            >
                                                [Edit]
                                            </button>
                                        </p>
                                    )}
                                </div>
                                {nickname && !activeGameId && (
                                    <div className="arcade-header-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => { playClick(); setShowScoreboard(!showScoreboard); }}
                                            onMouseEnter={playHover}
                                            className={`btn ${showScoreboard ? 'btn-primary' : 'btn-outline'}`}
                                            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            {showScoreboard ? <Gamepad2 size={16} /> : <Trophy size={16} />}
                                            {showScoreboard ? t('arcade_games') : t('arcade_scoreboard')}
                                        </button>
                                        {!showScoreboard && (
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search game..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="glass-input"
                                                    style={{
                                                        padding: '0.4rem 1rem 0.4rem 2rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        width: '160px',
                                                        fontFamily: 'monospace',
                                                        minHeight: '44px',
                                                        boxSizing: 'border-box',
                                                    }}
                                                    onFocus={(e) => { e.target.style.width = '210px'; }}
                                                    onBlur={(e) => { e.target.style.width = '160px'; }}
                                                />
                                                <span style={{ position: 'absolute', left: '10px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                                                    🔍
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => { playClick(); setIsOpen(false); setActiveGameId(null); setShowScoreboard(false); }}
                                onMouseEnter={playHover}
                                className="arcade-close-btn"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div ref={scrollRef} className="arcade-modal-body" data-lenis-prevent style={{ padding: isMobile ? '0.75rem' : '2rem' }}>
                            <AnimatePresence mode="wait">
                                {!nickname ? (
                                    /* Nickname Entry View */
                                    <motion.div
                                        key="nickname"
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                        style={{ maxWidth: '450px', margin: '8vh auto', textAlign: 'center' }}
                                    >
                                        <div className="glass-panel" style={{ padding: '3.5rem 2.5rem' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 10px 25px rgba(var(--accent-cyan-rgb), 0.3)' }}>
                                                <User size={40} color="#fff" />
                                            </div>
                                            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontWeight: 700, color: 'var(--text-headers)' }}>{t('arcade_set_nickname')}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Choose your identity to save your scores globally.</p>
                                            
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Enter username..."
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    className="glass-input"
                                                    style={{
                                                        flex: 1, padding: '1.2rem',
                                                        textAlign: 'center', fontSize: '1.1rem',
                                                    }}
                                                    maxLength={16}
                                                    autoFocus
                                                />
                                                <motion.button
                                                    onClick={() => { playClick(); generateRandomNickname(); }}
                                                    onMouseEnter={playHover}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Generate Random Tag"
                                                    whileHover={{ scale: 1.05, borderColor: 'var(--accent-cyan)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    🎲
                                                </motion.button>
                                            </div>

                                            <button
                                                onClick={() => { playSuccess(); saveNickname(); }}
                                                className="btn btn-primary"
                                                style={{ width: '100%', padding: '1.2rem', fontSize: '1.05rem' }}
                                                disabled={tempName.trim().length < 3}
                                            >
                                                <Save size={20} style={{ marginRight: '8px' }} /> {t('arcade_save_continue')}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : showScoreboard ? (
                                    /* Scoreboard View */
                                    <motion.div
                                        key="scoreboard"
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                                        style={{ maxWidth: '950px', margin: '0 auto' }}
                                    >
                                        <div className="glass-panel" style={{ padding: '2.5rem 3rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', letterSpacing: '-0.02em', margin: 0, color: 'var(--text-headers)' }}>
                                                    <Trophy color="gold" size={28} /> Global Hall of Fame
                                                </h3>
                                                
                                                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Game Filter:</span>
                                                    <select
                                                        value={scoreboardGameFilter}
                                                        onChange={(e) => setScoreboardGameFilter(e.target.value)}
                                                        className="glass-select"
                                                    >
                                                        <option value="all">All Simulations</option>
                                                        {gamesList.map(g => (
                                                            <option key={g.id} value={g.id}>{g.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="arcade-scoreboard-grid">
                                                {/* Global Scores from Cloud */}
                                                <div style={{ display: 'grid', gap: '0.8rem', alignContent: 'start' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Top 10 Records</h4>
                                                    {(() => {
                                                        const filtered = globalScores.filter(s => scoreboardGameFilter === 'all' || s.gameId === scoreboardGameFilter);
                                                        if (globalScores.length === 0) {
                                                            return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Syncing with cloud database...</p>;
                                                        }
                                                        if (filtered.length === 0) {
                                                            return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No scores submitted yet for this game.</p>;
                                                        }
                                                        return filtered.slice(0, 10).map((s, idx) => {
                                                            const isMe = s.name === nickname;
                                                            let rowBg = 'transparent';
                                                            let rowBorder = '1px solid var(--border-glass)';
                                                            if (isMe) {
                                                                rowBg = 'rgba(var(--accent-cyan-rgb), 0.08)';
                                                                rowBorder = '1px solid rgba(var(--accent-cyan-rgb), 0.3)';
                                                            } else if (idx === 0) {
                                                                rowBg = 'rgba(255, 215, 0, 0.04)';
                                                            }
                                                            return (
                                                                <div key={`global-${idx}`} style={{
                                                                    display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1.2rem',
                                                                    background: rowBg,
                                                                    border: rowBorder,
                                                                    borderRadius: '12px',
                                                                    alignItems: 'center',
                                                                    boxShadow: isMe ? '0 0 15px rgba(var(--accent-cyan-rgb), 0.15)' : 'none',
                                                                    transition: 'all 0.3s'
                                                                }}>
                                                                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                                                        <span style={{ 
                                                                            color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'var(--text-muted)', 
                                                                            width: '28px', 
                                                                            fontWeight: 800, 
                                                                            fontSize: idx < 3 ? '1.3rem' : '0.9rem',
                                                                            display: 'inline-block',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                                                                        </span>
                                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span style={{ color: 'var(--text-headers)', fontWeight: isMe ? 700 : 500, fontSize: '0.95rem' }}>{s.name}</span>
                                                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1px' }}>
                                                                                {gamesList.find(g => g.id === s.gameId)?.title || s.gameId}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ color: isMe ? 'var(--accent-cyan)' : 'var(--text-main)', fontWeight: 700, fontSize: '1.15rem', fontFamily: 'monospace' }}>
                                                                        {s.score.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>

                                                {/* Local High Scores */}
                                                <div style={{ display: 'grid', gap: '0.8rem', alignContent: 'start' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Your Best Performances</h4>
                                                    {Object.entries(localScores).length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No local records yet.</p>
                                                    ) : (
                                                        Object.entries(localScores)
                                                            .sort((a, b) => b[1] - a[1])
                                                            .map(([gameId, score]) => {
                                                                const gameInfo = gamesList.find(g => g.id === gameId);
                                                                return (
                                                                    <div key={`local-${gameId}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1.2rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: gameInfo?.color || 'var(--accent-cyan)' }} />
                                                                            <span style={{ color: 'var(--text-headers)', fontSize: '0.9rem', fontWeight: 500 }}>{gameInfo?.title || gameId}</span>
                                                                        </div>
                                                                        <div style={{ fontWeight: 700, color: gameInfo?.color || 'var(--accent-cyan)', fontFamily: 'monospace', fontSize: '1.05rem' }}>{score.toLocaleString()}</div>
                                                                    </div>
                                                                );
                                                            })
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : !activeGameId ? (
                                    /* Games Grid View */
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                                        {/* Category Tabs */}
                                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem', width: '100%' }}>
                                            {[
                                                { id: 'all', label: 'All Simulations', count: gamesList.length, icon: <List size={16} /> },
                                                { id: 'simulation', label: 'Retro & 3D Ports', count: gamesList.filter(g => getGameCategory(g.id) === 'simulation').length, icon: <Compass size={16} /> },
                                                { id: 'arcade', label: 'Classic Arcade', count: gamesList.filter(g => getGameCategory(g.id) === 'arcade').length, icon: <Gamepad2 size={16} /> },
                                                { id: 'puzzle', label: 'Puzzles & Strategy', count: gamesList.filter(g => getGameCategory(g.id) === 'puzzle').length, icon: <Zap size={16} /> }
                                            ].map(cat => (
                                                <button
                                                    key={cat.id}
                                                    className={`arcade-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                                                    onClick={() => { playClick(); setActiveTab(cat.id); }}
                                                    onMouseEnter={playHover}
                                                >
                                                    {cat.icon}
                                                    <span>{cat.label}</span>
                                                    <span style={{ fontSize: '0.75rem', opacity: 0.8, background: 'rgba(var(--accent-cyan-rgb), 0.15)', color: 'var(--text-headers)', padding: '2px 6px', borderRadius: '10px' }}>{cat.count}</span>
                                                </button>
                                            ))}
                                        </div>


                                        <div ref={gridRef} className="arcade-games-grid">
                                            {filteredGames.length === 0 && (
                                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👾</div>
                                                    <p style={{ fontSize: '1.2rem', margin: 0 }}>No games match your filters</p>
                                                    <button 
                                                        className="btn btn-outline" 
                                                        onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                                                        style={{ marginTop: '1.5rem', padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}
                                                    >
                                                        Reset Filters
                                                    </button>
                                                </div>
                                            )}

                                            {filteredGames.map((game) => {
                                                    const cat = getGameCategory(game.id);
                                                    return (
                                                        <div
                                                            key={game.id}
                                                            className="arcade-game-card"
                                                            onMouseEnter={playHover}
                                                            onClick={() => { playClick(); setActiveGameId(game.id); }}
                                                            style={{ '--game-color': game.color }}
                                                        >
                                                            {/* Category tag badge */}
                                                            <div className="arcade-card-badge">
                                                                {categoryLabels[cat]}
                                                            </div>

                                                            {/* Ambient glow */}
                                                            <div className="arcade-card-glow" />
                                                            
                                                            {/* Icon */}
                                                            <div className="arcade-card-icon">
                                                                {game.icon}
                                                            </div>
                                                            
                                                            {/* Title & Score */}
                                                            <div className="arcade-card-info">
                                                                <h3>{game.title}</h3>
                                                                <div className="arcade-card-status">
                                                                    <div className="arcade-card-score">
                                                                        {localScores[game.id] ? (
                                                                            <span className="arcade-score-value">BEST <span className="arcade-score-number">{localScores[game.id]}</span></span>
                                                                        ) : (
                                                                            <span className="arcade-score-empty">NOT PLAYED</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="arcade-card-launch">
                                                                        LAUNCH ⚡
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ) : (
                                    /* Active Game View */
                                    <motion.div
                                        key="game"
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <div style={{ width: '100%', maxWidth: '850px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '1rem', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '0.75rem' : '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '0.5rem' }}>
                                                <h3 style={{ color: activeGame.color, textShadow: `0 0 12px ${activeGame.color}`, fontSize: isMobile ? '1.25rem' : '1.6rem', margin: 0, fontWeight: 800 }}>{activeGame.title}</h3>
                                                {localScores[activeGameId] && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: '2px 8px', borderRadius: '6px' }}>PERSONAL BEST: {localScores[activeGameId]}</span>}
                                            </div>
                                            <button
                                                onClick={() => { playClick(); setActiveGameId(null); }}
                                                onMouseEnter={playHover}
                                                        className="btn btn-outline"
                                                style={{ padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem', fontSize: isMobile ? '0.8rem' : '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', alignSelf: isMobile ? 'flex-end' : 'auto' }}
                                            >
                                                <X size={16} /> {t('arcade_exit')}
                                            </button>
                                        </div>

                                        <div style={{ 
                                            flex: 1, 
                                            width: '100%', 
                                            maxWidth: '850px', 
                                            height: isMobile ? 'max(220px, 56.25vw)' : 'clamp(400px, 70vh, 600px)', 
                                            borderRadius: isMobile ? '16px' : '24px', 
                                            overflow: 'hidden', 
                                            border: `2px solid ${activeGame.color}`, 
                                            boxShadow: `0 0 35px ${activeGame.color}33`, 
                                            background: '#000',
                                            position: 'relative'
                                        }}>
                                            <Suspense fallback={
                                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: activeGame.color }}>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                        style={{ marginBottom: '1rem' }}
                                                    >
                                                        <Gamepad2 size={isMobile ? 30 : 40} />
                                                    </motion.div>
                                                    <p style={{ fontFamily: 'monospace', letterSpacing: '2px', fontSize: isMobile ? '0.8rem' : '1rem' }}>INITIALIZING VIRTUAL CONTAINER...</p>
                                                </div>
                                            }>
                                                {activeGame.comp && <activeGame.comp onGameOver={(score) => handleGameOver(score, activeGame.id)} />}
                                            </Suspense>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
        )}
    </>
);
};

export default GameLibrary;
