import React, { lazy } from 'react';
import { Ghost, Navigation, Box, Gamepad2, Zap, Crosshair, Eye, Target, Compass, Gem, Trophy, Activity, Flame } from 'lucide-react';

// Genuine Web & Retro Game Ports (Zero AI slop, 100% authentic ports)
const Mario64 = lazy(() => import('./Mario64'));
const GTAViceCity = lazy(() => import('./GTAViceCity'));
const HalfLife = lazy(() => import('./HalfLife'));
const Quake3 = lazy(() => import('./Quake3'));
const Doom = lazy(() => import('./Doom'));
const Diablo = lazy(() => import('./Diablo'));
const MinecraftClassic = lazy(() => import('./MinecraftClassic'));
const CS16 = lazy(() => import('./CS16'));
const LaleSavascilari = lazy(() => import('./LaleSavascilari'));
const DriftHunters = lazy(() => import('./DriftHunters'));
const Ultrakill = lazy(() => import('./Ultrakill'));
const HollowKnight = lazy(() => import('./HollowKnight'));
const SubwaySurfers = lazy(() => import('./SubwaySurfers'));
const GeometryDash = lazy(() => import('./GeometryDash'));
const Slope = lazy(() => import('./Slope'));
const RetroBowl = lazy(() => import('./RetroBowl'));
const MotoX3M = lazy(() => import('./MotoX3M'));
const FNAF1 = lazy(() => import('./FNAF1'));
const Pacman = lazy(() => import('./Pacman'));
const Original2048 = lazy(() => import('./Original2048'));
const CookieClicker = lazy(() => import('./CookieClicker'));
const WorldsHardestGame = lazy(() => import('./WorldsHardestGame'));
const FlappyBirdPort = lazy(() => import('./FlappyBirdPort'));

export const gamesList = [
    { id: 'mario64', title: 'Super Mario 64', icon: <Trophy size={24} />, color: '#ffcc00', comp: Mario64 },
    { id: 'gtavicecity', title: 'GTA Vice City', icon: <Gem size={24} />, color: '#ff66b2', comp: GTAViceCity },
    { id: 'hl1', title: 'Half-Life', icon: <Target size={24} />, color: '#ff9900', comp: HalfLife },
    { id: 'quake3', title: 'Quake III Arena', icon: <Target size={24} />, color: '#ffcc00', comp: Quake3 },
    { id: 'doom', title: 'DOOM (Classic)', icon: <Flame size={24} />, color: '#ff0000', comp: Doom },
    { id: 'diablo', title: 'Diablo I', icon: <Ghost size={24} />, color: '#8b0000', comp: Diablo },
    { id: 'minecraft_classic', title: 'Minecraft Classic', icon: <Box size={24} />, color: '#55aa55', comp: MinecraftClassic },
    { id: 'cs16', title: 'Kirka.io (CSGO Web)', icon: <Target size={24} />, color: '#ffd700', comp: CS16 },
    { id: 'lale_savascilari', title: 'İst. Efsaneleri: Lale Savaşçıları', icon: <Compass size={24} />, color: '#00ff00', comp: LaleSavascilari },
    { id: 'drift', title: 'Drift Hunters', icon: <Navigation size={24} />, color: '#ff4400', comp: DriftHunters },
    { id: 'ultrakill', title: 'ULTRAKILL', icon: <Crosshair size={24} />, color: '#ff3300', comp: Ultrakill },
    { id: 'hollowknight', title: 'Hollow Knight', icon: <Ghost size={24} />, color: '#aab8c2', comp: HollowKnight },
    { id: 'subway', title: 'Subway Surfers', icon: <Activity size={24} />, color: '#ffec00', comp: SubwaySurfers },
    { id: 'geodash', title: 'Geometry Dash', icon: <Zap size={24} />, color: '#ffcc00', comp: GeometryDash },
    { id: 'slope', title: 'Slope', icon: <Activity size={24} />, color: '#00ff00', comp: Slope },
    { id: 'retro_bowl', title: 'Retro Bowl', icon: <Gamepad2 size={24} />, color: '#ff4400', comp: RetroBowl },
    { id: 'moto_x3m', title: 'Moto X3M', icon: <Navigation size={24} />, color: '#ffcc00', comp: MotoX3M },
    { id: 'fnaf1', title: "Five Nights at Freddy's", icon: <Eye size={24} />, color: '#ff2200', comp: FNAF1 },
    { id: 'pacman', title: 'Pac-Man (Classic)', icon: <Ghost size={24} />, color: '#ffd700', comp: Pacman },
    { id: 'original_2048', title: '2048 (Original)', icon: <Box size={24} />, color: '#bd00ff', comp: Original2048 },
    { id: 'cookie_clicker', title: 'Cookie Clicker', icon: <Zap size={24} />, color: '#ff8800', comp: CookieClicker },
    { id: 'worlds_hardest', title: "World's Hardest Game", icon: <Crosshair size={24} />, color: '#ff003c', comp: WorldsHardestGame },
    { id: 'flappy_bird', title: 'Flappy Bird', icon: <Navigation size={24} />, color: '#ffcc00', comp: FlappyBirdPort },
];

export const categoryLabels = {
    simulation: '3D RETRO',
    arcade: 'ACTION',
    puzzle: 'CLASSIC'
};

export const getGameCategory = (id) => {
    const simList = ['mario64', 'gtavicecity', 'hl1', 'quake3', 'doom', 'diablo', 'minecraft_classic', 'cs16', 'lale_savascilari', 'drift'];
    const puzzleList = ['pacman', 'original_2048', 'cookie_clicker', 'worlds_hardest', 'flappy_bird'];
    
    if (simList.includes(id)) return 'simulation';
    if (puzzleList.includes(id)) return 'puzzle';
    return 'arcade';
};

export const RANDOM_PREFIXES = ['Pixel', 'Cyber', 'Neon', 'Voxel', 'Glitch', 'Retro', 'Alpha', 'Beta', 'Hyper', 'Matrix', 'Sonic', 'Aero', 'Nova', 'Quantum'];
export const RANDOM_SUFFIXES = ['Knight', 'Racer', 'Runner', 'Gamer', 'Hacker', 'Architect', 'Wizard', 'Driver', 'Slayer', 'Spectre', 'Ghost', 'Zero', 'Shadow', 'Striker'];
