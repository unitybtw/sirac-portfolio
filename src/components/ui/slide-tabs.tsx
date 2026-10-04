import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, FolderGit2, Activity, Gamepad2, Mail, Sun, Moon, Download, Sparkles, SlidersHorizontal, X } from "lucide-react";

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
  { id: "hero", href: "#hero", label: "Giriş", icon: <Sparkles size={14} /> },
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

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, item: TabItem) => {
    if (item.href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(item.href);
      if (target) {
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.scrollTo(target, { offset: -40, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    onSelect?.(item.id);
  };

  // 1. Monochrome (Orijinal mix-blend-difference stili)
  if (variant === "monochrome") {
    return (
      <ul
        onMouseLeave={updatePositionToActive}
        className={`relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1 ${className}`}
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
              onClick={(e) => handleTabClick(e, tab)}
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
          className="absolute z-0 h-7 rounded-full bg-black md:h-10"
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
              onClick={(e) => handleTabClick(e, tab)}
              className={`slide-tab-link ${isActive ? 'is-active' : ''}`}
            >
              {showIcons && <span style={{ opacity: 0.85, display: "flex" }}>{tab.icon}</span>}
              <span>{tab.label}</span>
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
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openControls = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsControlsOpen(true);
  };

  const closeControlsWithDelay = (delay = 450) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsControlsOpen(false);
    }, delay);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsControlsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const tabs: TabItem[] = [
    { id: "hero", href: "#hero", label: lang === "tr" ? "Giriş" : "Home", icon: <Sparkles size={14} /> },
    { id: "about", href: "#about", label: lang === "tr" ? "Hakkımda" : "About", icon: <User size={14} /> },
    { id: "projects", href: "#projects", label: lang === "tr" ? "Projeler" : "Projects", icon: <FolderGit2 size={14} /> },
    { id: "github-activity", href: "#github-activity", label: lang === "tr" ? "Katkılar" : "Activity", icon: <Activity size={14} /> },
    { id: "arcade", href: "#arcade", label: "Arcade", icon: <Gamepad2 size={14} /> },
    { id: "contact", href: "#contact", label: lang === "tr" ? "İletişim" : "Contact", icon: <Mail size={14} /> },
  ];

  return (
    <motion.header
      className="slide-navbar-root"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 24, delay: 0.08 }}
      aria-label="Primary Navigation"
    >
      <motion.div
        ref={dockRef}
        layout
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="slide-navbar-dock"
        onMouseLeave={() => closeControlsWithDelay(450)}
        onMouseEnter={cancelClose}
      >
        {/* Orta Kayar Sekmeler (SlideTabs) */}
        <SlideTabs items={tabs} activeId={activeSection} />

        {/* Zarif Dikey Ayırıcı Çizgi */}
        <div className="slide-dock-divider" />

        {/* Sağ Hızlı Butonlar: Mouse yaklaştığında / tıklanınca pürüzsüzce açılan yuvarlak butonlar */}
        <div
          className="slide-controls-wrapper"
          onMouseEnter={openControls}
        >
          <AnimatePresence initial={false}>
            {!isControlsOpen ? (
              <motion.button
                key="trigger"
                onClick={() => setIsControlsOpen(true)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16 }}
                className="slide-circle-btn slide-trigger-btn"
                title={lang === "tr" ? "Hızlı Menü & CV (Üzerine gelin veya tıklayın)" : "Quick Menu & CV (Hover or click)"}
                aria-label="Toggle Controls"
              >
                <SlidersHorizontal size={14} />
              </motion.button>
            ) : (
              <motion.div
                key="cluster"
                initial={{ opacity: 0, scale: 0.9, x: 4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 4 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="slide-controls-cluster"
              >
                {/* 1. Yuvarlak Dil Butonu (TR / EN) */}
                {onToggleLang && (
                  <button
                    onClick={onToggleLang}
                    className="slide-circle-btn"
                    title={lang === "tr" ? "Switch to English" : "Türkçe'ye Geç"}
                    aria-label="Toggle language"
                  >
                    <span>{lang === "tr" ? "EN" : "TR"}</span>
                  </button>
                )}

                {/* 2. Yuvarlak Tema Butonu (Karanlık / Aydınlık Mod) */}
                {onToggleTheme && (
                  <button
                    onClick={onToggleTheme}
                    className="slide-circle-btn"
                    title={theme === "light" ? (lang === "tr" ? "Karanlık Mod" : "Dark Mode") : (lang === "tr" ? "Aydınlık Mod" : "Light Mode")}
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                  </button>
                )}

                {/* 3. Yuvarlak CV İndir Butonu */}
                <a
                  href={`${import.meta.env.BASE_URL}cv.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={lang === "tr" ? "CV İndir (PDF)" : "Download CV (PDF)"}
                  className="slide-circle-btn slide-cv-circle"
                  aria-label="Download CV"
                >
                  <Download size={14} />
                </a>

                {/* 4. Yuvarlak Kapat / Daralt Butonu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsControlsOpen(false);
                  }}
                  className="slide-circle-btn slide-close-btn"
                  title={lang === "tr" ? "Kapat" : "Close"}
                  aria-label="Close Controls"
                >
                  <X size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
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
