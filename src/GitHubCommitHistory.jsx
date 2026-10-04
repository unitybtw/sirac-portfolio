import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronDown, RotateCcw } from 'lucide-react';
import CACHED_DATA from './data/githubContributions.json';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Colors for Light & Dark mode (level 0 is translucent to blend seamlessly)
const COLOR_LEVELS = {
  light: [
    "rgba(0, 0, 0, 0.06)", // level 0 (translucent base slot on card)
    "#9be9a8", // level 1
    "#40c463", // level 2
    "#30a14e", // level 3
    "#216e39"  // level 4
  ],
  dark: [
    "rgba(255, 255, 255, 0.08)", // level 0 (translucent base slot on card)
    "#0e4429", // level 1
    "#006d32", // level 2
    "#26a641", // level 3
    "#39d353"  // level 4
  ]
};

export default function GitHubCommitHistory() {
  const { i18n } = useTranslation();
  const isTr = i18n.language === 'tr';
  const [selectedYear, setSelectedYear] = useState("last"); // "last", "2026", "2025", "2024"
  const [animKey, setAnimKey] = useState(0);
  const [allData, setAllData] = useState(CACHED_DATA);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const containerRef = useRef(null);

  // Detect theme from html element
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch live fresh contribution data in background
  useEffect(() => {
    let isMounted = true;
    const ctrl = new AbortController();
    async function refreshData() {
      try {
        const years = ["last", "2026", "2025", "2024"];
        const results = await Promise.all(
          years.map(async (y) => {
            try {
              const res = await fetch(`https://github-contributions-api.jogruber.de/v4/unitybtw?y=${y}`, { signal: ctrl.signal });
              if (res.ok) return [y, await res.json()];
            } catch { /* silent fallback */ }
            return null;
          })
        );
        const fetched = Object.fromEntries(results.filter(Boolean));
        if (isMounted && Object.keys(fetched).length > 0) {
          setAllData((prev) => ({ ...prev, ...fetched }));
        }
      } catch {
        // use cached data
      }
    }
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancelSchedule = window.cancelIdleCallback || clearTimeout;
    const handle = schedule(() => refreshData(), { timeout: 4000 });
    return () => { isMounted = false; ctrl.abort(); cancelSchedule(handle); };
  }, []);

  // Current year contribution data
  const currentYearData = allData[selectedYear] || allData["last"];
  const contributions = useMemo(() => currentYearData.contributions || [], [currentYearData]);

  // Calculate total count text
  const totalCount = useMemo(() => {
    if (selectedYear === "last") {
      return currentYearData.total?.lastYear || 3101;
    }
    return currentYearData.total?.[selectedYear] || contributions.reduce((a, b) => a + b.count, 0);
  }, [currentYearData, selectedYear, contributions]);

  // Build weeks array (columns of 7 days: Sun=0 to Sat=6)
  const { weeks, monthLabels } = useMemo(() => {
    if (!contributions || contributions.length === 0) return { weeks: [], monthLabels: [] };

    const wList = [];
    let currentWeek = [];

    // Ensure list is chronological from oldest to newest
    const sorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Pad first week if it doesn't start on Sunday
    const firstDate = new Date(sorted[0].date + "T00:00:00Z");
    const firstDayOfWeek = firstDate.getUTCDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    let activeCount = 0;
    sorted.forEach((day) => {
      const d = new Date(day.date + "T00:00:00Z");
      const dayOfWeek = d.getUTCDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        wList.push(currentWeek);
        currentWeek = [];
      }

      const isActive = (day.count || 0) > 0;
      currentWeek.push({
        ...day,
        dayOfWeek,
        month: d.getUTCMonth(),
        activeIdx: isActive ? activeCount++ : -1
      });
    });

    if (currentWeek.length > 0) {
      // Pad trailing days
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      wList.push(currentWeek);
    }

    // Determine month label positions
    let prevMonth = -1;
    const mLabels = [];
    wList.forEach((week, wIdx) => {
      const validDay = week.find((d) => d !== null);
      if (validDay && validDay.month !== prevMonth) {
        prevMonth = validDay.month;
        mLabels.push({
          colIndex: wIdx,
          name: MONTH_NAMES[validDay.month]
        });
      }
    });

    return { weeks: wList, monthLabels: mLabels };
  }, [contributions]);

  const palette = isDark ? COLOR_LEVELS.dark : COLOR_LEVELS.light;

  // Tooltip map
  const dayByDate = useMemo(() => {
    const map = new Map();
    contributions.forEach((d) => map.set(d.date, d));
    return map;
  }, [contributions]);

  // Delegated hover handler
  const hoverRaf = useRef(0);
  const handleGridOver = (e) => {
    const t = e.target?.closest?.('.gh-day');
    if (!t) return;
    if (hoverRaf.current) return;
    hoverRaf.current = requestAnimationFrame(() => {
      hoverRaf.current = 0;
      const day = dayByDate.get(t.dataset.date);
      if (!day) return;
      const rect = t.getBoundingClientRect();
      const parentRect = containerRef.current?.getBoundingClientRect();
      if (parentRect) {
        setTooltipPos({
          x: rect.left - parentRect.left + 5,
          y: rect.top - parentRect.top - 32
        });
      }
      setHoveredDay((prev) => (prev?.date === day.date ? prev : day));
    });
  };
  const handleGridOut = (e) => {
    if (e.target?.closest?.('.gh-day')) setHoveredDay(null);
  };
  useEffect(() => () => { if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current); }, []);

  // Format date helper for tooltip
  const formatTooltipDate = (dateStr) => {
    try {
      const date = new Date(dateStr + "T00:00:00Z");
      return date.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleReplay = () => {
    setAnimKey((prev) => prev + 1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setAnimKey((prev) => prev + 1);
  };

  return (
    <div className="gh-activity-wrapper">
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="section-title" style={{ margin: 0, fontSize: '2rem' }}>
            {isTr ? 'GitHub Katkı Haritası' : 'GitHub Contribution Graph'}
          </h2>
          <p className="section-subtitle" style={{ margin: '0.4rem 0 0 0', fontSize: '1rem' }}>
            {isTr 
              ? '@unitybtw hesabı altındaki son bir yıllık commit ve katkı dağılımı.' 
              : 'Real-time contribution calendar and commit telemetry from @unitybtw.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleReplay}
            className="gh-replay-btn btn-outline"
            title={isTr ? 'Kuş animasyonunu tekrar oynat' : 'Replay bird hop animation'}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
          >
            <RotateCcw size={14} />
            <span>{isTr ? 'Tekrar Oynat' : 'Replay'}</span>
          </button>

          <a
            href="https://github.com/unitybtw"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Github size={16} />
            <span>{isTr ? 'Profili Aç' : 'View Profile'}</span>
            <ExternalLink size={13} style={{ opacity: 0.6 }} />
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="bento-card bento-col-12 gh-heatmap-card" style={{ padding: '2rem 2.2rem' }}>
        {/* Top Header Row of the Graph */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', minHeight: '32px', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedYear + '-' + totalCount}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <strong>{totalCount.toLocaleString()}</strong>{' '}
                {selectedYear === "last" 
                  ? (isTr ? 'son bir yıldaki toplam katkı' : 'contributions in the last year')
                  : (isTr ? `${selectedYear} yılındaki katkı` : `contributions in ${selectedYear}`)}
              </motion.span>
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSettingsMenu((prev) => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{isTr ? 'Katkı ayarları' : 'Contribution settings'}</span>
              <ChevronDown size={14} />
            </button>

            {showSettingsMenu && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '6px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.5rem 0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 20,
                  minWidth: '180px',
                  fontSize: '0.8rem'
                }}
              >
                <button
                  onClick={() => { handleYearChange("last"); setShowSettingsMenu(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.4rem 1rem',
                    background: selectedYear === 'last' ? 'var(--border-subtle)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {isTr ? 'Son 1 Yıl (3,101)' : 'Last Year (3,101)'}
                </button>
                <a
                  href="https://github.com/unitybtw"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '0.4rem 1rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none'
                  }}
                >
                  {isTr ? 'GitHub Profilinde Aç' : 'Open in GitHub'}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap Box + Right Year Selectors */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative' }}>
          {/* Heatmap Border Box */}
          <div 
            ref={containerRef}
            className="gh-heatmap-scroll"
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '1.25rem',
              position: 'relative'
            }}
          >
            <div
              key={`${selectedYear}-${animKey}`}
              style={{ minWidth: '720px', position: 'relative' }}
            >
              {/* Month Labels Row */}
              <div style={{ display: 'flex', marginLeft: '32px', marginBottom: '8px', fontSize: '11px', color: 'var(--text-secondary)', height: '16px', position: 'relative' }}>
                {monthLabels.map((m, mIdx) => (
                  <span
                    key={mIdx}
                    style={{
                      position: 'absolute',
                      left: `${m.colIndex * 14}px`,
                      fontWeight: 500
                    }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              {/* Grid with Day Labels on the Left */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {/* Day Labels (Mon, Wed, Fri) */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '96px', width: '26px', fontSize: '10px', color: 'var(--text-secondary)', paddingTop: '15px', paddingBottom: '12px' }}>
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* 53 Columns of Squares */}
                <div style={{ display: 'flex', gap: '3px' }} onMouseOver={handleGridOver} onMouseOut={handleGridOut}>
                  {weeks.map((week, colIdx) => (
                    <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {week.map((day, rowIdx) => {
                        if (!day) {
                          return (
                            <div 
                              key={rowIdx} 
                              style={{ width: '11px', height: '11px', background: 'transparent' }} 
                            />
                          );
                        }

                        const isActive = day.activeIdx >= 0;
                        const levelColor = palette[day.level || 0];
                        const baseColor = palette[0];

                        if (!isActive) {
                          // Empty day: renders immediately as the base slot ("ilk beyaz/taban kısım")
                          return (
                            <div
                              key={day.date}
                              className="gh-day gh-day-empty"
                              data-date={day.date}
                              style={{ backgroundColor: baseColor }}
                            />
                          );
                        }

                        // Active green day: base slot underneath, green square hops in like a bird from outside
                        const fromLeft = (colIdx + rowIdx) % 2 === 0;
                        const baseOffscreen = 1100;
                        const flightDistX = (fromLeft ? -1 : 1) * (baseOffscreen + ((colIdx * 23 + rowIdx * 37) % 320));
                        const flightDistY = - (190 + ((colIdx * 19 + rowIdx * 29) % 150));
                        const flightRot = (fromLeft ? -1 : 1) * (18 + (day.activeIdx % 5) * 4);
                        const flightRotCounter = (fromLeft ? 1 : -1) * (10 + (day.activeIdx % 4) * 3);
                        const delaySec = 0.45 + (colIdx * 0.038) + (rowIdx * 0.008);

                        return (
                          <div
                            key={day.date}
                            className="gh-day gh-day-slot"
                            data-date={day.date}
                            style={{ backgroundColor: baseColor }}
                          >
                            <div
                              className="gh-day-bird-hopping"
                              style={{
                                backgroundColor: levelColor,
                                animationDelay: `${delaySec.toFixed(3)}s`,
                                '--bird-x': `${flightDistX}px`,
                                '--bird-y': `${flightDistY}px`,
                                '--bird-rot': `${flightRot}deg`,
                                '--bird-rot-counter': `${flightRotCounter}deg`
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tooltip */}
              {hoveredDay && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y}px`,
                    transform: 'translate(-50%, -100%)',
                    background: '#1f2328',
                    color: '#ffffff',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    zIndex: 100,
                    fontWeight: 500
                  }}
                >
                  <strong>{hoveredDay.count > 0 ? (isTr ? `${hoveredDay.count} katkı` : `${hoveredDay.count} contributions`) : (isTr ? 'Katkı yok' : 'No contributions')}</strong> {isTr ? '— ' : 'on '}{formatTooltipDate(hoveredDay.date)}
                </div>
              )}

              {/* Bottom Footer inside Box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', paddingTop: '0.5rem', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <a
                  href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  {isTr ? 'Katkıların nasıl sayıldığını öğrenin' : 'Learn how we count contributions'}
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{isTr ? 'Daha az' : 'Less'}</span>
                  {palette.map((color, cIdx) => (
                    <span
                      key={cIdx}
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: color
                      }}
                    />
                  ))}
                  <span>{isTr ? 'Daha çok' : 'More'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year Buttons on the Right with Animated Smooth Highlight */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', width: '92px', flexShrink: 0 }}>
            {["2026", "2025", "2024"].map((y) => {
              const isSelected = selectedYear === y || (y === "2026" && selectedYear === "last");
              return (
                <motion.button
                  key={y}
                  onClick={() => handleYearChange(y)}
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    position: 'relative',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    background: 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'color 0.2s ease',
                    overflow: 'hidden'
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeYearHighlight"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '8px',
                        background: '#0969da',
                        zIndex: 0
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{y}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
