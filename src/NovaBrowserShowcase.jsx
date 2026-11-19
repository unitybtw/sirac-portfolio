import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import './nova-showcase.css';

const VIEWS = [
  {
    id: 'workspace',
    image: 'preview.webp',
    enTab: '01 · Vertical Tabs & Sidebar',
    trTab: '01 · Dikey Sekme & Kenar Çubuğu',
    enTitle: 'Structured spaces for focused browsing.',
    trTitle: 'Odaklı gezinme için yapılandırılmış çalışma alanları.',
    enText: 'Arc-inspired vertical tab management, isolated project Spaces, split viewports, and an integrated developer command sidebar.',
    trText: 'Dikey sekme yönetimi, proje bazlı izole çalışma alanları (Spaces), bölünmüş ekran ve geliştirici odaklı yan panel düzeni.',
  },
  {
    id: 'newtab',
    image: 'newtab.webp',
    enTab: '02 · Start Page & Ad Shield',
    trTab: '02 · Başlangıç & Gizlilik Kalkanı',
    enTitle: 'Distraction-free start with session-level blocking.',
    trTitle: 'Oturum seviyesinde koruma ile sade başlangıç.',
    enText: 'Clean quick-access dashboard paired with native ad and tracker interception built directly into the Chromium network layer.',
    trText: 'Chromium ağ katmanında yerleşik reklam ve izleyici engelleme kalkanıyla birlikte çalışan sade başlangıç ekranı.',
  },
  {
    id: 'sync',
    image: 'sync.webp',
    enTab: '03 · Zero-Knowledge E2EE Sync',
    trTab: '03 · Uçtan Uca Şifreli Eşitleme',
    enTitle: 'Client-side AES-256-GCM sync without accounts.',
    trTitle: 'Hesap gerektirmeyen istemci taraflı şifreli eşitleme.',
    enText: 'Pair devices with a single pairing code. Bookmarks and credentials are encrypted locally via WebCrypto before leaving your machine.',
    trText: 'Tek eşleştirme koduyla cihazlar arası bağlantı. Yer imleri ve parolalar cihazdan çıkmadan önce yerel olarak AES-256-GCM ile şifrelenir.',
  },
];

export default function NovaBrowserShowcase() {
  const { i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  const [active, setActive] = useState(0);
  const current = VIEWS[active];
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="nova-showcase">
      <div className="nova-header-grid">
        <div className="nova-headline-col">
          <div className="nova-brand-row">
            <img
              className="nova-icon-mark"
              src={`${baseUrl}assets/nova/logo.svg`}
              alt=""
              width="52"
              height="52"
              decoding="async"
            />
            <div className="nova-brand-meta">
              <span className="nova-eyebrow">
                {tr ? 'ÖNE ÇIKAN PROJE · MASAÜSTÜ TARAYICI' : 'FEATURED PROJECT · DESKTOP BROWSER'}
              </span>
              <span className="nova-stack-inline">Electron · TypeScript · React · WebGPU · MCP</span>
            </div>
          </div>

          <h2 id="nova-heading" className="nova-title">
            Nova Browser
          </h2>

          <p className="nova-lead">
            {tr
              ? 'Geliştiriciler için tasarlanmış açık kaynaklı masaüstü tarayıcı. Dikey sekmeler, yerel WebGPU yapay zekâ asistanı ve sıfır-bilgi eşitleme tek mimaride.'
              : 'An open-source desktop browser engineered for developers. Combines vertical tab spaces, on-device WebGPU inference, MCP tooling, and encrypted sync.'}
          </p>
        </div>

        <div className="nova-actions">
          <a
            href="https://github.com/unitybtw/nova-browser/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="nova-btn-download"
          >
            <span>{tr ? 'Sürümleri İncele' : 'Explore Releases'}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/unitybtw/nova-browser"
            target="_blank"
            rel="noopener noreferrer"
            className="nova-btn-source"
          >
            <span>{tr ? 'Kaynak Kodu' : 'Source Code'}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="nova-showcase-body">
        <div className="nova-tabs-row" role="tablist" aria-label={tr ? 'Nova ekran görüntüleri' : 'Nova interface views'}>
          {VIEWS.map((view, idx) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={active === idx}
              className={`nova-tab-btn ${active === idx ? 'is-active' : ''}`}
              onClick={() => setActive(idx)}
            >
              {tr ? view.trTab : view.enTab}
            </button>
          ))}
        </div>

        <div className="nova-preview-layout">
          <div className="nova-screenshot-frame">
            <img
              src={`${baseUrl}assets/nova/${current.image}`}
              alt={tr ? current.trTitle : current.enTitle}
              className="nova-screenshot-img"
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="nova-caption-bar" aria-live="polite">
            <div className="nova-caption-copy">
              <h3>{tr ? current.trTitle : current.enTitle}</h3>
              <p>{tr ? current.trText : current.enText}</p>
            </div>
            <a href="#other-projects" className="nova-more-link">
              <span>{tr ? 'Diğer projeler' : 'More projects'}</span>
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
