import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Gamepad2, Rocket, Zap, Navigation, Shield, Ghost, Crosshair, Target, Activity, Box, Trophy, User, Save, List } from 'lucide-react';

import AsteroidBlaster from './AsteroidBlaster';
import NeonRunner from './NeonRunner';
import CyberPong from './CyberPong';
import BrickBreaker from './BrickBreaker';
import FlappyNeon from './FlappyNeon';
import NeonSnakeGame from './NeonSnakeGame';
import SpaceDefenders from './SpaceDefenders';
import NeonDodger from './NeonDodger';
import NeonRacer from './NeonRacer';
import BeraatQuest from './BeraatQuest';
import AimTrainer from './AimTrainer';
import NeonHelicopter from './NeonHelicopter';
import GravityFlip from './GravityFlip';
import WhackAMole from './WhackAMole';
import NeonDarts from './NeonDarts';
import ColorMatcher from './ColorMatcher';
import SimonSays from './SimonSays';
import NeonStacker from './NeonStacker';
import TypingDefender from './TypingDefender';
import NeonJumper from './NeonJumper';
import SpaceLander from './SpaceLander';
import MathDefender from './MathDefender';
import NeonFrogger from './NeonFrogger';
import NeonTetris from './NeonTetris';
import NeonSurvive from './NeonSurvive';
import NeonMinesweeper from './NeonMinesweeper';
import NeonPlinko from './NeonPlinko';
import NeonBounce from './NeonBounce';
import NeonDraw from './NeonDraw';
import NeonClicker from './NeonClicker';
import CyberAirHockey from './CyberAirHockey';
import Neon2048 from './Neon2048';
import CyberGolf from './CyberGolf';
import NeonRhythm from './NeonRhythm';
import CyberFishing from './CyberFishing';
import NeonSokoban from './NeonSokoban';
import NeonMemory from './NeonMemory';
import NeonTicTacToe from './NeonTicTacToe';
import NeonBowling from './NeonBowling';
import CyberPiano from './CyberPiano';
import CyberInvaders from './CyberInvaders';
import NeonClimb from './NeonClimb';
import CyberPaint from './CyberPaint';
import NeonTurret from './NeonTurret';
import CyberSort from './CyberSort';
import NeonBalance from './NeonBalance';
import CyberGlide from './CyberGlide';
import NeonPac from './NeonPac';
import CyberMatch from './CyberMatch';
import NeonSlicer from './NeonSlicer';
import VoxelWorld from './VoxelWorld';
import CS16 from './CS16';
import Doom from './Doom';
import Slope from './Slope';
import Quake3 from './Quake3';
import Diablo from './Diablo';
import DriftHunters from './DriftHunters';
import Mario64 from './Mario64';
import HalfLife from './HalfLife';
import GeometryDash from './GeometryDash';
import SubwaySurfers from './SubwaySurfers';




const gamesList = [
    { id: 'mario64', title: 'Super Mario 64', icon: <Trophy size={24} />, color: '#ffcc00', comp: Mario64 },
    { id: 'hl1', title: 'Half-Life', icon: <Target size={24} />, color: '#ff9900', comp: HalfLife },
    { id: 'geodash', title: 'Geometry Dash', icon: <Zap size={24} />, color: '#ffcc00', comp: GeometryDash },
    { id: 'subway', title: 'Subway Surfers', icon: <Activity size={24} />, color: '#ffec00', comp: SubwaySurfers },
    { id: 'slope', title: 'Slope', icon: <Activity size={24} />, color: '#00ff00', comp: Slope },
    { id: 'quake3', title: 'Quake III', icon: <Target size={24} />, color: '#ffcc00', comp: Quake3 },
    { id: 'diablo', title: 'Diablo I', icon: <Ghost size={24} />, color: '#8b0000', comp: Diablo },
    { id: 'drift', title: 'Drift Hunters', icon: <Navigation size={24} />, color: '#ff4400', comp: DriftHunters },
    { id: 'doom', title: 'DOOM (Classic)', icon: <Activity size={24} />, color: '#ff0000', comp: Doom },
    { id: 'cs16', title: 'Counter-Strike 1.6', icon: <Crosshair size={24} />, color: '#ff9900', comp: CS16 },
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
        if (tempName.trim().length >= 3) {
            setNickname(tempName.trim());
            localStorage.setItem('arcade_nickname', tempName.trim());
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
            <motion.button
                onClick={() => setIsOpen(true)}
                className="btn btn-primary glass-panel"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '1rem 3rem', fontSize: '1.2rem', gap: '10px', display: 'flex', alignItems: 'center' }}
            >
                <Gamepad2 size={24} /> {t('arcade_btn')}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'rgba(5, 5, 8, 0.95)', backdropFilter: 'blur(10px)',
                            zIndex: 100000, display: 'flex', flexDirection: 'column', overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div>
                                    <h2 className="text-gradient" style={{ fontSize: '2rem', margin: 0 }}>{t('arcade_inside_title')}</h2>
                                    {nickname && <p style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace', margin: 0 }}>[ ACTIVE USER: {nickname} ]</p>}
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
                                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%', color: 'white', cursor: 'pointer' }}
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                            <AnimatePresence mode="wait">
                                {!nickname ? (
                                    /* Nickname Entry View */
                                    <motion.div
                                        key="nickname"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        style={{ maxWidth: '400px', margin: '10vh auto', textAlign: 'center' }}
                                    >
                                        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid var(--accent-cyan)' }}>
                                            <User size={60} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }} />
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('arcade_set_nickname')}</h3>
                                            <input
                                                type="text"
                                                placeholder="Enter username..."
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                                                    color: '#fff', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.1rem'
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                onClick={saveNickname}
                                                className="btn btn-primary"
                                                style={{ width: '100%', padding: '1rem' }}
                                                disabled={tempName.trim().length < 3}
                                            >
                                                <Save size={18} style={{ marginRight: '8px' }} /> {t('arcade_save_continue')}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : showScoreboard ? (
                                    /* Scoreboard View */
                                    <motion.div
                                        key="scoreboard"
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                        style={{ maxWidth: '800px', margin: '0 auto' }}
                                    >
                                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                                                <Trophy color="gold" /> GLOBAL HALL OF FAME
                                            </h3>

                                            <div style={{ display: 'grid', gap: '2rem' }}>
                                                {/* Global Scores from Cloud */}
                                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Top 10 Global Records</h4>
                                                    {globalScores.length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Syncing with cloud database...</p>
                                                    ) : (
                                                        globalScores.slice(0, 10).map((s, idx) => (
                                                            <div key={`global-${idx}`} style={{
                                                                display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1.2rem',
                                                                background: s.name === nickname ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                                                                border: s.name === nickname ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)',
                                                                borderRadius: '8px',
                                                                animation: 'fadeIn 0.5s ease-out'
                                                            }}>
                                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                    <span style={{ color: 'var(--text-muted)', width: '20px' }}>{idx + 1}.</span>
                                                                    <span style={{ color: 'white', fontWeight: 'bold' }}>{s.name}</span>
                                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{gamesList.find(g => g.id === s.gameId)?.title || s.gameId}</span>
                                                                </div>
                                                                <div style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontFamily: 'monospace' }}>{s.score.toLocaleString()}</div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }} />

                                                {/* Local High Scores */}
                                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Your Best Performances</h4>
                                                    {Object.entries(localScores).length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No local records yet.</p>
                                                    ) : (
                                                        Object.entries(localScores)
                                                            .sort((a, b) => b[1] - a[1])
                                                            .map(([gameId, score]) => (
                                                                <div key={`local-${gameId}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                        <span style={{ color: 'var(--accent-cyan)' }}>{gamesList.find(g => g.id === gameId)?.title}</span>
                                                                    </div>
                                                                    <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{score.toLocaleString()}</div>
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
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}
                                    >
                                        {gamesList.map((game, i) => (
                                            <motion.div
                                                key={game.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                whileHover={{ y: -10, boxShadow: `0 15px 30px ${game.color}33`, borderColor: game.color }}
                                                onClick={() => setActiveGameId(game.id)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                                                    borderRadius: '16px', padding: '2rem', cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                                                    transition: 'border-color 0.3s'
                                                }}
                                            >
                                                <div style={{ color: game.color, filter: `drop-shadow(0 0 10px ${game.color})` }}>
                                                    {game.icon}
                                                </div>
                                                <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0, textAlign: 'center' }}>{game.title}</h3>
                                                {localScores[game.id] && (
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>BEST: {localScores[game.id]}</span>
                                                )}
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t('arcade_play')}</span>
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

                                        <div style={{ flex: 1, width: '100%', maxWidth: '800px', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${activeGame.color}`, boxShadow: `0 0 30px ${activeGame.color}44` }}>
                                            {activeGame.comp && <activeGame.comp onGameOver={(score) => handleGameOver(score, activeGame.id)} />}
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
