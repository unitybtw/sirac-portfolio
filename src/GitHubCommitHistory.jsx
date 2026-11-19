import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COLOR_LEVELS = {
  light: ['rgba(9, 9, 11, 0.06)', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['rgba(255, 255, 255, 0.07)', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

const YEARS = ['2026', '2025', '2024'];

export default function GitHubCommitHistory() {
  const { i18n } = useTranslation();
  const isTr = i18n.language.startsWith('tr');
  const [selectedYear, setSelectedYear] = useState('last');
  const [allData, setAllData] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // Detect theme from html element
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Load cached contribution data asynchronously so it stays out of the critical initial JS bundle
  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();

    import('./data/githubContributions.json')
      .then((mod) => {
        if (mounted) setAllData((prev) => prev || mod.default);
      })
      .catch(() => {});

    async function refreshLive() {
      try {
        const results = await Promise.all(
          ['last', ...YEARS].map(async (y) => {
            try {
              const res = await fetch(`https://github-contributions-api.jogruber.de/v4/unitybtw?y=${y}`, { signal: ctrl.signal });
              if (res.ok) return [y, await res.json()];
            } catch { /* fallback to local JSON */ }
            return null;
          })
        );
        const fetched = Object.fromEntries(results.filter(Boolean));
        if (mounted && Object.keys(fetched).length > 0) {
          setAllData((prev) => ({ ...(prev || {}), ...fetched }));
        }
      } catch { /* silent */ }
    }

    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    const cancelSchedule = window.cancelIdleCallback || clearTimeout;
    const handle = schedule(refreshLive, { timeout: 3500 });
    return () => {
      mounted = false;
      ctrl.abort();
      cancelSchedule(handle);
    };
  }, []);

  const currentYearData = useMemo(
    () => (allData ? (allData[selectedYear] || allData.last || {}) : {}),
    [allData, selectedYear]
  );
  const contributions = useMemo(() => currentYearData.contributions || [], [currentYearData]);

  const totalCount = useMemo(() => {
    if (!allData) return selectedYear === 'last' ? 3101 : 0;
    if (selectedYear === 'last') {
      return currentYearData.total?.lastYear || contributions.reduce((a, b) => a + b.count, 0);
    }
    return currentYearData.total?.[selectedYear] || contributions.reduce((a, b) => a + b.count, 0);
  }, [allData, currentYearData, selectedYear, contributions]);

  const { weeks, monthLabels } = useMemo(() => {
    if (!contributions.length) return { weeks: [], monthLabels: [] };
    const wList = [];
    let currentWeek = [];
    const sorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDayOfWeek = new Date(`${sorted[0].date}T00:00:00Z`).getUTCDay();
    for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);

    for (const day of sorted) {
      const d = new Date(`${day.date}T00:00:00Z`);
      const dayOfWeek = d.getUTCDay();
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        wList.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push({ ...day, month: d.getUTCMonth() });
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      wList.push(currentWeek);
    }

    let prevMonth = -1;
    const mLabels = [];
    wList.forEach((week, wIdx) => {
      const validDay = week.find((d) => d !== null);
      if (validDay && validDay.month !== prevMonth) {
        prevMonth = validDay.month;
        mLabels.push({ colIndex: wIdx, name: MONTH_NAMES[validDay.month] });
      }
    });
    return { weeks: wList, monthLabels: mLabels };
  }, [contributions]);

  useEffect(() => {
    const chart = containerRef.current;
    if (chart && weeks.length && window.matchMedia('(max-width: 820px)').matches) {
      chart.scrollLeft = chart.scrollWidth - chart.clientWidth;
    }
  }, [selectedYear, weeks.length]);

  const palette = isDark ? COLOR_LEVELS.dark : COLOR_LEVELS.light;

  const dayByDate = useMemo(() => {
    const map = new Map();
    for (const d of contributions) map.set(d.date, d);
    return map;
  }, [contributions]);

  const hoverRaf = useRef(0);
  const handleGridOver = (e) => {
    const t = e.target?.closest?.('.gh-day');
    if (!t || !t.dataset.date) return;
    if (hoverRaf.current) return;
    hoverRaf.current = requestAnimationFrame(() => {
      hoverRaf.current = 0;
      const day = dayByDate.get(t.dataset.date);
      if (!day) return;
      const rect = t.getBoundingClientRect();
      const parentRect = containerRef.current?.getBoundingClientRect();
      const scrollLeft = containerRef.current?.scrollLeft || 0;
      if (parentRect) {
        setTooltipPos({
          x: rect.left - parentRect.left + scrollLeft + rect.width / 2,
          y: rect.top - parentRect.top - 10,
        });
      }
      setHoveredDay((prev) => (prev?.date === day.date ? prev : day));
    });
  };
  const handleGridOut = (e) => {
    if (e.target?.closest?.('.gh-day')) setHoveredDay(null);
  };
  useEffect(() => () => { if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current); }, []);

  const formatTooltipDate = (dateStr) => {
    try {
      return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div ref={sectionRef} className="gh-activity-wrapper">
      <header className="portfolio-section-heading" data-motion>
        <span className="portfolio-index">06</span>
        <div className="gh-section-header">
          <div>
            <h2 className="section-title">{isTr ? 'Açık Kaynak Aktivitesi' : 'Open-Source Activity'}</h2>
            <p className="section-subtitle">
              {isTr
                ? '@unitybtw hesabı altındaki son bir yıllık commit geçmişi.'
                : 'Contribution calendar and commit activity under @unitybtw.'}
            </p>
          </div>
          <a
            href="https://github.com/unitybtw"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-text-link gh-profile-link"
          >
            <Github size={16} />
            <span>@unitybtw</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </header>

      <div className="bento-card bento-col-12 gh-heatmap-card">
        <div className="gh-summary">
          <div className="gh-total-count">
            <strong>{totalCount.toLocaleString()}</strong>{' '}
            <span>
              {selectedYear === 'last'
                ? (isTr ? 'son bir yıldaki toplam katkı' : 'contributions in the last year')
                : (isTr ? `${selectedYear} yılındaki katkı` : `contributions in ${selectedYear}`)}
            </span>
          </div>

          <div className="gh-year-tabs" role="tablist" aria-label={isTr ? 'Yıl seçimi' : 'Select year'}>
            {YEARS.map((y) => {
              const isSelected = selectedYear === y || (y === '2026' && selectedYear === 'last');
              return (
                <button
                  key={y}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedYear(y)}
                  className={`gh-year-btn ${isSelected ? 'is-selected' : ''}`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>

        <div className="gh-map-area">
          <div
            ref={containerRef}
            className="gh-heatmap-scroll"
            role="region"
            aria-label={isTr ? 'GitHub katkı takvimi' : 'GitHub contribution calendar'}
            tabIndex={0}
          >
            {weeks.length === 0 ? (
              <div className="gh-grid-placeholder" aria-hidden="true" />
            ) : (
              <div className="gh-grid-inner" style={{ width: `${Math.max(720, weeks.length * 14 + 32)}px` }}>
                <div className="gh-months-row">
                  {monthLabels.map((m, mIdx) => (
                    <span key={mIdx} style={{ left: `${m.colIndex * 14}px` }}>{m.name}</span>
                  ))}
                </div>

                <div className="gh-matrix-wrap">
                  <div className="gh-days-labels">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  <div className="gh-weeks-row" onMouseOver={handleGridOver} onMouseOut={handleGridOut}>
                    {weeks.map((week, colIdx) => (
                      <div key={colIdx} className="gh-week-col">
                        {week.map((day, rowIdx) => (
                          day ? (
                            <span
                              key={day.date}
                              className="gh-day"
                              data-date={day.date}
                              style={{ backgroundColor: palette[day.level || 0] }}
                            />
                          ) : (
                            <span key={rowIdx} className="gh-day gh-day-empty" />
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {hoveredDay && (
                  <div
                    className="gh-tooltip"
                    style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
                  >
                    <strong>
                      {hoveredDay.count > 0
                        ? (isTr ? `${hoveredDay.count} katkı` : `${hoveredDay.count} contributions`)
                        : (isTr ? 'Katkı yok' : 'No contributions')}
                    </strong>{' '}
                    {isTr ? '· ' : 'on '}
                    {formatTooltipDate(hoveredDay.date)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="gh-map-footer">
            <span className="gh-legend-note">
              {isTr ? 'GitHub API ile senkronize' : 'Synced via GitHub API'}
            </span>
            <div className="gh-legend-scale">
              <span>{isTr ? 'Az' : 'Less'}</span>
              {palette.map((color, cIdx) => (
                <span key={cIdx} className="gh-legend-swatch" style={{ backgroundColor: color }} />
              ))}
              <span>{isTr ? 'Çok' : 'More'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
