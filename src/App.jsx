import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Gamepad2, Cpu, Mail, Sun, Moon, Globe, Download, Code, MonitorSmartphone, Box, Database } from 'lucide-react';
import './index.css';
import { LINKEDIN_URL } from './i18n';

const ThreeDViewer = React.lazy(() => import('./ThreeDViewer'));

// ── Page Progress Indicator ──────────────────────────────────────────────
const PageProgress = () => {
  const barRef = React.useRef(null);
  
  useEffect(() => {
    // Only run JS fallback if browser doesn't support native CSS scroll-timeline
    if (!CSS.supports('animation-timeline: scroll()')) {
      const handleScroll = () => {
        if (!barRef.current) return;
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
        barRef.current.style.transform = `scaleX(${scrollPercent})`;
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial set
      
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return <div className="page-progress-bar" ref={barRef} />;
};

// ── Magnetic Button Wrapper ──────────────────────────────────────────────
const Magnetic = ({ children }) => {
  const ref = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: 'relative' }}
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

// ── Main App Component ────────────────────────────────────────────────────
function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Apply Theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Toggle Language
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  // Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle Anchor Clicks smoothly with Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.getAttribute('href')?.startsWith('#')) {
        const id = target.getAttribute('href');
        if (id === '#') return;
        const targetElement = document.querySelector(id);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -40, duration: 1.2 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Fallback for browsers that don't support scroll-driven animations
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              // Add a slight stagger based on index if multiple enter at once
              setTimeout(() => {
                entry.target.classList.add('is-revealed');
              }, index * 100);
              observer.unobserve(entry.target); // Only reveal once for clean minimal feel
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );

      document.querySelectorAll('.bento-card, .section-title, .section-subtitle').forEach((el) => {
        el.classList.add('js-scroll-reveal');
        observer.observe(el);
      });

      return () => {
        observer.disconnect();
        document.removeEventListener('click', handleAnchorClick);
        lenis.destroy();
      };
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  // Parallax for Hero is now handled purely in CSS via .hero-parallax-content

  return (
    <>
      <PageProgress />
      
      {/* ── Navbar ── */}
      <nav className="glass-panel">
        <div className="nav-name">
          {t('nav_name')}
        </div>
        <div className="nav-links">
          <a href="#about">{t('nav_about')}</a>
          <a href="#timeline">{t('timeline_title')}</a>
          <a href="#projects">{t('archives_title')}</a>
          <a href={`${import.meta.env.BASE_URL}cv.pdf`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
            <Download size={14} /> {t('btn_view_cv')}
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="desktop-only-controls" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage} 
              className="btn-outline" 
              style={{ padding: '0.4rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Change Language"
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {i18n.language === 'tr' ? 'EN' : 'TR'}
              </span>
            </button>

            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme} 
              className="btn-outline" 
              style={{ padding: '0.4rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          <a href="#contact" className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
            {t('nav_contact')}
          </a>
        </div>
      </nav>

      {/* Floating Action Controls for Mobile */}
      <div className="mobile-settings-pill">
        <button 
          onClick={toggleLanguage} 
          className="btn-outline" 
          style={{ padding: '0.4rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          title="Change Language"
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {i18n.language === 'tr' ? 'EN' : 'TR'}
          </span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="btn-outline" 
          style={{ padding: '0.4rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <main className="app-container">
        {/* ── Hero Section ── */}
        <section className="hero-section" id="hero">
          <div className="hero-parallax-content">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
            >
            <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'var(--border-subtle)', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {t('badge_hire')}
            </div>
            <h1 className="hero-title">
              {t('hero_title_1')}<br/>
              <span style={{ color: 'var(--text-secondary)' }}>{t('hero_title_2')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('hero_subtitle_1')} <br/>
              {t('hero_subtitle_2')}
            </p>
            <div className="hero-buttons">
              <Magnetic>
                <a href="#projects" className="btn-primary">
                  {t('btn_explore')} <ArrowRight size={18} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={`${import.meta.env.BASE_URL}cv.pdf`} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Download size={18} /> {t('btn_view_cv')}
                </a>
              </Magnetic>
              <Magnetic>
                <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Github size={18} /> {t('btn_repos')}
                </a>
              </Magnetic>
            </div>
            </motion.div>
          </div>
        </section>

        {/* ── About Section ── */}
        <section id="about">
          <h2 className="section-title">{t('about_title')}</h2>
          <p className="section-subtitle">{t('about_subtitle')}</p>
          
          <div className="bento-grid">
            <div className="bento-card bento-col-8">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Biography</h3>
              <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                {t('about_text_1')}
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                {t('about_text_2')}
              </p>
            </div>
            
            <div className="bento-card bento-col-4" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', opacity: 0.9 }}>Quick Stats</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase' }}>{t('about_stat_1')}</div>
                  <div style={{ fontWeight: 500 }}>{t('about_stat_1_val')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase' }}>{t('about_stat_2')}</div>
                  <div style={{ fontWeight: 500 }}>{t('about_stat_2_val')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase' }}>{t('about_stat_4')}</div>
                  <div style={{ fontWeight: 500 }}>{t('about_stat_4_val')}</div>
                </div>
              </div>
            </div>

            <React.Suspense fallback={<div className="bento-card bento-col-12" style={{ minHeight: '520px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>INITIALIZING 3D ENGINE...</div>}>
              <ThreeDViewer t={t} theme={theme} />
            </React.Suspense>
          </div>
        </section>

        {/* ── Skills / Tech Stack Section ── */}
        <section id="skills">
          <h2 className="section-title">{t('skills_title')}</h2>
          <p className="section-subtitle">{t('skills_subtitle')}</p>
          
          <div className="bento-grid">
            <div className="bento-card bento-col-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Gamepad2 size={24} />
                <h3 style={{ fontSize: '1.2rem' }}>{t('skill_cat_engines')}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Unity</strong> <span>Advanced</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>URP / HDRP</strong> <span>Advanced</span></li>
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>{t('skill_unity_desc')}</p>
            </div>

            <div className="bento-card bento-col-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Code size={24} />
                <h3 style={{ fontSize: '1.2rem' }}>{t('skill_cat_languages')}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>C#</strong> <span>Advanced</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Swift (SwiftUI)</strong> <span>Intermediate</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>JavaScript / React</strong> <span>Intermediate</span></li>
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>{t('skill_swift_desc')}</p>
            </div>

            <div className="bento-card bento-col-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Box size={24} />
                <h3 style={{ fontSize: '1.2rem' }}>{t('skill_cat_tools')}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Blender</strong> <span>Advanced</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Git & GitHub</strong> <span>Advanced</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Figma</strong> <span>Intermediate</span></li>
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>{t('skill_blender_desc')}</p>
            </div>
          </div>
        </section>

        {/* ── Experience/Education Section ── */}
        <section id="timeline">
          <h2 className="section-title">{t('timeline_title')}</h2>
          <p className="section-subtitle">{t('timeline_subtitle')}</p>

          <div className="bento-grid">
            <div className="bento-card bento-col-12">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('timeline_event_3_year')}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{t('timeline_event_3_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('timeline_event_3_desc')}</p>
            </div>
          </div>
        </section>

        {/* ── Projects Section ── */}
        <section id="projects">
          <h2 className="section-title">{t('archives_title')}</h2>
          <p className="section-subtitle">{t('archives_subtitle')}</p>

          <div className="bento-grid">
            {/* Featured Project 1: Legend of the Three Masks */}
            <div className="bento-card bento-col-12" style={{ borderTop: '4px solid var(--text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t('games.m_title')}</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '800px' }}>{t('games.m_desc')}</p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <a href="https://unitybtw.itch.io/legend-of-the-three-masks" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                      <Gamepad2 size={16} /> Itch.io
                    </a>
                  </div>
                </div>
                <Gamepad2 size={32} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
              </div>
            </div>

            {/* Featured Project 2: Zero-Ads Arcade Engine */}
            <div className="bento-card bento-col-12" style={{ borderTop: '4px solid var(--text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t('games.arcade_engine_title')}</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '800px' }}>{t('games.arcade_engine_desc')}</p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                      <Github size={16} /> GitHub
                    </a>
                  </div>
                </div>
                <Cpu size={32} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
              </div>
            </div>

            {/* Signal */}
            <div className="bento-card bento-col-6" style={{ justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('games.signal_title')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('games.signal_desc')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <a href="https://github.com/unitybtw/Signal-macOS" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.4rem', width: 'fit-content' }}>
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>

            {/* Aether Command */}
            <div className="bento-card bento-col-6" style={{ justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('games.aether_title')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('games.aether_desc')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <a href="https://github.com/unitybtw/aether-command" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.4rem', width: 'fit-content' }}>
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer id="contact" className="footer app-container">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('footer_title')}</h2>
        <p style={{ marginBottom: '2rem' }}>{t('footer_subtitle')}</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <Linkedin size={18} /> LinkedIn
          </a>
          <a href="mailto:contact@example.com" className="btn-primary">
            <Mail size={18} /> {t('btn_transmit')}
          </a>
        </div>
        
        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} {t('footer_copyright')}
        </div>
      </footer>
    </>
  );
}

export default App;
