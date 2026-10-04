import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
    X,
    Gamepad2,
    Trophy,
    Medal,
    Award,
    Search,
    Shuffle,
    Maximize,
    Minimize,
    User,
    Save,
    Play,
    RotateCcw,
    ChevronLeft,
    Sparkles,
    Cpu,
    LayoutGrid,
    Pencil,
    Flame,
    Compass,
    Zap,
    Crown
} from 'lucide-react';
import './arcade.css';
import { playClick, playHover, playSuccess, playArcadeOpen } from './soundEffects';
import { gamesList, categoryLabels, getGameCategory, RANDOM_PREFIXES, RANDOM_SUFFIXES } from './gamesData';

const GameLibrary = ({ isOpen, setIsOpen, activeGameId, setActiveGameId }) => {
    const { t } = useTranslation();
    const [nickname, setNickname] = useState(() => localStorage.getItem('arcade_nickname') || '');
    const [tempName, setTempName] = useState('');
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [localScores, setLocalScores] = useState(() => {
        try {
            const saved = localStorage.getItem('arcade_scores');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [scoreboardGameFilter, setScoreboardGameFilter] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [gameReloadKey, setGameReloadKey] = useState(0);

    // Responsive genişlik kontrolü
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollRef = useRef(null);
    const gridRef = useRef(null);
    const frameRef = useRef(null);
    const [frameWidth, setFrameWidth] = useState(0);

    // Tam ekran durumu dinleyicisi
    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        document.addEventListener('webkitfullscreenchange', handleFsChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFsChange);
            document.removeEventListener('webkitfullscreenchange', handleFsChange);
        };
    }, []);

    // Evrensel Tam Ekran geçiş fonksiyonu
    const toggleFullScreen = useCallback(() => {
        const el = frameRef.current;
        if (!el) return;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (req) {
                req.call(el).catch((err) => {
                    console.error("Fullscreen request failed:", err);
                });
            }
        } else {
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            if (exit) {
                exit.call(document).catch((err) => {
                    console.error("Exit fullscreen failed:", err);
                });
            }
        }
    }, []);

    // Aktif oyundan çıkış
    const handleExitActiveGame = useCallback(() => {
        playClick();
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            if (exit) exit.call(document).catch(() => {});
        }
        setActiveGameId(null);
    }, [setActiveGameId]);

    // ESC tuşu ile oyundan kütüphaneye veya modal dışına çıkış
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    return; // Tam ekran çıkışını tarayıcı yönetsin
                }
                if (activeGameId) {
                    handleExitActiveGame();
                } else if (showScoreboard) {
                    setShowScoreboard(false);
                } else {
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeGameId, showScoreboard, handleExitActiveGame, setIsOpen]);

    // Aktif oyunu yeniden başlat
    const handleRestartGame = useCallback(() => {
        playClick();
        setGameReloadKey((prev) => prev + 1);
    }, []);

    // Rastgele oyun seçip başlat
    const handleQuickShuffle = useCallback(() => {
        playSuccess();
        const candidatePool = activeTab === 'all' 
            ? gamesList 
            : gamesList.filter(g => getGameCategory(g.id) === activeTab);
        
        const listToUse = candidatePool.length > 0 ? candidatePool : gamesList;
        const randomPick = listToUse[Math.floor(Math.random() * listToUse.length)];
        
        setShowScoreboard(false);
        setActiveGameId(randomPick.id);
        setGameReloadKey(prev => prev + 1);
    }, [activeTab, setActiveGameId]);

    // Çerçeve genişliği ResizeObserver (mobil ölçekleme için)
    useEffect(() => {
        if (!isOpen || !activeGameId) return;
        const el = frameRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) setFrameWidth(entry.contentRect.width);
        });
        ro.observe(el);
        setFrameWidth(el.getBoundingClientRect().width);
        return () => ro.disconnect();
    }, [isOpen, activeGameId]);

    // Hızlı rastgele nick üretimi
    const generateRandomNickname = () => {
        const p = RANDOM_PREFIXES[Math.floor(Math.random() * RANDOM_PREFIXES.length)];
        const s = RANDOM_SUFFIXES[Math.floor(Math.random() * RANDOM_SUFFIXES.length)];
        const num = Math.floor(100 + Math.random() * 899);
        setTempName(`${p}${s}${num}`);
    };

    const activeGame = useMemo(() => {
        return gamesList.find((g) => g.id === activeGameId);
    }, [activeGameId]);

    const saveNickname = () => {
        const trimmed = tempName.trim();
        if (trimmed.length >= 3) {
            setNickname(trimmed);
            localStorage.setItem('arcade_nickname', trimmed);
        }
    };

    // Filtrelenmiş oyunlar listesi (memoize)
    const filteredGames = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return gamesList.filter((game) => {
            const matchesSearch = !q || game.title.toLowerCase().includes(q);
            const matchesTab = activeTab === 'all' || getGameCategory(game.id) === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab]);

    // Global Firebase Skorları
    const [globalScores, setGlobalScores] = useState([]);
    const FIREBASE_DB = 'https://sirac-portfolio-default-rtdb.europe-west1.firebasedatabase.app';

    const fetchGlobalScores = useCallback(async () => {
        try {
            let res = await fetch(`${FIREBASE_DB}/scores.json?orderBy="score"&limitToLast=100`);
            let data = await res.json();

            if (data && data.error && data.error.includes("Index not defined")) {
                res = await fetch(`${FIREBASE_DB}/scores.json`);
                data = await res.json();
            }

            if (data && typeof data === 'object') {
                const scoresArray = Object.values(data);
                scoresArray.sort((a, b) => b.score - a.score);
                setGlobalScores(scoresArray.slice(0, 100));
            } else {
                setGlobalScores([]);
            }
        } catch (e) {
            console.error("Score fetch error:", e);
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

    // Modal açıkken arka plan kaydırmasını dondur
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            if (typeof window.lenisRafPause === 'function') window.lenisRafPause();
            else if (window.lenis && typeof window.lenis.stop === 'function') window.lenis.stop();
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (typeof window.lenisRafResume === 'function') window.lenisRafResume();
            else if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (typeof window.lenisRafResume === 'function') window.lenisRafResume();
            else if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
        };
    }, [isOpen]);

    // Skor kaydetme fonksiyonu
    const handleGameOver = useCallback(async (score, gameId) => {
        const id = gameId || activeGameId;
        if (!id) return;

        // 1. Yerel Kayıt
        setLocalScores((prev) => {
            const currentBest = prev[id] || 0;
            if (score > currentBest) {
                const newScores = { ...prev, [id]: score };
                localStorage.setItem('arcade_scores', JSON.stringify(newScores));
                return newScores;
            }
            return prev;
        });

        // 2. Firebase Bulut Kaydı
        if (score > 0 && nickname) {
            try {
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

                fetchGlobalScores();
            } catch (e) {
                console.error("Cloud score sync error:", e);
            }
        }
    }, [activeGameId, nickname, FIREBASE_DB, fetchGlobalScores]);

    // Öne çıkan oyunlar (Portal kartında rozet olarak gösterilir)
    const featuredHighlights = [
        { id: 'minecraft_classic', title: 'Minecraft 1.5.2', color: '#55aa55' },
        { id: 'cs16', title: 'CS:GO Web', color: '#ffd700' },
        { id: 'gtavicecity', title: 'GTA Vice City', color: '#ff66b2' },
        { id: 'quake3', title: 'Quake III', color: '#ffcc00' },
        { id: 'mario64', title: 'Mario 64', color: '#ffaa00' },
        { id: 'subway', title: 'Subway Surfers', color: '#00ffcc' },
        { id: 'doom', title: 'DOOM', color: '#ff0033' },
    ];

    return (
        <>
            {/* ── 1. PORTAL KARTI (Ana sayfada yer alan zarif kart) ── */}
            <div
                onClick={() => { setIsOpen(true); playArcadeOpen(); }}
                onMouseEnter={playHover}
                className="arcade-portal-card"
            >
                <div className="arcade-portal-glow" />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {/* Canlı Durum Hapı */}
                    <div className="arcade-portal-live-badge">
                        <span className="arcade-status-dot" />
                        <span>{t('arcade_portal_badge')}</span>
                    </div>

                    {/* İkon */}
                    <div className="arcade-portal-icon-wrapper">
                        <Gamepad2 size={38} color="#ffffff" />
                    </div>

                    {/* Başlık ve Açıklama */}
                    <h3 className="arcade-portal-title">
                        {t('arcade_title')}
                    </h3>

                    <p className="arcade-portal-subtitle">
                        {t('arcade_portal_desc')}
                    </p>

                    {/* Öne Çıkan Oyun Çipleri */}
                    <div className="arcade-portal-chips">
                        {featuredHighlights.map((feat, i) => (
                            <span
                                key={i}
                                className="arcade-portal-chip"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(true);
                                    playArcadeOpen();
                                    if (feat.id) {
                                        setActiveGameId(feat.id);
                                        setGameReloadKey((prev) => prev + 1);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                                title={`${feat.title} - ${t('arcade_play')}`}
                            >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: feat.color }} />
                                {feat.title}
                            </span>
                        ))}
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="arcade-portal-actions">
                        <button
                            type="button"
                            className="arcade-cta-btn"
                            onClick={(e) => { e.stopPropagation(); setIsOpen(true); playArcadeOpen(); }}
                        >
                            <Play size={16} fill="currentColor" /> {t('arcade_portal_explore')}
                        </button>

                        <button
                            type="button"
                            className="arcade-cta-btn secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(true);
                                playArcadeOpen();
                                handleQuickShuffle();
                            }}
                        >
                            <Shuffle size={15} /> {t('arcade_portal_shuffle')}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── 2. TAM EKRAN MODAL PENCERESİ ── */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="arcade-modal-overlay"
                            data-lenis-prevent
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Üst Navigasyon Çubuğu */}
                            <header className="arcade-modal-header">
                                <div className="arcade-modal-header-inner">
                                    {/* Sol: Logo + Oyuncu Adı */}
                                    <div className="arcade-header-brand">
                                        <div className="arcade-brand-badge">
                                            <Gamepad2 size={20} />
                                        </div>
                                        <div className="arcade-brand-info">
                                            <h2>{t('arcade_inside_title')}</h2>
                                            {nickname && (
                                                <div className="arcade-player-tag">
                                                    <span>{t('arcade_connected_as')}</span>
                                                    <span className="arcade-player-name">{nickname}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { playClick(); setTempName(nickname); setNickname(''); }}
                                                        className="arcade-edit-name-btn"
                                                        title={t('arcade_edit_name')}
                                                    >
                                                        <Pencil size={11} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Orta: Arama + Skor Tablosu + Rastgele */}
                                    {nickname && !activeGameId && (
                                        <div className="arcade-header-actions">
                                            {/* Arama Alanı */}
                                            {!showScoreboard && (
                                                <div className="arcade-search-box">
                                                    <span className="arcade-search-icon">
                                                        <Search size={14} />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder={t('arcade_search_placeholder')}
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="arcade-search-input"
                                                    />
                                                    {searchQuery && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSearchQuery('')}
                                                            className="arcade-search-clear"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Rastgele Oyun */}
                                            {!showScoreboard && (
                                                <button
                                                    type="button"
                                                    onClick={handleQuickShuffle}
                                                    onMouseEnter={playHover}
                                                    className="arcade-action-btn"
                                                    title={t('arcade_random_pick')}
                                                >
                                                    <Shuffle size={14} />
                                                    <span>{t('arcade_random_pick')}</span>
                                                </button>
                                            )}

                                            {/* Skor Tablosu Geçişi */}
                                            <button
                                                type="button"
                                                onClick={() => { playClick(); setShowScoreboard(!showScoreboard); }}
                                                onMouseEnter={playHover}
                                                className={`arcade-action-btn ${showScoreboard ? 'active' : ''}`}
                                            >
                                                {showScoreboard ? <Gamepad2 size={14} /> : <Trophy size={14} />}
                                                <span>{showScoreboard ? t('arcade_games') : t('arcade_scoreboard')}</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Sağ: Kapatma Butonu */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            playClick();
                                            setIsOpen(false);
                                            setActiveGameId(null);
                                            setShowScoreboard(false);
                                        }}
                                        onMouseEnter={playHover}
                                        className="arcade-close-btn"
                                        aria-label={t('arcade_exit')}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </header>

                            {/* Ana Gövde */}
                            <main ref={scrollRef} className="arcade-modal-body" data-lenis-prevent>
                                <div className="arcade-modal-body-inner">
                                    <AnimatePresence mode="wait">
                                        {/* ── A: KİMLİK / NICKNAME BELİRLEME EKRANI ── */}
                                        {!nickname ? (
                                            <motion.div
                                                key="nickname-view"
                                                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                                                transition={{ duration: 0.25 }}
                                                className="arcade-identity-modal"
                                            >
                                                <div className="arcade-avatar-preview">
                                                    {tempName.trim() ? tempName.trim().charAt(0).toUpperCase() : <User size={34} />}
                                                </div>

                                                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: 'var(--arcade-font-heading)', color: 'var(--arcade-text-primary)' }}>
                                                    {t('arcade_set_nickname')}
                                                </h3>
                                                <p style={{ color: 'var(--arcade-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                                                    {t('arcade_nickname_sub')}
                                                </p>

                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder={t('arcade_enter_name')}
                                                        value={tempName}
                                                        onChange={(e) => setTempName(e.target.value)}
                                                        className="arcade-search-input"
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.9rem 1.25rem',
                                                            borderRadius: '14px',
                                                            fontSize: '1.05rem',
                                                            textAlign: 'center',
                                                            fontWeight: 600,
                                                            width: 'auto'
                                                        }}
                                                        maxLength={16}
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => { playClick(); generateRandomNickname(); }}
                                                        onMouseEnter={playHover}
                                                        className="arcade-action-btn"
                                                        style={{ padding: '0.9rem 1.15rem', borderRadius: '14px' }}
                                                        title={t('arcade_gen_random')}
                                                    >
                                                        <Shuffle size={16} />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => { playSuccess(); saveNickname(); }}
                                                    className="arcade-cta-btn"
                                                    style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
                                                    disabled={tempName.trim().length < 3}
                                                >
                                                    <Save size={18} /> {t('arcade_save_continue')}
                                                </button>
                                            </motion.div>
                                        ) : showScoreboard ? (
                                            /* ── B: SKOR TABLOSU / HALL OF FAME ── */
                                            <motion.div
                                                key="scoreboard-view"
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -16 }}
                                                transition={{ duration: 0.2 }}
                                                className="arcade-scoreboard-container"
                                            >
                                                <div className="arcade-scoreboard-panel">
                                                    <div className="arcade-scoreboard-header">
                                                        <h3 className="arcade-scoreboard-title">
                                                            <Trophy size={26} color="#f59e0b" />
                                                            <span>{t('arcade_global_hall')}</span>
                                                        </h3>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <select
                                                                value={scoreboardGameFilter}
                                                                onChange={(e) => setScoreboardGameFilter(e.target.value)}
                                                                className="arcade-filter-select"
                                                            >
                                                                <option value="all">{t('arcade_cat_all')} (75)</option>
                                                                {gamesList.map((g) => (
                                                                    <option key={g.id} value={g.id}>{g.title}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="arcade-leaderboard-layout">
                                                        {/* Sol: Küresel Sıralama */}
                                                        <div>
                                                            <h4 style={{ color: 'var(--arcade-text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', fontWeight: 700 }}>
                                                                {t('arcade_top_records')}
                                                            </h4>

                                                            {(() => {
                                                                const filtered = globalScores.filter((s) => scoreboardGameFilter === 'all' || s.gameId === scoreboardGameFilter);

                                                                if (globalScores.length === 0) {
                                                                    return <p style={{ color: 'var(--arcade-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Skorlar yükleniyor...</p>;
                                                                }

                                                                if (filtered.length === 0) {
                                                                    return <p style={{ color: 'var(--arcade-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Bu oyun için henüz kayıtlı skor yok.</p>;
                                                                }

                                                                return (
                                                                    <>
                                                                        {/* Top 3 Podyumu */}
                                                                        <div className="arcade-podium-grid">
                                                                            {filtered.slice(0, 3).map((pod, idx) => (
                                                                                <div key={`pod-${idx}`} className={`arcade-podium-card ${idx === 0 ? 'first' : ''}`}>
                                                                                    <div className="arcade-podium-rank" style={{ color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#d97706' }}>
                                                                                        {idx === 0 ? <Crown size={20} /> : idx === 1 ? <Medal size={20} /> : <Award size={20} />}
                                                                                    </div>
                                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--arcade-text-primary)' }}>{pod.name}</span>
                                                                                    <span style={{ fontSize: '0.7rem', color: 'var(--arcade-text-muted)', marginTop: '2px' }}>
                                                                                        {gamesList.find(g => g.id === pod.gameId)?.title || pod.gameId}
                                                                                    </span>
                                                                                    <span style={{ fontSize: '1rem', fontWeight: 800, color: idx === 0 ? '#f59e0b' : 'var(--arcade-accent)', fontFamily: 'var(--arcade-font-mono)', marginTop: '6px' }}>
                                                                                        {Number(pod.score).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        {/* 4-10 Sıralama Listesi */}
                                                                        {filtered.slice(3, 10).map((row, i) => {
                                                                            const isMe = row.name === nickname;
                                                                            return (
                                                                                <div key={`row-${i}`} className={`arcade-score-row ${isMe ? 'is-me' : ''}`}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                        <span style={{ width: '24px', fontWeight: 800, fontSize: '0.82rem', color: 'var(--arcade-text-muted)' }}>
                                                                                            #{i + 4}
                                                                                        </span>
                                                                                        <div>
                                                                                            <span style={{ fontWeight: isMe ? 800 : 600, fontSize: '0.9rem', color: 'var(--arcade-text-primary)' }}>{row.name}</span>
                                                                                            <div style={{ fontSize: '0.72rem', color: 'var(--arcade-text-muted)' }}>
                                                                                                {gamesList.find(g => g.id === row.gameId)?.title || row.gameId}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span style={{ fontWeight: 800, fontFamily: 'var(--arcade-font-mono)', fontSize: '0.95rem', color: isMe ? 'var(--arcade-accent)' : 'var(--arcade-text-primary)' }}>
                                                                                        {Number(row.score).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>

                                                        {/* Sağ: Yerel Kişisel Rekorlar */}
                                                        <div>
                                                            <h4 style={{ color: 'var(--arcade-text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', fontWeight: 700 }}>
                                                                {t('arcade_my_records')}
                                                            </h4>

                                                            {Object.entries(localScores).length === 0 ? (
                                                                <p style={{ color: 'var(--arcade-text-muted)', fontSize: '0.85rem' }}>Henüz kaydedilmiş yerel rekorun yok.</p>
                                                            ) : (
                                                                Object.entries(localScores)
                                                                    .sort((a, b) => b[1] - a[1])
                                                                    .map(([gid, sc]) => {
                                                                        const gInfo = gamesList.find((g) => g.id === gid);
                                                                        return (
                                                                            <div key={`local-${gid}`} className="arcade-score-row">
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: gInfo?.color || 'var(--arcade-accent)' }} />
                                                                                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--arcade-text-primary)' }}>{gInfo?.title || gid}</span>
                                                                                </div>
                                                                                <span style={{ fontWeight: 800, fontFamily: 'var(--arcade-font-mono)', color: gInfo?.color || 'var(--arcade-accent)', fontSize: '0.92rem' }}>
                                                                                    {Number(sc).toLocaleString()}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : !activeGameId ? (
                                            /* ── C: OYUN LİSTESİ VE KATEGORİ IZGARASI ── */
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                                {/* Kategori Sekme Çubuğu */}
                                                <div className="arcade-tab-bar">
                                                    {[
                                                        { id: 'all', label: t('arcade_cat_all'), count: gamesList.length, icon: <LayoutGrid size={15} /> },
                                                        { id: 'simulation', label: t('arcade_cat_simulation'), count: gamesList.filter(g => getGameCategory(g.id) === 'simulation').length, icon: <Sparkles size={15} /> },
                                                        { id: 'arcade', label: t('arcade_cat_arcade'), count: gamesList.filter(g => getGameCategory(g.id) === 'arcade').length, icon: <Gamepad2 size={15} /> },
                                                        { id: 'puzzle', label: t('arcade_cat_puzzle'), count: gamesList.filter(g => getGameCategory(g.id) === 'puzzle').length, icon: <Cpu size={15} /> }
                                                    ].map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            className={`arcade-tab-item ${activeTab === cat.id ? 'active' : ''}`}
                                                            onClick={() => { playClick(); setActiveTab(cat.id); }}
                                                            onMouseEnter={playHover}
                                                        >
                                                            {cat.icon}
                                                            <span>{cat.label}</span>
                                                            <span className="arcade-tab-counter">{cat.count}</span>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Oyun Kartları Izgarası */}
                                                <div ref={gridRef} className="arcade-games-grid">
                                                    {filteredGames.length === 0 && (
                                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--arcade-text-muted)' }}>
                                                            <Gamepad2 size={44} style={{ opacity: 0.4, marginBottom: '1rem' }} />
                                                            <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>{t('arcade_no_games')}</p>
                                                            <button
                                                                type="button"
                                                                className="arcade-action-btn"
                                                                onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                                                                style={{ marginTop: '1.25rem' }}
                                                            >
                                                                {t('arcade_reset_filters')}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {filteredGames.map((game) => {
                                                        const cat = getGameCategory(game.id);
                                                        const userScore = localScores[game.id];

                                                        return (
                                                            <div
                                                                key={game.id}
                                                                className="arcade-game-card"
                                                                onMouseEnter={playHover}
                                                                onClick={() => {
                                                                    playClick();
                                                                    setActiveGameId(game.id);
                                                                    setGameReloadKey((prev) => prev + 1);
                                                                }}
                                                                style={{ '--game-color': game.color }}
                                                            >
                                                                {/* Ambient Renk Işıltısı */}
                                                                <div className="arcade-card-ambient" />

                                                                {/* Kart Üst Bilgisi */}
                                                                <div className="arcade-card-top">
                                                                    <span className="arcade-card-badge">
                                                                        {cat === 'simulation' ? <Compass size={11} /> : cat === 'puzzle' ? <Cpu size={11} /> : <Zap size={11} />}
                                                                        {categoryLabels[cat]}
                                                                    </span>

                                                                    <div className={`arcade-card-status-pill ${userScore ? 'has-record' : ''}`}>
                                                                        {userScore ? (
                                                                            <>
                                                                                <Trophy size={11} color="#f59e0b" />
                                                                                <span>{Number(userScore).toLocaleString()}</span>
                                                                            </>
                                                                        ) : (
                                                                            <span>{t('arcade_ready')}</span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Kart İkon & Başlık */}
                                                                <div className="arcade-card-content">
                                                                    <div className="arcade-card-icon">
                                                                        {game.icon}
                                                                    </div>
                                                                    <h3 className="arcade-card-title">{game.title}</h3>
                                                                </div>

                                                                {/* Kart Alt Çubuğu */}
                                                                <div className="arcade-card-bottom">
                                                                    <span className="arcade-card-score-info">
                                                                        {userScore ? (
                                                                            <span className="arcade-card-score-num">#{t('arcade_personal_best')}: {userScore}</span>
                                                                        ) : (
                                                                            <span>Web Port</span>
                                                                        )}
                                                                    </span>

                                                                    <span className="arcade-card-play-tag">
                                                                        {t('arcade_play')} <Play size={11} fill="currentColor" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : activeGame ? (
                                            /* ── D: AKTİF OYUN OYNAMA EKRANI (Player View) ── */
                                            <motion.div
                                                key={`active-${activeGame.id}`}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                className="arcade-player-container"
                                            >
                                                {/* Üst Oyun Kontrol Dock'u */}
                                                <div className="arcade-player-dock">
                                                    <div className="arcade-player-left">
                                                        <button
                                                            type="button"
                                                            onClick={handleExitActiveGame}
                                                            onMouseEnter={playHover}
                                                            className="arcade-action-btn"
                                                        >
                                                            <ChevronLeft size={16} />
                                                            <span>{t('arcade_back_to_library')}</span>
                                                        </button>
                                                    </div>

                                                    <div className="arcade-player-center">
                                                        <h3 className="arcade-player-title">{activeGame.title}</h3>
                                                        {localScores[activeGameId] && (
                                                            <span className="arcade-player-record-pill">
                                                                <Trophy size={13} color="#f59e0b" />
                                                                <span>{t('arcade_personal_best')}: {localScores[activeGameId]}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="arcade-player-controls">
                                                        <button
                                                            type="button"
                                                            onClick={handleRestartGame}
                                                            onMouseEnter={playHover}
                                                            className="arcade-action-btn"
                                                            title={t('arcade_restart')}
                                                        >
                                                            <RotateCcw size={14} />
                                                            {!isMobile && <span>{t('arcade_restart')}</span>}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => { playClick(); toggleFullScreen(); }}
                                                            onMouseEnter={playHover}
                                                            className="arcade-action-btn"
                                                            title={isFullscreen ? t('arcade_minimize') : t('arcade_fullscreen')}
                                                        >
                                                            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                                                            {!isMobile && <span>{isFullscreen ? t('arcade_minimize') : t('arcade_fullscreen')}</span>}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Oyun Çerçevesi (Canvas / Iframe Sahnesi) */}
                                                <div className={`arcade-game-frame ${isFullscreen ? 'is-fullscreen' : ''}`} ref={frameRef}>
                                                    {/* Sadece tam ekrandayken görünen minimal sağ üst yüzen kontrol */}
                                                    {isFullscreen && (
                                                        <div className="arcade-frame-overlay-controls">
                                                            <button
                                                                type="button"
                                                                onClick={() => { playClick(); toggleFullScreen(); }}
                                                                className="arcade-floating-btn"
                                                                title={t('arcade_minimize')}
                                                                aria-label={t('arcade_minimize')}
                                                            >
                                                                <Minimize size={18} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleExitActiveGame}
                                                                className="arcade-floating-btn"
                                                                title={t('arcade_exit')}
                                                                aria-label={t('arcade_exit')}
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Mobil/Masaüstü Ölçekleme Kapsayıcısı */}
                                                    <div
                                                        className="arcade-scaled-viewport"
                                                        style={isMobile ? {
                                                            width: '900px',
                                                            height: '675px',
                                                            transform: `scale(${(frameWidth || 360) / 900})`,
                                                            transformOrigin: 'top left',
                                                        } : undefined}
                                                    >
                                                        <Suspense fallback={
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: activeGame.color }}>
                                                                <motion.div
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                                    style={{ marginBottom: '1rem' }}
                                                                >
                                                                    <Gamepad2 size={isMobile ? 32 : 44} />
                                                                </motion.div>
                                                                <p style={{ fontFamily: 'var(--arcade-font-mono)', letterSpacing: '2px', fontSize: isMobile ? '0.8rem' : '0.95rem' }}>
                                                                    INITIALIZING RUNTIME CONTAINER...
                                                                </p>
                                                            </div>
                                                        }>
                                                            {activeGame.comp && (
                                                                <activeGame.comp
                                                                    key={`${activeGame.id}-${gameReloadKey}`}
                                                                    onGameOver={(score) => handleGameOver(score, activeGame.id)}
                                                                />
                                                            )}
                                                        </Suspense>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--arcade-text-muted)' }}>
                                                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{t('arcade_no_games')}</p>
                                                <button
                                                    type="button"
                                                    className="arcade-action-btn"
                                                    onClick={handleExitActiveGame}
                                                    style={{ marginTop: '1rem' }}
                                                >
                                                    <ChevronLeft size={16} /> {t('arcade_back_to_library')}
                                                </button>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </main>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default GameLibrary;
