import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitBranch, ExternalLink, Github, ChevronDown, Clock, ArrowUpRight } from 'lucide-react';
import CACHED_DATA from './data/githubContributions.json';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Colors for Light & Dark mode (level 0 is translucent to blend seamlessly)
const COLOR_LEVELS = {
  light: [
    "rgba(0, 0, 0, 0.06)", // level 0 (translucent slot on card)
    "#9be9a8", // level 1
    "#40c463", // level 2
    "#30a14e", // level 3
    "#216e39"  // level 4
  ],
  dark: [
    "rgba(255, 255, 255, 0.08)", // level 0
    "#0e4429", // level 1
    "#006d32", // level 2
    "#26a641", // level 3
    "#39d353"  // level 4
  ]
};

// Rich initial commits collection for live stream animation
const STATIC_COMMITS = [
  {
    repo: "sirac-portfolio",
    sha: "5aa47ad",
    message: "feat(arcade): redesign portal card with minimalist layout, SVG vector controller animation, and remove all sounds",
    year: "2026",
    date: "2026-10-04T18:27:36Z",
    url: "https://github.com/unitybtw/sirac-portfolio/commit/5aa47ad763781054a2b205c8218840d1c7a8929b"
  },
  {
    repo: "nova-browser",
    sha: "f099c0f",
    message: "fix(core): harden tab restoration, MCP server, bridge navigation, and adblock timer",
    year: "2026",
    date: "2026-10-04T07:20:55Z",
    url: "https://github.com/unitybtw/nova-browser/commit/f099c0fd6089a64c537720274fb5ce10f2fefba4"
  },
  {
    repo: "sirac-portfolio",
    sha: "507a659",
    message: "feat(nova): update Nova Browser logo, vector assets, latest v1.5.0 screenshots and interactive slide controls",
    year: "2026",
    date: "2026-10-04T18:23:23Z",
    url: "https://github.com/unitybtw/sirac-portfolio/commit/507a65986f5133378ebccc9e82af89162e9c5ad6"
  },
  {
    repo: "nova-browser",
    sha: "046155f",
    message: "fix(webview): sanitize user-agent and resolve navigation loops for Google CAPTCHA and YouTube",
    year: "2026",
    date: "2026-10-01T14:23:39Z",
    url: "https://github.com/unitybtw/nova-browser/commit/046155fd6f855e17d64104fd9b173ed8ddd89f9f"
  },
  {
    repo: "sirac-portfolio",
    sha: "1da9f29",
    message: "fix(hero): refine typography, text hierarchy and alignments in entrance section",
    year: "2026",
    date: "2026-10-04T18:20:20Z",
    url: "https://github.com/unitybtw/sirac-portfolio/commit/1da9f29feda25ffd2bb5f8975f36c11a65c13aea"
  },
  {
    repo: "nova-browser",
    sha: "350f5c3",
    message: "fix(main): Windows file origin normalization and orphan tmp cleanup",
    year: "2026",
    date: "2026-10-01T12:06:47Z",
    url: "https://github.com/unitybtw/nova-browser/commit/350f5c3e847c8dc1626ba468b349abc337f57cc5"
  },
  {
    repo: "nova-browser",
    sha: "a75d77e",
    message: "fix(fuses): GrantFileProtocolExtraPrivileges fuse for blank window fix on Electron 43+",
    year: "2025",
    date: "2025-09-30T19:41:58Z",
    url: "https://github.com/unitybtw/nova-browser/commit/a75d77ed3e1671b080051cb46dc1784585dfb5f9"
  },
  {
    repo: "sirac-portfolio",
    sha: "87d36f3",
    message: "feat: add GitHub commit history, Nova Browser showcase, universal game fullscreen, and Bento UI polish",
    year: "2025",
    date: "2025-09-12T14:20:00Z",
    url: "https://github.com/unitybtw/sirac-portfolio"
  },
  {
    repo: "Signal-macOS",
    sha: "c18a992",
    message: "feat(audio): low-latency Core Audio mechanical feedback profiles & WPM tracker",
    year: "2024",
    date: "2024-11-20T10:15:00Z",
    url: "https://github.com/unitybtw"
  },
  {
    repo: "aether-command",
    sha: "e90bf12",
    message: "feat(vision): gesture recognition engine and multi-touch translation daemon",
    year: "2024",
    date: "2024-08-14T09:40:00Z",
    url: "https://github.com/unitybtw"
  }
];

function formatRelativeTime(dateStr, isTr) {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) {
      const mins = Math.max(1, Math.floor(diff / 60));
      return isTr ? `${mins} dk önce` : `${mins}m ago`;
    }
    if (diff < 86400) {
      const hrs = Math.floor(diff / 3600);
      return isTr ? `${hrs} saat önce` : `${hrs}h ago`;
    }
    if (diff < 86400 * 2) {
      return isTr ? 'Dün' : 'Yesterday';
    }
    if (diff < 86400 * 30) {
      const days = Math.floor(diff / 86400);
      return isTr ? `${days} gün önce` : `${days}d ago`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function GitHubCommitHistory() {
  const { i18n } = useTranslation();
  const isTr = i18n.language === 'tr';
  const [selectedYear, setSelectedYear] = useState("last"); // "last", "2026", "2025", "2024"
  const [allData, setAllData] = useState(CACHED_DATA);
  const [commits, setCommits] = useState(STATIC_COMMITS);
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
            } catch { /* sessiz geç */ }
            return null;
          })
        );
        const fetched = Object.fromEntries(results.filter(Boolean));
        if (isMounted && Object.keys(fetched).length > 0) {
          setAllData((prev) => ({ ...prev, ...fetched }));
        }

        // Live commits fetch from active repositories
        const [portfolioRes, novaRes] = await Promise.all([
          fetch('https://api.github.com/repos/unitybtw/sirac-portfolio/commits?per_page=4', { signal: ctrl.signal }).catch(() => null),
          fetch('https://api.github.com/repos/unitybtw/nova-browser/commits?per_page=4', { signal: ctrl.signal }).catch(() => null)
        ]);

        const freshCommits = [];
        if (portfolioRes && portfolioRes.ok) {
          const list = await portfolioRes.json();
          list.forEach((c) => {
            freshCommits.push({
              repo: "sirac-portfolio",
              sha: c.sha.substring(0, 7),
              message: c.commit.message.split("\n")[0],
              year: new Date(c.commit.author.date).getFullYear().toString(),
              date: c.commit.author.date,
              url: c.html_url
            });
          });
        }
        if (novaRes && novaRes.ok) {
          const list = await novaRes.json();
          list.forEach((c) => {
            freshCommits.push({
              repo: "nova-browser",
              sha: c.sha.substring(0, 7),
              message: c.commit.message.split("\n")[0],
              year: new Date(c.commit.author.date).getFullYear().toString(),
              date: c.commit.author.date,
              url: c.html_url
            });
          });
        }

        if (isMounted && freshCommits.length > 0) {
          freshCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
          setCommits((prev) => {
            const map = new Map();
            [...freshCommits, ...prev].forEach((item) => map.set(item.sha, item));
            return Array.from(map.values());
          });
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

  // Filter commits based on year
  const filteredCommits = useMemo(() => {
    if (selectedYear === "2024") {
      const list = commits.filter((c) => c.year === "2024");
      return list.length > 0 ? list : commits.slice(4, 8);
    }
    if (selectedYear === "2025") {
      const list = commits.filter((c) => c.year === "2025");
      return list.length > 0 ? list : commits.slice(3, 7);
    }
    // "2026" or "last"
    const list = commits.filter((c) => c.year === "2026");
    return list.length > 0 ? list.slice(0, 6) : commits.slice(0, 6);
  }, [commits, selectedYear]);

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

    sorted.forEach((day) => {
      const d = new Date(day.date + "T00:00:00Z");
      const dayOfWeek = d.getUTCDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        wList.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push({
        ...day,
        dayOfWeek,
        month: d.getUTCMonth()
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

      {/* Main Container */}
      <div className="bento-card bento-col-12" style={{ padding: '2rem 2.2rem', overflow: 'hidden' }}>
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
                  onClick={() => { setSelectedYear("last"); setShowSettingsMenu(false); }}
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
          {/* Heatmap Border Box with Year Glide Transitions */}
          <div 
            ref={containerRef}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '1.25rem',
              overflowX: 'auto',
              position: 'relative'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, x: 24, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -24, filter: 'blur(5px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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

                          const levelColor = palette[day.level || 0];

                          return (
                            <div
                              key={day.date}
                              className="gh-day"
                              data-date={day.date}
                              style={{ backgroundColor: levelColor }}
                            />
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Year Buttons on the Right with Animated Smooth Highlight */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', width: '92px', flexShrink: 0 }}>
            {["2026", "2025", "2024"].map((y) => {
              const isSelected = selectedYear === y || (y === "2026" && selectedYear === "last");
              return (
                <motion.button
                  key={y}
                  onClick={() => setSelectedYear(y)}
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

        {/* ── Live Commit Stream with Staggered Flying Glide Animation ── */}
        <div className="gh-commits-container">
          <div className="gh-commits-header">
            <div className="gh-commits-title-group">
              <GitCommit size={16} />
              <span>{isTr ? 'Son Canlı Commit Akışı' : 'Recent Commit Stream'}</span>
              <span className="live-status-dot" style={{ marginLeft: '4px' }} />
            </div>

            <a
              href="https://github.com/unitybtw?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>{isTr ? 'Tüm Repolar' : 'All Repositories'}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="gh-commits-grid">
            <AnimatePresence mode="popLayout">
              {filteredCommits.map((c, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.a
                    key={selectedYear + '-' + c.sha}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gh-commit-card"
                    initial={{
                      opacity: 0,
                      x: isEven ? -160 : 160,
                      rotate: isEven ? -2.5 : 2.5,
                      filter: 'blur(8px)'
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotate: 0,
                      filter: 'blur(0px)'
                    }}
                    exit={{
                      opacity: 0,
                      x: isEven ? 100 : -100,
                      filter: 'blur(6px)',
                      transition: { duration: 0.25 }
                    }}
                    transition={{
                      duration: 0.65,
                      delay: 0.08 + idx * 0.075,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{
                      y: -3,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div className="gh-commit-main">
                      <div className="gh-commit-icon-badge">
                        <GitCommit size={18} />
                      </div>
                      <div className="gh-commit-info">
                        <div className="gh-commit-message" title={c.message}>
                          {c.message}
                        </div>
                        <div className="gh-commit-meta">
                          <span className="gh-repo-tag">{c.repo}</span>
                          <span>·</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={11} style={{ opacity: 0.7 }} />
                            {formatRelativeTime(c.date, isTr)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="gh-commit-right">
                      <span className="gh-commit-sha">
                        <GitBranch size={11} style={{ opacity: 0.6 }} />
                        {c.sha}
                      </span>
                      <ArrowUpRight size={15} style={{ opacity: 0.45 }} />
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
