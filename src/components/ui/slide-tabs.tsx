import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, FolderGit2, Activity, Gamepad2, Mail, Sun, Moon, Download, Menu, X } from "lucide-react";

export interface TabItem {
  id: string;
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Position {
  left: number;
  width: number;
  opacity: number;
}

export interface SlideTabsProps {
  items?: TabItem[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  showIcons?: boolean;
  variant?: "portfolio" | "monochrome";
}

// Siraç'ın Portföyü için Varsayılan Bölüm Sekmeleri
export const DEFAULT_PORTFOLIO_TABS: TabItem[] = [
  { id: "hero", href: "#hero", label: "Giriş", icon: <Home size={14} /> },
  { id: "about", href: "#about", label: "Hakkımda", icon: <User size={14} /> },
  { id: "projects", href: "#projects", label: "Projeler", icon: <FolderGit2 size={14} /> },
  { id: "github-activity", href: "#github-activity", label: "Katkılar", icon: <Activity size={14} /> },
  { id: "arcade", href: "#arcade", label: "Arcade", icon: <Gamepad2 size={14} /> },
  { id: "contact", href: "#contact", label: "İletişim", icon: <Mail size={14} /> },
];

export const SlideTabs: React.FC<SlideTabsProps> = ({
  items = DEFAULT_PORTFOLIO_TABS,
  activeId,
  onSelect,
  className = "",
  showIcons = true,
  variant = "portfolio",
}) => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const updatePositionToActive = () => {
    if (activeId && tabRefs.current[activeId]) {
      const activeEl = tabRefs.current[activeId];
      if (activeEl) {
        const { width } = activeEl.getBoundingClientRect();
        setPosition({
          left: activeEl.offsetLeft,
          width,
          opacity: 1,
        });
        return;
      }
    }
    setPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    updatePositionToActive();
  }, [activeId, items]);

  useEffect(() => {
    const handleResize = () => updatePositionToActive();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeId, items]);

  const handleTabClick = (item: TabItem) => {
    // Let the app's shared anchor handler align after lazy content settles.
    onSelect?.(item.id);
  };

  // 1. Monochrome (Orijinal mix-blend-difference stili)
  if (variant === "monochrome") {
    return (
      <ul
        onMouseLeave={updatePositionToActive}
        className={`relative mx-auto flex w-fit rounded-md border-2 border-black bg-white p-1 ${className}`}
      >
        {items.map((tab) => (
          <li
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            onMouseEnter={() => {
              const el = tabRefs.current[tab.id];
              if (!el) return;
              const { width } = el.getBoundingClientRect();
              setPosition({ left: el.offsetLeft, width, opacity: 1 });
            }}
            className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white mix-blend-difference md:px-5 md:py-2.5 md:text-sm"
          >
            <a
              href={tab.href}
              onClick={() => handleTabClick(tab)}
              className="inline-flex items-center gap-1.5 text-inherit no-underline"
            >
              {showIcons && tab.icon}
              <span>{tab.label}</span>
            </a>
          </li>
        ))}
        <motion.li
          animate={position}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute z-0 h-7 rounded-md bg-black md:h-10"
        />
      </ul>
    );
  }

  // 2. Portfolio Stili (Temaya duyarlı cam dock)
  return (
    <ul
      onMouseLeave={updatePositionToActive}
      className={`slide-tabs-list ${className}`}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <li
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            onMouseEnter={() => {
              const el = tabRefs.current[tab.id];
              if (!el) return;
              const { width } = el.getBoundingClientRect();
              setPosition({ left: el.offsetLeft, width, opacity: 1 });
            }}
            style={{ position: "relative", zIndex: 10 }}
          >
            <a
              href={tab.href}
              onClick={() => handleTabClick(tab)}
              className={`slide-tab-link ${isActive ? 'is-active' : ''}`}
            >
              {showIcons && <span className="slide-tab-icon" style={{ opacity: 0.85, display: "flex" }}>{tab.icon}</span>}
              <span className="slide-tab-label">{tab.label}</span>
            </a>
          </li>
        );
      })}

      {/* Kayar İmleç (Pill Cursor) */}
      <motion.li
        animate={position}
        transition={{ type: "spring", stiffness: 440, damping: 33 }}
        className="slide-tab-cursor-pill"
      />
    </ul>
  );
};

// ── Siraç'ın Portföyü için Tam Donanımlı Floating Slide Navbar ──────────
export interface SlideNavbarProps {
  activeSection?: string | null;
  theme?: "light" | "dark";
  onToggleTheme?: (e: React.MouseEvent) => void;
  lang?: "tr" | "en";
  onToggleLang?: () => void;
}

export const SlideNavbar: React.FC<SlideNavbarProps> = ({
  activeSection,
  theme = "light",
  onToggleTheme,
  lang = "tr",
  onToggleLang,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const tabs: TabItem[] = [
    { id: "hero", href: "#hero", label: lang === "tr" ? "Giriş" : "Home", icon: <Home size={14} /> },
    { id: "about", href: "#about", label: lang === "tr" ? "Hakkımda" : "About", icon: <User size={14} /> },
    { id: "projects", href: "#projects", label: lang === "tr" ? "Projeler" : "Projects", icon: <FolderGit2 size={14} /> },
    { id: "github-activity", href: "#github-activity", label: lang === "tr" ? "Katkılar" : "Activity", icon: <Activity size={14} /> },
    { id: "arcade", href: "#arcade", label: "Arcade", icon: <Gamepad2 size={14} /> },
    { id: "contact", href: "#contact", label: lang === "tr" ? "İletişim" : "Contact", icon: <Mail size={14} /> },
  ];

  const mobileTabs = tabs.filter(t => t.id !== "arcade");

  return (
    <>
      {/* ── Desktop Floating Dock (>= 769px) ── */}
      <motion.header
        className="slide-navbar-root"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 24, delay: 0.08 }}
        aria-label="Primary Navigation"
      >
        <div className="slide-navbar-dock" data-ascii-target="navbar">
          {/* Orta Kayar Sekmeler (SlideTabs) */}
          <SlideTabs items={tabs} activeId={activeSection} />

          {/* Sağ Hızlı Butonlar: 3 Hızlı Buton (TR/EN, Tema, CV) */}
          <motion.div
            className="slide-controls-cluster"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.15,
                },
              },
            }}
          >
            {/* 1. Dil Butonu (TR / EN) */}
            {onToggleLang && (
              <motion.button
                variants={{
                  hidden: { opacity: 0, x: -16, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  },
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={onToggleLang}
                className="slide-circle-btn"
                title={lang === "tr" ? "Switch to English" : "Türkçe'ye Geç"}
                aria-label="Toggle language"
                style={{ overflow: "hidden", position: "relative" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={lang}
                    initial={{ y: 10, opacity: 0, rotateX: -60 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -10, opacity: 0, rotateX: 60 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "inline-block", transformOrigin: "center" }}
                  >
                    {lang === "tr" ? "EN" : "TR"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            )}

            {/* 2. Tema Butonu (Karanlık / Aydınlık Mod) */}
            {onToggleTheme && (
              <motion.button
                variants={{
                  hidden: { opacity: 0, x: -16, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  },
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={onToggleTheme}
                className="slide-circle-btn"
                title={theme === "light" ? (lang === "tr" ? "Karanlık Mod" : "Dark Mode") : (lang === "tr" ? "Aydınlık Mod" : "Light Mode")}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </motion.button>
            )}

            {/* 3. CV İndir Butonu */}
            <motion.a
              variants={{
                hidden: { opacity: 0, x: -16, scale: 0.8 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                },
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              href={`${import.meta.env.BASE_URL}cv.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              title={lang === "tr" ? "CV İndir (PDF)" : "Download CV (PDF)"}
              className="slide-circle-btn slide-cv-circle"
              aria-label="Download CV"
            >
              <Download size={14} />
            </motion.a>
          </motion.div>
        </div>
      </motion.header>

      {/* ── Mobile Top Header & Hamburger Navigation (< 769px) ── */}
      <header className="mobile-nav-header" data-ascii-target="navbar">
        <a
          href="#hero"
          className="mobile-brand"
          onClick={() => setMobileOpen(false)}
        >
          <span className="mobile-brand-title">SİRAÇ G. ŞİMŞEK</span>
          <span className="mobile-brand-tag">DEV</span>
        </a>

        <div className="mobile-nav-controls">
          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              className="mobile-action-pill"
              title={lang === "tr" ? "Switch to English" : "Türkçe'ye Geç"}
              aria-label="Toggle language"
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
          )}

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="mobile-action-icon-btn"
              title={theme === "light" ? "Dark Mode" : "Light Mode"}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`mobile-hamburger-btn ${mobileOpen ? "is-open" : ""}`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Sheet & Backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="mobile-menu-drawer"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div className="mobile-drawer-top">
                <span className="mobile-drawer-section-label">
                  {lang === "tr" ? "GEZİNME" : "NAVIGATION"}
                </span>
                <span className="mobile-drawer-status-chip">
                  <span className="live-status-dot" />
                  <span>İstanbul, TR</span>
                </span>
              </div>

              <nav className="mobile-drawer-nav">
                <ul className="mobile-drawer-list">
                  {mobileTabs.map((tab, idx) => {
                    const isActive = activeSection === tab.id;
                    return (
                      <motion.li
                        key={tab.id}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.035 }}
                      >
                        <a
                          href={tab.href}
                          className={`mobile-drawer-item ${isActive ? "is-active" : ""}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="mobile-drawer-item-icon">{tab.icon}</span>
                          <span className="mobile-drawer-item-label">{tab.label}</span>
                          {isActive && <span className="mobile-drawer-active-dot" />}
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mobile-drawer-actions">
                <a
                  href={`${import.meta.env.BASE_URL}cv.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-drawer-cv-cta"
                  onClick={() => setMobileOpen(false)}
                >
                  <Download size={15} />
                  <span>{lang === "tr" ? "Özgeçmişi İndir (PDF)" : "Download CV (PDF)"}</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Demo Bileşeni ────────────────────────────────────────────────────────
export const SlideTabsExample = () => {
  return (
    <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "center" }}>
      <div>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1rem", color: "var(--text-secondary)" }}>
          Portföy Stili (Temaya Uyumlu Kayar Sekmeler)
        </h3>
        <SlideTabs activeId="projects" />
      </div>

      <div>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1rem", color: "var(--text-secondary)" }}>
          Monochrome Mix-Blend Stili
        </h3>
        <SlideTabs variant="monochrome" />
      </div>
    </div>
  );
};

export default SlideTabs;
