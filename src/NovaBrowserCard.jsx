import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Download } from 'lucide-react';

const SCREENSHOTS = [
  {
    id: "preview",
    src: "assets/nova/preview.webp",
    titleEn: "Active Browsing & AI Sidepanel",
    titleTr: "Aktif Gezinme & Yerel Yapay Zeka Paneli",
    descEn: "Multi-tab workspaces, sandboxed Chromium webview, and integrated on-device AI sidepanel.",
    descTr: "Çoklu sekme çalışma alanları, izole Chromium webview ve entegre yerel yapay zeka paneli."
  },
  {
    id: "newtab",
    src: "assets/nova/newtab.webp",
    titleEn: "Vertical Tabs & Start Dashboard",
    titleTr: "Dikey Sekmeler & Başlangıç Panosu",
    descEn: "Vertical sidebar tab strip, omnibox quick search, customizable speed dials & task checklist.",
    descTr: "Dikey kenar çubuğu sekmeleri, çok işlevli omnibox arama, özelleştirilebilir hızlı kadranlar ve görev listesi."
  },
  {
    id: "horizontal",
    src: "assets/nova/horizontal-preview.webp",
    titleEn: "Horizontal Tabs Layout",
    titleTr: "Yatay Sekmeler Düzeni",
    descEn: "Full-width viewport, Chrome-style horizontal tab strip, and floating AI assistant.",
    descTr: "Tam genişlikte tarama alanı, Chrome tarzı yatay sekme şeridi ve kayan yapay zeka asistanı."
  },
  {
    id: "sync",
    src: "assets/nova/sync.webp",
    titleEn: "Zero-Knowledge Cloud Sync",
    titleTr: "Sıfır-Bilgi Bulut Senkronizasyonu",
    descEn: "1-Click multi-device pairing code (AES-256-GCM + PBKDF2) with realtime WebSocket sync.",
    descTr: "1 tıkla cihaz eşleme kodu (AES-256-GCM + PBKDF2) ile gerçek zamanlı şifreli WebSocket senkronizasyonu."
  }
];

export default function NovaBrowserCard() {
  const { t, i18n } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const visibleRef = useRef(true);
  // Foto kutusu kapalı şerit halinde başlar, ekrana gelince açılır
  const [opened, setOpened] = useState(false);

  const activePhoto = SCREENSHOTS[activeIdx];
  const isTr = i18n.language === 'tr';

  // Slayt: sadece kart ekrandayken + sekme odaktayken dön.
  // Ekran dışındayken setInterval çalışmaya devam edip 120Hz scroll'u bölmesin.
  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      const io = new IntersectionObserver(
        ([entry]) => { visibleRef.current = entry.isIntersecting; },
        { threshold: 0.05 }
      );
      io.observe(el);
      visibleRef.current = true;
      var cleanupIO = () => io.disconnect();
    }
    const onVis = () => { /* document.hidden timer içinde kontrol ediliyor */ };
    document.addEventListener('visibilitychange', onVis);
    const timer = setInterval(() => {
      if (!visibleRef.current || document.hidden) return;
      setActiveIdx((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 3800);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVis); if (cleanupIO) cleanupIO(); };
  }, []);

  // Kutu açılma tetikleyici: şerit ekrana girince bir kez aç
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    // Hareket hassasiyeti varsa animasyonsuz direkt aç
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setOpened(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpened(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Komşu görseli önceden indir: geçiş anında decode takılması olmasın
  useEffect(() => {
    const next = SCREENSHOTS[(activeIdx + 1) % SCREENSHOTS.length];
    const img = new Image();
    img.decoding = 'async';
    img.src = next.src;
  }, [activeIdx]);

  return (
    <div ref={cardRef} className="bento-card bento-col-12" style={{ padding: '2rem 2.2rem', overflow: 'hidden' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.6rem' }}>
            <img
              src="assets/nova/logo.webp"
              alt="Nova Browser Logo"
              loading="lazy"
              decoding="async"
              width={52}
              height={52}
              style={{
                width: '52px',
                height: '52px',
                minWidth: '52px',
                objectFit: 'contain',
                display: 'block',
                background: 'transparent',
                // PNG'nin kendi squircle formu var; ekstra CSS border/radius
                // üstüne binince dışarı taşan sahte bir katman gibi görünüyordu.
                // Bu yüzden çerçeveyi kaldırıp sadece yumuşak gölge bıraktık.
                border: 'none',
                borderRadius: 0,
                boxShadow: '0 2px 10px rgba(0,0,0,0.10)'
              }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.85rem', margin: 0, letterSpacing: '-0.02em', fontWeight: 700 }}>
                  {t('games.nova_title')}
                </h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.15rem 0.6rem', borderRadius: '100px', background: 'var(--border-subtle)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  v1.4.4
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Electron · React 18 · TypeScript · Vite · WebGPU · MCP Server (Port 3020)
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '850px', lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
            {t('games.nova_desc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a 
            href="https://github.com/unitybtw/nova-browser" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary" 
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
          >
            <Github size={16} /> {isTr ? "GitHub Repo" : "GitHub Repository"}
          </a>
          <a 
            href="https://github.com/unitybtw/nova-browser/releases" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-outline" 
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
          >
            <Download size={15} /> {isTr ? "İndir / Sürümler" : "Releases & Downloads"}
          </a>
        </div>
      </div>

      {/* Foto kutusu: kapalı ince şerit gibi başlar, ekrana gelince
          perde gibi aşağı doğru açılır, foto içeride belirir */}
      <motion.div
        ref={frameRef}
        initial={false}
        animate={opened ? 'open' : 'closed'}
        variants={{
          closed: { height: 0, opacity: 0 },
          open: { height: 'auto', opacity: 1 },
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0d1117',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          marginTop: '1.25rem',
          userSelect: 'none'
        }}
      >
        {/* Foto alanı tam boyda durur; kutu açılırken üstten alta perde gibi belirir */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            /* Fotoğrafların hepsi 2880x1800 (16:10) — kap da aynı oranda olursa
               letterbox boşluğu kalmaz, siyah köşe/kenar görünmez */
            aspectRatio: '16 / 10',
            overflow: 'hidden',
            background: '#0a0d12'
          }}
        >
          {/* Yeni foto altyazı kartından yukarı doğru genişleyerek açılır,
              eski foto altta hızlıca solar — "karttan büyüyen" hissi */}
          <AnimatePresence initial={false}>
            <motion.img
              key={activePhoto.id}
              src={activePhoto.src}
              alt={isTr ? activePhoto.titleTr : activePhoto.titleEn}
              initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
              /* Çıkış: anında yok olmak yerine bir süre altta küçülerek kalır,
                 yeni foto üstte açılırken derinlik hissi verir */
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              loading={activeIdx === 0 ? 'eager' : 'lazy'}
              fetchPriority={activeIdx === 0 ? 'high' : 'low'}
              decoding="async"
              className="nova-shot"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Bottom Caption Overlay — kutu açıldıktan sonra belirir */}
        <motion.div
          initial={false}
          animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: opened ? 0.55 : 0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0.85rem 1.25rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 75%, transparent 100%)',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>
                  {isTr ? activePhoto.titleTr : activePhoto.titleEn}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                  {isTr ? activePhoto.descTr : activePhoto.descEn}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Discreet status indicators (automated, non-clickable) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {SCREENSHOTS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === activeIdx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === activeIdx ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.35s ease'
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
