import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, FolderGit2, Activity, Gamepad2, Mail, Sun, Moon, Download, Sparkles } from "lucide-react";

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

  // Aktif sekmenin konumunu güncelle
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
    // Aktif sekme yoksa imleci gizle
    setPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    updatePositionToActive();
  }, [activeId]);

  // Pencere boyutu değiştiğinde pozisyonu koru
  useEffect(() => {
    const handleResize = () => updatePositionToActive();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeId]);

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
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute z-0 h-7 rounded-full bg-black md:h-10"
        />
      </ul>
    );
  }

  // 2. Portfolio Stili (Temaya duyarlı, pürüzsüz cam dock)
  return (
    <ul
      onMouseLeave={updatePositionToActive}
      className={`slide-tabs-nav ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        padding: "4px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        listStyle: "none",
        margin: 0,
      }}
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
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                borderRadius: "9999px",
                transition: "color 0.2s ease",
              }}
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
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        style={{
          position: "absolute",
          zIndex: 1,
          height: "calc(100% - 8px)",
          borderRadius: "9999px",
          background: "var(--border-subtle)",
          top: "4px",
          pointerEvents: "none",
        }}
      />
    </ul>
  );
};

// ── Siraç'ın Portföyü için Tam Donanımlı Floating Slide Navbar ──────────
export interface SlideNavbarProps {
  activeSection?: string | null;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
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
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
      style={{
        position: "fixed",
        top: "16px",
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "0 1.5rem",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          maxWidth: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Sol Logo & Canlı Durum */}
        <a
          href="#hero"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 0.9rem",
            borderRadius: "9999px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            backdropFilter: "blur(12px)",
            textDecoration: "none",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "var(--accent-cta)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 800,
            }}
          >
            S
          </span>
          <span style={{ letterSpacing: "0.02em" }}>SİRAÇ</span>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              marginLeft: "4px",
            }}
          />
        </a>

        {/* Orta Kayar Sekmeler (SlideTabs) */}
        <SlideTabs items={tabs} activeId={activeSection} />

        {/* Sağ Hızlı Butonlar (Dil, Tema, CV) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "4px",
            borderRadius: "9999px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              title={lang === "tr" ? "Switch to English" : "Türkçe'ye Geç"}
              style={{
                padding: "6px 10px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={theme === "light" ? "Karanlık Mod" : "Aydınlık Mod"}
              style={{
                padding: "6px",
                borderRadius: "50%",
                display: "flex",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          )}

          <a
            href={`${import.meta.env.BASE_URL}cv.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            title="CV İndir"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "9999px",
              backgroundColor: "var(--accent-cta)",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Download size={12} />
            <span>CV</span>
          </a>
        </div>
      </div>
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
