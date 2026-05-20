import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Gamepad2, Rocket, Zap, Navigation, Shield, Ghost, Crosshair, Target, Activity, Box, Trophy, User, Save, List, Gem, Compass, Eye } from 'lucide-react';
import { playClick, playHover, playSuccess, playArcadeOpen } from './soundEffects';

const AsteroidBlaster = lazy(() => import('./AsteroidBlaster'));
const NeonRunner = lazy(() => import('./NeonRunner'));
const CyberPong = lazy(() => import('./CyberPong'));
const BrickBreaker = lazy(() => import('./BrickBreaker'));
const FlappyNeon = lazy(() => import('./FlappyNeon'));
const NeonSnakeGame = lazy(() => import('./NeonSnakeGame'));
const SpaceDefenders = lazy(() => import('./SpaceDefenders'));
const NeonDodger = lazy(() => import('./NeonDodger'));
const NeonRacer = lazy(() => import('./NeonRacer'));
const BeraatQuest = lazy(() => import('./BeraatQuest'));
const AimTrainer = lazy(() => import('./AimTrainer'));
const NeonHelicopter = lazy(() => import('./NeonHelicopter'));
const GravityFlip = lazy(() => import('./GravityFlip'));
const WhackAMole = lazy(() => import('./WhackAMole'));
const NeonDarts = lazy(() => import('./NeonDarts'));
const ColorMatcher = lazy(() => import('./ColorMatcher'));
const SimonSays = lazy(() => import('./SimonSays'));
const NeonStacker = lazy(() => import('./NeonStacker'));
const TypingDefender = lazy(() => import('./TypingDefender'));
const NeonJumper = lazy(() => import('./NeonJumper'));
const SpaceLander = lazy(() => import('./SpaceLander'));
const MathDefender = lazy(() => import('./MathDefender'));
const NeonFrogger = lazy(() => import('./NeonFrogger'));
const NeonTetris = lazy(() => import('./NeonTetris'));
const NeonSurvive = lazy(() => import('./NeonSurvive'));
const NeonMinesweeper = lazy(() => import('./NeonMinesweeper'));
const NeonPlinko = lazy(() => import('./NeonPlinko'));
const NeonBounce = lazy(() => import('./NeonBounce'));
const NeonDraw = lazy(() => import('./NeonDraw'));
const NeonClicker = lazy(() => import('./NeonClicker'));
const CyberAirHockey = lazy(() => import('./CyberAirHockey'));
const Neon2048 = lazy(() => import('./Neon2048'));
const CyberGolf = lazy(() => import('./CyberGolf'));
const NeonRhythm = lazy(() => import('./NeonRhythm'));
const CyberFishing = lazy(() => import('./CyberFishing'));
const NeonSokoban = lazy(() => import('./NeonSokoban'));
const NeonMemory = lazy(() => import('./NeonMemory'));
const NeonTicTacToe = lazy(() => import('./NeonTicTacToe'));
const NeonBowling = lazy(() => import('./NeonBowling'));
const CyberPiano = lazy(() => import('./CyberPiano'));
const CyberInvaders = lazy(() => import('./CyberInvaders'));
const NeonClimb = lazy(() => import('./NeonClimb'));
const CyberPaint = lazy(() => import('./CyberPaint'));
const NeonTurret = lazy(() => import('./NeonTurret'));
const CyberSort = lazy(() => import('./CyberSort'));
const NeonBalance = lazy(() => import('./NeonBalance'));
const CyberGlide = lazy(() => import('./CyberGlide'));
const NeonPac = lazy(() => import('./NeonPac'));
const CyberMatch = lazy(() => import('./CyberMatch'));
const NeonSlicer = lazy(() => import('./NeonSlicer'));
const VoxelWorld = lazy(() => import('./VoxelWorld'));
const Doom = lazy(() => import('./Doom'));
const Slope = lazy(() => import('./Slope'));
const Quake3 = lazy(() => import('./Quake3'));
const Diablo = lazy(() => import('./Diablo'));
const DriftHunters = lazy(() => import('./DriftHunters'));
const Mario64 = lazy(() => import('./Mario64'));
const HalfLife = lazy(() => import('./HalfLife'));
const GeometryDash = lazy(() => import('./GeometryDash'));
const SubwaySurfers = lazy(() => import('./SubwaySurfers'));
const HollowKnight = lazy(() => import('./HollowKnight'));
const Ultrakill = lazy(() => import('./Ultrakill'));
const GTAViceCity = lazy(() => import('./GTAViceCity'));
const LaleSavascilari = lazy(() => import('./LaleSavascilari'));
const CS16 = lazy(() => import('./CS16'));
const FNAF1 = lazy(() => import('./FNAF1'));



const gamesList = [
    { id: 'fnaf1', title: "Five Nights at Freddy's", icon: <Eye size={24} />, color: '#ff2200', comp: FNAF1 },
    { id: 'cs16', title: 'Kirka.io (CSGO Web)', icon: <Target size={24} />, color: '#ffd700', comp: CS16 },
    { id: 'lale_savascilari', title: 'İst.Efsaneleri: Lale Savaşçıları', icon: <Compass size={24} />, color: '#00ff00', comp: LaleSavascilari },
    { id: 'gtavicecity', title: 'GTA Vice City', icon: <Gem size={24} />, color: '#ff66b2', comp: GTAViceCity },
    { id: 'ultrakill', title: 'ULTRAKILL', icon: <Crosshair size={24} />, color: '#ff3300', comp: Ultrakill },
    { id: 'hollowknight', title: 'Hollow Knight', icon: <Ghost size={24} />, color: '#aab8c2', comp: HollowKnight },
    { id: 'mario64', title: 'Super Mario 64', icon: <Trophy size={24} />, color: '#ffcc00', comp: Mario64 },
    { id: 'hl1', title: 'Half-Life', icon: <Target size={24} />, color: '#ff9900', comp: HalfLife },
    { id: 'geodash', title: 'Geometry Dash', icon: <Zap size={24} />, color: '#ffcc00', comp: GeometryDash },
    { id: 'subway', title: 'Subway Surfers', icon: <Activity size={24} />, color: '#ffec00', comp: SubwaySurfers },
    { id: 'slope', title: 'Slope', icon: <Activity size={24} />, color: '#00ff00', comp: Slope },
    { id: 'quake3', title: 'Quake III', icon: <Target size={24} />, color: '#ffcc00', comp: Quake3 },
    { id: 'diablo', title: 'Diablo I', icon: <Ghost size={24} />, color: '#8b0000', comp: Diablo },
    { id: 'drift', title: 'Drift Hunters', icon: <Navigation size={24} />, color: '#ff4400', comp: DriftHunters },
    { id: 'doom', title: 'DOOM (Classic)', icon: <Activity size={24} />, color: '#ff0000', comp: Doom },
    { id: 'asteroid', title: 'Asteroid Blaster', icon: <Rocket size={24} />, color: '#00f0ff', comp: AsteroidBlaster },
    { id: 'runner', title: 'Cyber Jumper', icon: <Zap size={24} />, color: '#bd00ff', comp: NeonRunner },
    { id: 'pong', title: 'Cyber Pong', icon: <Activity size={24} />, color: '#00f0ff', comp: CyberPong },
    { id: 'breaker', title: 'Neon Breakout', icon: <Box size={24} />, color: '#ff003c', comp: BrickBreaker },
    { id: 'flappy', title: 'Flappy Neon', icon: <Navigation size={24} />, color: '#8a2be2', comp: FlappyNeon },
    { id: 'snake', title: 'Neon Snake', icon: <Ghost size={24} />, color: '#00ff00', comp: NeonSnakeGame },
    { id: 'defenders', title: 'Space Defenders', icon: <Shield size={24} />, color: '#f0f', comp: SpaceDefenders },
    { id: 'dodger', title: 'Neon Dodger', icon: <Target size={24} />, color: '#00f0ff', comp: NeonDodger },
    { id: 'racer', title: 'Speed Racer', icon: <Gamepad2 size={24} />, color: '#ffaa00', comp: NeonRacer },
    { id: 'beraat', title: "Beraat's Quest", icon: <Crosshair size={24} />, color: '#ff00ff', comp: BeraatQuest },
    { id: 'aim', title: 'Aim Trainer', icon: <Crosshair size={24} />, color: '#00f0ff', comp: AimTrainer },
    { id: 'heli', title: 'Neon Copter', icon: <Navigation size={24} />, color: '#ff00ff', comp: NeonHelicopter },
    { id: 'grav', title: 'Gravity Flip', icon: <Zap size={24} />, color: '#00ff00', comp: GravityFlip },
    { id: 'mole', title: 'Cyber Whack', icon: <Target size={24} />, color: '#ffaa00', comp: WhackAMole },
    { id: 'darts', title: 'Neon Darts', icon: <Crosshair size={24} />, color: '#ff003c', comp: NeonDarts },
    { id: 'color', title: 'Color Match', icon: <Activity size={24} />, color: '#8a2be2', comp: ColorMatcher },
    { id: 'simon', title: 'Simon Says', icon: <Gamepad2 size={24} />, color: '#00f0ff', comp: SimonSays },
    { id: 'stacker', title: 'Neon Stacker', icon: <Box size={24} />, color: '#f0f', comp: NeonStacker },
    { id: 'typing', title: 'Type Defender', icon: <Target size={24} />, color: '#00ff00', comp: TypingDefender },
    { id: 'jumper', title: 'Neon Jumper', icon: <Zap size={24} />, color: '#ffaa00', comp: NeonJumper },
    { id: 'lander', title: 'Space Lander', icon: <Rocket size={24} />, color: '#00ff00', comp: SpaceLander },
    { id: 'math', title: 'Math Defender', icon: <Activity size={24} />, color: '#ffaa00', comp: MathDefender },
    { id: 'frog', title: 'Neon Frogger', icon: <Zap size={24} />, color: '#00f0ff', comp: NeonFrogger },
    { id: 'tetris', title: 'Neon Tetris', icon: <Box size={24} />, color: '#8a2be2', comp: NeonTetris },
    { id: 'survive', title: 'Neon Survive', icon: <Crosshair size={24} />, color: '#ff003c', comp: NeonSurvive },
    { id: 'mines', title: 'Cyber Sweeper', icon: <Target size={24} />, color: '#f0f', comp: NeonMinesweeper },
    { id: 'plinko', title: 'Neon Plinko', icon: <Gamepad2 size={24} />, color: '#00f0ff', comp: NeonPlinko },
    { id: 'bounce', title: 'Neon Bounce', icon: <Activity size={24} />, color: '#00ff00', comp: NeonBounce },
    { id: 'draw', title: 'Neon Draw', icon: <Box size={24} />, color: '#ffaa00', comp: NeonDraw },
    { id: 'clicker', title: 'Neon Clicker', icon: <Zap size={24} />, color: '#f0f', comp: NeonClicker },
    { id: 'cyberairhockey', title: 'Cyber Air Hockey', icon: <Activity size={24} />, color: '#00f0ff', comp: CyberAirHockey },
    { id: 'neon2048', title: 'Neon 2048', icon: <Box size={24} />, color: '#ffaa00', comp: Neon2048 },
    { id: 'cybergolf', title: 'Cyber Golf', icon: <Target size={24} />, color: '#00ff00', comp: CyberGolf },
    { id: 'neonrhythm', title: 'Neon Rhythm', icon: <Activity size={24} />, color: '#f0f', comp: NeonRhythm },
    { id: 'cyberfishing', title: 'Cyber Fishing', icon: <Crosshair size={24} />, color: '#00f0ff', comp: CyberFishing },
    { id: 'neonsokoban', title: 'Neon Sokoban', icon: <Box size={24} />, color: '#ffaa00', comp: NeonSokoban },
    { id: 'neonmemory', title: 'Neon Memory', icon: <Box size={24} />, color: '#8a2be2', comp: NeonMemory },
    { id: 'neontictactoe', title: 'Neon TicTacToe', icon: <Shield size={24} />, color: '#00ccff', comp: NeonTicTacToe },
    { id: 'neonbowling', title: 'Neon Bowling', icon: <Target size={24} />, color: '#ffff00', comp: NeonBowling },
    { id: 'cyberpiano', title: 'Cyber Piano', icon: <Activity size={24} />, color: '#ff00ff', comp: CyberPiano },
    { id: 'cyberinvaders', title: 'Cyber Invaders', icon: <Shield size={24} />, color: '#00f0ff', comp: CyberInvaders },
    { id: 'neonclimb', title: 'Neon Climb', icon: <Navigation size={24} />, color: '#8a2be2', comp: NeonClimb },
    { id: 'cyberpaint', title: 'Cyber Paint', icon: <Box size={24} />, color: '#ffaa00', comp: CyberPaint },
    { id: 'neonturret', title: 'Neon Turret', icon: <Crosshair size={24} />, color: '#00ccff', comp: NeonTurret },
    { id: 'cybersort', title: 'Cyber Sort', icon: <Activity size={24} />, color: '#00ff00', comp: CyberSort },
    { id: 'neonbalance', title: 'Neon Balance', icon: <Zap size={24} />, color: '#ff00ff', comp: NeonBalance },
    { id: 'cyberglide', title: 'Cyber Glide', icon: <Rocket size={24} />, color: '#ffff00', comp: CyberGlide },
    { id: 'neonpac', title: 'Neon Pac', icon: <Ghost size={24} />, color: '#ffff00', comp: NeonPac },
    { id: 'cybermatch', title: 'Cyber Match', icon: <Box size={24} />, color: '#00f0ff', comp: CyberMatch },
    { id: 'neonslicer', title: 'Neon Slicer', icon: <Zap size={24} />, color: '#ff003c', comp: NeonSlicer },
    { id: 'voxel', title: 'Neon Voxel World', icon: <Box size={24} />, color: '#00f0ff', comp: VoxelWorld },

];

const categoryLabels = {
    simulation: 'PORT',
    arcade: 'ARCADE',
    puzzle: 'PUZZLE'
};

const getGameCategory = (id) => {
    const simList = ['fnaf1', 'cs16', 'lale_savascilari', 'gtavicecity', 'ultrakill', 'hollowknight', 'mario64', 'hl1', 'geodash', 'subway', 'slope', 'quake3', 'diablo', 'drift', 'doom', 'voxel'];
    const puzzleList = ['color', 'mines', 'neon2048', 'cybergolf', 'neonsokoban', 'neonmemory', 'neontictactoe', 'neonbowling', 'cyberpiano', 'cyberinvaders', 'neonclimb', 'cybersort', 'neonbalance', 'cybermatch'];
    
    if (simList.includes(id)) return 'simulation';
    if (puzzleList.includes(id)) return 'puzzle';
    return 'arcade';
};

const RANDOM_PREFIXES = ['Pixel', 'Cyber', 'Neon', 'Voxel', 'Glitch', 'Retro', 'Alpha', 'Beta', 'Hyper', 'Matrix', 'Sonic', 'Aero', 'Nova', 'Quantum'];
const RANDOM_SUFFIXES = ['Knight', 'Racer', 'Runner', 'Gamer', 'Hacker', 'Architect', 'Wizard', 'Driver', 'Slayer', 'Spectre', 'Ghost', 'Zero', 'Shadow', 'Striker'];

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

    const [globalScores, setGlobalScores] = useState([]);
    const FIREBASE_DB = 'https://sirac-portfolio-default-rtdb.europe-west1.firebasedatabase.app';

    // Fetch Global Scores from Firebase
    const fetchGlobalScores = async () => {
        try {
            const res = await fetch(`${FIREBASE_DB}/scores.json`);
            const data = await res.json();
            if (data) {
                // Firebase stores objects, convert to sorted array
                const scoresArray = Object.values(data);
                scoresArray.sort((a, b) => b.score - a.score);
                setGlobalScores(scoresArray.slice(0, 100)); // Keep top 100
            } else {
                setGlobalScores([]);
            }
        } catch (e) {
            console.error("Score fetch failed", e);
        }
    };

    useEffect(() => {
        if (isOpen) fetchGlobalScores();
    }, [isOpen]);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
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
            <motion.div
                onClick={() => { setIsOpen(true); playArcadeOpen(); }}
                className="arcade-portal-card"
                whileHover={{ scale: 1.02, y: -8, boxShadow: '0 0 40px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                    cursor: 'pointer',
                    width: '100%', 
                    maxWidth: '900px', 
                    margin: '0 auto',
                    borderRadius: '32px',
                    padding: '4.5rem 2rem',
                    background: 'linear-gradient(135deg, rgba(15,15,25,0.7) 0%, rgba(5,5,10,0.9) 100%)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {/* Scanner Beam / Scanline Effect */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, transparent, rgba(0, 240, 255, 0.08) 50%, transparent)',
                    pointerEvents: 'none',
                    animation: 'scanline-anim 6s infinite linear',
                    zIndex: 0
                }} />

                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.05) 0%, transparent 50%)', zIndex: 0, pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div 
                        animate={{ 
                            boxShadow: ['0 0 20px rgba(0,240,255,0.2)', '0 0 40px rgba(138,43,226,0.4)', '0 0 20px rgba(0,240,255,0.2)'],
                            y: [0, -4, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        style={{ width: '90px', height: '90px', borderRadius: '28px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <Gamepad2 size={46} color="#fff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
                    </motion.div>
                    
                    <h3 style={{ fontSize: '2.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 20px rgba(0,240,255,0.1)' }}>
                        {t('arcade_btn') || 'Launch Arcade'}
                    </h3>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginTop: '0.8rem', maxWidth: '500px', lineHeight: 1.6 }}>
                        Explore 50+ fully playable web simulations, arcade games, and strategy challenges. Submit high scores to the global database.
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', background: 'rgba(0,0,0,0.4)', padding: '0.65rem 2.2rem', borderRadius: '50px', border: '1px solid rgba(0, 240, 255, 0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>50+</span>
                            <span style={{ color: 'var(--text-muted)' }}>Simulations</span>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 8px #00ff66', animation: 'bar-pulse 2s infinite' }} />
                            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>ONLINE</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="arcade-modal-overlay"
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
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.3s' }}
                                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                            <AnimatePresence mode="wait">
                                {!nickname ? (
                                    /* Nickname Entry View */
                                    <motion.div
                                        key="nickname"
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                        style={{ maxWidth: '450px', margin: '8vh auto', textAlign: 'center' }}
                                    >
                                        <div className="glass-panel" style={{ padding: '3.5rem 2.5rem', borderRadius: '24px', border: '1px solid rgba(0, 240, 255, 0.15)', background: 'rgba(15,15,20,0.85)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 10px 25px rgba(0, 240, 255, 0.3)' }}>
                                                <User size={40} color="#fff" />
                                            </div>
                                            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontWeight: 700 }}>{t('arcade_set_nickname')}</h3>
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
                                                    style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'rgba(255,255,255,0.1)' }}
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
                                        <div className="glass-panel" style={{ padding: '2.5rem 3rem', borderRadius: '24px', background: 'rgba(15,15,22,0.6)', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', letterSpacing: '-0.02em', margin: 0 }}>
                                                    <Trophy color="gold" size={28} /> Global Hall of Fame
                                                </h3>
                                                
                                                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Game Filter:</span>
                                                    <select
                                                        value={scoreboardGameFilter}
                                                        onChange={(e) => setScoreboardGameFilter(e.target.value)}
                                                        className="glass-input"
                                                        style={{
                                                            padding: '0.4rem 1.2rem',
                                                            borderRadius: '20px',
                                                            fontSize: '0.85rem',
                                                            background: 'rgba(255,255,255,0.05)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            color: '#fff',
                                                            outline: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <option value="all" style={{ background: '#0a0a0f', color: '#fff' }}>All Simulations</option>
                                                        {gamesList.map(g => (
                                                            <option key={g.id} value={g.id} style={{ background: '#0a0a0f', color: '#fff' }}>{g.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="arcade-scoreboard-grid">
                                                {/* Global Scores from Cloud */}
                                                <div style={{ display: 'grid', gap: '0.8rem', alignContent: 'start' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Top 10 Records</h4>
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
                                                            let rowBorder = '1px solid rgba(255,255,255,0.03)';
                                                            if (isMe) {
                                                                rowBg = 'rgba(0, 240, 255, 0.06)';
                                                                rowBorder = '1px solid rgba(0, 240, 255, 0.3)';
                                                            } else if (idx === 0) {
                                                                rowBg = 'rgba(255, 215, 0, 0.02)';
                                                            }
                                                            return (
                                                                <div key={`global-${idx}`} style={{
                                                                    display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1.2rem',
                                                                    background: rowBg,
                                                                    border: rowBorder,
                                                                    borderRadius: '12px',
                                                                    alignItems: 'center',
                                                                    boxShadow: isMe ? '0 0 15px rgba(0, 240, 255, 0.1)' : 'none',
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
                                                                            <span style={{ color: 'white', fontWeight: isMe ? 700 : 500, fontSize: '0.95rem' }}>{s.name}</span>
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
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Your Best Performances</h4>
                                                    {Object.entries(localScores).length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No local records yet.</p>
                                                    ) : (
                                                        Object.entries(localScores)
                                                            .sort((a, b) => b[1] - a[1])
                                                            .map(([gameId, score]) => {
                                                                const gameInfo = gamesList.find(g => g.id === gameId);
                                                                return (
                                                                    <div key={`local-${gameId}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: gameInfo?.color || 'var(--accent-cyan)' }} />
                                                                            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>{gameInfo?.title || gameId}</span>
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
                                                <motion.button
                                                    key={cat.id}
                                                    onClick={() => { playClick(); setActiveTab(cat.id); }}
                                                    onMouseEnter={playHover}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '0.6rem 1.2rem',
                                                        borderRadius: '25px',
                                                        border: activeTab === cat.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.05)',
                                                        background: activeTab === cat.id ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                                        color: activeTab === cat.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        boxShadow: activeTab === cat.id ? '0 0 15px rgba(0, 240, 255, 0.15)' : 'none',
                                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                    whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.15)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {cat.icon}
                                                    <span>{cat.label}</span>
                                                    <span style={{ fontSize: '0.75rem', opacity: 0.6, background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '10px' }}>{cat.count}</span>
                                                </motion.button>
                                            ))}
                                        </div>

                                        <motion.div
                                            key="grid"
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                                            variants={{
                                                hidden: { opacity: 0 },
                                                visible: {
                                                    opacity: 1,
                                                    transition: { staggerChildren: 0.02, delayChildren: 0.05 }
                                                }
                                            }}
                                            className="arcade-games-grid"
                                        >
                                            {gamesList.filter(game => {
                                                const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
                                                const matchesTab = activeTab === 'all' || getGameCategory(game.id) === activeTab;
                                                return matchesSearch && matchesTab;
                                            }).length === 0 && (
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

                                            {gamesList
                                                .filter(game => {
                                                    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
                                                    const matchesTab = activeTab === 'all' || getGameCategory(game.id) === activeTab;
                                                    return matchesSearch && matchesTab;
                                                })
                                                .map((game) => {
                                                    const cat = getGameCategory(game.id);
                                                    return (
                                                        <motion.div
                                                            key={game.id}
                                                            variants={{
                                                                hidden: { opacity: 0, y: 15 },
                                                                visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                                                                hover: { 
                                                                    y: -5, 
                                                                    scale: 1.03,
                                                                    boxShadow: `0 15px 30px -5px ${game.color}44`,
                                                                    borderColor: game.color,
                                                                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                                                                }
                                                            }}
                                                            initial="hidden"
                                                            animate="visible"
                                                            whileHover="hover"
                                                            onMouseEnter={playHover}
                                                            onClick={() => { playClick(); setActiveGameId(game.id); }}
                                                            style={{
                                                                background: 'rgba(20, 20, 30, 0.85)', 
                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                borderRadius: '20px', padding: '2rem 1rem 1.5rem 1rem', cursor: 'pointer',
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem',
                                                                justifyContent: 'space-between',
                                                                position: 'relative', overflow: 'hidden',
                                                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                                                willChange: 'transform, opacity'
                                                            }}
                                                        >
                                                            {/* Category tag badge in top right */}
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '8px',
                                                                right: '8px',
                                                                fontSize: '0.6rem',
                                                                fontWeight: 700,
                                                                letterSpacing: '1px',
                                                                color: game.color,
                                                                background: `${game.color}15`,
                                                                border: `1px solid ${game.color}33`,
                                                                padding: '2px 6px',
                                                                borderRadius: '4px'
                                                            }}>
                                                                {categoryLabels[cat]}
                                                            </div>

                                                            {/* Ambient game color background glow */}
                                                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '60px', background: `radial-gradient(ellipse at top, ${game.color}33 0%, transparent 70%)`, pointerEvents: 'none' }} />
                                                            
                                                            <motion.div 
                                                                variants={{
                                                                    rest: { scale: 1, rotate: 0 },
                                                                    hover: { scale: 1.1, rotate: 5, filter: `drop-shadow(0 0 16px ${game.color})` }
                                                                }}
                                                                style={{ color: game.color, filter: `drop-shadow(0 0 12px ${game.color}66)`, background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }}
                                                            >
                                                                {game.icon}
                                                            </motion.div>
                                                            
                                                            <div style={{ textAlign: 'center', width: '100%', position: 'relative', height: '45px' }}>
                                                                <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</h3>
                                                                
                                                                <div style={{ position: 'relative', width: '100%', height: '20px', overflow: 'hidden' }}>
                                                                    <motion.div 
                                                                        variants={{
                                                                            rest: { opacity: 1, y: 0 },
                                                                            hover: { opacity: 0, y: -10 }
                                                                        }} 
                                                                        style={{ position: 'absolute', width: '100%', left: 0 }}
                                                                    >
                                                                        {localScores[game.id] ? (
                                                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                                                BEST <span style={{ color: game.color, fontWeight: 700 }}>{localScores[game.id]}</span>
                                                                            </div>
                                                                        ) : (
                                                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', padding: '3px 8px' }}>NOT PLAYED</div>
                                                                        )}
                                                                    </motion.div>

                                                                    <motion.div 
                                                                        variants={{
                                                                            rest: { opacity: 0, y: 10 },
                                                                            hover: { opacity: 1, y: 0 }
                                                                        }}
                                                                        style={{ position: 'absolute', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }}
                                                                    >
                                                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', background: `linear-gradient(90deg, ${game.color}, var(--accent-violet))`, padding: '4px 12px', borderRadius: '12px', display: 'inline-block', boxShadow: `0 0 10px ${game.color}88`, letterSpacing: '0.5px' }}>
                                                                            LAUNCH ⚡
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                        </motion.div>
                                    </div>
                                ) : (
                                    /* Active Game View */
                                    <motion.div
                                        key="game"
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <h3 style={{ color: activeGame.color, textShadow: `0 0 12px ${activeGame.color}`, fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>{activeGame.title}</h3>
                                                {localScores[activeGameId] && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>PERSONAL BEST: {localScores[activeGameId]}</span>}
                                            </div>
                                            <button
                                                onClick={() => { playClick(); setActiveGameId(null); }}
                                                onMouseEnter={playHover}
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', borderColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <X size={16} /> {t('arcade_exit')}
                                            </button>
                                        </div>

                                        <div style={{ 
                                            flex: 1, 
                                            width: '100%', 
                                            maxWidth: '850px', 
                                            height: 'clamp(400px, 70vh, 600px)', 
                                            borderRadius: '24px', 
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
                                                        <Gamepad2 size={40} />
                                                    </motion.div>
                                                    <p style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>INITIALIZING VIRTUAL CONTAINER...</p>
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
            </AnimatePresence>
        </>
    );
};

export default GameLibrary;
