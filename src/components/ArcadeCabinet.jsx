import { useEffect, useId, useRef, useState } from 'react';

// A hand-drawn cabinet with a small vector game inside its clipped CRT screen.
export default function ArcadeCabinet() {
  const id = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`retro-arcade-scene arcade-cabinet ${visible ? 'is-visible' : ''}`}>
    <svg viewBox="0 0 420 350" fill="none" className="retro-arcade-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="110" y1="50" x2="265" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#303443" /><stop offset="1" stopColor="#151722" /></linearGradient>
        <linearGradient id={`${id}-side`} x1="252" y1="100" x2="311" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#202431" /><stop offset="1" stopColor="#10121b" /></linearGradient>
        <linearGradient id={`${id}-screen`} x1="180" y1="102" x2="180" y2="168" gradientUnits="userSpaceOnUse"><stop stopColor="#0e2633" /><stop offset="1" stopColor="#090e1b" /></linearGradient>
        <clipPath id={`${id}-clip`}><path d="M130 107H231L220 161H140Z" /></clipPath>
        <pattern id={`${id}-scanlines`} width="4" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5H4" stroke="#fff" strokeOpacity=".055" /></pattern>
      </defs>
      <ellipse cx="211" cy="326" rx="118" ry="12" fill="currentColor" opacity=".075" />
      <path d="m65 294 146-44 139 46-144 43Z" stroke="currentColor" strokeOpacity=".1" strokeDasharray="3 7" />
      <g className="ac-coin ac-coin-left"><ellipse cx="73" cy="150" rx="10" ry="13" fill="#f7cb74" stroke="#b88631" /><path d="m72 142-3 8h5l-3 8" stroke="#946625" strokeWidth="1.5" strokeLinejoin="round" /></g>
      <g className="ac-coin ac-coin-right"><ellipse cx="337" cy="235" rx="9" ry="12" fill="#f7cb74" stroke="#b88631" /><path d="m337 228-3 7h5l-3 8" stroke="#946625" strokeWidth="1.5" /></g>
      <path d="M68 225h10m-5-5v10M333 99h10m-5-5v10" stroke="currentColor" strokeOpacity=".24" strokeLinecap="round" />
      <circle cx="83" cy="88" r="2" fill="var(--arcade-accent)" opacity=".5" /><circle cx="323" cy="167" r="2" fill="currentColor" opacity=".25" />
      {/* One continuous side panel gives the cabinet real depth. */}
      <path d="m248 44 52 26v48l-13 82 28 23-9 99-54-24 8-99-27-23 15-82Z" fill={`url(#${id}-side)`} stroke="#555b6e" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="m248 44 52 26-52 24-130-1V44Z" fill="#3c4152" stroke="#646a7b" strokeWidth="1.2" />
      <path d="M118 44h130v50l-15 82 27 23-8 99H107v-99l21-23-10-82Z" fill={`url(#${id}-body)`} stroke="#646a7b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m271 99 13 7-11 73-14-5Z" fill="#56c7ef" fillOpacity=".14" />
      <path d="m276 209-15 26h13l-10 27 27-36h-15l10-14Z" fill="#71d6f4" opacity=".8" />
      <path d="M118 91h130M110 286h143" stroke="#7a83a3" strokeOpacity=".5" />
      {/* Illuminated marquee. */}
      <rect x="127" y="52" width="113" height="32" rx="4" fill="#101728" stroke="#8dd6fa" strokeOpacity=".45" />
      <text x="183" y="73" textAnchor="middle" fill="#a9eaff" fontFamily="monospace" fontSize="15" fontWeight="700" letterSpacing="3">ARCADE</text>
      <path className="ac-marquee-light" d="M141 80h83" stroke="#58c9ed" strokeWidth="1.5" />
      {/* Recessed CRT, screen content stays within its trapezoid. */}
      <path d="M123 100h115l-12 68h-92Z" fill="#070b12" stroke="#6b758d" strokeWidth="1.2" />
      <path d="M130 107h101l-11 54h-80Z" fill={`url(#${id}-screen)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <g className="ac-enemies" fill="#72d6ec">
          {[151, 176, 201].map((x) => <path key={x} d={`M${x} 118h3v-3h3v3h3v3h3v6h-3v-3h-9v3h-3v-6h3Z`} />)}
        </g>
        <path className="ac-player" d="M178 147h4v-4h4v4h4v4h4v4h-20v-4h4Z" fill="#dce9fc" />
        <path className="ac-shot" d="M184 142v-5" stroke="#f9d891" strokeWidth="2" />
        <path d="M144 110h8m61 25h3M155 138h2" stroke="#b2d4ed" strokeOpacity=".4" />
        <path className="ac-scan" d="M127 110h108v4H127Z" fill="#7bd7f7" opacity=".12" />
        <path d="M130 107h101l-11 54h-80Z" fill={`url(#${id}-scanlines)`} />
      </g>
      <path d="m135 109 84 1" stroke="#c4e9fa" strokeOpacity=".18" strokeWidth="2" />
      {/* Sloped controls, including an actual joystick stem. */}
      <path d="m128 176 105 0 27 23H107Z" fill="#363d52" stroke="#727e97" strokeWidth="1.2" strokeLinejoin="round" />
      <ellipse cx="149" cy="190" rx="13" ry="4" fill="#141a29" /><path d="m149 188 5-18" stroke="#b5bfd2" strokeWidth="4" strokeLinecap="round" />
      <g className="ac-joystick"><circle cx="154" cy="168" r="8" fill="#f48194" stroke="#ffb7c3" /><circle cx="152" cy="165" r="2" fill="#fff" opacity=".5" /></g>
      <ellipse className="ac-button ac-button-one" cx="192" cy="188" rx="7" ry="3.5" fill="#72d8f2" stroke="#b4efff" />
      <ellipse className="ac-button ac-button-two" cx="211" cy="187" rx="7" ry="3.5" fill="#a597ed" stroke="#d3caff" />
      <path d="M121 208h125" stroke="#8c98b5" strokeOpacity=".25" />
      <rect x="156" y="222" width="49" height="44" rx="4" fill="#0e121e" stroke="#555e76" />
      <rect x="170" y="230" width="21" height="4" rx="2" fill="#7786a4" /><circle cx="181" cy="249" r="4" fill="#23344a" stroke="#57b7d5" />
      <path d="M125 278h34m-34 4h34m47-4h30m-30 4h30" stroke="#657089" strokeOpacity=".4" />
      <path d="M112 298v9h19v-9m98 0v9h19v-9" fill="#0e1320" stroke="#565e74" />
    </svg>
  </div>;
}
