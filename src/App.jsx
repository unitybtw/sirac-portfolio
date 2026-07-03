import React, { useEffect, useState, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';
import { Terminal, Github, Linkedin, Mail, ArrowRight, Code, Layers, Smartphone, Box, Gamepad2, Compass, Globe, Moon, Sun, ChevronLeft, ChevronRight, ChevronUp, Volume2, VolumeX, ChevronDown, FileText, X, Download, Briefcase, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import './index.css';
import './light-mode.css';
import './i18n';
import { LINKEDIN_URL } from './i18n';
const GameLibrary = lazy(() => import("./GameLibrary"));
const ThreeDViewer = lazy(() => import("./ThreeDViewer"));
import PresencePanel from './PresencePanel';
import { gamesList } from './gamesData';
import { playClick, playHover, playSuccess, playArcadeOpen, setMutedState, getMutedState } from './soundEffects';

// Disable browser layout scroll restoration on reload
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

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
        height: '3px',
        background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
        boxShadow: '0 0 8px rgba(115, 218, 202, 0.4), 0 0 15px rgba(187, 154, 243, 0.2)',
        transformOrigin: '0%',
        zIndex: 10001,
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
    <TiltCard
      className="skill-card glass-panel"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1, delay: delay / 2000 }} // Scale down delay
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', borderRadius: '0', border: '1px solid var(--border-glass)', backdropFilter: 'none', WebkitBackdropFilter: 'none', background: 'rgba(255, 255, 255, 0.02)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="skill-icon-container" style={{ color: 'var(--text-main)', opacity: 0.8, background: 'var(--bg-glass)', padding: '10px', borderRadius: '0', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
           <span style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)' }}>{label}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{percent}% Proficiency</span>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0.5rem 0' }}>{description}</p>
      <div style={{ width: '100%', height: '6px', background: 'var(--border-glass)', borderRadius: '0', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          className="skill-progress-bar-fill"
          style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))', borderRadius: '0', position: 'relative', transformOrigin: 'left', }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: percent / 100 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.2 + (delay / 3000) }}
        >
          <motion.div 
            style={{ 
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', 
              opacity: 0.8,
              }}
            animate={{ x: ['-200%', '400%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          />
        </motion.div>
      </div>
    </TiltCard>
  );
};

const MatrixBackground = ({ theme, isPaused, matrixRainMode }) => {
  useEffect(() => {
    if (isPaused) return;
    if (window.innerWidth <= 768) {
      const canvas = document.getElementById('matrix-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
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

    const colorsDark = ['rgba(96, 165, 250, 0.04)', 'rgba(192, 132, 252, 0.02)'];
    const colorsLight = ['rgba(37, 99, 235, 0.03)', 'rgba(124, 58, 237, 0.015)'];
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

      ctx.fillStyle = theme === 'dark' ? 'rgba(10, 12, 16, 0.1)' : 'rgba(248, 250, 252, 0.1)';
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
  }, [theme, isPaused, matrixRainMode]);

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



// ThreeDViewer is now imported lazily from ThreeDViewer.jsx

// ─── CV Modal ───────────────────────────────────────────────────────────────
const CVModal = ({ isOpen, onClose, t, theme }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handlePrint = () => window.print();

  const skills = [
    { label: 'Unity / C#',      pct: 95, color: 'var(--accent-cyan)' },
    { label: 'SwiftUI / macOS', pct: 82, color: 'var(--accent-violet)' },
    { label: 'Blender / 3D',    pct: 88, color: 'var(--accent-cyan)' },
    { label: 'React / Web',     pct: 75, color: 'var(--accent-violet)' },
    { label: 'C++ / Engine',    pct: 80, color: 'var(--accent-pink)' },
    { label: 'Firebase / DB',   pct: 72, color: 'var(--accent-pink)' },
  ];

  const experience = [
    { period: '2021 – Present', title: 'Freelance Unity Developer', desc: 'Advanced game mechanics, shaders, physics in Unity/C#. Multiple titles published on itch.io.' },
    { period: '2022 – Present', title: 'macOS Utility Developer', desc: 'Native macOS utilities using SwiftUI & Combine. Premium glassmorphism UI focus.' },
    { period: '2024 – Present', title: 'React & UI Architect',    desc: 'Modular React frontends, WebGL integrations, Tokyo Night–inspired design systems.' },
  ];

  const projects = [
    { name: 'Legend of the Three Masks', stack: 'Unity · C# · 3D',       link: 'https://unitybtw.itch.io/legend-of-the-three-masks' },
    { name: 'Flying Bird',               stack: 'Unity · C# · 2D',       link: 'https://unitybtw.itch.io/flying-bird' },
    { name: 'Cyber Arcade Platform',     stack: 'React · Canvas · WebGL', link: 'https://unitybtw.github.io/sirac-portfolio/' },
    { name: 'macOS Glassmorphic Tools',  stack: 'SwiftUI · Combine',      link: 'https://github.com/unitybtw' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(5,5,12,0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '820px', maxHeight: '90vh',
              overflowY: 'auto',
              background: theme === 'dark' ? 'rgba(15,17,26,0.97)' : 'rgba(248,250,252,0.97)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '0',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-sf)',
              position: 'relative',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent',
            }}
            className="cv-modal-scroll"
          >
            {/* Accent top bar */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink))', borderRadius: '28px 28px 0 0' }} />

            {/* Header */}
            <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-display)' }}>
                  Siraç Göktuğ Şimşek
                </h2>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '1px' }}>
                  Game Developer · UI Engineer · Unity / SwiftUI / React
                </p>
                <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                  {[
                    { icon: <Mail size={13}/>,     label: 'sgoktug34@gmail.com',               href: 'mailto:sgoktug34@gmail.com' },
                    { icon: <Github size={13}/>,   label: 'github.com/unitybtw',               href: 'https://github.com/unitybtw' },
                    { icon: <Linkedin size={13}/>, label: 'linkedin.com/in/siracsimsek',       href: LINKEDIN_URL },
                    { icon: <Globe size={13}/>,    label: 'İstanbul, Türkiye',                 href: null },
                  ].map((item, i) => (
                    item.href
                      ? <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                          <span style={{ color: 'var(--accent-cyan)' }}>{item.icon}</span>{item.label}
                        </a>
                      : <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--accent-cyan)' }}>{item.icon}</span>{item.label}
                        </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
                <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}>
                  <Download size={14}/> PDF
                </button>
                <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <X size={16}/>
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

              {/* LEFT column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Experience */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Briefcase size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>Experience</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {experience.map((exp, i) => (
                      <div key={i} style={{ paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.3)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-violet)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>{exp.period}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>{exp.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{exp.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <GraduationCap size={16} style={{ color: 'var(--accent-violet)' }} />
                    <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-violet)' }}>Education</h3>
                  </div>
                  <div style={{ paddingLeft: '1rem', borderLeft: '2px solid rgba(187,154,243,0.3)', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-violet)' }} />
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-violet)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>2023 – Present</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>B.Sc. Digital Game Design</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Istanbul Kultur University (IKU)</div>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Code size={16} style={{ color: 'var(--accent-pink)' }} />
                    <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-pink)' }}>Projects</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {projects.map((proj, i) => (
                      <a key={i} href={proj.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '0', textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,158,100,0.4)'; e.currentTarget.style.background = 'rgba(255,158,100,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      >
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{proj.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{proj.stack}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT column — Skills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Terminal size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>Technical Skills</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {skills.map((sk, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{sk.label}</span>
                          <span style={{ fontSize: '0.78rem', color: sk.color, fontFamily: 'monospace', fontWeight: 700 }}>{sk.pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '0', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sk.pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: '0', background: `linear-gradient(90deg, ${sk.color}, rgba(255,255,255,0.5))` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools / Stack badges */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Layers size={16} style={{ color: 'var(--accent-violet)' }} />
                    <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-violet)' }}>Tools & Stack</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Unity 3D', 'C#', 'SwiftUI', 'Combine', 'React', 'Vite', 'Blender', 'Figma', 'Firebase', 'WebGL', 'Three.js', 'Framer Motion', 'Git', 'macOS', 'Xcode'].map((tool, i) => (
                      <span key={i} style={{ padding: '0.3rem 0.7rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0', fontSize: '0.75rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Globe size={16} style={{ color: 'var(--accent-pink)' }} />
                    <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-pink)' }}>Languages</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[{ lang: 'Turkish', level: 'Native' }, { lang: 'English', level: 'Professional' }].map((l, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '0' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{l.lang}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-pink)', fontFamily: 'monospace' }}>{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div style={{ padding: '1rem 2.5rem 1.5rem', borderTop: '1px solid var(--border-glass)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              References available upon request · sgoktug34@gmail.com
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// ────────────────────────────────────────────────────────────────────────────

const ScrambleText = ({ text }) => {
  return (
    <span style={{ display: 'inline-block', cursor: 'default' }}>
      {text}
    </span>
  );
};

const SyntaxHighlightedTitle = ({ text }) => {
  if (!text) return null;
  if (text.startsWith('//') && text.includes('<') && text.includes('/>')) {
    const commentIndex = text.indexOf('//');
    const tagStartIndex = text.indexOf('<');
    const tagEndIndex = text.indexOf('/>');
    const commentPart = text.substring(commentIndex, tagStartIndex);
    const tagContent = text.substring(tagStartIndex + 1, tagEndIndex).trim();
    return (
      <span className="developer-title">
        <span className="code-comment">{commentPart}</span>
        <span className="code-bracket">&lt;</span>
        <span className="code-tag">{tagContent}</span>
        <span className="code-bracket">/&gt;</span>
      </span>
    );
  }
  return <span>{text}</span>;
};

// Preloader removed — site loads instantly
// CyberCursor removed — using native cursor

const formatTerminalText = (text, type) => {
  if (type === 'input') {
    const parts = text.split('sirac@iku:~$ ');
    if (parts.length > 1) {
      return (
        <>
          <span style={{ color: 'var(--terminal-prompt)' }}>sirac@iku:~$ </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{parts[1]}</span>
        </>
      );
    }
  }
  
  if (text.includes('[OK]')) {
    const parts = text.split('[OK]');
    return (
      <>
        {parts[0]}
        <span style={{ color: 'var(--terminal-success)', fontWeight: 'bold' }}>[OK]</span>
        {parts.slice(1).join('[OK]')}
      </>
    );
  }
  
  if (text.includes('ACCESS GRANTED')) {
    return (
      <>
        <span style={{ color: 'var(--terminal-success)', fontWeight: 'bold', textShadow: '0 0 10px var(--border-glass-glow)' }}>ACCESS GRANTED.</span>
        {text.replace('ACCESS GRANTED.', '')}
      </>
    );
  }

  if (text.includes('CLASSIFIED IDENTITY:')) {
    return (
      <>
        <span style={{ color: 'var(--accent-pink)', fontWeight: 'bold' }}>CLASSIFIED IDENTITY: </span>
        <span style={{ color: 'var(--accent-cyan)' }}>{text.replace('CLASSIFIED IDENTITY: ', '')}</span>
      </>
    );
  }

  if (text.includes('Role:')) {
    return (
      <>
        <span style={{ color: 'var(--terminal-orange)' }}>Role:</span>
        {text.replace('Role:', '')}
      </>
    );
  }

  if (text.includes('SYSTEM CAPABILITIES LOG:')) {
    return <span style={{ color: 'var(--accent-pink)', fontWeight: 'bold' }}>{text}</span>;
  }

  if (text.includes('[|||||||||||||||||||]')) {
    const parts = text.split(' [');
    const progressParts = parts[1].split('] ');
    return (
      <>
        <span style={{ color: 'var(--text-main)' }}>{parts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}> [</span>
        <span style={{ color: 'var(--accent-cyan)' }}>{progressParts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}>] </span>
        <span style={{ color: 'var(--terminal-success)', fontWeight: 'bold' }}>{progressParts[1]}</span>
      </>
    );
  }

  if (text.includes('[||||||||||||||||  ]')) {
    const parts = text.split(' [');
    const progressParts = parts[1].split('] ');
    return (
      <>
        <span style={{ color: 'var(--text-main)' }}>{parts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}> [</span>
        <span style={{ color: 'var(--accent-violet)' }}>{progressParts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}>] </span>
        <span style={{ color: 'var(--terminal-success)', fontWeight: 'bold' }}>{progressParts[1]}</span>
      </>
    );
  }

  if (text.includes('[||||||||||||||||| ]')) {
    const parts = text.split(' [');
    const progressParts = parts[1].split('] ');
    return (
      <>
        <span style={{ color: 'var(--text-main)' }}>{parts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}> [</span>
        <span style={{ color: 'var(--accent-pink)' }}>{progressParts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}>] </span>
        <span style={{ color: 'var(--terminal-success)', fontWeight: 'bold' }}>{progressParts[1]}</span>
      </>
    );
  }

  if (text.includes('[|||||||||||||||   ]')) {
    const parts = text.split(' [');
    const progressParts = parts[1].split('] ');
    return (
      <>
        <span style={{ color: 'var(--text-main)' }}>{parts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}> [</span>
        <span style={{ color: 'var(--accent-cyan)' }}>{progressParts[0]}</span>
        <span style={{ color: 'var(--terminal-progress-bg)' }}>] </span>
        <span style={{ color: 'var(--terminal-success)', fontWeight: 'bold' }}>{progressParts[1]}</span>
      </>
    );
  }

  if (text.startsWith('  ') && text.includes(' - ')) {
    const parts = text.split(' - ');
    return (
      <>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{parts[0]}</span>
        <span style={{ color: 'var(--text-muted)' }}> - {parts[1]}</span>
      </>
    );
  }

  return text;
};

const InteractiveTerminal = ({ 
  isArcadeOpen, 
  setIsArcadeOpen, 
  isMuted, 
  toggleMute, 
  matrixRainMode, 
  setMatrixRainMode, 
  setShowSecretGame,
  activeVisitorCount,
  setActiveArcadeGame,
  theme,
  toggleTheme,
  activeSection
}) => {
  const [history, setHistory] = useState([
    { type: 'log', text: 'SYSTEM ONLINE // v2.5' },
    { type: 'log', text: 'ESTABLISHING NEURAL GRID ENGINES... [OK]' },
    { type: 'success', text: 'ACCESS GRANTED. Welcome to sirac@iku shell.' },
    { type: 'log', text: 'Type "help" to list available system commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const terminalBodyRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInputValue, setTempInputValue] = useState('');

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      let nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        nextIndex = commandHistory.length - 1;
      }
      
      if (historyIndex === -1) {
        setTempInputValue(input);
      }
      
      setHistoryIndex(nextIndex);
      setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      
      let nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(-1);
        setInput(tempInputValue);
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'Enter') {
      const commandText = input.trim();
      if (!commandText) return;

      playClick();

      setCommandHistory(prev => {
        const last = prev[prev.length - 1];
        if (last === commandText) return prev;
        return [...prev, commandText];
      });
      setHistoryIndex(-1);

      const parts = commandText.split(' ');
      const cmd = parts[0].toLowerCase();

      const newHistory = [...history, { type: 'input', text: `sirac@iku:~$ ${commandText}` }];

      switch (cmd) {
        case 'help':
          newHistory.push(
            { type: 'log', text: 'Available commands:' },
            { type: 'info', text: '  about        - Details about Siraç Göktuğ Şimşek' },
            { type: 'info', text: '  skills       - Load system skill tree parameters' },
            { type: 'info', text: '  projects     - Output compiled project archives' },
            { type: 'info', text: '  arcade       - Toggle live arcade interface module' },
            { type: 'info', text: '  play <game>  - Launch any arcade/simulation game' },
            { type: 'info', text: '  diagnostics  - Print real-time system & telemetry' },
            { type: 'info', text: '  theme        - Toggle interface dark/light mode' },
            { type: 'info', text: '  sound        - Toggle synth volume state (mute/unmute)' },
            { type: 'info', text: '  matrix       - Toggle green matrix digital code rain mode' },
            { type: 'info', text: '  snake        - Launch secret retro snake easter egg game' },
            { type: 'info', text: '  clear        - Purge screen buffer log' }
          );
          break;

        case 'about':
          newHistory.push(
            { type: 'success', text: 'CLASSIFIED IDENTITY: Siraç Göktuğ Şimşek' },
            { type: 'log', text: 'Role: Game Developer & UI Engineer' },
            { type: 'log', text: 'Bio: Crafting low-level custom renderers, safe memory systems (Rust/C++), and console-grade web/mobile interfaces.' },
            { type: 'log', text: 'Currently studying Digital Game Design at IKU.' }
          );
          setTimeout(() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
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
          setTimeout(() => {
            const el = document.getElementById('skills');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
          break;

        case 'projects':
          newHistory.push(
            { type: 'success', text: 'ARCHIVED PROJECTS SUMMARY:' },
            { type: 'info', text: '  1. FNAF 1 (Fan Port) - Interactive browser 2D engine' },
            { type: 'info', text: '  2. CS 1.6 Web - Tactical shooter simulator' },
            { type: 'info', text: '  3. Doom II - WebGL retro engine viewport integration' },
            { type: 'log', text: 'Scroll down to the "Archives" grid to deploy any module!' }
          );
          setTimeout(() => {
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
          break;

        case 'arcade':
          if (window.innerWidth < 968) {
            newHistory.push({ type: 'error', text: 'ERROR: Arcade module requires physical keyboard/mouse inputs and is restricted on mobile devices.' });
          } else {
            setIsArcadeOpen(!isArcadeOpen);
            playArcadeOpen();
            newHistory.push({ type: 'success', text: `Arcade module state toggled: ${!isArcadeOpen ? 'ACTIVE' : 'STANDBY'}` });
          }
          break;

        case 'play':
        case 'launch': {
          const query = parts.slice(1).join(' ');
          if (!query) {
            newHistory.push({ type: 'error', text: 'Usage: play <game-name> (e.g. play fnaf, play cs, play doom)' });
            break;
          }
          const q = query.toLowerCase().trim();
          let matched = gamesList.find(g => g.id.toLowerCase() === q);
          if (!matched) {
            matched = gamesList.find(g => g.id.toLowerCase().includes(q));
          }
          if (!matched) {
            matched = gamesList.find(g => g.title.toLowerCase().includes(q));
          }
          if (matched) {
            newHistory.push({ type: 'success', text: `LAUNCHING ${matched.title.toUpperCase()} PROTOCOL... [OK]` });
            if (window.innerWidth < 968) {
              newHistory.push({ type: 'error', text: 'ERROR: Arcade module requires physical keyboard/mouse inputs and is restricted on mobile devices.' });
            } else {
              setActiveArcadeGame(matched.id);
              setIsArcadeOpen(true);
              playArcadeOpen();
            }
          } else {
            newHistory.push({ type: 'error', text: `No game matching "${query}" was found.` });
          }
          break;
        }

        case 'diagnostics':
        case 'sysinfo':
        case 'status':
        case 'neofetch': {
          const pingTime = Math.floor(Math.random() * 25) + 15;
          newHistory.push(
            { type: 'success', text: 'SYSTEM DIAGNOSTICS & TELEMETRY REPORT:' },
            { type: 'log', text: '----------------------------------------' },
            { type: 'info', text: `  Host OS:          macOS` },
            { type: 'info', text: `  Active Theme:     ${theme.toUpperCase()}` },
            { type: 'info', text: `  UI Language:      ${i18n.language.toUpperCase()}` },
            { type: 'info', text: `  Sound Engine:     ${isMuted ? 'STANDBY (MUTED)' : 'ACTIVE (UNMUTED)'}` },
            { type: 'info', text: `  Matrix Shader:    ${matrixRainMode ? 'ACTIVE (NEON GREEN)' : 'STANDBY (CYAN VIOLET)'}` },
            { type: 'info', text: `  Viewport Section: ${activeSection.toUpperCase()}` },
            { type: 'info', text: `  Active Visitors:  ${activeVisitorCount}` },
            { type: 'info', text: `  Ping Latency:     ${pingTime}ms` },
            { type: 'log', text: '----------------------------------------' }
          );
          break;
        }

        case 'theme':
          toggleTheme();
          newHistory.push({ type: 'success', text: `Theme successfully shifted to ${(theme === 'dark' ? 'light' : 'dark').toUpperCase()}.` });
          break;

        case 'sudo': {
          const sub = parts.slice(1).join(' ').toLowerCase();
          if (sub.includes('rm -rf') || sub.includes('rm ')) {
            newHistory.push({ type: 'error', text: 'Nice try, hacker. Core systems are protected by neural safeguards.' });
          } else if (sub.includes('access') || sub.includes('login')) {
            newHistory.push({ type: 'success', text: 'Accessing mainframe... authorization bypass initialized... just kidding, you are already admin.' });
          } else {
            newHistory.push({ type: 'log', text: 'Authorization bypass active. Admin command access granted.' });
          }
          break;
        }

        case 'sound':
          toggleMute();
          newHistory.push({ type: 'success', text: `Audio mute state: ${!isMuted ? 'MUTED' : 'UNMUTED'}` });
          break;

        case 'matrix':
          setMatrixRainMode(!matrixRainMode);
          playSuccess();
          newHistory.push({ type: 'success', text: `Matrix code rain theme: ${!matrixRainMode ? 'ACTIVE (NEON GREEN)' : 'STANDBY (CYAN VIOLET)'}` });
          break;

        case 'snake':
        case 'secret':
          if (setShowSecretGame) {
            setShowSecretGame(true);
            playSuccess();
            newHistory.push({ type: 'success', text: 'INITIATING SECRET NEON SNAKE MINIGAME PROTOCOL...' });
          } else {
            newHistory.push({ type: 'error', text: 'ERROR: Secret engine is offline.' });
          }
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
    }
  };

  return (
    <div 
      className="glass-panel code-terminal" 
      onClick={handleFocus}
      style={{
        width: '100%', maxWidth: '500px', borderRadius: '0', overflow: 'hidden',
        border: isFocused ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)', 
        boxShadow: isFocused 
          ? '0 20px 40px -10px rgba(var(--accent-cyan-rgb), 0.25), 0 0 15px rgba(var(--accent-cyan-rgb), 0.1)' 
          : '0 25px 50px -12px rgba(0,0,0,0.6)',
        textAlign: 'left', background: 'var(--bg-glass)', backdropFilter: 'var(--glass-blur)',
        cursor: 'text', height: '360px', display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ background: 'var(--bg-glass)', padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#666' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#888' }} />
        </div>
        <div style={{ flex: 1, textTransform: 'uppercase', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sf)', letterSpacing: '1px' }}>
          sirac@iku: ~/shell
        </div>
      </div>

      <div ref={terminalBodyRef} className="code-terminal-body" style={{ padding: '20px', fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
        {history.map((line, index) => {
          let color = 'var(--text-main)';
          if (line.type === 'input') color = 'var(--terminal-input)';
          else if (line.type === 'success') color = 'var(--terminal-success)';
          else if (line.type === 'error') color = 'var(--terminal-error)';
          else if (line.type === 'info') color = 'var(--terminal-info)';
          
          return (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ color, whiteSpace: 'pre-wrap' }}
            >
              {formatTerminalText(line.text, line.type)}
            </motion.div>
          );
        })}
      </div>

      <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-code)', fontSize: '16px' }}>
        <span style={{ color: '#7ee787' }}>sirac@iku:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--accent-cyan)',
            flex: 1,
            fontFamily: 'inherit',
            fontSize: '16px',
            caretColor: 'var(--accent-cyan)'
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
        const timeout = setTimeout(() => setPhase(2), 0);
        return () => clearTimeout(timeout);
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
      show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          y: { type: 'spring', stiffness: 100 },
          opacity: { duration: 0.3 },
          filter: { type: 'tween', ease: 'easeOut', duration: 0.4 }
        }
      }
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
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(5, 5, 8, 0.85)', 
      backdropFilter: 'blur(20px)', 
      zIndex: 100000, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '1.5rem'
    }}>
      <div className="glass-panel" style={{ 
        padding: '2.5rem', 
        borderRadius: '0', 
        border: '1px solid var(--border-glass)', 
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        background: 'var(--bg-glass)'
      }}>
        <h2 className="text-gradient" style={{ margin: '0 0 0.5rem 0', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '4px' }}>
          NEON SNAKE
        </h2>
        <div style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          SCORE: <span style={{ color: 'var(--text-main)' }}>{score}</span>
        </div>
        <div className="neon-game-board" style={{ 
          width: '300px', 
          height: '300px', 
          border: '2px solid var(--border-glass)', 
          background: 'var(--bg-dark)',
          borderRadius: '0',
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' 
        }}>
          {/* Grid lines background */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(var(--border-glass) 1px, transparent 1px), linear-gradient(90deg, var(--border-glass) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          
          {snake.map((seg, i) => (
            <motion.div 
              key={i} 
              layout
              style={{ 
                position: 'absolute', 
                left: `${seg[0] * 10}px`, 
                top: `${seg[1] * 10}px`, 
                width: '10px', 
                height: '10px', 
                background: i === 0 ? 'var(--text-main)' : 'var(--accent-cyan)', 
                borderRadius: i === 0 ? '4px' : '2px'
              }} 
            />
          ))}
          <motion.div 
            animate={{ scale: [0.9, 1.2, 0.9] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ 
              position: 'absolute', 
              left: `${food[0] * 10}px`, 
              top: `${food[1] * 10}px`, 
              width: '10px', 
              height: '10px', 
              background: 'var(--accent-violet)', 
              borderRadius: '50%'
            }} 
          />
        </div>
        {gameOver && (
          <motion.h3 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ color: '#ff7b72', fontFamily: 'monospace', marginTop: '1.5rem', marginBottom: 0, letterSpacing: '2px' }}
          >
            GAME OVER
          </motion.h3>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {gameOver && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHover}
              onClick={() => {
                playSuccess();
                setSnake([[10, 10]]);
                setFood([15, 15]);
                setDir([0, -1]);
                setGameOver(false);
                setScore(0);
              }} 
              className="btn btn-primary glass-panel"
              style={{ 
                padding: '0.8rem 2rem', 
                fontSize: '0.9rem',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              RESTART
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={playHover}
            onClick={() => { playClick(); onClose(); }} 
            className="btn btn-outline glass-panel"
            style={{ 
              padding: '0.8rem 2rem', 
              color: 'var(--accent-cyan)', 
              cursor: 'pointer',
              fontSize: '0.9rem',
              letterSpacing: '1px'
            }}
          >
            EXIT SIMULATION
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// --- 3D Tilt Card Effect ---
const TiltCard = ({ children, className, style, ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      if (mobile) {
        x.set(0);
        y.set(0);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [x, y]);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]); // Reduced slightly for smoother feel
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const flareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const flareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const background = useMotionTemplate`radial-gradient(circle at ${flareX} ${flareY}, rgba(var(--glow-color, var(--accent-cyan-rgb)), 0.15) 0%, transparent 65%)`;

  const handleMouseMove = (e) => {
    if (isMobile) return;
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
    if (isMobile) return;
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = (e) => {
    if (!isMobile) playHover();
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateY: isMobile ? 0 : rotateY,
        rotateX: isMobile ? 0 : rotateX,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        position: "relative",
        ...style
      }}
      className={className}
      {...props}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isMobile ? "none" : background,
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 5
        }}
      />
      <div style={{ transform: isMobile ? "none" : "translateZ(30px)", transformStyle: "preserve-3d", height: '100%', position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
};

// --- Magnetic Effect for Interactive Elements ---
const Magnetic = ({ children, className }) => {
  const ref = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      if (mobile) {
        setPosition({ x: 0, y: 0 });
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouse = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    if (isMobile) return;
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <div
      className={className}
      style={{ position: "relative", display: "inline-block" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      <motion.div
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        style={{ display: "inline-block" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('dark');
  const [activeVisitorCount, setActiveVisitorCount] = useState(1);
  const [showSecretGame, setShowSecretGame] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' ? window.scrollY > 40 : false);



  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(window.innerWidth <= 968);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse Tracking for Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth <= 968) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Force scroll to top on refresh
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll spy active section tracker
  useEffect(() => {
    const sections = ['hero', 'about', 'timeline', 'projects', 'skills', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id) || (id === 'hero' ? document.querySelector('.hero') : null);
      if (el) {
        if (id === 'hero' && !el.id) {
          el.id = 'hero';
        }
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic out - punchier and responsive
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    lenis.on('scroll', (e) => {
      scrollY.set(e.scroll);
      const currentScrolled = e.scroll > 40;
      setScrolled(prev => {
        if (prev !== currentScrolled) return currentScrolled;
        return prev;
      });
    });

    // Handle internal anchor links click with Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          lenis.scrollTo(element, { offset: -80 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Pausable RAF loop — can be fully suspended when arcade modal is open
    let rafId;
    let rafPaused = false;
    function raf(time) {
      if (!rafPaused) {
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose pause/resume so arcade modal can fully stop Lenis processing
    window.lenisRafPause = () => { rafPaused = true; };
    window.lenisRafResume = () => { rafPaused = false; };

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      window.lenis = null;
      window.lenisRafPause = null;
      window.lenisRafResume = null;
    };
  }, [scrollY]);

  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [activeArcadeGame, setActiveArcadeGame] = useState(null);
  const [isMuted, setIsMuted] = useState(getMutedState());
  const [matrixRainMode, setMatrixRainMode] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setMutedState(nextMute);
    if (!nextMute) {
      playClick();
    }
  };

  // Unified Konami Code Easter Egg: ↑ ↑ ↓ ↓ ← → ← → B A
  // Merged two duplicate listeners into one to prevent double-firing
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
      const expected = konamiCode[codeIndex];
      if (e.key === expected || e.key === expected.toLowerCase()) {
        codeIndex++;
        if (codeIndex === konamiCode.length) {
          codeIndex = 0;
          // Action 1: Toggle matrix rain
          setMatrixRainMode(prev => !prev);
          // Action 2: Show secret snake game
          setShowSecretGame(true);
          if (!isMuted) {
            playArcadeOpen();
            setTimeout(() => playSuccess(), 300);
          }
          console.log('%c👾 KONAMI CODE ACTIVATED 👾', 'color: var(--accent-cyan); font-size: 18px; font-weight: bold;');
          const banner = document.createElement('div');
          Object.assign(banner.style, {
            position: 'fixed', top: '15%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(10, 12, 16, 0.95)',
            border: '1px solid var(--accent-cyan)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '20px 40px', borderRadius: '0',
            zIndex: '999999', fontFamily: 'monospace',
            color: 'var(--text-main)', textAlign: 'center',
            pointerEvents: 'none'
          });
          banner.innerHTML = `<h1 style="color:var(--accent-cyan);margin:0 0 10px;font-size:22px">CHEAT CODE DETECTED</h1><p style="margin:0;font-size:13px;color:#7ee787">GRID SHADER OVERRIDE INITIATED</p>`;
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





  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = (e) => {
    playClick();

    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Get click position, or default to center of the viewport
    const x = e && typeof e.clientX === 'number' ? e.clientX : window.innerWidth / 2;
    const y = e && typeof e.clientY === 'number' ? e.clientY : window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check if browser supports View Transition API
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        try {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ];
          document.documentElement.animate(
            {
              clipPath: clipPath
            },
            {
              duration: 650,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } catch (err) {
          console.warn("View transition animation failed:", err);
        }
      }).catch((err) => {
        console.warn("View transition promise rejected:", err);
      });
    } else {
      // Create a temporary ripple overlay element
      const ripple = document.createElement('div');
      ripple.className = 'theme-transition-ripple';
      
      // Set styles for the ripple circle
      ripple.style.position = 'fixed';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = `${endRadius * 2}px`;
      ripple.style.height = `${endRadius * 2}px`;
      ripple.style.marginLeft = `${-endRadius}px`;
      ripple.style.marginTop = `${-endRadius}px`;
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '999999';
      ripple.style.backgroundColor = nextTheme === 'light' ? '#f6f8fa' : '#1a1b26';

      document.body.appendChild(ripple);

      // Animate the ripple scale from 0 to 1
      const animation = ripple.animate(
        [
          { transform: 'scale(0)' },
          { transform: 'scale(1)' }
        ],
        {
          duration: 650,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      );

      // Once the ripple has fully expanded and covers the screen, toggle the theme
      animation.onfinish = () => {
        setTheme(nextTheme);

        // Now fade out the ripple smoothly to reveal the new theme
        const fadeAnimation = ripple.animate(
          [
            { opacity: 1 },
            { opacity: 0 }
          ],
          {
            duration: 300,
            easing: 'ease-out'
          }
        );

        fadeAnimation.onfinish = () => {
          ripple.remove();
        };
      };
    }
  };

  const changeLanguage = (lng) => {
    playClick();
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
      image: `${import.meta.env.BASE_URL}assets/masks.webp`
    },
    {
      id: 2,
      title: 'Flying Bird',
      desc: t('games.fb_desc'),
      tags: ['Unity', 'C#', '2D', 'Casual'],
      glow: 'glow-cyan',
      link: 'https://unitybtw.itch.io/flying-bird',
      image: `${import.meta.env.BASE_URL}assets/bird.webp`
    },
    {
      id: 3,
      title: t('games.macos_title'),
      desc: t('games.macos_desc'),
      tags: ['SwiftUI', 'Combine', 'macOS', 'Native'],
      glow: 'glow-violet',
      link: 'https://github.com/unitybtw',
      image: null
    },
    {
      id: 4,
      title: t('games.arcade_title'),
      desc: t('games.arcade_desc'),
      tags: ['React', 'Canvas', 'WebGL', 'HTML5'],
      glow: 'glow-cyan',
      link: 'https://unitybtw.github.io/sirac-portfolio/',
      image: null
    }
  ];



  // scrollY is defined above near mouseX / mouseY to prevent TDZ errors
  // Background icon parallax — used in JSX floating icons
  const parallax1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const parallax2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const parallax3 = useTransform(scrollY, [0, 1000], [0, -100]);

  // Mouse-driven transforms
  const terminalX = useTransform(springX, [0, 1920], [-15, 15]);
  const terminalY = useTransform(springY, [0, 1080], [-15, 15]);
  const bgIconX = useTransform(springX, [0, 1920], [20, -20]);
  const bgIconY = useTransform(springY, [0, 1080], [20, -20]);
  const bgSpotlightTemplate = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(var(--accent-cyan-rgb), 0.04) 0%, rgba(var(--accent-violet-rgb), 0.025) 50%, transparent 100%)`;

  // Combined mouse and scroll parallax motion values for background blobs
  const blob1XVal = useTransform(springX, [0, 1920], [30, -30]);
  const blob1YVal = useTransform([springY, scrollY], ([yVal, scrollVal]) => {
    const mouseOffset = ((yVal - 540) / 540) * -30;
    const scrollOffset = scrollVal * -0.1;
    return mouseOffset + scrollOffset;
  });

  const blob2XVal = useTransform(springX, [0, 1920], [-45, 45]);
  const blob2YVal = useTransform([springY, scrollY], ([yVal, scrollVal]) => {
    const mouseOffset = ((yVal - 540) / 540) * 45;
    const scrollOffset = scrollVal * 0.15;
    return mouseOffset + scrollOffset;
  });

  const blob3XVal = useTransform(springX, [0, 1920], [25, -25]);
  const blob3YVal = useTransform([springY, scrollY], ([yVal, scrollVal]) => {
    const mouseOffset = ((yVal - 540) / 540) * -25;
    const scrollOffset = scrollVal * -0.08;
    return mouseOffset + scrollOffset;
  });

  const blob4XVal = useTransform(springX, [0, 1920], [-20, 20]);
  const blob4YVal = useTransform([springY, scrollY], ([yVal, scrollVal]) => {
    const mouseOffset = ((yVal - 540) / 540) * 20;
    const scrollOffset = scrollVal * 0.12;
    return mouseOffset + scrollOffset;
  });

  return (
    <>
    <AnimatePresence>
      {showSecretGame && <KonamiGame key="konami" onClose={() => setShowSecretGame(false)} />}
    </AnimatePresence>

    <PageProgress />
    <div className={`app-container ${theme}-mode ${isArcadeOpen ? 'arcade-open-active' : ''}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
          {/* <MatrixBackground theme={theme} isPaused={isArcadeOpen} matrixRainMode={matrixRainMode} /> */}
          <div className="cyber-bg">
            {!isMobileDevice && (
              <motion.div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  pointerEvents: 'none',
                  zIndex: 0,
                  background: bgSpotlightTemplate,
                }}
              />
            )}
            <motion.div className="cyber-bg-blob-wrapper" style={{ top: '-10%', left: '-10%', x: isMobileDevice ? 0 : blob1XVal, y: isMobileDevice ? 0 : blob1YVal }}>
              <div className="cyber-bg-blob-1" />
            </motion.div>
            <motion.div className="cyber-bg-blob-wrapper" style={{ bottom: '-10%', right: '-10%', x: isMobileDevice ? 0 : blob2XVal, y: isMobileDevice ? 0 : blob2YVal }}>
              <div className="cyber-bg-blob-2" />
            </motion.div>
            <motion.div className="cyber-bg-blob-wrapper" style={{ top: '35%', right: '15%', x: isMobileDevice ? 0 : blob3XVal, y: isMobileDevice ? 0 : blob3YVal }}>
              <div className="cyber-bg-blob-3" />
            </motion.div>
            <motion.div className="cyber-bg-blob-wrapper" style={{ bottom: '25%', left: '20%', x: isMobileDevice ? 0 : blob4XVal, y: isMobileDevice ? 0 : blob4YVal }}>
              <div className="cyber-bg-blob-4" />
            </motion.div>
            {/* Parallax Floating Icons */}
              <motion.div style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.15, color: 'var(--accent-cyan)', y: parallax1, x: isMobileDevice ? 0 : bgIconX, }}>
                <Code size={60} />
              </motion.div>
              <motion.div style={{ position: 'absolute', top: '45%', right: '10%', opacity: 0.15, color: 'var(--accent-violet)', y: parallax2, x: isMobileDevice ? 0 : bgIconY, }}>
                <Layers size={80} />
              </motion.div>
              <motion.div style={{ position: 'absolute', top: '75%', left: '15%', opacity: 0.15, color: 'var(--accent-cyan)', y: parallax3, x: isMobileDevice ? 0 : bgIconX, }}>
                <Box size={70} />
              </motion.div>
          </div>



          <nav className={`glass-panel ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" fetchpriority="high" loading="eager" decoding="sync" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }} />
              <h1 className="text-gradient">
                <span className="logo-name-full">{t('nav_name') || 'SIRAÇ GÖKTUĞ ŞİMŞEK.'}</span>
                <span className="logo-name-short">{t('nav_name_mobile') || 'SIRAÇ.'}</span>
              </h1>
            </div>
            
            {/* Desktop Nav Links */}
            {!isMobileDevice && (
              <div className="nav-links">
                <Magnetic>
                  <a href="#about" className={activeSection === 'about' ? 'active' : ''} data-index="[01]" onMouseEnter={playHover} onClick={() => playClick()}>
                    {t('nav_about') || 'About'}
                    {activeSection === 'about' && (
                      <motion.span 
                        key={i18n.language}
                        layoutId="activeNavIndicator" 
                        className="active-nav-indicator" 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#timeline" className={activeSection === 'timeline' ? 'active' : ''} data-index="[02]" onMouseEnter={playHover} onClick={() => playClick()}>
                    {t('nav_timeline') || 'Timeline'}
                    {activeSection === 'timeline' && (
                      <motion.span 
                        key={i18n.language}
                        layoutId="activeNavIndicator" 
                        className="active-nav-indicator" 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} data-index="[03]" onMouseEnter={playHover} onClick={() => playClick()}>
                    {t('nav_work')}
                    {activeSection === 'projects' && (
                      <motion.span 
                        key={i18n.language}
                        layoutId="activeNavIndicator" 
                        className="active-nav-indicator" 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#skills" className={activeSection === 'skills' ? 'active' : ''} data-index="[04]" onMouseEnter={playHover} onClick={() => playClick()}>
                    {t('nav_skills')}
                    {activeSection === 'skills' && (
                      <motion.span 
                        key={i18n.language}
                        layoutId="activeNavIndicator" 
                        className="active-nav-indicator" 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} data-index="[05]" onMouseEnter={playHover} onClick={() => playClick()}>
                    {t('nav_contact')}
                    {activeSection === 'contact' && (
                      <motion.span 
                        key={i18n.language}
                        layoutId="activeNavIndicator" 
                        className="active-nav-indicator" 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
                
                <Magnetic>
                  <button
                    onClick={() => { playClick(); setIsArcadeOpen(true); }}
                    onMouseEnter={playHover}
                    className="btn btn-outline glass-panel"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}
                  >
                    <Gamepad2 size={14} /> {t('arcade_button') || 'Arcade'}
                  </button>
                </Magnetic>
              </div>
            )}

            {/* Nav Utilities - ALWAYS visible on right */}
            <div className="nav-utilities">
              <div className="lang-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-glass)', padding: '0.3rem 0.6rem', borderRadius: '0', border: '1px solid var(--border-glass)', position: 'relative' }}>
                <Globe size={14} style={{ color: 'var(--text-muted)', marginRight: '2px', zIndex: 1 }} />
                <div style={{ position: 'relative', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {/* Sliding Background */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '32px',
                      height: '24px',
                      background: 'linear-gradient(135deg, rgba(var(--accent-cyan-rgb), 0.15), rgba(var(--accent-cyan-rgb), 0.05))',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: '0',
                      border: '1px solid rgba(var(--accent-cyan-rgb), 0.3)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 12px rgba(var(--accent-cyan-rgb), 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.05)',
                      zIndex: 0,
                      transform: `translateX(${i18n.language?.startsWith('tr') ? 37 : 0}px)`,
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  
                  <button 
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); changeLanguage('en'); }} 
                    className="lang-btn"
                    style={{ 
                      color: i18n.language?.startsWith('en') ? 'var(--accent-cyan)' : 'var(--text-muted)'
                    }}
                  >
                    EN
                  </button>
                  <button 
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); changeLanguage('tr'); }} 
                    className="lang-btn"
                    style={{ 
                      color: i18n.language?.startsWith('tr') ? 'var(--accent-cyan)' : 'var(--text-muted)'
                    }}
                  >
                    TR
                  </button>
                </div>
              </div>

              <Magnetic>
                <button
                  onClick={() => { toggleMute(); playClick(); }}
                  onMouseEnter={playHover}
                  className="nav-utility-btn"
                  style={{ 
                    background: 'var(--bg-glass)', 
                    border: '1px solid var(--border-glass)', 
                    borderRadius: '50%', 
                    width: '38px', 
                    height: '38px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    color: isMuted ? 'var(--text-muted)' : 'var(--accent-cyan)',
                    '--hover-border-color': isMuted ? 'var(--border-glass)' : 'var(--accent-cyan)'
                  }}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </Magnetic>

              <div className="theme-toggle-container">
                <Magnetic>
                  <button
                    onClick={(e) => { toggleTheme(e); }}
                    onMouseEnter={playHover}
                    className="theme-toggle-btn-desktop nav-utility-btn"
                    style={{ 
                      background: 'var(--bg-glass)', 
                      border: '1px solid var(--border-glass)', 
                      borderRadius: '50%', 
                      width: '38px', 
                      height: '38px', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      color: 'var(--accent-cyan)', 
                      position: 'relative',
                      '--hover-border-color': 'var(--accent-cyan)'
                    }}
                  >
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                  </button>
                </Magnetic>
              </div>

              {/* Hamburger Toggle button */}
              <button 
                className="nav-toggle-btn" 
                onClick={() => { playClick(); setIsMobileMenuOpen(!isMobileMenuOpen); }} 
                onMouseEnter={playHover}
                aria-label="Toggle Menu"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ width: '20px', height: '2px', backgroundColor: 'currentColor', borderRadius: '0', display: 'block', transition: 'all 0.3s', transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transformOrigin: 'center' }}></span>
                  <span style={{ width: '20px', height: '2px', backgroundColor: 'currentColor', borderRadius: '0', display: 'block', transition: 'all 0.3s', opacity: isMobileMenuOpen ? 0 : 1 }}></span>
                  <span style={{ width: '20px', height: '2px', backgroundColor: 'currentColor', borderRadius: '0', display: 'block', transition: 'all 0.3s', transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transformOrigin: 'center' }}></span>
                </div>
              </button>
            </div>
          </nav>

          {/* Mobile Sliding Overlay Drawer - Escaping layout transforms */}
          <AnimatePresence>
            {isMobileDevice && isMobileMenuOpen && (
              <motion.div 
                className="nav-links active"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <Magnetic>
                  <a href="#about" className={activeSection === 'about' ? 'active' : ''} data-index="[01]" onMouseEnter={playHover} onClick={() => { playClick(); setIsMobileMenuOpen(false); }}>
                    {t('nav_about') || 'About'}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#timeline" className={activeSection === 'timeline' ? 'active' : ''} data-index="[02]" onMouseEnter={playHover} onClick={() => { playClick(); setIsMobileMenuOpen(false); }}>
                    {t('nav_timeline') || 'Timeline'}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} data-index="[03]" onMouseEnter={playHover} onClick={() => { playClick(); setIsMobileMenuOpen(false); }}>
                    {t('nav_work')}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#skills" className={activeSection === 'skills' ? 'active' : ''} data-index="[04]" onMouseEnter={playHover} onClick={() => { playClick(); setIsMobileMenuOpen(false); }}>
                    {t('nav_skills')}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} data-index="[05]" onMouseEnter={playHover} onClick={() => { playClick(); setIsMobileMenuOpen(false); }}>
                    {t('nav_contact')}
                  </a>
                </Magnetic>
                
                <Magnetic>
                  <button
                    onClick={() => { playClick(); setIsArcadeOpen(true); setIsMobileMenuOpen(false); }}
                    onMouseEnter={playHover}
                    className="btn btn-outline glass-panel"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}
                  >
                    <Gamepad2 size={14} /> {t('arcade_button') || 'Arcade'}
                  </button>
                </Magnetic>

                {/* Mobile-only utilities drawer */}
                <div className="mobile-menu-utilities">
                  {/* Language Switcher */}
                  <div className="mobile-lang-switcher">
                    <button 
                      onClick={() => { playClick(); changeLanguage('en'); }}
                      className={i18n.language?.startsWith('en') ? 'active' : ''}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => { playClick(); changeLanguage('tr'); }}
                      className={i18n.language?.startsWith('tr') ? 'active' : ''}
                    >
                      TR
                    </button>
                  </div>

                  {/* Sound & Theme Controls */}
                  <div className="mobile-controls">
                    <button 
                      onClick={() => { toggleMute(); playClick(); }} 
                      className="mobile-control-btn"
                      aria-label="Toggle Sound"
                      style={{ color: isMuted ? 'var(--text-muted)' : 'var(--accent-cyan)' }}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button 
                      onClick={(e) => { toggleTheme(e); }} 
                      className="mobile-control-btn"
                      aria-label="Toggle Theme"
                    >
                      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <section className="hero" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '12rem', paddingBottom: '6rem', minHeight: '90vh' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}
            >
              <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: '0.9', margin: '0 0 1.5rem 0', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                SİRAÇ GÖKTUĞ<br />ŞİMŞEK.
              </h1>
              <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 4rem 0', letterSpacing: '-0.02em', maxWidth: '600px', lineHeight: '1.4' }}>
                Software Engineer & Digital Game Designer. Crafting structural digital experiences.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#projects" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                  {t('btn_explore') || 'Explore Work'} <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                </a>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', border: '1px solid var(--border-glass)', transition: 'all 0.3s', backgroundColor: 'var(--bg-dark)' }} className="social-btn-hover">
                    <Linkedin size={24} />
                  </a>
                  <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', border: '1px solid var(--border-glass)', transition: 'all 0.3s', backgroundColor: 'var(--bg-dark)' }} className="social-btn-hover">
                    <Github size={24} />
                  </a>
                  <button onClick={() => setShowCVModal(true)} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', border: '1px solid var(--border-glass)', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: 'var(--bg-dark)' }} className="social-btn-hover">
                    <FileText size={24} />
                  </button>
                </div>
              </div>
            </motion.div>


            {/* Scroll Indicator */}
            <motion.div 
              layout
              className="scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              whileHover={{ opacity: 1 }}
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                const el = document.getElementById('about');
                if (el) window.lenis?.scrollTo(el, { offset: -80 });
              }}
            >
              <span className="scroll-text">{t('scroll_down') || 'SCROLL'}</span>
              
              {/* Desktop: Mouse indicator */}
              <div className="scroll-mouse-wheel">
                <motion.div 
                  className="scroll-mouse-dot"
                  animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                />
              </div>

              {/* Mobile: Bouncing Chevron */}
              <div className="scroll-mobile-chevron">
                <ChevronDown size={20} className="bounce-arrow" />
              </div>
            </motion.div>
          </section>

          {/* About Section */}
          <section id="about" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', borderBottom: '1px solid var(--border-glass)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 3rem 0', color: 'var(--text-main)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{t('about_title') || 'ABOUT'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              <div>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem', fontWeight: 500 }}>{t('about_text_1')}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>{t('about_text_2')}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8' }}>{t('about_text_3')}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t(`about_stat_${num}`)}</div>
                    <div style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 700 }}>{t(`about_stat_${num}_val`)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section id="timeline" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', borderBottom: '1px solid var(--border-glass)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 3rem 0', color: 'var(--text-main)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{t('timeline_title') || 'EXPERIENCE'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {[1, 2, 3, 4].map((num) => (
                <div key={num} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 150px) 1fr', gap: '2rem', alignItems: 'start' }} className="timeline-item">
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, paddingTop: '0.3rem', borderRight: '1px solid var(--border-glass)' }}>{t(`timeline_event_${num}_year`)}</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{t(`timeline_event_${num}_title`)}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>{t(`timeline_event_${num}_desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Modules Section */}
          <motion.section 
             id="featured-modules" 
             className="desktop-only glass-panel" 
             style={{ maxWidth: '1200px', margin: '0 auto 5rem auto', padding: '5rem 2rem', borderRadius: '0', }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="section-title text-gradient"><SyntaxHighlightedTitle text={t('featured_title')} /></h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('featured_subtitle')}</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {[
                { name: 'FNAF 1 (Fan Port)', desc: 'Full interactive 2D engine map for browser.', icon: <Gamepad2 size={32} /> },
                { name: 'CS 1.6 Web', desc: 'Real-time tactical simulator in JS.', icon: <Terminal size={32} /> },
                { name: 'Subway Surfers', desc: 'Infinite runner module with high-res assets.', icon: <Smartphone size={32} /> },
                { name: 'Mario 64', desc: 'Native WebGL N64 simulation layer.', icon: <Box size={32} /> },
                { name: 'Doom II', desc: 'Full retro FPS engine integration.', icon: <Terminal size={32} /> },
                { name: 'GTA Vice City', desc: 'Full 3D retro environment simulation.', icon: <Layers size={32} /> }
              ].map((game, i) => (
                <TiltCard
                  key={i}
                  className="glass-panel"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1, delay: i * 0.1 }}
                  onClick={() => { playClick(); setIsArcadeOpen(true); }}
                  style={{ padding: '2rem', borderRadius: '0', cursor: 'pointer', border: '1px solid var(--border-glass)', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', height: '100%', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
                >
                  <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{game.icon}</div>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{game.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{game.desc}</p>
                </TiltCard>
              ))}
            </div>
          </motion.section>

          {/* Projects Gallery */}
          <section id="projects" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid var(--border-glass)' }}>
            <div className="section-header" style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{t('archives_title') || 'PROJECTS'}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('archives_subtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {projects.map((project) => (
                <a 
                  key={project.id} 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-glass)', background: 'var(--bg-dark)', textDecoration: 'none', transition: 'all 0.3s' }}
                  className="project-card-minimal"
                >
                  {project.image ? (
                    <div style={{ height: '220px', overflow: 'hidden', borderBottom: '1px solid var(--border-glass)' }}>
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', transition: 'filter 0.3s' }}
                        className="project-img-minimal"
                      />
                    </div>
                  ) : (
                    <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-glass)', backgroundColor: 'var(--bg-darker)' }}>
                      <Code size={40} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, margin: '0 0 1.5rem 0' }}>{project.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {project.tags.map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', borderBottom: '1px solid var(--border-glass)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 3rem 0', color: 'var(--text-main)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{t('skills_title') || 'SKILLS'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Development</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>React, Next.js, Node.js, TypeScript, C++, C#</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Game & Graphics</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>Unity, WebGL, Three.js, Blender, SwiftUI</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Tools & Systems</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>Git, Docker, Figma, Linux, CI/CD</p>
              </div>
            </div>
          </section>


          <motion.footer 
            id="contact" 
            className="footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >

            <motion.div
              style={{ textAlign: 'center', marginBottom: '3rem' }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="section-title text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}><SyntaxHighlightedTitle text={t('footer_title')} /></h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('footer_subtitle')}</p>

              <div className="footer-contact">
                <div className="contact-btn-wrapper">
                  <Magnetic>
                    <a 
                      href="mailto:sgoktug34@gmail.com" 
                      className="btn btn-primary glass-panel" 
                      onMouseEnter={playHover}
                      onClick={playClick}
                      style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}
                    >
                      <Mail size={20} style={{ marginRight: '10px' }} /> {t('btn_transmit')}
                    </a>
                  </Magnetic>
                </div>
              </div>

              <motion.div 
                style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.15 }
                  }
                }}
              >
                {[
                  { href: 'https://github.com/unitybtw', icon: <Github size={24} />, label: 'GitHub' },
                  { href: LINKEDIN_URL, icon: <Linkedin size={24} />, label: 'LinkedIn' },
                  { href: 'https://unitybtw.itch.io/', icon: <Gamepad2 size={24} />, label: 'Itch.io' }
                ].map((social, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.8 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Magnetic>
                      <a 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onMouseEnter={playHover}
                        onClick={playClick}
                        className="social-icon"
                        style={{ color: 'var(--text-muted)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                        title={social.label}
                      >
                        {social.icon}
                        <span style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5 }}>{social.label}</span>
                      </a>
                    </Magnetic>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2rem', marginTop: '2rem' }}>
              {/* Contact info row */}
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.2rem' }}>
                {[
                  { icon: <Mail size={13}/>, label: 'sgoktug34@gmail.com', href: 'mailto:sgoktug34@gmail.com' },
                  { icon: <Github size={13}/>, label: 'github.com/unitybtw', href: 'https://github.com/unitybtw' },
                  { icon: <Linkedin size={13}/>, label: 'LinkedIn Profile', href: LINKEDIN_URL },
                  { icon: <Globe size={13}/>, label: 'İstanbul, TR', href: null },
                ].map((item, i) => (
                  item.href
                    ? <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <span style={{ color: 'var(--accent-cyan)' }}>{item.icon}</span>{item.label}
                      </a>
                    : <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>{item.icon}</span>{item.label}
                      </span>
                ))}
              </div>
              {/* Availability badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.3rem 0.9rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  {t('badge_hire')}
                </span>
              </div>
              {/* Copyright */}
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                <span>&copy; {new Date().getFullYear()} {t('footer_copyright')}</span>
              </div>
            </div>
          </motion.footer>
        </motion.div>
      </div>

    {/* Back to Top Button */}
    <AnimatePresence>
      {scrolled && !isArcadeOpen && (
        <motion.button
          key="backToTop"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={() => { 
            playClick(); 
            window.lenis?.scrollTo(0, { duration: 1.5 }); 
          }}
          onMouseEnter={playHover}
          whileHover={{ scale: 1.1, borderColor: 'var(--accent-cyan)' }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            color: 'var(--accent-cyan)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
          }}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>

    {!isArcadeOpen && <PresencePanel onActiveCountChange={setActiveVisitorCount} />}
    <CVModal isOpen={showCVModal} onClose={() => setShowCVModal(false)} t={t} theme={theme} />
    </>
  );
}

export default App;
