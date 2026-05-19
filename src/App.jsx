import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, Github, Linkedin, Mail, ArrowRight, Code, Layers, Smartphone, Box, Gamepad2, Compass, Globe, Moon, Sun, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Stage, PresentationControls } from '@react-three/drei';
import './index.css';
import './light-mode.css';
import './i18n';
const GameLibrary = lazy(() => import("./GameLibrary"));
import PresencePanel from './PresencePanel';
import { playClick, playHover, playSuccess, playArcadeOpen, setMutedState, getMutedState } from './soundEffects';

const PageProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="page-progress-bar"
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
        transformOrigin: '0%',
        zIndex: 10001,
        boxShadow: '0 0 10px var(--accent-cyan)'
      }}
    />
  );
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

const SkillCard = ({ icon, label, percent, delay, description }) => {
  return (
    <motion.div
      className="skill-card glass-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay / 2000 }} // Scale down delay
      whileHover={{ y: -5, scale: 1.02, boxShadow: '0 10px 30px rgba(0,240,255,0.1)' }}
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', willChange: 'transform, opacity' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: 'var(--text-main)', opacity: 0.8, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#fff' }}>{label}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{percent}% Proficiency</span>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0.5rem 0' }}>{description}</p>
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          className="skill-progress-bar-fill"
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))', borderRadius: '10px', position: 'relative' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 + (delay / 3000), ease: "easeOut" }}
        >
          <motion.div 
            style={{ 
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', 
              opacity: 0.8 
            }}
            animate={{ x: ['-200%', '400%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const MatrixBackground = ({ theme, isPaused, matrixRainMode }) => {
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

    const colorsDark = ['rgba(0, 240, 255, 0.15)', 'rgba(138, 43, 226, 0.15)'];
    const colorsLight = ['rgba(0, 150, 255, 0.1)', 'rgba(100, 43, 200, 0.1)'];
    const colorsMatrix = ['rgba(0, 255, 102, 0.4)', 'rgba(0, 255, 200, 0.2)'];

    // Set font once initially
    ctx.font = `${fontSize}px monospace`;

    let lastDrawTime = 0;
    const fps = matrixRainMode ? 20 : 12;
    const interval = 1000 / fps;
    let animationFrameId;

    const draw = (timestamp) => {
      if (timestamp - lastDrawTime < interval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      // Pause drawing if tab is hidden to save CPU
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      lastDrawTime = timestamp;

      ctx.fillStyle = theme === 'dark' ? 'rgba(5, 5, 8, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentPalette = matrixRainMode ? colorsMatrix : (theme === 'dark' ? colorsDark : colorsLight);

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];

        // Dynamic colors: Random choice between palette tones
        ctx.fillStyle = currentPalette[Math.random() > 0.5 ? 0 : 1];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-apply font style since canvas resize resets the context state
      ctx.font = `${fontSize}px monospace`;
      
      const newColumns = Math.floor(canvas.width / fontSize);
      while (drops.length < newColumns) {
        drops.push(1);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
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

// --- 3D Model Viewer Component ---
const Model = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};

const ThreeDViewer = ({ t }) => {
  const models = ["model.glb", "model2.glb", "model3.glb"];
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const containerRef = React.useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.05 }); // Start loading when at least 5% is in view

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const nextModel = () => setCurrentModelIndex((prev) => (prev + 1) % models.length);
  const prevModel = () => setCurrentModelIndex((prev) => (prev - 1 + models.length) % models.length);

  return (
    <motion.section
      ref={containerRef}
      id="3d-viewer"
      className="viewer-section glass-panel"
      style={{ maxWidth: '1200px', margin: '0 auto 5rem auto', borderRadius: '40px', padding: '3rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.2 }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title text-gradient"><ScrambleText text={t('viewer_title')} /></h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('viewer_subtitle')} ({currentModelIndex + 1}/{models.length})</p>
      </div>

      <div style={{ height: '500px', width: '100%', position: 'relative', zIndex: 1, borderRadius: '24px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Navigation Buttons */}
        <button onClick={prevModel} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-main)', backdropFilter: 'blur(10px)' }}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextModel} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-main)', backdropFilter: 'blur(10px)' }}>
          <ChevronRight size={24} />
        </button>

        {isVisible ? (
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>INITIALIZING 3D ENGINE...</div>}>
            <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 0, 4], fov: 45 }}>
              <color attach="background" args={['#050508']} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
              <pointLight position={[-10, -10, -10]} />
              
              <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                <Stage environment="city" intensity={0.6} contactShadow={false}>
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Model path={`${import.meta.env.BASE_URL}${models[currentModelIndex]}`} />
                  </Float>
                </Stage>
              </PresentationControls>
              
              <OrbitControls enableZoom={true} enablePan={false} makeDefault />
            </Canvas>
          </Suspense>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem', gap: '8px' }}>
            <Gamepad2 size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <span>3D ENGINE STANDBY</span>
          </div>
        )}
        
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {t('viewer_hint')}
        </div>
      </div>
    </motion.section>
  );
};

const ScrambleText = ({ text }) => {
  return <span>{text}</span>;
};

const CyberCursor = () => {
  return null;
};

const InteractiveTerminal = ({ isArcadeOpen, setIsArcadeOpen, activeArcadeGame, setActiveArcadeGame, isMuted, toggleMute, matrixRainMode, setMatrixRainMode, t }) => {
  const [history, setHistory] = useState([
    { type: 'log', text: 'SYSTEM ONLINE // v2.5' },
    { type: 'log', text: 'ESTABLISHING NEURAL GRID ENGINES... [OK]' },
    { type: 'success', text: 'ACCESS GRANTED. Welcome to sirac@iku shell.' },
    { type: 'log', text: 'Type "help" to list available system commands.' }
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = React.useRef(null);
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    
    const commandText = input.trim();
    if (!commandText) return;

    playClick();

    const parts = commandText.split(' ');
    const cmd = parts[0].toLowerCase();

    const newHistory = [...history, { type: 'input', text: `sirac@iku:~$ ${commandText}` }];

    switch (cmd) {
      case 'help':
        newHistory.push(
          { type: 'log', text: 'Available commands:' },
          { type: 'info', text: '  about      - Details about Siraç Göktuğ Şimşek' },
          { type: 'info', text: '  skills     - Load system skill tree parameters' },
          { type: 'info', text: '  projects   - Output compiled project archives' },
          { type: 'info', text: '  arcade     - Toggle live arcade interface module' },
          { type: 'info', text: '  sound      - Toggle synth volume state (mute/unmute)' },
          { type: 'info', text: '  matrix     - Toggle green matrix digital code rain mode' },
          { type: 'info', text: '  clear      - Purge screen buffer log' }
        );
        break;

      case 'about':
        newHistory.push(
          { type: 'success', text: 'CLASSIFIED IDENTITY: Siraç Göktuğ Şimşek' },
          { type: 'log', text: 'Role: Game Developer & UI Engineer' },
          { type: 'log', text: 'Bio: Crafting low-level custom renderers, safe memory systems (Rust/C++), and console-grade web/mobile interfaces.' },
          { type: 'log', text: 'Currently studying Digital Game Design at IKU.' }
        );
        break;

      case 'skills':
        newHistory.push(
          { type: 'success', text: 'SYSTEM CAPABILITIES LOG:' },
          { type: 'log', text: '  - Unity / C#          [|||||||||||||||||||] 95%' },
          { type: 'log', text: '  - SwiftUI / macOS     [||||||||||||||||  ] 82%' },
          { type: 'log', text: '  - Blender / 3D        [||||||||||||||||| ] 88%' },
          { type: 'log', text: '  - C++ / Engine Dev    [||||||||||||||||  ] 80%' },
          { type: 'log', text: '  - React / Web Apps    [|||||||||||||||   ] 75%' }
        );
        break;

      case 'projects':
        newHistory.push(
          { type: 'success', text: 'ARCHIVED PROJECTS SUMMARY:' },
          { type: 'info', text: '  1. FNAF 1 (Fan Port) - Interactive browser 2D engine' },
          { type: 'info', text: '  2. CS 1.6 Web - Tactical shooter simulator' },
          { type: 'info', text: '  3. Doom II - WebGL retro engine viewport integration' },
          { type: 'log', text: 'Scroll down to the "Archives" grid to deploy any module!' }
        );
        break;

      case 'arcade':
        setIsArcadeOpen(!isArcadeOpen);
        playArcadeOpen();
        newHistory.push({ type: 'success', text: `Arcade module state toggled: ${!isArcadeOpen ? 'ACTIVE' : 'STANDBY'}` });
        break;

      case 'sound':
        toggleMute();
        newHistory.push({ type: 'success', text: `Audio mute state: ${!isMuted ? 'MUTED' : 'UNMUTED'}` });
        break;

      case 'matrix':
        setMatrixRainMode(!matrixRainMode);
        playSuccess();
        newHistory.push({ type: 'success', text: `Matrix code rain theme: ${!matrixRainMode ? 'ACTIVE (NEON GREEN)' : 'STANDBY (CYAN VIOLET)'}` });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({ type: 'error', text: `Command not recognized: '${cmd}'. Type 'help' for options.` });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div 
      className="glass-panel code-terminal" 
      onClick={handleFocus}
      style={{
        width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid rgba(0, 240, 255, 0.15)', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 20px rgba(0, 240, 255, 0.1)',
        textAlign: 'left', background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(12px)',
        cursor: 'text', height: '360px', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 5px #ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 5px #ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 5px #27c93f' }} />
        </div>
        <div style={{ flex: 1, textTransform: 'uppercase', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sf)', letterSpacing: '1px' }}>
          sirac@iku: ~/shell
        </div>
      </div>

      <div style={{ padding: '20px', fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: '#e5e5e5', lineHeight: '1.6', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {history.map((line, index) => {
          let color = '#e5e5e5';
          if (line.type === 'input') color = '#79c0ff';
          else if (line.type === 'success') color = '#7ee787';
          else if (line.type === 'error') color = '#ff7b72';
          else if (line.type === 'info') color = 'var(--accent-cyan)';
          
          return (
            <div key={index} style={{ color, whiteSpace: 'pre-wrap' }}>
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-code)', fontSize: '0.85rem' }}>
        <span style={{ color: '#7ee787' }}>sirac@iku:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--accent-cyan)',
            flex: 1,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            caretColor: 'var(--accent-cyan)',
            textShadow: '0 0 5px var(--accent-cyan)'
          }}
          placeholder="..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
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
        }, Math.random() * 10 + 10); // Super fast typing
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setPhase(1), 300); // Short pause
        return () => clearTimeout(timeout);
      }
    } else if (phase === 1) {
      if (text.length > 0) {
        const timeout = setTimeout(() => {
          setText(text.slice(0, -3)); // Delete 3 chars at a time
        }, 5); // Lightning fast delete
        return () => clearTimeout(timeout);
      } else {
        setPhase(2);
      }
    }
  }, [text, phase]);

  if (phase === 2) {
    const words1 = (title1 || "").split(" ");
    const words2 = (title2 || "").split(" ");
    
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
      }
    };
    
    const item = {
      hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
      show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100 } }
    };

    return (
      <motion.h1
        className="hero-title"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {words1.map((word, i) => (
            <motion.span key={i} variants={item} className="text-gradient">
              {word}
            </motion.span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {words2.map((word, i) => (
            <motion.span key={i} variants={item} className="text-accent-gradient">
              {word}
            </motion.span>
          ))}
        </div>
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

// --- 3D Tilt Card Effect ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const flareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const flareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const background = useMotionTemplate`radial-gradient(circle at ${flareX} ${flareY}, rgba(0, 240, 255, 0.12) 0%, transparent 65%)`;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        position: "relative"
      }}
      className={className}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background,
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 5
        }}
      />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d", height: '100%', position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
};

// --- Magnetic Effect for Interactive Elements ---
const Magnetic = ({ children }) => {
  const ref = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('dark');
  const [showSecretGame, setShowSecretGame] = useState(false);

  // Mouse Tracking for Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Force scroll to top on refresh
  useEffect(() => {
    window.scrollTo(0, 0);
    // For some specialized browsers/mobile
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [activeArcadeGame, setActiveArcadeGame] = useState(null);
  const [isMuted, setIsMuted] = useState(getMutedState());
  const [matrixRainMode, setMatrixRainMode] = useState(false);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setMutedState(nextMute);
    if (!nextMute) {
      playClick();
    }
  };

  // Konami Code Easter Egg: ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 
      'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight', 
      'ArrowLeft', 'ArrowRight', 
      'b', 'a'
    ];
    let codeIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key === konamiCode[codeIndex] || e.key === konamiCode[codeIndex].toLowerCase()) {
        codeIndex++;
        if (codeIndex === konamiCode.length) {
          codeIndex = 0;
          if (!isMuted) {
            playArcadeOpen();
            setTimeout(() => {
              playSuccess();
            }, 300);
          }
          console.log('%c👾 CHEAT CODE ACTIVATED 👾', 'color: #00f0ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f0ff');
          setMatrixRainMode(prev => !prev);
          
          const banner = document.createElement('div');
          banner.style.position = 'fixed';
          banner.style.top = '15%';
          banner.style.left = '50%';
          banner.style.transform = 'translate(-50%, -50%)';
          banner.style.background = 'rgba(8, 8, 18, 0.95)';
          banner.style.border = '2px solid var(--accent-cyan)';
          banner.style.boxShadow = '0 0 30px var(--accent-cyan)';
          banner.style.padding = '20px 40px';
          banner.style.borderRadius = '12px';
          banner.style.zIndex = '999999';
          banner.style.fontFamily = 'monospace';
          banner.style.color = '#fff';
          banner.style.textAlign = 'center';
          banner.style.pointerEvents = 'none';
          banner.innerHTML = `
            <h1 style="color: var(--accent-cyan); margin: 0 0 10px 0; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px var(--accent-cyan)">CHEAT CODE DETECTED</h1>
            <p style="margin: 0; font-size: 14px; color: #7ee787">GRID SHADER OVERRIDE INITIATED</p>
          `;
          document.body.appendChild(banner);
          
          setTimeout(() => {
            banner.style.transition = 'opacity 1s';
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 1000);
          }, 3000);
        }
      } else {
        codeIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted]);

  // Global sound event delegation (hover & click)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest('a, button, [role="button"], .project-card, .game-card');
      if (target) {
        if ((target.innerText && target.innerText.toLowerCase().includes('arcade')) || target.closest('#featured-modules')) {
          playArcadeOpen();
        } else {
          playClick();
        }
      }
    };

    const handleGlobalHover = (e) => {
      const target = e.target.closest('a, button, [role="button"], .project-card, .game-card');
      if (target) {
        playHover();
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('mouseover', handleGlobalHover);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('mouseover', handleGlobalHover);
    };
  }, []);

  // Konami Code Logic
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowSecretGame(true);
          playSuccess();
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

  // Mouse-driven transforms
  const terminalX = useTransform(springX, [0, 1920], [-15, 15]);
  const terminalY = useTransform(springY, [0, 1080], [-15, 15]);
  const bgIconX = useTransform(springX, [0, 1920], [20, -20]);
  const bgIconY = useTransform(springY, [0, 1080], [20, -20]);

  return (
    <>
    <AnimatePresence mode="wait">
      {showSecretGame && <KonamiGame onClose={() => setShowSecretGame(false)} />}

      <PageProgress />
      <div className={`app-container ${theme}-mode`}>
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <CyberCursor />
          <MatrixBackground theme={theme} isPaused={isArcadeOpen} matrixRainMode={matrixRainMode} />
          <div className="cyber-bg">
            <div className="cyber-bg-blob-3"></div>
            <div className="cyber-bg-blob-4"></div>
            {/* Parallax Floating Icons */}
              <motion.div style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.15, color: 'var(--accent-cyan)', y: parallax1, x: bgIconX, willChange: 'transform' }}>
                <Code size={60} />
              </motion.div>
              <motion.div style={{ position: 'absolute', top: '45%', right: '10%', opacity: 0.15, color: 'var(--accent-violet)', y: parallax2, x: bgIconY, willChange: 'transform' }}>
                <Layers size={80} />
              </motion.div>
              <motion.div style={{ position: 'absolute', top: '75%', left: '15%', opacity: 0.15, color: 'var(--accent-cyan)', y: parallax3, x: bgIconX, willChange: 'transform' }}>
                <Box size={70} />
              </motion.div>
          </div>



          {/* Navigation */}
          <nav className="glass-panel">
            <div className="nav-logo">
              <h1 className="text-gradient">{t('nav_name') || 'SIRAÇ GÖKTUĞ ŞİMŞEK.'}</h1>
            </div>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
              <Magnetic><a href="#about">{t('nav_about') || 'About'}</a></Magnetic>
              <Magnetic><a href="#timeline">{t('nav_timeline') || 'Timeline'}</a></Magnetic>
              <Magnetic><a href="#projects">{t('nav_work')}</a></Magnetic>
              <Magnetic><a href="#skills">{t('nav_skills')}</a></Magnetic>
              <Magnetic><a href="#contact">{t('nav_contact')}</a></Magnetic>
              
              <Magnetic>
                <button
                  onClick={() => setIsArcadeOpen(true)}
                  className="btn btn-outline glass-panel desktop-only"
                  style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}
                >
                  <Gamepad2 size={18} /> {t('arcade_button') || 'Arcade'}
                </button>
              </Magnetic>

              <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
                <Globe size={16} style={{ color: 'var(--text-muted)' }} />
                <motion.button whileHover={{ scale: 1.1, color: "var(--accent-cyan)" }} whileTap={{ scale: 0.9 }} onClick={() => changeLanguage('en')} style={{ background: 'transparent', border: 'none', color: i18n.language?.startsWith('en') ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, padding: '0.2rem' }}>EN</motion.button>
                <span style={{ color: 'var(--border-glass)' }}>|</span>
                <motion.button whileHover={{ scale: 1.1, color: "var(--accent-cyan)" }} whileTap={{ scale: 0.9 }} onClick={() => changeLanguage('tr')} style={{ background: 'transparent', border: 'none', color: i18n.language?.startsWith('tr') ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, padding: '0.2rem' }}>TR</motion.button>
              </div>

              <Magnetic>
                <motion.button
                  onClick={toggleMute}
                  style={{ marginLeft: '0.5rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: isMuted ? 'var(--text-muted)' : 'var(--accent-cyan)' }}
                  whileHover={{ scale: 1.1, boxShadow: isMuted ? 'none' : '0 0 10px var(--accent-cyan)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </motion.button>
              </Magnetic>

              <Magnetic>
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
              </Magnetic>
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
              style={{ x: terminalX, y: terminalY }}
            >
              <InteractiveTerminal 
                isArcadeOpen={isArcadeOpen}
                setIsArcadeOpen={setIsArcadeOpen}
                activeArcadeGame={activeArcadeGame}
                setActiveArcadeGame={setActiveArcadeGame}
                isMuted={isMuted}
                toggleMute={toggleMute}
                matrixRainMode={matrixRainMode}
                setMatrixRainMode={setMatrixRainMode}
                t={t}
              />
            </motion.div>
          </section>

          {/* About Section */}
          <motion.section
            id="about"
            className="about-section glass-panel"
            style={{ maxWidth: '1200px', margin: '0 auto 5rem auto', borderRadius: '40px', padding: '4rem 5%', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Background flourish inside About */}
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle at center, rgba(var(--accent-violet-rgb), 0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
            
            <div style={{ flex: '1 1 400px', position: 'relative', zIndex: 1 }}>
              <div className="section-header" style={{ alignItems: 'flex-start', textAlign: 'left', marginBottom: '2rem' }}>
                <h2 className="section-title text-gradient" style={{ letterSpacing: '-0.02em' }}><ScrambleText text={t('about_title')} /></h2>
                <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>{t('about_subtitle')}</p>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '1.5rem', fontWeight: 500 }}>
                {t('about_text_1')}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {t('about_text_2')}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                {t('about_text_3')}
              </p>
            </div>
            
            <div style={{ flex: '1 1 350px', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', position: 'relative', zIndex: 1 }}>
              {[1, 2, 3, 4].map((num) => (
                <motion.div 
                  key={num} 
                  className="glass-panel" 
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)' }}
                  style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', transition: 'border-color 0.3s' }}
                >
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.8rem' }}>{t(`about_stat_${num}`)}</div>
                  <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>{t(`about_stat_${num}_val`)}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Timeline Section */}
          <section id="timeline" style={{ padding: '0 5% 5rem', position: 'relative' }}>
            <div className="section-header">
              <h2 className="section-title text-gradient"><ScrambleText text={t('timeline_title')} /></h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('timeline_subtitle')}</p>
            </div>
            
            <div className="timeline-container" style={{ maxWidth: '900px', margin: '3rem auto 0', position: 'relative' }}>
              {/* Central Pipe */}
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, var(--accent-cyan), var(--accent-violet), transparent)', opacity: 0.3 }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {[1, 2, 3, 4].map((num) => (
                  <motion.div 
                    key={num}
                    initial={{ opacity: 0, x: num % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: num * 0.1 }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: num % 2 === 0 ? 'flex-start' : 'flex-end',
                      flexDirection: num % 2 === 0 ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      width: '100%',
                      position: 'relative'
                    }}
                  >
                    {/* Node Dot */}
                    <div style={{ 
                      position: 'absolute', left: '50%', transform: 'translateX(-50%)', 
                      width: '16px', height: '16px', borderRadius: '50%', 
                      background: num > 2 ? 'var(--accent-violet)' : 'var(--accent-cyan)',
                      boxShadow: `0 0 15px ${num > 2 ? 'var(--accent-violet)' : 'var(--accent-cyan)'}`,
                      zIndex: 2,
                      border: '4px solid #050508'
                    }} />

                    {/* Content Card */}
                    <div className="glass-panel" style={{ 
                      width: '42%', 
                      padding: '1.5rem', 
                      borderRadius: '24px', 
                      background: 'rgba(255,255,255,0.02)',
                      textAlign: num % 2 === 0 ? 'left' : 'right',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: num > 2 ? 'var(--accent-violet)' : 'var(--accent-cyan)',
                        background: num > 2 ? 'rgba(140, 60, 230, 0.1)' : 'rgba(0, 212, 255, 0.1)',
                        border: num > 2 ? '1px solid rgba(140, 60, 230, 0.2)' : '1px solid rgba(0, 212, 255, 0.2)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        letterSpacing: '1px'
                      }}>
                        {t(`timeline_event_${num}_year`)}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>
                        {t(`timeline_event_${num}_title`)}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                        {t(`timeline_event_${num}_desc`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Modules Section - To prove content depth to admins */}
          <section id="featured-modules" style={{ padding: '5rem 5%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div className="section-header">
              <h2 className="section-title text-gradient"><ScrambleText text={t('featured_title')} /></h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('featured_subtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {[
                { name: 'FNAF 1 (Fan Port)', desc: 'Full interactive 2D engine map for browser.', icon: <Gamepad2 size={32} /> },
                { name: 'CS 1.6 Web', desc: 'Real-time tactical simulator in JS.', icon: <Terminal size={32} /> },
                { name: 'Subway Surfers', desc: 'Infinite runner module with high-res assets.', icon: <Smartphone size={32} /> },
                { name: 'Mario 64', desc: 'Native WebGL N64 simulation layer.', icon: <Box size={32} /> },
                { name: 'Doom II', desc: 'Full retro FPS engine integration.', icon: <Terminal size={32} /> },
                { name: 'GTA Vice City', desc: 'Full 3D retro environment simulation.', icon: <Layers size={32} /> }
              ].map((game, i) => (
                <motion.div
                  key={i}
                  className="glass-panel"
                  whileHover={{ scale: 1.05, y: -10, boxShadow: '0 20px 40px rgba(0,240,255,0.2)' }}
                  onClick={() => setIsArcadeOpen(true)}
                  style={{ padding: '2rem', borderRadius: '24px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}
                >
                  <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{game.icon}</div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{game.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{game.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Projects Timeline (Gallery) */}
          <section id="projects" className="gallery-section">
            <div className="section-header">
              <h2 className="section-title text-gradient"><ScrambleText text={t('archives_title')} /></h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('archives_subtitle')}</p>
            </div>
            <motion.div 
              className="masonry-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {projects.map((project, idx) => (
                <TiltCard key={project.id} className={`project-card glass-panel ${project.glow}`}>
                  <motion.div
                    onClick={() => window.open(project.link, '_blank')}
                    style={{ padding: 0, willChange: 'transform, opacity' }}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { type: 'tween', ease: "easeOut", duration: 0.4 } }
                    }}
                  >
                    {project.image && (
                      <div style={{ height: '180px', overflow: 'hidden', borderBottom: '1px solid var(--border-glass)', borderRadius: '20px 20px 0 0' }}>
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
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
                </TiltCard>
              ))}
            </motion.div>
          </section>

          {/* Arcade Section */}
          <section id="arcade" className="desktop-only" style={{ padding: '0 5% 5rem', textAlign: 'center' }}>
            <div className="section-header">
              <h2 className="section-title text-gradient"><ScrambleText text={t('arcade_section_title') || 'ARCADE UNIVERSE'} /></h2>
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
            style={{ margin: '0 5%', borderRadius: '40px', willChange: 'transform, opacity' }}
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="section-header">
              <h2 className="section-title text-gradient"><ScrambleText text={t('skills_title')} /></h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('skills_subtitle')}</p>
            </div>
            <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              <SkillCard icon={<UnityIcon />} label="Unity / C#" percent={95} delay={100} description={t('skill_unity_desc')} />
              <SkillCard icon={<SwiftIcon />} label="SwiftUI / macOS" percent={82} delay={300} description={t('skill_swift_desc')} />
              <SkillCard icon={<BlenderIcon />} label="Blender / 3D" percent={88} delay={500} description={t('skill_blender_desc')} />
              <SkillCard icon={<Terminal size={32} />} label="System Architecture" percent={80} delay={700} description={t('skill_sys_desc')} />
            </div>
          </motion.section>

          {/* System Telemetry Section [NEW] - Professionalism Boost */}
          <section id="telemetry" style={{ padding: '4rem 5%', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '1200px', padding: '2.5rem', borderRadius: '30px', display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-around', alignItems: 'center', border: '1px solid rgba(0,240,255,0.1)', background: 'rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)' }} />
              {[
                { label: t('stats_games'), val: "50+", icon: <Gamepad2 size={24} /> },
                { label: t('stats_lines'), val: "15K+", icon: <Code size={24} /> },
                { label: t('stats_users'), val: "SYNC.", icon: <Globe size={24} /> },
                { label: t('stats_uptime'), val: "100%", icon: <Terminal size={24} /> }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <ThreeDViewer t={t} />

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
              </div>
            </motion.div>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border-glass)', paddingTop: '2rem', marginTop: '2rem' }}>
              &copy; {new Date().getFullYear()} {t('footer_copyright')}
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
    <PresencePanel />
    </>
  );
}

export default App;
