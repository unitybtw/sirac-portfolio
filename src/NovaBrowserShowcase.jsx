import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './nova-showcase.css';

const features = [
  { id: 'workspace', en: 'Your workspace', tr: 'Senin çalışma alanın', enTitle: 'More room for your ideas.', trTitle: 'Fikirlerine daha fazla alan.', enText: 'Flexible tab layouts, a personal start page and shortcuts that keep your everyday tools close.', trText: 'Esnek sekme düzenleri, kişisel bir başlangıç sayfası ve her gün kullandığın araçları yakında tutan kısayollar.' },
  { id: 'ai', en: 'On-device AI', tr: 'Cihazında yapay zekâ', enTitle: 'A little intelligence. Right beside you.', trTitle: 'Biraz zekâ. Hemen yanında.', enText: 'An integrated AI side panel lets you work with your assistant while keeping the page in view.', trText: 'Entegre yapay zekâ paneli, sayfayı gözden kaybetmeden asistanınla birlikte çalışmanı sağlıyor.' },
  { id: 'personal', en: 'Make it yours', tr: 'Kendine göre düzenle', enTitle: 'Your browser. Your rhythm.', trTitle: 'Senin tarayıcın. Senin ritmin.', enText: 'Arrange your workspace and bring your favourite extensions. Built to adapt to the way you work.', trText: 'Çalışma alanını düzenle ve sevdiğin eklentileri kullan. Senin çalışma biçimine uyum sağlamak için tasarlandı.' },
];

function FeatureMotion({ type }) {
  return <div className={`nova-feature-motion nova-motion-${type}`} aria-hidden="true">
    {type === 'workspace' ? <><div className="nova-layout-rail"><i /><i /><i /></div><div className="nova-layout-main"><i /><i /><i /></div><div className="nova-layout-side"><i /><i /></div></> : type === 'ai' ? <div className="nova-wave">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ '--index': i }} />)}</div> : <div className="nova-tiles">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--index': i }} />)}</div>}
  </div>;
}

export default function NovaBrowserShowcase() {
  const { i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const feature = features[active];
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`nova-showcase ${visible ? 'nova-in-view' : ''}`}>
    <div className="nova-atmosphere" aria-hidden="true"><i /><i /></div>
    <div className="nova-intro">
      <div className="nova-editorial">
        <span className="nova-eyebrow"><span /> {tr ? 'ÖNE ÇIKAN PROJEM / MASAÜSTÜ' : 'FEATURED PROJECT / DESKTOP'}</span>
        <h2 id="nova-heading">Nova<br /><span>Browser.</span></h2>
        <p className="nova-lead">{tr ? 'Web’de gezinmenin ötesinde.' : 'Go beyond browsing.'}</p>
        <p className="nova-description">{tr ? 'Geliştiriciler ve meraklı zihinler için tasarladığım açık kaynaklı tarayıcı. Çalışma alanın, araçların ve yapay zekân bir arada.' : 'An open-source browser I built for developers and curious minds. Your workspace, tools and AI, together.'}</p>
        <div className="nova-actions">
          <a href="https://github.com/unitybtw/nova-browser/releases" target="_blank" rel="noopener noreferrer" className="nova-download">{tr ? 'Nova’yı keşfet' : 'Explore Nova'} <span aria-hidden="true">↗</span></a>
          <a href="https://github.com/unitybtw/nova-browser" target="_blank" rel="noopener noreferrer" className="nova-source">{tr ? 'Kaynak kodu' : 'Source code'} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="nova-logo-scene">
        <div className="nova-logo-halo" aria-hidden="true" />
        <img className="nova-product-logo" src={`${import.meta.env.BASE_URL}assets/nova/logo.webp`} alt="Nova Browser" width="2048" height="2048" loading="lazy" decoding="async" />
        <span className="nova-logo-label"><i /> {tr ? 'Merakla geliştirildi.' : 'Built with curiosity.'}</span>
      </div>
    </div>
    <div className="nova-feature-area">
      <div className="nova-feature-heading"><span>{tr ? 'SENİN İÇİN TASARLANDI' : 'DESIGNED AROUND YOU'}</span><span>0{active + 1} / 03</span></div>
      <div className="nova-view-controls" aria-label={tr ? 'Nova özelliklerini keşfet' : 'Explore Nova features'}>
        {features.map((item, index) => <button key={item.id} type="button" aria-pressed={active === index} onClick={() => setActive(index)}><span className="nova-control-number">0{index + 1}</span>{tr ? item.tr : item.en}<span className="nova-control-arrow" aria-hidden="true">↗</span></button>)}
      </div>
      <AnimatePresence mode="wait" initial={false}><motion.div className="nova-feature-detail" key={feature.id} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -6 }} transition={{ duration: reduce ? 0 : .2 }}>
        <div className="nova-feature-copy" aria-live="polite"><h3>{tr ? feature.trTitle : feature.enTitle}</h3><p>{tr ? feature.trText : feature.enText}</p></div><FeatureMotion type={feature.id} />
      </motion.div></AnimatePresence>
    </div>
    <div className="nova-footer"><span>Electron <b>·</b> TypeScript <b>·</b> React <b>·</b> WebGPU</span><a href="#other-projects">{tr ? 'Diğer projelerim' : 'More of my work'} <span aria-hidden="true">↓</span></a></div>
  </div>;
}
