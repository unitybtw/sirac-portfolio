import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  Github,
  Download,
  Lock,
  PanelRight,
  Search,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react';
import './nova-showcase.css';

const TABS = [
  {
    id: 'workspace',
    num: '01',
    trLabel: 'Dikey Sekmeler & Çalışma Alanı',
    enLabel: 'Vertical Tabs & Spaces',
    trTitle: 'Fikirlerin ve sekmelerin için daha ferah bir alan.',
    enTitle: 'More room for your ideas and workflows.',
    trDesc: 'Sekme kalabalığını ortadan kaldıran dikey sekme çubuğu, ayrılmış çalışma alanları (Spaces) ve geliştirici odaklı akıcı bölünmüş düzen.',
    enDesc: 'Eliminate tab clutter with Arc-inspired vertical tabs, dedicated Spaces for projects, and a developer-first split layout.',
    image: 'preview.webp',
    url: 'https://github.com/unitybtw/nova-browser',
    tags: ['Vertical Tabs', 'Project Spaces', 'Split View'],
    highlight: {
      trBadge: 'Sekme Düzeni',
      enBadge: 'Tab Architecture',
      trStat: 'Sıfır Karışıklık',
      enStat: 'Zero Clutter',
    },
  },
  {
    id: 'ai',
    num: '02',
    trLabel: 'Cihazında Yapay Zekâ (WebGPU)',
    enLabel: 'On-Device AI (WebGPU)',
    trTitle: 'API anahtarı yok. Bulut yok. Tamamen yerel zekâ.',
    enTitle: 'No API keys. No cloud. 100% private intelligence.',
    enDesc: 'WebGPU üzerinde doğrudan çalışan Llama 3.2 3B modeli; gezindiğin web sayfalarını anında özetler, kodları açıklar ve gizliliğini korur.',
    trDesc: 'Doğrudan WebGPU üzerinde çalışan Llama 3.2 3B modeli; gezindiğin sayfaları anında analiz eder, kodları açıklar ve verilerini asla cihazından çıkarmaz.',
    image: 'preview.webp',
    url: 'https://nova.ai/assistant',
    tags: ['Llama 3.2 3B', 'WebGPU', '100% Private', 'MCP Ready'],
    highlight: {
      trBadge: 'Yapay Zekâ Motoru',
      enBadge: 'AI Engine',
      trStat: 'Llama 3.2 (Yerel)',
      enStat: 'Llama 3.2 (Local)',
    },
  },
  {
    id: 'newtab',
    num: '03',
    trLabel: 'Yeni Sekme & Gizlilik Kalkanı',
    enLabel: 'New Tab & Privacy Shield',
    trTitle: 'Hızlı başlangıç, odaklı tasarım ve yerel koruma.',
    enTitle: 'Instant start, focused design and native protection.',
    trDesc: 'Minimalist saat ve kısayol paneli. Dahili Kalkan motoru, reklam ve izleyicileri Chromium oturum katmanında anında bloke eder.',
    enDesc: 'A distraction-free dashboard with instant dials. The native Privacy Shield blocks ads and telemetry at the Chromium session layer.',
    image: 'newtab.webp',
    url: 'nova://newtab',
    tags: ['Ad Blocking', 'Tracker Protection', 'Fast Dial'],
    highlight: {
      trBadge: 'Gizlilik',
      enBadge: 'Security',
      trStat: 'Kalkan Aktif',
      enStat: 'Shield Active',
    },
  },
];

const PILLARS = [
  {
    icon: Cpu,
    trTitle: 'WebGPU Yapay Zekâ Motoru',
    enTitle: 'WebGPU AI Engine',
    trText: 'Harici API anahtarına veya sunucuya ihtiyaç duymadan cihazında yerel Llama modelleri çalıştırır.',
    enText: 'Runs local Llama models directly on hardware via WebGPU with zero cloud telemetry or API cost.',
  },
  {
    icon: Layers,
    trTitle: 'Spaces & Dikey Navigasyon',
    enTitle: 'Spaces & Vertical Navigation',
    trText: 'Kişisel, iş ve açık kaynak projelerini ayrı alanlara bölerek sekmelerini düzenli tutar.',
    enText: 'Organize tabs into dedicated workspaces so you never lose context between projects.',
  },
  {
    icon: ShieldCheck,
    trTitle: 'Yerel Kalkan Koruması',
    enTitle: 'Native Privacy Shield',
    trText: 'Ağ seviyesinde reklam ve izleyici engelleme; üçüncü parti kodların seni takip etmesini önler.',
    enText: 'Network-level ad and tracking blocking protects your browsing habits without slowdowns.',
  },
  {
    icon: Terminal,
    trTitle: 'Model Context Protocol (MCP)',
    enTitle: 'Model Context Protocol (MCP)',
    trText: 'Yapay zekâ asistanını yerel geliştirme araçlarına ve dosya sistemine güvenle bağlar.',
    enText: 'Bridges browser context with local developer tools and agentic workflows via MCP.',
  },
];

export default function NovaBrowserShowcase() {
  const { i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  const [activeTab, setActiveTab] = useState(0);
  const [inView, setInView] = useState(false);
  const showcaseRef = useRef(null);
  const reduce = useReducedMotion();

  const currentTab = TABS[activeTab];
  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    const el = showcaseRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={showcaseRef}
      className={`nova-showcase ${inView ? 'nova-in-view' : ''}`}
      data-motion
    >
      {/* Background Atmosphere & Nebula Glow */}
      <div className="nova-aurora-backdrop" aria-hidden="true">
        <div className="nova-aurora-blob blob-1" />
        <div className="nova-aurora-blob blob-2" />
        <div className="nova-aurora-grid" />
      </div>

      {/* Top Banner / Editorial Header */}
      <div className="nova-hero-header">
        <div className="nova-headline-block">
          <div className="nova-badge-row">
            <span className="nova-status-pill">
              <span className="nova-pulse-dot" />
              {tr ? 'ÖNE ÇIKAN PROJEM · MASAÜSTÜ' : 'FEATURED PROJECT · DESKTOP'}
            </span>
            <span className="nova-version-chip">v1.2 Beta</span>
          </div>

          <h2 id="nova-heading" className="nova-display-title">
            Nova <span className="nova-gradient-word">Browser.</span>
          </h2>

          <p className="nova-subhead">
            {tr
              ? 'Geliştiriciler ve meraklı zihinler için tasarladığım açık kaynaklı masaüstü tarayıcısı.'
              : 'An open-source desktop browser engineered for developers, builders, and curious minds.'}
          </p>

          <p className="nova-lead-copy">
            {tr
              ? 'Web’de gezinmenin ötesine geç: Dikey sekme düzeni, dahili WebGPU yapay zekâ asistanı, yerel gizlilik kalkanı ve MCP entegrasyonu tek bir akıcı deneyimde bir araya geliyor.'
              : 'Go beyond ordinary browsing: Vertical tab spaces, an on-device WebGPU AI assistant, native privacy shielding, and MCP tooling unified into a single desktop experience.'}
          </p>

          {/* Action CTAs */}
          <div className="nova-actions-group">
            <a
              href="https://github.com/unitybtw/nova-browser/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="nova-btn-primary"
            >
              <Download size={16} />
              <span>{tr ? 'Nova’yı İndir / Keşfet' : 'Explore & Download'}</span>
              <ExternalLink size={14} className="nova-btn-arrow" />
            </a>

            <a
              href="https://github.com/unitybtw/nova-browser"
              target="_blank"
              rel="noopener noreferrer"
              className="nova-btn-secondary"
            >
              <Github size={16} />
              <span>{tr ? 'Kaynak Kodu (GitHub)' : 'Source Code (GitHub)'}</span>
              <span className="nova-star-badge">★ Open Source</span>
            </a>
          </div>

          {/* Architecture Badges */}
          <div className="nova-tech-chips">
            <span className="nova-chip">Electron 32</span>
            <span className="nova-chip">TypeScript</span>
            <span className="nova-chip">React 19</span>
            <span className="nova-chip">WebGPU</span>
            <span className="nova-chip">Llama 3.2 3B</span>
            <span className="nova-chip">MCP Protocol</span>
          </div>
        </div>

        {/* 3D App Icon & Floating Hologram */}
        <div className="nova-app-scene">
          <div className="nova-app-halo" aria-hidden="true" />
          <div className="nova-app-card">
            <img
              src={`${baseUrl}assets/nova/logo.svg`}
              alt="Nova Browser Icon"
              width="240"
              height="240"
              className="nova-app-img"
              loading="eager"
              decoding="async"
            />
            <div className="nova-app-meta">
              <span className="nova-app-name">Nova Browser</span>
              <span className="nova-app-sub">macOS · Windows · Linux</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Browser Stage (The Realistic Mockup Frame) */}
      <div className="nova-stage-container">
        <div className="nova-stage-header-bar">
          <span className="nova-stage-label">
            <Sparkles size={13} className="nova-stage-icon" />
            {tr ? 'CANLI TARAYICI ARAYÜZÜ VİTRİNİ' : 'LIVE BROWSER INTERFACE SHOWCASE'}
          </span>
          <div className="nova-stage-tabs-pill">
            {TABS.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                className={`nova-stage-tab-btn ${activeTab === idx ? 'active' : ''}`}
                onClick={() => setActiveTab(idx)}
                aria-pressed={activeTab === idx}
              >
                <span className="nova-tab-num">{tab.num}</span>
                <span className="nova-tab-text">{tr ? tab.trLabel : tab.enLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Realistic Window Mockup */}
        <div className="nova-browser-window">
          {/* macOS Titlebar Chrome */}
          <div className="nova-window-titlebar">
            <div className="nova-traffic-lights" aria-hidden="true">
              <span className="light-red" />
              <span className="light-yellow" />
              <span className="light-green" />
            </div>

            {/* Omnibox / URL address bar */}
            <div className="nova-omnibox">
              <Lock size={12} className="nova-lock-icon" />
              <span className="nova-url-text">{currentTab.url}</span>
              <div className="nova-shield-badge">
                <ShieldCheck size={12} />
                <span>{tr ? 'Kalkan Aktif' : 'Shield Active'}</span>
              </div>
            </div>

            {/* Browser Control Icons */}
            <div className="nova-window-actions" aria-hidden="true">
              <div className="nova-ai-toggle-pill active">
                <Sparkles size={12} />
                <span>AI</span>
              </div>
              <PanelRight size={14} className="nova-window-icon" />
            </div>
          </div>

          {/* Window Screen Canvas */}
          <div className="nova-screen-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.99 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="nova-screen-canvas"
              >
                <img
                  src={`${baseUrl}assets/nova/${currentTab.image}`}
                  alt={tr ? currentTab.trTitle : currentTab.enTitle}
                  className="nova-screen-image"
                  loading="eager"
                  decoding="async"
                />

                {/* Floating Insight Card on Screen */}
                <div className="nova-screen-overlay-card">
                  <div className="nova-overlay-top">
                    <span className="nova-overlay-badge">
                      {tr ? currentTab.highlight.trBadge : currentTab.highlight.enBadge}
                    </span>
                    <span className="nova-overlay-stat">
                      {tr ? currentTab.highlight.trStat : currentTab.highlight.enStat}
                    </span>
                  </div>
                  <h4 className="nova-overlay-title">
                    {tr ? currentTab.trTitle : currentTab.enTitle}
                  </h4>
                  <p className="nova-overlay-desc">
                    {tr ? currentTab.trDesc : currentTab.enDesc}
                  </p>
                  <div className="nova-overlay-tags">
                    {currentTab.tags.map((t) => (
                      <span key={t} className="nova-overlay-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 4 Pillars Feature Grid (Architecture & Specs) */}
      <div className="nova-pillars-grid">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div key={i} className="nova-pillar-card">
              <div className="nova-pillar-header">
                <div className="nova-pillar-icon-box">
                  <Icon size={19} />
                </div>
                <span className="nova-pillar-index">0{i + 1}</span>
              </div>
              <h3 className="nova-pillar-title">
                {tr ? pillar.trTitle : pillar.enTitle}
              </h3>
              <p className="nova-pillar-text">
                {tr ? pillar.trText : pillar.enText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Strip */}
      <div className="nova-showcase-footer">
        <div className="nova-footer-stats">
          <span className="nova-stat-item">
            <CheckCircle2 size={13} className="nova-stat-icon" />
            {tr ? 'Açık Kaynak Kodlu (MIT Lisansı)' : 'Open Source (MIT License)'}
          </span>
          <span className="nova-stat-item">
            <Zap size={13} className="nova-stat-icon" />
            {tr ? 'Chromium 128 / Electron Tabanlı' : 'Powered by Chromium 128 & Electron'}
          </span>
        </div>

        <a href="#other-projects" className="nova-next-link">
          <span>{tr ? 'Diğer Seçili Projeler' : 'Other Selected Projects'}</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}
