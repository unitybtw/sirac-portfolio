import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Gamepad2, Cpu, Mail, Sun, Moon, Globe, Download, Code, MonitorSmartphone, Box, Database, X, GraduationCap, Award, BookOpen, ChevronDown, ChevronUp, FolderGit2, Activity, MapPin } from 'lucide-react';
import './index.css';
import { LINKEDIN_URL } from './i18n';

// Ekranın altında kalan ağır bileşenler: ilk paint'i bloklamasın,
// main thread boş kalsın ki scroll 120Hz'de takılmasın.
const GitHubCommitHistory = lazy(() => import('./GitHubCommitHistory'));
const NovaBrowserCard = lazy(() => import('./NovaBrowserCard'));
const GameLibrary = lazy(() => import('./GameLibrary'));


// ── Page Progress Indicator ──────────────────────────────────────────────
const PageProgress = () => {
  const barRef = useRef(null);
  
  useEffect(() => {
    // Only run JS fallback if browser doesn't support native CSS scroll-timeline
    if (!CSS.supports('animation-timeline: scroll()')) {
      let docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const updateDocHeight = () => {
        docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
      };
      window.addEventListener('resize', updateDocHeight, { passive: true });

      const handleScroll = () => {
        if (!barRef.current) return;
        const scrollPercent = window.scrollY / docHeight;
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollPercent))})`;
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial set
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateDocHeight);
      };
    }
  }, []);

  return <div className="page-progress-bar" ref={barRef} />;
};



// ── Hero giriş varyantları (kademeli: rozet → başlık → alt yazı → butonlar) ──
const heroParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const heroChild = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
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

  // Contact Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | sending | success | error

  // Timeline Expand State
  const [expandedEventId, setExpandedEventId] = useState(null);

  const toggleExpandEvent = (id) => {
    setExpandedEventId(prev => prev === id ? null : id);
  };

  const timelineEvents = [
    {
      id: 'event_3',
      yearKey: 'timeline_event_3_year',
      titleKey: 'timeline_event_3_title',
      descKey: 'timeline_event_3_desc',
      detailsKey: 'timeline_event_3_details',
      icon: <GraduationCap size={18} />
    },
    {
      id: 'event_2',
      yearKey: 'timeline_event_2_year',
      titleKey: 'timeline_event_2_title',
      descKey: 'timeline_event_2_desc',
      detailsKey: 'timeline_event_2_details',
      icon: <Award size={18} />
    },
    {
      id: 'event_1',
      yearKey: 'timeline_event_1_year',
      titleKey: 'timeline_event_1_title',
      descKey: 'timeline_event_1_desc',
      detailsKey: 'timeline_event_1_details',
      icon: <BookOpen size={18} />
    }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New Portfolio Message from ${formState.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

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

  // Toggle Theme — smooth vertical wipe via View Transitions API
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    // Fallback for browsers without View Transitions
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  // Language transition state
  const [isLangTransitioning, setIsLangTransitioning] = useState(false);

  // Toggle Language with smooth transition
  const toggleLanguage = () => {
    if (isLangTransitioning) return;
    setIsLangTransitioning(true);
    setTimeout(() => {
      const nextLang = i18n.language === 'tr' ? 'en' : 'tr';
      i18n.changeLanguage(nextLang);
      setTimeout(() => setIsLangTransitioning(false), 350);
    }, 250);
  };

  // Smooth Scrolling (120Hz-tuned: lerp-based, leaksiz rAF, reduced-motion saygılı)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    // Hareket hassasiyeti olan kullanıcıda smooth-scroll'u kapat (erişilebilirlik + pil)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.14, // Akıcı ve gecikmesiz 120Hz/60Hz tepki
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
      smoothTouch: false,
    });

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose the real instance + RAF pause/resume helpers so GameLibrary (arcade
    // modal) can freeze background scrolling. Guards inside GameLibrary treat
    // anything without a start/stop function (e.g. Vite's leaked module shim on
    // window.lenis) as absent instead of crashing.
    window.lenis = lenis;
    window.lenisRafPause = () => cancelAnimationFrame(rafId);
    window.lenisRafResume = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(raf);
    };

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

    // Clean up fallback observer if it exists
    let observer;
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('is-revealed');
              }, index * 100);
              observer.unobserve(entry.target); 
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      document.querySelectorAll('.bento-card, .section-title, .section-subtitle, .contact-info, .contact-form-container').forEach((el) => {
        el.classList.add('js-scroll-reveal');
        observer.observe(el);
      });
    }

    return () => {
      if (observer) observer.disconnect();
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      if (window.lenis === lenis) window.lenis = undefined;
      window.lenisRafPause = undefined;
      window.lenisRafResume = undefined;
      lenis.destroy();
    };
  }, []);

  // Parallax for Hero is now handled purely in CSS via .hero-parallax-content

  // Dock durumu: DOM üzerinden doğrudan classList yönetimi (App re-render etmez)
  const dockRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    let ticking = false;
    let isCompact = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const compact = window.scrollY > 48;
        if (compact !== isCompact) {
          isCompact = compact;
          if (dockRef.current) {
            dockRef.current.classList.toggle('is-compact', compact);
          }
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id === 'hero' ? null : e.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    const spyIds = ['hero', 'projects', 'arcade', 'github-activity', 'contact'];
    spyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      spy.disconnect();
    };
  }, []);

  const dockLinks = [
    { id: 'projects', anim: 'projects', href: '#projects', label: t('archives_title'), icon: <FolderGit2 size={17} /> },
    { id: 'github-activity', anim: 'github-activity', href: '#github-activity', label: i18n.language === 'tr' ? 'Aktivite' : 'Activity', icon: <Activity size={17} /> },
    { id: 'arcade', anim: 'arcade', href: '#arcade', label: t('arcade_section_title'), icon: <Gamepad2 size={17} /> },
    { id: 'contact', anim: 'contact', href: '#contact', label: t('nav_contact'), icon: <Mail size={17} /> },
  ];

  // Arcade (oyun kütüphanesi) modal durumu
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null);

  return (
    <>
      <PageProgress />
      
      {/* ── Floating Dock ── */}
      <nav
        ref={dockRef}
        className="dock"
        aria-label="Primary"
      >
        <a href="#hero" className="dock-mono" title="Siraç G. Şimşek" aria-label="Back to top">
          S
        </a>

        <span className="dock-sep" aria-hidden="true" />

        {dockLinks.map((l) => (
          <a
            key={l.id}
            href={l.href}
            data-anim={l.anim}
            title={l.label}
            aria-label={l.label}
            aria-current={activeSection === l.id ? 'true' : undefined}
            className={`dock-item${activeSection === l.id ? ' is-active' : ''}`}
          >
            {activeSection === l.id && (
              <motion.span
                layoutId="dock-pill"
                className="dock-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="dock-icon">{l.icon}</span>
            <span key={l.label} className="dock-label dock-label-swap">{l.label}</span>
          </a>
        ))}

        <span className="dock-sep" aria-hidden="true" />

        {/* Language */}
        <button
          onClick={toggleLanguage}
          className="dock-icon-btn dock-control"
          title="Change Language"
          aria-label="Change Language"
        >
          <span key={i18n.language} className="dock-swap dock-lang">{i18n.language === 'tr' ? 'EN' : 'TR'}</span>
        </button>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="dock-icon-btn dock-control"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          <span key={theme} className="dock-swap">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </span>
        </button>

        {/* CV — öne çıkan buton */}
        <a
          href={`${import.meta.env.BASE_URL}cv.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-cv"
          title={t('btn_view_cv')}
        >
          <Download size={15} />
          <span key={t('btn_view_cv')} className="dock-label dock-label-swap">{t('btn_view_cv')}</span>
        </a>
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
          onClick={(e) => toggleTheme(e)} 
          className="btn-outline" 
          style={{ padding: '0.4rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <motion.main
        className="app-container"
        animate={{
          opacity: isLangTransitioning ? 0 : 1,
          y: isLangTransitioning ? -8 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Hero Section (Asymmetric & Typographic) ── */}
        <section className="hero-section" id="hero">
          <div className="hero-parallax-content" style={{ width: '100%' }}>
            <div className="hero-layout-grid">
              {/* Left Column: Asymmetric Typography & Actions */}
              <motion.div
                className="hero-left-column"
                variants={heroParent}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={heroChild} className="hero-status-pill">
                  <span className="live-status-chip">
                    <span className="live-status-dot" />
                    {t('badge_hire')}
                  </span>
                </motion.div>

                <motion.h1 variants={heroChild} className="hero-main-title">
                  {t('hero_title_1')}
                  <span className="hero-title-accent">{t('hero_title_2')}</span>
                </motion.h1>

                <motion.div variants={heroChild} className="hero-meta-subtitle">
                  <span>{t('hero_subtitle_1')}</span>
                </motion.div>

                <motion.div variants={heroChild} className="hero-academic-tag">
                  {t('hero_subtitle_2')}
                </motion.div>

                <motion.p variants={heroChild} className="hero-tagline-text">
                  {t('hero_tagline')}
                </motion.p>

                <motion.div variants={heroChild} className="hero-actions-row">
                  <a href="#projects" className="btn-primary">
                    {t('btn_explore')} <ArrowRight size={17} />
                  </a>
                  <a
                    href={`${import.meta.env.BASE_URL}cv.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    <Download size={17} /> {t('btn_view_cv')}
                  </a>
                  <a
                    href="https://github.com/unitybtw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-btn"
                    title="GitHub"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-btn"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                </motion.div>
              </motion.div>

              {/* Right Column: Professional Portrait Showcase */}
              <motion.div
                className="hero-right-column"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hero-portrait-card">
                  <img
                    src={`${import.meta.env.BASE_URL}sirac_portrait.jpg`}
                    alt="Sıraç Göktuğ Şimşek"
                    className="hero-portrait-img"
                    loading="eager"
                  />

                  {/* Top Location Badge */}
                  <div className="hero-portrait-top-badge">
                    <MapPin size={12} />
                    <span>İstanbul, TR</span>
                  </div>

                  {/* Floating Glass Meta Overlay */}
                  <div className="hero-portrait-overlay">
                    <div className="hero-portrait-name">
                      Sıraç Göktuğ Şimşek
                    </div>
                    <div className="hero-portrait-role">
                      {t('hero_subtitle_1')}
                    </div>
                    <div className="hero-portrait-meta">
                      <span>{t('hero_subtitle_2')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── About Section ── */}
        <section id="about">
          <h2 className="section-title">{t('about_title')}</h2>
          <p className="section-subtitle">{t('about_subtitle')}</p>
          
          <div className="bento-grid">
            <div className="bento-card bento-col-8">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{t('about_bio_heading')}</h3>
              <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                {t('about_text_1')}
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                {t('about_text_2')}
              </p>
            </div>
            
            <div className="bento-card bento-col-4">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('about_stats_heading')}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{t('about_stat_1')}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t('about_stat_1_val')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{t('about_stat_2')}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t('about_stat_2_val')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{t('about_stat_4')}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t('about_stat_4_val')}</div>
                </div>
              </div>
            </div>
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
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Unity</strong>
                  <span className="skill-pill-badge">{t('skill_level_advanced')}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>URP / HDRP</strong>
                  <span className="skill-pill-badge">{t('skill_level_advanced')}</span>
                </li>
              </ul>
              <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{t('skill_unity_desc')}</p>
            </div>

            <div className="bento-card bento-col-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Code size={24} />
                <h3 style={{ fontSize: '1.2rem' }}>{t('skill_cat_languages')}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>C#</strong>
                  <span className="skill-pill-badge">{t('skill_level_advanced')}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Swift (SwiftUI)</strong>
                  <span className="skill-pill-badge">{t('skill_level_intermediate')}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>JavaScript / React</strong>
                  <span className="skill-pill-badge">{t('skill_level_intermediate')}</span>
                </li>
              </ul>
              <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{t('skill_languages_desc')}</p>
            </div>

            <div className="bento-card bento-col-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Box size={24} />
                <h3 style={{ fontSize: '1.2rem' }}>{t('skill_cat_tools')}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Blender</strong>
                  <span className="skill-pill-badge">{t('skill_level_advanced')}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Git & GitHub</strong>
                  <span className="skill-pill-badge">{t('skill_level_advanced')}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Figma</strong>
                  <span className="skill-pill-badge">{t('skill_level_intermediate')}</span>
                </li>
              </ul>
              <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{t('skill_blender_desc')}</p>
            </div>
          </div>
        </section>

        <section id="timeline">
          <h2 className="section-title">{t('timeline_title')}</h2>
          <p className="section-subtitle">{t('timeline_subtitle')}</p>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            {timelineEvents.map((event) => {
              const isExpanded = expandedEventId === event.id;
              return (
                <div 
                  key={event.id} 
                  className={`timeline-item ${isExpanded ? 'active' : ''}`}
                  onClick={() => toggleExpandEvent(event.id)}
                >
                  <div className="timeline-icon-node">
                    {event.icon}
                  </div>
                  
                  <div className="timeline-content bento-card">
                    <div className="timeline-header-meta">
                      <span className="timeline-year">{t(event.yearKey)}</span>
                      <span className="timeline-toggle-chevron">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>
                    
                    <h3 className="timeline-item-title">{t(event.titleKey)}</h3>
                    <p className="timeline-item-desc">{t(event.descKey)}</p>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          className="timeline-expanded-details"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <ul className="timeline-details-list">
                            {t(event.detailsKey, { returnObjects: true }).map((detail, idx) => (
                              <li key={idx} className="timeline-details-item">{detail}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Projects Section ── */}
        <section id="projects">
          <h2 className="section-title">{t('archives_title')}</h2>
          <p className="section-subtitle">{t('archives_subtitle')}</p>

          <div className="bento-grid">
            {/* Flagship Project: Nova Browser with Screenshot Showcase */}
            <Suspense fallback={<div className="bento-card bento-col-12" style={{ minHeight: '300px' }} />}>
              <NovaBrowserCard />
            </Suspense>

            {/* Featured Project: Legend of the Three Masks */}
            <div className="bento-card bento-col-12">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>{t('games.m_title')}</h3>
                    <span className="project-badge project-badge-released">
                      {t('games.badge_released')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                    <span className="tech-tag">Unity 3D</span>
                    <span className="tech-tag">C#</span>
                    <span className="tech-tag">URP</span>
                    <span className="tech-tag">Blender</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.6, fontSize: '0.95rem' }}>{t('games.m_desc')}</p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <a href="https://unitybtw.itch.io/legend-of-the-three-masks" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
                      <Gamepad2 size={16} /> Itch.io
                    </a>
                  </div>
                </div>
                <Gamepad2 size={36} color="var(--text-secondary)" style={{ opacity: 0.25 }} />
              </div>
            </div>

            {/* Signal */}
            <div className="bento-card bento-col-6" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>{t('games.signal_title')}</h3>
                  <span className="project-badge project-badge-open">
                    {t('games.badge_open_source')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className="tech-tag">Swift</span>
                  <span className="tech-tag">SwiftUI</span>
                  <span className="tech-tag">Core Audio</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t('games.signal_desc')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <a href="https://github.com/unitybtw/Signal-macOS" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', width: 'fit-content' }}>
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>

            {/* Aether Command */}
            <div className="bento-card bento-col-6" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>{t('games.aether_title')}</h3>
                  <span className="project-badge project-badge-open">
                    {t('games.badge_open_source')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className="tech-tag">Swift</span>
                  <span className="tech-tag">Vision API</span>
                  <span className="tech-tag">AppKit</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t('games.aether_desc')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <a href="https://github.com/unitybtw/aether-command" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', width: 'fit-content' }}>
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── GitHub Commit History Section ── */}
        <section id="github-activity">
          <Suspense fallback={<div className="bento-card bento-col-12" style={{ minHeight: '300px' }} />}>
            <GitHubCommitHistory />
          </Suspense>
        </section>

        {/* ── Arcade / Game Library ── */}
        <section id="arcade">
          <h2 className="section-title">{t('arcade_section_title')}</h2>
          <p className="section-subtitle">{t('arcade_section_subtitle')}</p>
          <Suspense fallback={<div className="bento-card bento-col-12" style={{ minHeight: '320px' }} />}>
            <GameLibrary
              isOpen={isArcadeOpen}
              setIsOpen={setIsArcadeOpen}
              activeGameId={activeGameId}
              setActiveGameId={setActiveGameId}
            />
          </Suspense>
        </section>
      </motion.main>

      {/* ── Footer / Contact ── */}
      <motion.footer
        id="contact"
        className="footer app-container"
        animate={{
          opacity: isLangTransitioning ? 0 : 1,
          y: isLangTransitioning ? -8 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>{t('footer_title')}</h2>
            <p className="contact-subtitle" style={{ marginBottom: '2rem' }}>{t('footer_subtitle')}</p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Linkedin size={18} /> LinkedIn
              </a>
              <a href="mailto:sgoktug34@gmail.com" className="btn-outline">
                <Mail size={18} /> Email
              </a>
            </div>
            
            <div className="availability-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', flexShrink: 0 }}></span>
              {t('about_stat_4_val')}
            </div>
          </div>
          
          <div className="contact-form-container">
            <form onSubmit={handleFormSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">{t('form_name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  placeholder={t('form_placeholder_name')}
                  required
                  disabled={submitStatus === 'sending'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t('form_email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleFormChange}
                  placeholder={t('form_placeholder_email')}
                  required
                  disabled={submitStatus === 'sending'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t('form_message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleFormChange}
                  placeholder={t('form_placeholder_message')}
                  required
                  rows={4}
                  disabled={submitStatus === 'sending'}
                ></textarea>
              </div>

              <AnimatePresence initial={false}>
                {submitStatus === 'success' && (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="form-alert alert-success"
                  >
                    {t('form_success')}
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="form-alert alert-danger"
                  >
                    {t('form_error')}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={submitStatus === 'sending'}
              >
                {submitStatus === 'sending' ? t('form_sending') : t('form_submit')}
              </button>
            </form>
          </div>
        </div>
        
        <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          © {new Date().getFullYear()} {t('footer_copyright')}
        </div>
      </motion.footer>
    </>
  );
}

export default App;
