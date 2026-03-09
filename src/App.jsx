import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, Github, Linkedin, Mail, ArrowRight, Code, Layers, Smartphone, Box, Gamepad2, Compass, Globe, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './index.css';
import './light-mode.css';
import './i18n';
const GameLibrary = lazy(() => import("./GameLibrary"));
import CompanionDrone from './CompanionDrone';

// --- Web Audio Synthesizer (Zero Dependencies) ---
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playClickSound = () => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { }
};

const playHoverSound = () => {
  try {
    const ctx = initAudio();
    if (ctx.state !== 'running') return; // Needs interaction first
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { }
};

// SVG Icons for Skills
const UnityIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L22 7.8L12 13.6L2 7.8L12 2Z" />
    <path d="M22 7.8V16.2L12 22V13.6" />
    <path d="M2 7.8V16.2L12 22" />
  </svg>
);

const SwiftIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 3C15 5 13 8 10 9C7 10 4 9 3 7C5.5 6 9 3 14.5 3Z" />
    <path d="M12 9C12 13 14 18 20 20C17 21.5 13 21.5 9.5 19.5C6 17.5 4 14.5 4 11" />
  </svg>
);

const BlenderIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8L15 2" />
    <path d="M8 12L2 15" />
    <path d="M12 16L15 22" />
    <path d="M16 12L22 15" />
  </svg>
);

const SkillRing = ({ icon, label, percent, delay }) => {
  const [offset, setOffset] = useState(440);

  useEffect(() => {
    const timer = setTimeout(() => {
      const targetOffset = 440 - (440 * percent) / 100;
      setOffset(targetOffset);
    }, delay);
    return () => clearTimeout(timer);
  }, [percent, delay]);

  return (
    <div className="skill-ring">
      <svg className="progress-ring" viewBox="0 0 150 150">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#8a2be2" />
          </linearGradient>
        </defs>
        <circle className="bg" cx="75" cy="75" r="70" />
        <circle className="fg" cx="75" cy="75" r="70" style={{ strokeDashoffset: offset, stroke: `url(#gradient-${label})` }} />
      </svg>
      <div className="skill-icon">{icon}</div>
      <div className="skill-label text-gradient">{label}</div>
    </div>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Wait a bit before hiding after 100%
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="loading-content">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{ marginBottom: '2rem', color: 'var(--accent-cyan)' }}
        >
          <Box size={50} />
        </motion.div>

        <div className="loading-bar-container">
          <motion.div
            className="loading-bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="loading-text" style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
          SYSTEM INITIALIZING... {Math.min(progress, 100)}%
        </div>
      </div>
    </motion.div>
  );
};

const MatrixBackground = ({ theme, isPaused }) => {
  useEffect(() => {
    if (isPaused) return;
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=<>?/\\';
    characters = characters.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Create trailing fade effect based on theme
      const fadeColor = theme === 'dark' ? 'rgba(10, 10, 12, 0.05)' : 'rgba(240, 240, 245, 0.1)';
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];

        // Dynamic colors: Random choice between cyan and violet tones
        const isCyan = Math.random() > 0.5;
        const color = theme === 'dark'
          ? (isCyan ? 'rgba(0, 240, 255, 0.15)' : 'rgba(138, 43, 226, 0.15)')
          : (isCyan ? 'rgba(0, 150, 255, 0.1)' : 'rgba(100, 43, 200, 0.1)');

        ctx.fillStyle = color;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40); // Slightly slower for CPU efficiency (25fps is enough)

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isPaused]);

  // Styling matrix to sit completely behind everything with no pointer events
  return (
    <canvas
      id="matrix-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -5,
        pointerEvents: 'none'
      }}
    />
  );
};

const TypewriterTitle = ({ title1, title2 }) => {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState(0); // 0: typing, 1: erasing, 2: final
  const codeString = "public class GameDev {\n  string title = \"ARCHITECT\";\n}";

  useEffect(() => {
    if (phase === 0) {
      if (text.length < codeString.length) {
        const timeout = setTimeout(() => {
          setText(codeString.slice(0, text.length + 1));
        }, Math.random() * 40 + 20); // random typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setPhase(1), 1000); // pause reading
        return () => clearTimeout(timeout);
      }
    } else if (phase === 1) {
      if (text.length > 0) {
        const timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 15); // delete speed
        return () => clearTimeout(timeout);
      } else {
        setPhase(2);
      }
    }
  }, [text, phase]);

  if (phase === 2) {
    return (
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <span className="text-gradient">{title1}</span><br />
        <span className="text-accent-gradient">{title2}</span>
      </motion.h1>
    );
  }

  return (
    <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center' }}>
      <h1 style={{ fontFamily: 'monospace', fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', textAlign: 'left', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap', lineHeight: '1.4', margin: 0 }}>
        {text}<span className="cursor-blink">|</span>
      </h1>
    </div>
  );
};

// --- Retro Snake Minigame (Konami Easter Egg) ---
const KonamiGame = ({ onClose }) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [dir, setDir] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp': if (dir[1] === 0) setDir([0, -1]); break;
        case 'ArrowDown': if (dir[1] === 0) setDir([0, 1]); break;
        case 'ArrowLeft': if (dir[0] === 0) setDir([-1, 0]); break;
        case 'ArrowRight': if (dir[0] === 0) setDir([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(s => {
        const h = s[0];
        const newH = [h[0] + dir[0], h[1] + dir[1]];
        // Wall collision
        if (newH[0] < 0 || newH[0] >= 30 || newH[1] < 0 || newH[1] >= 30) {
          setGameOver(true); return s;
        }
        // Self collision
        if (s.some(seg => seg[0] === newH[0] && seg[1] === newH[1])) {
          setGameOver(true); return s;
        }
        const newSnake = [newH, ...s];
        // Food check
        if (newH[0] === food[0] && newH[1] === food[1]) {
          setScore(sc => sc + 10);
          setFood([Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [dir, food, gameOver]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#0f0', fontFamily: 'monospace', textShadow: '0 0 10px #0f0' }}>NEON SNAKE</h1>
      <p style={{ color: '#0f0', fontFamily: 'monospace' }}>SCORE: {score}</p>
      <div style={{ width: '300px', height: '300px', border: '2px solid #0f0', position: 'relative', boxShadow: '0 0 20px #0f0' }}>
        {snake.map((seg, i) => (
          <div key={i} style={{ position: 'absolute', left: `${seg[0] * 10}px`, top: `${seg[1] * 10}px`, width: '10px', height: '10px', background: i === 0 ? '#fff' : '#0f0', boxShadow: '0 0 5px #0f0' }} />
        ))}
        <div style={{ position: 'absolute', left: `${food[0] * 10}px`, top: `${food[1] * 10}px`, width: '10px', height: '10px', background: '#f0f', boxShadow: '0 0 10px #f0f' }} />
      </div>
      {gameOver && <h2 style={{ color: 'red', fontFamily: 'monospace', marginTop: '1rem' }}>GAME OVER</h2>}
      <button onClick={onClose} style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #0f0', color: '#0f0', fontFamily: 'monospace', cursor: 'pointer' }}>EXIT SIMULATION</button>
    </div>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('dark');
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [showSecretGame, setShowSecretGame] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [activeArcadeGame, setActiveArcadeGame] = useState(null);

  // Konami Code Logic
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowSecretGame(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);





  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const projects = [
    {
      id: 1,
      title: t('games.m_title'),
      desc: t('games.m_desc'),
      tags: ['Unity', 'C#', 'Game Design', 'Itch.io'],
      glow: 'glow-violet',
      link: 'https://unitybtw.itch.io/legend-of-the-three-masks',
      image: `${import.meta.env.BASE_URL}assets/masks.jpeg`
    },
    {
      id: 2,
      title: 'Flying Bird',
      desc: t('games.fb_desc'),
      tags: ['Unity', 'C#', '2D', 'Casual'],
      glow: 'glow-cyan',
      link: 'https://unitybtw.itch.io/flying-bird',
      image: `${import.meta.env.BASE_URL}assets/bird.png`
    }
  ];



  const { scrollY } = useScroll();
  const parallax1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const parallax2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const parallax3 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <AnimatePresence mode="wait">
      {showSecretGame && <KonamiGame onClose={() => setShowSecretGame(false)} />}




      {!isAppLoaded ? (
        <LoadingScreen key="loading" onComplete={() => setIsAppLoaded(true)} />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <MatrixBackground theme={theme} isPaused={isArcadeOpen} />
          <div className="cyber-bg">
            {/* Parallax Floating Icons */}
            <motion.div style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.15, color: 'var(--accent-cyan)', y: parallax1 }}>
              <Code size={60} />
            </motion.div>
            <motion.div style={{ position: 'absolute', top: '45%', right: '10%', opacity: 0.15, color: 'var(--accent-violet)', y: parallax2 }}>
              <Layers size={80} />
            </motion.div>
            <motion.div style={{ position: 'absolute', top: '75%', left: '15%', opacity: 0.15, color: 'var(--accent-cyan)', y: parallax3 }}>
              <Box size={70} />
            </motion.div>
          </div>



          {/* Navigation */}
          <nav className="glass-panel">
            <div className="nav-logo">
              <h1 className="text-gradient">{t('nav_name') || 'SIRAÇ GÖKTUĞ ŞİMŞEK.'}</h1>
            </div>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
              <a href="#projects">{t('nav_work')}</a>
              <a href="#skills">{t('nav_skills')}</a>
              <a href="#arcade" className="desktop-only">{t('nav_arcade') || 'Arcade'}</a>
              <a href="#contact">{t('nav_contact')}</a>
              <button
                onClick={() => setIsArcadeOpen(true)}
                className="btn btn-outline glass-panel desktop-only"
                style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}
              >
                <Gamepad2 size={18} /> {t('arcade_button') || 'Arcade'}
              </button>

              <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
                <Globe size={16} style={{ color: 'var(--text-muted)' }} />
                <motion.button whileHover={{ scale: 1.1, color: "var(--accent-cyan)" }} whileTap={{ scale: 0.9 }} onClick={() => changeLanguage('en')} style={{ background: 'transparent', border: 'none', color: i18n.language === 'en' ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, padding: '0.2rem' }}>EN</motion.button>
                <span style={{ color: 'var(--border-glass)' }}>|</span>
                <motion.button whileHover={{ scale: 1.1, color: "var(--accent-cyan)" }} whileTap={{ scale: 0.9 }} onClick={() => changeLanguage('tr')} style={{ background: 'transparent', border: 'none', color: i18n.language === 'tr' ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, padding: '0.2rem' }}>TR</motion.button>
              </div>

              <motion.button
                onClick={toggleTheme}
                style={{ marginLeft: '0.5rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-main)', position: 'relative', overflow: 'hidden' }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 10px var(--accent-cyan)' }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div
                      key="moon"
                      initial={{ y: -30, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: 30, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute' }}
                    >
                      <Moon size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ y: -30, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: 30, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute' }}
                    >
                      <Sun size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="hero">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="glass-panel" style={{ display: 'inline-block', padding: '0.5rem 1rem', marginBottom: '1.5rem', borderRadius: '30px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px', color: 'var(--accent-cyan)' }}>
                  {t('badge_hire')}
                </span>
              </div>
              <TypewriterTitle title1={t('hero_title_1')} title2={t('hero_title_2')} />
              <p className="hero-subtitle">
                {t('hero_subtitle_1')}<br /> {t('hero_subtitle_2')}
              </p>
              <div className="hero-cta">
                <a href="#projects" className="btn btn-primary glass-panel">
                  {t('btn_explore')} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </a>
                <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" className="btn btn-outline glass-panel">
                  <Github size={18} style={{ marginRight: '8px' }} /> {t('btn_repos')}
                </a>
                <a href="https://unitybtw.itch.io/" target="_blank" rel="noopener noreferrer" className="btn btn-outline glass-panel" style={{ color: 'var(--accent-cyan)' }}>
                  <Gamepad2 size={18} style={{ marginRight: '8px' }} /> Itch.io
                </a>
              </div>
            </motion.div>
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <div className="glass-panel code-terminal" style={{
                width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                textAlign: 'left', background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(40px)'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sf)', letterSpacing: '1px' }}>
                    sirac@iku: ~/portfolio
                  </div>
                </div>
                <div style={{ padding: '24px', fontFamily: '"Fira Code", monospace, SFMono-Regular', fontSize: '0.9rem', color: '#e5e5e5', lineHeight: '1.7' }}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <span style={{ color: '#ff7b72' }}>const</span> <span style={{ color: '#79c0ff' }}>developer</span> <span style={{ color: '#ff7b72' }}>=</span> {'{'}
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} style={{ paddingLeft: '24px' }}>
                    <span style={{ color: '#d2a8ff' }}>name</span>: <span style={{ color: '#a5d6ff' }}>'Siraç Göktuğ Şimşek'</span>,
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }} style={{ paddingLeft: '24px' }}>
                    <span style={{ color: '#d2a8ff' }}>role</span>: <span style={{ color: '#a5d6ff' }}>'Game Developer & UI Engineer'</span>,
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} style={{ paddingLeft: '24px' }}>
                    <span style={{ color: '#d2a8ff' }}>skills</span>: [<span style={{ color: '#a5d6ff' }}>'Unity'</span>, <span style={{ color: '#a5d6ff' }}>'C#'</span>, <span style={{ color: '#a5d6ff' }}>'SwiftUI'</span>, <span style={{ color: '#a5d6ff' }}>'React'</span>],
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.0 }} style={{ paddingLeft: '24px' }}>
                    <span style={{ color: '#d2a8ff' }}>passion</span>: <span style={{ color: '#a5d6ff' }}>'Building Digital Realities'</span>,
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.5 }} style={{ paddingLeft: '24px' }}>
                    <span style={{ color: '#d2a8ff' }}>status</span>: <span style={{ color: '#7ee787' }}>'Compiling the future...'</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.0 }}>
                    {'}'};
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }} style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#7ee787', marginRight: '8px' }}>➜</span>
                    <span style={{ color: '#79c0ff', marginRight: '8px' }}>~</span>
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: '10px', height: '18px', background: '#e5e5e5', display: 'inline-block' }} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Projects Timeline (Gallery) */}
          <section id="projects" className="gallery-section">
            <div className="section-header">
              <h2 className="section-title text-gradient">{t('archives_title')}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('archives_subtitle')}</p>
            </div>
            <div className="masonry-grid">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  className={`project-card glass-panel ${project.glow}`}
                  onClick={() => window.open(project.link, '_blank')}
                  style={{ padding: 0 }}
                  initial={{ opacity: 0, y: 80, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -15, scale: 1.03, boxShadow: '0 20px 40px rgba(0, 240, 255, 0.2)' }}
                >
                  {project.image && (
                    <div style={{ height: '180px', overflow: 'hidden', borderBottom: '1px solid var(--border-glass)' }}>
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="project-tags">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div className="project-info">
                      <h3 className="project-title text-gradient">{project.title}</h3>
                      <p className="project-desc">{project.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Arcade Section */}
          <section id="arcade" className="desktop-only" style={{ padding: '0 5% 5rem', textAlign: 'center' }}>
            <div className="section-header">
              <h2 className="section-title text-gradient">{t('arcade_section_title') || 'ARCADE UNIVERSE'}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('arcade_section_subtitle')}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Suspense fallback={<div className="glass-panel" style={{ padding: '1rem 3rem', color: 'var(--accent-cyan)' }}>INITIALIZING ARCADE...</div>}>
                <GameLibrary
                  isOpen={isArcadeOpen}
                  setIsOpen={setIsArcadeOpen}
                  activeGameId={activeArcadeGame}
                  setActiveGameId={setActiveArcadeGame}
                />
              </Suspense>
            </div>
          </section>

          {/* Tech Stack & Skills */}
          <motion.section
            id="skills"
            className="skills-section glass-panel"
            style={{ margin: '0 5%', borderRadius: '40px' }}
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <div className="section-header">
              <h2 className="section-title text-gradient">{t('skills_title')}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('skills_subtitle')}</p>
            </div>

            <div className="skills-container">
              <SkillRing icon={<UnityIcon />} label="Unity & C#" percent={90} delay={500} />
              <SkillRing icon={<SwiftIcon />} label="SwiftUI / ARKit" percent={75} delay={700} />
              <SkillRing icon={<BlenderIcon />} label="Blender 3D" percent={85} delay={900} />
              <SkillRing icon={<Terminal size={40} />} label={t('skill_sys')} percent={80} delay={1100} />
            </div>
          </motion.section>

          {/* Interactive Footer */}
          <footer id="contact" className="footer">
            <div className="glass-panel status-bar">
              <div className="status-level">
                <div className="pulsing-dot"></div>
                {t('status_level')}
              </div>
              <div className="status-quest">
                <Compass size={18} />
                <span>{t('status_quest')}</span>
              </div>
            </div>

            <motion.div
              style={{ textAlign: 'center', marginBottom: '3rem' }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('footer_title')}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('footer_subtitle')}</p>

              <div className="footer-contact">
                <div className="contact-btn-wrapper">
                  <a href="mailto:sgoktug34@gmail.com" className="btn btn-primary glass-panel" style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>
                    <Mail size={20} style={{ marginRight: '10px' }} /> {t('btn_transmit')}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><Github size={24} /></a>
                <a href="https://unitybtw.itch.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><Gamepad2 size={24} /></a>
                <a href="#" style={{ color: 'var(--text-muted)' }}><Linkedin size={24} /></a>
              </div>
            </motion.div>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border-glass)', paddingTop: '2rem', marginTop: '2rem' }}>
              &copy; {new Date().getFullYear()} {t('footer_copyright')}
            </div>
          </footer>
          {/* Interactive Companion Drone */}
          <div className="desktop-only">
            <CompanionDrone activeGameId={activeArcadeGame} isArcadeOpen={isArcadeOpen} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
