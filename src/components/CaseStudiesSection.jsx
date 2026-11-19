import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { SectionHeading } from './PortfolioSections';

export default function CaseStudiesSection() {
  const { i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  const notes = [
    {
      title: 'Nova Browser',
      category: tr ? 'Masaüstü & tarayıcı' : 'Desktop & browser',
      stack: 'Electron · TypeScript · MCP',
      summary: tr ? 'Süreç izolasyonu, WebGPU ve yerel MCP mimarisi.' : 'Process isolation, on-device WebGPU, and native MCP.',
      detail: tr
        ? 'Ana tarayıcı arayüzünü WebGPU çıkarım katmanından ve eklenti bağlamlarından ayıran çoklu süreç mimarisi; harici araç bağlantıları için yerleşik Model Context Protocol sunucusuyla birlikte kaynak kodda incelenebilir.'
        : 'Multi-process boundary isolating UI threads from WebGPU inference and browser contexts, paired with a native Model Context Protocol server for local tool integrations.',
      url: 'https://github.com/unitybtw/nova-browser',
    },
    {
      title: 'Unity & WebGL',
      category: tr ? 'Oyun geliştirme' : 'Game development',
      stack: 'Unity · C# · WebGL',
      summary: tr ? 'Fizik kontrolcüleri ve sıfır-tahsisli döngüler.' : 'Character physics and WebGL isolation boundaries.',
      detail: tr
        ? 'Itch.io üzerinde yayınlanan Legend of the Three Masks için C# fizik kontrolcüleri ve URP sahne optimizasyonu; portföydeki tarayıcı oyun alanı ise üçüncü taraf WASM portlarını opak origin iframe sınırı içinde çalıştırır.'
        : 'Custom C# movement physics and URP optimization for Legend of the Three Masks, alongside the portfolio arcade sandboxing third-party WASM ports inside opaque-origin iframes.',
      url: 'https://unitybtw.itch.io/legend-of-the-three-masks',
    },
    {
      title: 'Signal & Aether',
      category: tr ? 'Native macOS' : 'Native macOS',
      stack: 'Swift · Core Audio · Vision',
      summary: tr ? 'Düşük gecikmeli ses ve kamera hareket algılama.' : 'Low-latency Core Audio mixing and Vision hand tracking.',
      detail: tr
        ? 'Signal, CGEvent klavye dinleyicilerini ön belleklenmiş Core Audio kanallarına sıfır gecikmeyle bağlar. Aether Command ise Apple Vision iskelet noktalarını düşük CPU kullanımıyla sistem kısayollarına eşler.'
        : 'Signal routes system keyboard hooks into pre-buffered Core Audio voices for zero-lag acoustic playback. Aether Command maps Apple Vision hand landmarks to desktop actions with minimal CPU overhead.',
      url: 'https://github.com/unitybtw',
    },
  ];

  return (
    <section id="case-studies" className="portfolio-section engineering-notes" aria-labelledby="case-studies-heading">
      <SectionHeading
        index="05"
        id="case-studies-heading"
        title={tr ? 'Mühendislik Notları' : 'Engineering Notes'}
        subtitle={tr ? 'Seçili projelerdeki mimari kararlar.' : 'Architecture notes from selected projects.'}
      />
      <div className="engineering-notes-list">
        {notes.map((note) => (
          <details key={note.title} className="engineering-note" data-motion>
            <summary>
              <span className="note-category">{note.category}</span>
              <span className="note-heading">
                <strong>{note.title}</strong>
                <span>{note.summary}</span>
              </span>
              <ChevronDown size={20} className="note-chevron" />
            </summary>
            <div className="note-detail">
              <p>{note.detail}</p>
              <div>
                <span className="work-stack">{note.stack}</span>
                <a className="portfolio-text-link" href={note.url} target="_blank" rel="noopener noreferrer">
                  {tr ? 'Projeyi incele' : 'Explore project'}
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
