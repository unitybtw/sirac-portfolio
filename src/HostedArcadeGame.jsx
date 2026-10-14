import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isolatedPlayerUrl, FRAME_PERMISSIONS } from './utils/arcadeSecurity';

// The parent player owns restart and fullscreen; each game keeps its original runtime.
export default function HostedArcadeGame({ title, url, source, controls, external = false, opaqueOrigin = false }) {
  const frame = useRef(null);
  const { i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  return <div className="hosted-arcade-game">
    {external ? <div className="hosted-arcade-launch">
      <h3>{title}</h3>
      <p>{tr ? 'Bu oyun ayrı bir sekmede açılır. Kütüphanen burada açık kalır.' : 'This game opens in a separate tab. Your library stays open here.'}</p>
      <a className="btn-primary" href={url} target="_blank" rel="noopener noreferrer">{tr ? 'Yeni sekmede oyna' : 'Play in a new tab'} ↗</a>
    </div> : <iframe ref={frame} src={opaqueOrigin ? isolatedPlayerUrl(url, import.meta.env.BASE_URL) : url} title={title}
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      allow={FRAME_PERMISSIONS} referrerPolicy="no-referrer" allowFullScreen
      onLoad={() => frame.current?.focus()} />}
    <div className="hosted-arcade-info">
      <span>{controls[tr ? 'tr' : 'en']}{opaqueOrigin && (tr ? ' · Kayıtlar yalnızca bu oturumda' : ' · Session-only saves')}</span>
      <a href={source} target="_blank" rel="noopener noreferrer">{tr ? 'Kaynak / geliştirici' : 'Source / creator'} ↗</a>
    </div>
  </div>;
}
