import React, { useEffect, useState, useRef, Suspense } from 'react';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Gamepad2, Cpu, Mail, Sun, Moon, Globe, Download, Code, MonitorSmartphone, Box, Database, X, GraduationCap, Award, BookOpen, ChevronDown, ChevronUp, FolderGit2, Activity, MapPin, User } from 'lucide-react';
import './index.css';
import './portfolio-refresh.css';
import './portfolio-motion.css';
import { usePortfolioMotion } from './hooks/usePortfolioMotion';
import { createScrollFrameLoop } from './utils/scrollFrameLoop';
import { AboutSection, SkillsSection, ProjectsSection, ContactIntro } from './components/PortfolioSections';
import { LINKEDIN_URL } from './i18n';
import { SlideNavbar } from './components/ui/slide-tabs';
import AsciiSceneBuilder from './components/AsciiSceneBuilder';
import MiniSiracCompanions from './components/MiniSiracCompanions';
import MiniSiracDrag from './components/MiniSiracDrag';
import CaseStudiesSection from './components/CaseStudiesSection';

// Keep section geometry available on the first render. Lazy game runtimes still
// load only after selection; delaying page sections shifted restored scroll positions.
import GitHubCommitHistory from './GitHubCommitHistory';
import NovaBrowserShowcase from './NovaBrowserShowcase';
import GameLibrary from './GameLibrary';

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
  usePortfolioMotion();
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
      icon: <Code size={18} />
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

  // Toggle Theme: smooth vertical wipe via View Transitions API
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

  // Language change state for reactive updates
  const [currentLang, setCurrentLang] = useState(i18n.language || 'tr');

  // Toggle Language with native View Transitions & directional micro-animations
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'tr' ? 'en' : 'tr';

    // Fallback if View Transitions API is not available
    if (!document.startViewTransition) {
      i18n.changeLanguage(nextLang);
      setCurrentLang(nextLang);
      return;
    }

    document.documentElement.classList.add('transition-lang');
    const transition = document.startViewTransition(() => {
      i18n.changeLanguage(nextLang);
      setCurrentLang(nextLang);
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove('transition-lang');
    });
  };

  // Smooth Scrolling (120Hz-tuned: lerp-based, leaksiz rAF, reduced-motion saygılı)
  useEffect(() => {
    // Let the browser preserve the visitor's position across reload/back navigation.
    window.history.scrollRestoration = 'auto';

    // Hareket hassasiyeti olan kullanıcıda smooth-scroll'u kapat (erişilebilirlik + pil)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.14, // Responsive easing without a long trailing scroll
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
      smoothTouch: false,
    });

    const frames = createScrollFrameLoop({
      tick: time => lenis.raf(time),
      isAnimating: () => lenis.isScrolling === 'smooth',
      request: callback => requestAnimationFrame(callback),
      cancel: id => cancelAnimationFrame(id),
      isVisible: () => !document.hidden,
    });
    const wake = () => frames.wake();
    const visibilityChanged = () => frames.visibilityChanged();
    window.addEventListener('wheel', wake, { passive: true });
    lenis.on('scroll', wake);
    document.addEventListener('visibilitychange', visibilityChanged);
    window.lenis = lenis;
    window.lenisRafPause = () => frames.pause();
    window.lenisRafResume = () => frames.resume();

    // Handle Anchor Clicks smoothly with Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (e.defaultPrevented || target?.classList.contains('skip-link')) return;
      if (target && target.getAttribute('href')?.startsWith('#')) {
        const id = target.getAttribute('href');
        if (id === '#') return;
        const section = document.querySelector(id);
        const anchorSelector = id === '#projects' ? '#projects .nova-showcase' : `${id} .portfolio-section-heading, ${id} .gh-section-header, ${id} .contact-grid`;
        const targetElement = document.querySelector(anchorSelector) || section?.querySelector(':scope > .section-title') || section;
        if (targetElement) {
          e.preventDefault();
          // Measure after the mobile drawer releases body scroll. Lazy sections can
          // also change the page height during the journey, so align once more at rest.
          requestAnimationFrame(() => {
            const gap = window.innerWidth <= 768 ? 88 : 96;
            // Numeric destinations avoid applying both CSS scroll-margin and the
            // navigation offset. Align visible content rather than section padding.
            const destination = element => element.getBoundingClientRect().top + window.scrollY - gap;
            lenis.resize();
            lenis.scrollTo(destination(targetElement), {
              duration: 0.85,
              onComplete: () => {
                lenis.resize();
                const settledSection = document.querySelector(id);
                const settledTarget = document.querySelector(anchorSelector) || settledSection?.querySelector(':scope > .section-title') || settledSection;
                if (settledTarget && Math.abs(destination(settledTarget) - window.scrollY) > 2) {
                  lenis.scrollTo(destination(settledTarget), { duration: 0.18 });
                  frames.wake();
                }
              },
            });
            frames.wake();
          });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('wheel', wake);
      document.removeEventListener('visibilitychange', visibilityChanged);
      lenis.off('scroll', wake);
      frames.dispose();
      if (window.lenis === lenis) window.lenis = undefined;
      window.lenisRafPause = undefined;
      window.lenisRafResume = undefined;
      lenis.destroy();
    };
  }, []);

  // Section reveals share one observer; hero character motion is independent.

  // Scroll spy: sayfanın neresinde olduğumuzu tespit edip SlideTabs'a bildirir
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id === 'hero' ? null : e.target.id === 'other-projects' ? 'projects' : e.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    const spyIds = ['hero', 'about', 'projects', 'other-projects', 'case-studies', 'github-activity', 'arcade', 'contact'];
    spyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    return () => {
      spy.disconnect();
    };
  }, []);

  // Arcade (oyun kütüphanesi) modal durumu
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null);

  return (
    <>
      <PageProgress />
      <MiniSiracCompanions />
      <MiniSiracDrag />
      
      {/* ── SlideTabs Floating Dock Navbar ── */}
      <SlideNavbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={currentLang}
        onToggleLang={toggleLanguage}
      />

      {/* ── Hero Section ── */}
      <section className="hero-section" id="hero">
        <div className="hero-parallax-content">
          <div className="hero-layout-grid">
              {/* Left Column: Asymmetric Typography & Actions */}
              <motion.div
                className="hero-left-column"
                variants={heroParent}
                initial="hidden"
                animate="show"
              >
                <div className="ascii-target-group" data-ascii-target="title">
                  {/* Clean Metadata Line (No SaaS pill container, no pulsing neon dot) */}
                  <motion.div variants={heroChild} className="hero-meta-row">
                    <span className="hero-meta-location"><MapPin size={13} /> {t('hero_location')}</span>
                    <span className="hero-meta-divider">/</span>
                    <span className="hero-meta-status">{t('badge_hire')}</span>
                  </motion.div>

                  {/* Direct, Authentic Main Title */}
                  <motion.div variants={heroChild} className="hero-heading-group">
                    <h1 className="hero-main-title">
                      <span className="hero-name-lead">{t('hero_name')}:</span> {t('hero_title')}
                    </h1>
                  </motion.div>
                </div>

                <div className="ascii-target-group" data-ascii-target="details">
                  {/* Narrative Intro */}
                  <motion.p variants={heroChild} className="hero-tagline-text">
                    {t('hero_tagline')}
                  </motion.p>

                  {/* Tech Stack Pills */}
                  <motion.div variants={heroChild} className="hero-stack-pills">
                    <span className="tech-tag">Unity 3D</span>
                    <span className="tech-tag">C#</span>
                    <span className="tech-tag">TypeScript</span>
                    <span className="tech-tag">Electron</span>
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Blender</span>
                  </motion.div>
                </div>

                {/* Action Buttons & Social Links */}
                <div className="ascii-target-group" data-ascii-target="actions">
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
                    <div className="hero-social-divider" />
                    <div className="hero-socials-group">
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
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column: AI Portrait Showcase + Full-Body ASCII Scene Builder */}
              <motion.div
                className="hero-right-column"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ flexDirection: 'column', gap: '0.75rem' }}
              >
                <div className="hero-portrait-card" data-ascii-target="portrait">
                  <img
                    src={import.meta.env.VITE_PROFILE_PHOTO_URL || "https://files.catbox.moe/y8qlp8.jpg"}
                    alt="Sıraç Göktuğ Şimşek"
                    className="hero-portrait-img"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width="380"
                    height="475"
                  />
                  <div className="hero-portrait-scrim" />

                  {/* Floating Meta Overlay */}
                  <div className="hero-portrait-overlay">
                    <div className="hero-portrait-name">
                      Sıraç Göktuğ Şimşek
                    </div>
                    <div className="hero-portrait-role">
                      <span className="hero-portrait-status-dot" />
                      <span>{t('hero_title')}</span>
                    </div>
                  </div>
                </div>

                <AsciiSceneBuilder lang={currentLang} />
              </motion.div>
            </div>
          </div>

        </section>

        <main className="app-container">
          <AboutSection />
          <SkillsSection />

        <section id="timeline" data-motion>
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
        <section id="projects" aria-labelledby="nova-heading">
          <Suspense fallback={<div className="nova-showcase" style={{ minHeight: '950px' }} />}>
            <NovaBrowserShowcase />
          </Suspense>
        </section>

        <ProjectsSection />

        {/* ── Engineering Case Studies Section ── */}
        <CaseStudiesSection />

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
      </main>

      {/* ── Footer / Contact ── */}
      <footer
        id="contact"
        className="footer app-container portfolio-contact"
      >
        <div className="contact-grid">
          <ContactIntro />

          <div className="contact-form-container" data-motion data-motion-order="1">
            <div className="contact-form-heading"><Mail size={18}/><span>{currentLang === 'tr' ? 'Aklında ne var?' : 'What do you have in mind?'}</span></div>
            <form onSubmit={handleFormSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">{t('form_name')}</label>
                <input
                  type="text"
                  autoComplete="name"
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
                  autoComplete="email"
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
              
              <div className="contact-submit-scene">
              <button 
                data-sirac-submit
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={submitStatus === 'sending'}
              >
                {submitStatus === 'sending' ? t('form_sending') : t('form_submit')}
              </button>
              </div>
            </form>
          </div>
        </div>
        
        <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          © {new Date().getFullYear()} {t('footer_copyright')}
        </div>
      </footer>
    </>
  );
}

export default App;
