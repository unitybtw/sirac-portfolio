import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Briefcase, Mail } from 'lucide-react';
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

    // Fallback for browsers that don't support scroll-driven animations
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
      );

      document.querySelectorAll('.bento-card').forEach((el) => {
        el.classList.add('js-scroll-reveal');
        observer.observe(el);
      });

      return () => {
        observer.disconnect();
        lenis.destroy();
      };
    }

    return () => lenis.destroy();
  }, []);

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
              <a href="#projects" className="btn-primary">
                {t('btn_explore')} <ArrowRight size={18} />
              </a>
              <a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Github size={18} /> {t('btn_repos')}
              </a>
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

        {/* ── Experience Section ── */}
        <section id="timeline">
          <h2 className="section-title">{t('timeline_title')}</h2>
          <p className="section-subtitle">{t('timeline_subtitle')}</p>

          <div className="bento-grid">
            <div className="bento-card bento-col-6">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('timeline_event_4_year')}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{t('timeline_event_4_title')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('timeline_event_4_desc')}</p>
            </div>
            
            <div className="bento-card bento-col-6">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('timeline_event_3_year')}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{t('timeline_event_3_title')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('timeline_event_3_desc')}</p>
            </div>

            <div className="bento-card bento-col-6">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('timeline_event_2_year')}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{t('timeline_event_2_title')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('timeline_event_2_desc')}</p>
            </div>

            <div className="bento-card bento-col-6">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('timeline_event_1_year')}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{t('timeline_event_1_title')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('timeline_event_1_desc')}</p>
            </div>
          </div>
        </section>

        {/* ── Projects Section ── */}
        <section id="projects">
          <h2 className="section-title">{t('archives_title')}</h2>
          <p className="section-subtitle">{t('archives_subtitle')}</p>

          <div className="bento-grid">
            {/* Featured Project */}
            <div className="bento-card bento-col-12" style={{ borderTop: '4px solid var(--text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t('games.m_title')}</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>{t('games.m_desc')}</p>
                </div>
                <Briefcase size={32} color="var(--border-subtle)" />
              </div>
            </div>

            {/* Minor Projects */}
            <div className="bento-card bento-col-6">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('games.macos_title')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('games.macos_desc')}</p>
            </div>

            <div className="bento-card bento-col-6">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Classic Arcade Core</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('games.fb_desc')}</p>
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
