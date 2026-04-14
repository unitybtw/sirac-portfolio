import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Gamepad2, Rocket, Zap, Navigation, Shield, Ghost, Crosshair, Target, Activity, Box, Trophy, User, Save, List, Gem, Compass } from 'lucide-react';

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



const gamesList = [
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
    { id: 'asteroid', title: 'Asteroid Blaster', icon: <Rocket size={24} />, color: 'var(--accent-cyan)', comp: AsteroidBlaster },
    { id: 'runner', title: 'Cyber Jumper', icon: <Zap size={24} />, color: 'var(--accent-violet)', comp: NeonRunner },
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

const GameLibrary = ({ isOpen, setIsOpen, activeGameId, setActiveGameId }) => {
    const { t } = useTranslation();
    const [nickname, setNickname] = useState(localStorage.getItem('arcade_nickname') || '');
    const [tempName, setTempName] = useState('');
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [localScores, setLocalScores] = useState(() => {
        const saved = localStorage.getItem('arcade_scores');
        return saved ? JSON.parse(saved) : {};
    });

    const activeGame = gamesList.find(g => g.id === activeGameId);

    const saveNickname = () => {
        const trimmed = tempName.trim();
        if (trimmed.length >= 3) {
            setNickname(trimmed);
            localStorage.setItem('arcade_nickname', trimmed);
        }
    };

    const [globalScores, setGlobalScores] = useState([]);
    const DB_URL = 'https://api.npoint.io/3acbc3b9d1e79276cfab';

    // Fetch Global Scores
    const fetchGlobalScores = async () => {
        try {
            const res = await fetch(DB_URL);
            const data = await res.json();
            if (data && data.scores) {
                setGlobalScores(data.scores);
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
        let isImproved = false;
        setLocalScores(prev => {
            const currentBest = prev[id] || 0;
            if (score > currentBest) {
                isImproved = true;
                const newScores = { ...prev, [id]: score };
                localStorage.setItem('arcade_scores', JSON.stringify(newScores));
                return newScores;
            }
            return prev;
        });

        // 2. Global Sync (If it's a valid score)
        if (score > 0) {
            try {
                const res = await fetch(DB_URL);
                const data = await res.json();
                let scores = data.scores || [];

                // Remove existing entry for this user and game
                scores = scores.filter(s => !(s.name === nickname && s.gameId === id));

                // Add new score
                scores.push({ name: nickname, gameId: id, score: score, date: new Date().toISOString() });

                // Sort and Limit to top 100
                scores.sort((a, b) => b.score - a.score);
                scores = scores.slice(0, 100);

                await fetch(DB_URL, {
                    method: 'POST',
                    body: JSON.stringify({ scores })
                });
                setGlobalScores(scores);
            } catch (e) {
                console.error("Cloud sync failed", e);
            }
        }
    }, [activeGameId, nickname]);

    return (
        <>
            <motion.div
                onClick={() => setIsOpen(true)}
                className="arcade-portal-card"
                whileHover={{ scale: 1.02, y: -10, boxShadow: '0 30px 60px -15px rgba(0, 240, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                    cursor: 'pointer',
                    width: '100%', 
                    maxWidth: '900px', 
                    margin: '0 auto',
                    borderRadius: '32px',
                    padding: '4rem 2rem',
                    background: 'linear-gradient(135deg, rgba(20,20,30,0.8) 0%, rgba(10,10,15,0.9) 100%)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.08) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 10px 30px rgba(0, 240, 255, 0.3)' }}>
                        <Gamepad2 size={40} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('arcade_btn') || 'Launch Arcade'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '400px' }}>
                        Over 50 retro and modern simulations. Compete on global leaderboards.
                    </p>
                </div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="arcade-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'rgba(5, 5, 8, 0.99)',
                            zIndex: 100000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            willChange: 'opacity'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                <div>
                                    <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '-0.02em', fontWeight: 800 }}>{t('arcade_inside_title')}</h2>
                                    {nickname && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Connected as <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{nickname}</span></p>}
                                </div>
                                {nickname && !activeGameId && (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => setShowScoreboard(!showScoreboard)}
                                            className={`btn ${showScoreboard ? 'btn-primary' : 'btn-outline'}`}
                                            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            {showScoreboard ? <Gamepad2 size={16} /> : <Trophy size={16} />}
                                            {showScoreboard ? t('arcade_games') : t('arcade_scoreboard')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => { setIsOpen(false); setActiveGameId(null); setShowScoreboard(false); }}
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
                                        <div className="glass-panel" style={{ padding: '3.5rem 2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(20,20,25,0.6)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 10px 20px rgba(0, 240, 255, 0.2)' }}>
                                                <User size={40} color="#fff" />
                                            </div>
                                            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontWeight: 700 }}>{t('arcade_set_nickname')}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Choose your identity to save your scores globally.</p>
                                            <input
                                                type="text"
                                                placeholder="Enter username..."
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '1.2rem', background: 'rgba(0,0,0,0.4)',
                                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                                                    color: '#fff', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.1rem',
                                                    outline: 'none', transition: 'border-color 0.3s'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                                maxLength={16}
                                                autoFocus
                                            />
                                            <button
                                                onClick={saveNickname}
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
                                        style={{ maxWidth: '900px', margin: '0 auto' }}
                                    >
                                        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', background: 'rgba(20,20,30,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                                                <Trophy color="gold" size={28} /> Global Hall of Fame
                                            </h3>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
                                                {/* Global Scores from Cloud */}
                                                <div style={{ display: 'grid', gap: '0.8rem', alignContent: 'start' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Top 10 Global Records</h4>
                                                    {globalScores.length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Syncing with cloud database...</p>
                                                    ) : (
                                                        globalScores.slice(0, 10).map((s, idx) => (
                                                            <div key={`global-${idx}`} style={{
                                                                display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem',
                                                                background: s.name === nickname ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                                animation: 'fadeIn 0.5s ease-out',
                                                                alignItems: 'center'
                                                            }}>
                                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                    <span style={{ color: 'var(--text-muted)', width: '20px', fontWeight: 600 }}>{idx + 1}.</span>
                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span style={{ color: 'white', fontWeight: s.name === nickname ? 700 : 500 }}>{s.name}</span>
                                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{gamesList.find(g => g.id === s.gameId)?.title || s.gameId}</span>
                                                                    </div>
                                                                </div>
                                                                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1.1rem' }}>{s.score.toLocaleString()}</div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Local High Scores */}
                                                <div style={{ display: 'grid', gap: '0.8rem', alignContent: 'start' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Your Best Performances</h4>
                                                    {Object.entries(localScores).length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No local records yet.</p>
                                                    ) : (
                                                        Object.entries(localScores)
                                                            .sort((a, b) => b[1] - a[1])
                                                            .map(([gameId, score]) => (
                                                                <div key={`local-${gameId}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', alignItems: 'center' }}>
                                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{gamesList.find(g => g.id === gameId)?.title}</span>
                                                                    </div>
                                                                    <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{score.toLocaleString()}</div>
                                                                </div>
                                                            ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : !activeGameId ? (
                                    /* Games Grid View */
                                    <motion.div
                                        key="grid"
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: { staggerChildren: 0.02, delayChildren: 0.1 }
                                            }
                                        }}
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}
                                    >
                                        {gamesList.map((game) => (
                                            <motion.div
                                                key={game.id}
                                                variants={{
                                                    hidden: { opacity: 0, y: 15 },
                                                    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
                                                }}
                                                whileHover={{ y: -4, scale: 1.02, boxShadow: `0 10px 25px -5px ${game.color}66`, borderColor: `rgba(255,255,255,0.2)` }}
                                                onClick={() => setActiveGameId(game.id)}
                                                style={{
                                                    background: 'rgba(20, 20, 30, 0.85)', 
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    borderRadius: '20px', padding: '1.5rem 1rem', cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                                                    justifyContent: 'space-between',
                                                    position: 'relative', overflow: 'hidden',
                                                    willChange: 'transform, opacity'
                                                }}
                                            >
                                                {/* Ambient game color background glow */}
                                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '50px', background: `radial-gradient(ellipse at top, ${game.color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
                                                
                                                <div style={{ color: game.color, filter: `drop-shadow(0 0 16px ${game.color}88)`, background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    {game.icon}
                                                </div>
                                                <div style={{ textAlign: 'center', width: '100%' }}>
                                                    <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</h3>
                                                    {localScores[game.id] ? (
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
                                                            BEST <span style={{ color: game.color, fontWeight: 700 }}>{localScores[game.id]}</span>
                                                        </div>
                                                    ) : (
                                                        <div style={{ fontSize: '0.75rem', color: 'transparent', padding: '4px 8px' }}>-</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    /* Active Game View */
                                    <motion.div
                                        key="game"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                                <h3 style={{ color: activeGame.color, textShadow: `0 0 10px ${activeGame.color}`, fontSize: '1.5rem', margin: 0 }}>{activeGame.title}</h3>
                                                {localScores[activeGameId] && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>BEST: {localScores[activeGameId]}</span>}
                                            </div>
                                            <button
                                                onClick={() => setActiveGameId(null)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'rgba(255,255,255,0.2)' }}
                                            >
                                                <X size={16} style={{ marginRight: '8px' }} /> {t('arcade_exit')}
                                            </button>
                                        </div>

                                        <div style={{ flex: 1, width: '100%', maxWidth: '800px', minHeight: '600px', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${activeGame.color}`, boxShadow: `0 0 30px ${activeGame.color}44`, background: '#000' }}>
                                            <Suspense fallback={
                                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: activeGame.color }}>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                        style={{ marginBottom: '1rem' }}
                                                    >
                                                        <Gamepad2 size={40} />
                                                    </motion.div>
                                                    <p style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING UNIVERSE...</p>
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
