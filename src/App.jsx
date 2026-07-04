import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Gamepad2, Cpu, Mail } from 'lucide-react';
import './index.css';
import { LINKEDIN_URL } from './i18n';

// ── Page Progress Indicator ──────────────────────────────────────────────
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
      style={{ scaleX }}
    />
  );
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
  const { t } = useTranslation();

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

  // Parallax for Hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <>
      <PageProgress />
      
      {/* ── Navbar ── */}
      <nav className="glass-panel">
        <div style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
          {t('nav_name')}
        </div>
        <div className="nav-links">
          <a href="#about">{t('nav_about')}</a>
          <a href="#timeline">{t('timeline_title')}</a>
          <a href="#projects">{t('archives_title')}</a>
        </div>
        <a href="#contact" className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
          {t('nav_contact')}
        </a>
      </nav>

      <main className="app-container">
        {/* ── Hero Section ── */}
        <section className="hero-section" id="hero">
          <motion.div 
            style={{ y: y1, opacity: opacity1 }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like bezier
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
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Magnetic>
                <a href="#projects" className="btn-primary">
                  {t('btn_explore')} <ArrowRight size={18} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Github size={18} /> {t('btn_repos')}
                </a>
              </Magnetic>
            </div>
          </motion.div>
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
            
            <div className="bento-card bento-col-4" style={{ background: 'var(--text-primary)', color: 'white' }}>
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
                </div>
                <Cpu size={32} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
              </div>
            </div>

            {/* Signal */}
            <div className="bento-card bento-col-6">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('games.signal_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('games.signal_desc')}</p>
            </div>

            {/* Aether Command */}
            <div className="bento-card bento-col-6">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('games.aether_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('games.aether_desc')}</p>
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
