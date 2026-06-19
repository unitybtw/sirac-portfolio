import React, { lazy } from 'react';
import { Ghost, Navigation, Box, Gamepad2, Zap, Crosshair, Eye, Target, Compass, Gem, Trophy, Shield, Rocket, Activity } from 'lucide-react';

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
const RetroBowl = lazy(() => import('./RetroBowl'));
const MotoX3M = lazy(() => import('./MotoX3M'));
const CookieClicker = lazy(() => import('./CookieClicker'));
const WorldsHardestGame = lazy(() => import('./WorldsHardestGame'));
const MinecraftClassic = lazy(() => import('./MinecraftClassic'));
const Pacman = lazy(() => import('./Pacman'));
const FlappyBirdPort = lazy(() => import('./FlappyBirdPort'));
const Original2048 = lazy(() => import('./Original2048'));

export const gamesList = [
    { id: 'pacman', title: 'Pac-Man (Classic)', icon: <Ghost size={24} />, color: '#ffd700', comp: Pacman },
    { id: 'flappy_bird', title: 'Flappy Bird', icon: <Navigation size={24} />, color: '#ffcc00', comp: FlappyBirdPort },
    { id: 'original_2048', title: '2048 (Original)', icon: <Box size={24} />, color: '#bd00ff', comp: Original2048 },
    { id: 'retro_bowl', title: 'Retro Bowl', icon: <Gamepad2 size={24} />, color: '#ff4400', comp: RetroBowl },
    { id: 'moto_x3m', title: 'Moto X3M', icon: <Navigation size={24} />, color: '#ffcc00', comp: MotoX3M },
    { id: 'cookie_clicker', title: 'Cookie Clicker', icon: <Zap size={24} />, color: '#ff8800', comp: CookieClicker },
    { id: 'worlds_hardest', title: "World's Hardest Game", icon: <Crosshair size={24} />, color: '#ff003c', comp: WorldsHardestGame },
    { id: 'minecraft_classic', title: 'Minecraft Classic', icon: <Box size={24} />, color: '#55aa55', comp: MinecraftClassic },
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

export const categoryLabels = {
    simulation: 'PORT',
    arcade: 'ARCADE',
    puzzle: 'PUZZLE'
};

export const getGameCategory = (id) => {
    const simList = ['fnaf1', 'cs16', 'lale_savascilari', 'gtavicecity', 'ultrakill', 'hollowknight', 'mario64', 'hl1', 'geodash', 'subway', 'slope', 'quake3', 'diablo', 'drift', 'doom', 'voxel', 'retro_bowl', 'minecraft_classic', 'cookie_clicker', 'pacman', 'flappy_bird', 'original_2048'];
    const puzzleList = ['color', 'mines', 'neon2048', 'cybergolf', 'neonsokoban', 'neonmemory', 'neontictactoe', 'neonbowling', 'cyberpiano', 'cyberinvaders', 'neonclimb', 'cybersort', 'neonbalance', 'cybermatch'];
    
    if (simList.includes(id)) return 'simulation';
    if (puzzleList.includes(id)) return 'puzzle';
    return 'arcade';
};

export const RANDOM_PREFIXES = ['Pixel', 'Cyber', 'Neon', 'Voxel', 'Glitch', 'Retro', 'Alpha', 'Beta', 'Hyper', 'Matrix', 'Sonic', 'Aero', 'Nova', 'Quantum'];
export const RANDOM_SUFFIXES = ['Knight', 'Racer', 'Runner', 'Gamer', 'Hacker', 'Architect', 'Wizard', 'Driver', 'Slayer', 'Spectre', 'Ghost', 'Zero', 'Shadow', 'Striker'];
