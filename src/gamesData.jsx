import React, { lazy } from 'react';
import HostedArcadeGame from './HostedArcadeGame';
import additionalBrowserPorts from './data/additionalBrowserPorts.json';
import { Ghost, Navigation, Box, Gamepad2, Zap, Crosshair, Eye, Target, Gem, Activity, Flame } from 'lucide-react';

// Browser games and retro ports. Keep each upstream runtime and attribution intact.
const GTAViceCity = lazy(() => import('./GTAViceCity'));
const HalfLife = lazy(() => import('./HalfLife'));
const Quake3 = lazy(() => import('./Quake3'));
const Doom = lazy(() => import('./Doom'));
const Diablo = lazy(() => import('./Diablo'));
const MinecraftClassic = lazy(() => import('./MinecraftClassic'));
const CS16 = lazy(() => import('./CS16'));
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

const hosted = (props) => function BrowserGame() { return <HostedArcadeGame {...props} />; };

const Doom3 = hosted({title:'DOOM 3 — Demo',url:'https://wasm.continuation-labs.com/d3demo/',source:'https://github.com/gabrielcuvillier/d3wasm',controls:{en:'Demo · Initial download ≈400 MB · WASD + mouse',tr:'Demo · İlk indirme ≈400 MB · WASD + fare'}});
const ArxFatalis = hosted({title:'Arx Fatalis — Demo',url:'https://wasm.continuation-labs.com/arxdemo/',source:'https://www.continuation-labs.com/projects/arxwasm/',controls:{en:'Demo · WASD: move · Mouse: interact',tr:'Demo · WASD: hareket · Fare: etkileşim'}});
const NetQuake = hosted({title:'Quake',url:'https://www.netquake.io/',source:'https://www.netquake.io/',controls:{en:'Free episode 1 · WASD + mouse · Space: jump',tr:'Ücretsiz 1. bölüm · WASD + fare · Boşluk: zıpla'}});
const RedAlert2 = hosted({external:true,title:'Red Alert 2 — Chrono Divide',url:'https://game.chronodivide.com/',source:'https://chronodivide.com/',controls:{en:'Community beta · Mouse: select / command · Game files may be required',tr:'Topluluk betası · Fare: seç / komut ver · Oyun dosyaları gerekebilir'}});

const HotlineMiami = hosted({title:'Hotline Miami',url:'https://raw.githack.com/genizy/web-port/main/hotline-miami/index.html',source:'https://github.com/genizy/web-port/tree/main/hotline-miami',controls:{en:'WASD: move · Mouse: aim / attack',tr:'WASD: hareket · Fare: nişan / saldırı'}});

const Celeste = hosted({opaqueOrigin:true,title:'Celeste',url:`${import.meta.env.BASE_URL}ports/celeste.json`,source:'https://github.com/web-ports/celeste',controls:{en:'Community port · Arrow keys: move · C: jump · X: dash',tr:'Topluluk portu · Ok tuşları: hareket · C: zıpla · X: atıl'}});
const PlantsVsZombies = hosted({opaqueOrigin:true,title:'Plants vs. Zombies',url:`${import.meta.env.BASE_URL}ports/pvz.json`,source:'https://github.com/web-ports/pvz',controls:{en:'Community port · Mouse: select / plant',tr:'Topluluk portu · Fare: seç / bitki yerleştir'}});
const SlimeRancher = hosted({opaqueOrigin:true,title:'Slime Rancher — Alpha',url:`${import.meta.env.BASE_URL}ports/slime-ranchers.json`,source:'https://github.com/web-ports/slime-ranchers',controls:{en:'Community alpha · WASD + mouse · Space: jump',tr:'Topluluk alfası · WASD + fare · Boşluk: zıpla'}});

const Cuphead = hosted({opaqueOrigin:true,title:'Cuphead',url:`${import.meta.env.BASE_URL}ports/cuphead.json`,source:'https://github.com/web-ports/cuphead',controls:{en:'Community port · ≈2.1 GB initial download · Check in-game controls',tr:'Topluluk portu · İlk indirme ≈2,1 GB · Tuşlar oyun içinde'}});
const Silksong = hosted({opaqueOrigin:true,title:'Hollow Knight: Silksong',url:`${import.meta.env.BASE_URL}ports/hollow-knight-silksong.json`,source:'https://github.com/web-ports/hollow-knight-silksong',controls:{en:'Community port · ≈2 GB initial download · Keyboard / gamepad',tr:'Topluluk portu · İlk indirme ≈2 GB · Klavye / oyun kolu'}});
const Bendy = hosted({opaqueOrigin:true,title:'Bendy and the Ink Machine',url:`${import.meta.env.BASE_URL}ports/bendy-and-the-ink-machine.json`,source:'https://github.com/web-ports/bendy-and-the-ink-machine',controls:{en:'Community port · ≈685 MB initial download · WASD + mouse',tr:'Topluluk portu · İlk indirme ≈685 MB · WASD + fare'}});
const IronLung = hosted({opaqueOrigin:true,title:'Iron Lung',url:`${import.meta.env.BASE_URL}ports/iron-lung.json`,source:'https://github.com/web-ports/iron-lung',controls:{en:'Community port · Keyboard + mouse · Controls in game',tr:'Topluluk portu · Klavye + fare · Tuşlar oyun içinde'}});
const Tabs = hosted({opaqueOrigin:true,title:'Totally Accurate Battle Simulator',url:`${import.meta.env.BASE_URL}ports/tabs.json`,source:'https://github.com/web-ports/tabs',controls:{en:'Community port · ≈1.75 GB initial download · Mouse + keyboard',tr:'Topluluk portu · İlk indirme ≈1,75 GB · Fare + klavye'}});
const MiSide = hosted({opaqueOrigin:true,title:'MiSide',url:`${import.meta.env.BASE_URL}ports/miside.json`,source:'https://github.com/web-ports/miside',controls:{en:'Community port · WASD + mouse · E: interact',tr:'Topluluk portu · WASD + fare · E: etkileşim'}});

// Keep the bulk catalogue declarative; game binaries load only after selection.
const additionalCategories = new Map(additionalBrowserPorts.map(port => [port.id, port.category]));
const additionalGames = additionalBrowserPorts.map(port => {
    const downloadEn = port.downloadMB ? `Initial download ≈${Math.ceil(port.downloadMB)} MB · ` : '';
    const downloadTr = port.downloadMB ? `İlk indirme ≈${Math.ceil(port.downloadMB)} MB · ` : '';
    return {
        id: port.id,
        title: port.title,
        icon: port.category === 'simulation' ? <Box size={24} /> : <Gamepad2 size={24} />,
        color: '#71717a',
        comp: hosted({
            opaqueOrigin: true,
            title: port.title,
            url: `${import.meta.env.BASE_URL}ports/${port.entry}`,
            source: port.source,
            controls: {
                en: `Community port · ${downloadEn}Keyboard / mouse · Controls in game`,
                tr: `Topluluk portu · ${downloadTr}Klavye / fare · Tuşlar oyun içinde`,
            },
        }),
    };
});

export const gamesList = [
    ...additionalGames,
    { id: 'cuphead', title: 'Cuphead', icon: <Gamepad2 size={24} />, color: '#71717a', comp: Cuphead },
    { id: 'silksong', title: 'Hollow Knight: Silksong', icon: <Ghost size={24} />, color: '#71717a', comp: Silksong },
    { id: 'bendy', title: 'Bendy and the Ink Machine', icon: <Eye size={24} />, color: '#71717a', comp: Bendy },
    { id: 'iron_lung', title: 'Iron Lung', icon: <Navigation size={24} />, color: '#71717a', comp: IronLung },
    { id: 'tabs', title: 'Totally Accurate Battle Simulator', icon: <Target size={24} />, color: '#71717a', comp: Tabs },
    { id: 'miside', title: 'MiSide', icon: <Eye size={24} />, color: '#71717a', comp: MiSide },

    { id: 'celeste', title: 'Celeste', icon: <Zap size={24} />, color: '#71717a', comp: Celeste },
    { id: 'plants_vs_zombies', title: 'Plants vs. Zombies', icon: <Flame size={24} />, color: '#71717a', comp: PlantsVsZombies },
    { id: 'slime_rancher', title: 'Slime Rancher — Alpha', icon: <Box size={24} />, color: '#71717a', comp: SlimeRancher },

    { id: 'hotline_miami', title: 'Hotline Miami', icon: <Crosshair size={24} />, color: '#71717a', comp: HotlineMiami },
    { id: 'doom3', title: 'DOOM 3 — Demo', icon: <Flame size={24} />, color: '#71717a', comp: Doom3 },
    { id: 'arx_fatalis', title: 'Arx Fatalis — Demo', icon: <Gem size={24} />, color: '#71717a', comp: ArxFatalis },
    { id: 'netquake', title: 'Quake', icon: <Target size={24} />, color: '#71717a', comp: NetQuake },
    { id: 'red_alert2', title: 'Red Alert 2 — Chrono Divide', icon: <Target size={24} />, color: '#71717a', launchMode: 'external', comp: RedAlert2 },
    { id: 'gtavicecity', title: 'GTA Vice City', icon: <Gem size={24} />, color: '#ff66b2', comp: GTAViceCity },
    { id: 'hl1', title: 'Half-Life', icon: <Target size={24} />, color: '#ff9900', comp: HalfLife },
    { id: 'quake3', title: 'Quake III Arena', icon: <Target size={24} />, color: '#ffcc00', comp: Quake3 },
    { id: 'doom', title: 'DOOM (Classic)', icon: <Flame size={24} />, color: '#ff0000', comp: Doom },
    { id: 'diablo', title: 'Diablo I', icon: <Ghost size={24} />, color: '#8b0000', comp: Diablo },
    { id: 'minecraft_classic', title: 'Minecraft Classic', icon: <Box size={24} />, color: '#55aa55', comp: MinecraftClassic },
    { id: 'cs16', title: 'Kirka.io (CSGO Web)', icon: <Target size={24} />, color: '#ffd700', comp: CS16 },
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
];

export const categoryLabels = {
    simulation: '3D RETRO',
    arcade: 'ACTION',
    puzzle: 'CLASSIC'
};

export const getGameCategory = (id) => {
    if (additionalCategories.has(id)) return additionalCategories.get(id);
    const simList = ['bendy', 'iron_lung', 'tabs', 'miside', 'slime_rancher', 'doom3', 'arx_fatalis', 'netquake', 'red_alert2', 'gtavicecity', 'hl1', 'quake3', 'doom', 'diablo', 'minecraft_classic', 'cs16', 'drift'];
    const puzzleList = ['pacman', 'original_2048', 'cookie_clicker', 'worlds_hardest'];
    
    if (simList.includes(id)) return 'simulation';
    if (puzzleList.includes(id)) return 'puzzle';
    return 'arcade';
};

export const RANDOM_PREFIXES = ['Pixel', 'Cyber', 'Neon', 'Voxel', 'Glitch', 'Retro', 'Alpha', 'Beta', 'Hyper', 'Matrix', 'Sonic', 'Aero', 'Nova', 'Quantum'];
export const RANDOM_SUFFIXES = ['Knight', 'Racer', 'Runner', 'Gamer', 'Hacker', 'Architect', 'Wizard', 'Driver', 'Slayer', 'Spectre', 'Ghost', 'Zero', 'Shadow', 'Striker'];
