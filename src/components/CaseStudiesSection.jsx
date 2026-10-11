import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Layers, ChevronDown, ExternalLink, Code2, ShieldCheck, Gauge } from 'lucide-react';

export default function CaseStudiesSection() {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language === 'tr';
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const caseStudies = [
    {
      id: 'nova-browser',
      category: isTr ? 'Masaüstü Mimarisi & IPC Sistemleri' : 'Desktop Architecture & IPC Systems',
      title: isTr
        ? 'Nova Browser: Çoklu Süreç İzolasyonu ve Yerel MCP Entegrasyonu'
        : 'Architecting Nova Browser: Multi-Process Isolation & Local MCP Server',
      icon: <Terminal size={18} className="text-current opacity-80" />,
      badges: ['Electron', 'TypeScript', 'MCP Protocol', 'React', 'AES-256-GCM'],
      problem: isTr
        ? 'Geleneksel tarayıcılar yüksek bellek tüketir; yerel yapay zeka modelleri bağlandığında arayüz iş parçacığı (UI thread) kilitlenir ve güvenlik izolasyonu riske girer.'
        : 'Desktop browsers often suffer from heavy memory footprints; integrating local LLM tooling risks freezing the UI renderer thread and breaching webview security sandboxes.',
      solution: isTr
        ? 'Ana süreç (Main Process), render ve özel arka plan sidecar süreçlerini kesin olarak izole eden çoklu süreç mimarisi kuruldu. Model Context Protocol (MCP) yerel sunucusu ayrı bir arka plan worker üzerinde çalıştırılarak asenkron güvenli IPC kanallarıyla bağlandı.'
        : 'Engineered a decoupled multi-process architecture with strict contextIsolation. Offloaded the Model Context Protocol (MCP) server to a dedicated lightweight Node background worker, bridging requests via secure asynchronous IPC channels.',
      metrics: [
        { label: isTr ? 'Bellek Optimizasyonu' : 'RAM Efficiency', val: '30% lower footprint' },
        { label: isTr ? 'UI Gecikmesi' : 'UI Thread Stall', val: '0 ms (zero freeze)' },
        { label: isTr ? 'Şifreleme' : 'Sync Security', val: 'AES-256-GCM E2EE' }
      ],
      details: isTr
        ? [
            'Chromium webview bileşenleri `contextIsolation: true` ve `nodeIntegration: false` ile tam kum havuzunda (sandbox) çalıştırılır.',
            'Yerel MCP sunucusu yapay zeka ajanlarının dosya sistemi, araçlar ve tarayıcı sekmeleriyle güvenli protokol üzerinden konuşmasını sağlar.',
            'Cihazlar arası bulut sekme senkronizasyonu PBKDF2 anahtar türetimi ve AES-256-GCM ile uçtan uca şifrelenir; sunucu veriyi asla düz metin göremez.'
          ]
        : [
            'Enforces hardened Chromium webview sandboxing with `contextIsolation: true` and zero Node.js leakage into untrusted web content.',
            'Native Model Context Protocol (MCP) daemon enables local AI agents to execute tools, inspect tabs, and automate workflows securely.',
            'Zero-knowledge cross-device tab synchronization powered by PBKDF2 key derivation and AES-256-GCM encryption over real-time WebSockets.'
          ],
      link: 'https://github.com/unitybtw'
    },
    {
      id: 'webgl-optimization',
      category: isTr ? 'Oyun Motoru & Grafik Pipeline' : 'Game Engine & Graphics Pipeline',
      title: isTr
        ? 'Web Portları ve Unity URP için Sıfır-Tahsisli Oyun Döngüleri'
        : 'Zero-Allocation Game Loops & Draw Call Batching for WebGL',
      icon: <Cpu size={18} className="text-current opacity-80" />,
      badges: ['Unity 3D', 'C#', 'URP', 'WebAssembly', 'WebGL'],
      problem: isTr
        ? 'Tarayıcıda çalışan WebGL ve WebAssembly oyunları, C# Garbage Collector çalıştığında ani kare düşüşleri (frame spike) ve yüksek Draw Call sebebiyle takılmalar yaşar.'
        : 'Browser-hosted WebAssembly games frequently suffer from jarring frame drops during Garbage Collector passes and GPU stalls caused by excessive draw call overhead.',
      solution: isTr
        ? 'Oyun döngüsü içindeki tüm Update fonksiyonları GC tahsisi yapmayacak şekilde (Struct tabanlı veri yapıları ve Object Pooling ile) yeniden tasarlandı. SRP Batcher ile malzeme gruplaması yapılarak sahne çizim çağrıları 14 seviyesine indirildi.'
        : 'Refactored all per-frame game systems to strictly zero GC allocations using pre-allocated struct buffers and reusable object pools. Configured Unity Scriptable Render Pipeline (SRP) batching to compress scene draw calls to just 14.',
      metrics: [
        { label: isTr ? 'Hedef FPS' : 'Target Framerate', val: 'Sustained 60 FPS' },
        { label: isTr ? 'Çizim Çağrısı' : 'Draw Calls', val: '14 Draw Calls' },
        { label: isTr ? 'Bellek Tahsisi' : 'Per-Frame GC', val: '0 Bytes / frame' }
      ],
      details: isTr
        ? [
            'LINQ ve boxing/unboxing işlemlerinin oyun döngüsünden tamamen arındırılmasıyla GC duraklamaları sıfırlandı.',
            'Universal Render Pipeline (URP) shader grafiklerinde doku atlaslama ve GPU instancing birleştirildi.',
            '23 adet retro ve WebGL oyun portunun tarayıcıda sıfır gecikmeli, reklamsız ve doğrudan çalışabilmesi için iframe izolasyonu ve CSP yapılandırıldı.'
          ]
        : [
            'Completely purged LINQ queries and reference type allocations from tick loops, preventing garbage collection stutter.',
            'Leveraged Universal Render Pipeline (URP) with material property blocks and GPU instancing across modular 3D environment meshes.',
            'Architected a zero-overhead web sandbox for 23 genuine retro ports and WebGL titles running at native browser speeds without ad telemetry.'
          ],
      link: '#arcade'
    },
    {
      id: 'native-tooling',
      category: isTr ? 'Native macOS & Düşük Gecikmeli Ses' : 'Native macOS & Low-Latency Systems',
      title: isTr
        ? 'Signal & Aether: Sub-4ms Ses Hatları ve Bilgisayarlı Görü'
        : 'Sub-4ms Audio Pipelines & Native Vision Gestures (Signal & Aether)',
      icon: <Layers size={18} className="text-current opacity-80" />,
      badges: ['Swift', 'Core Audio', 'AVAudioEngine', 'Apple Vision', 'AppKit'],
      problem: isTr
        ? 'Tuş sesi geri bildirimi 10ms gecikmeyi aştığında kullanıcıda doğal olmayan bir yapaylık hissi yaratır. Sürekli kamera takibi ise yüksek CPU/pil tüketimine yol açar.'
        : 'Mechanical audio feedback feels disjointed if latency exceeds 10ms. Continuous computer vision gesture tracking on webcam feeds easily drains laptop battery if unthrottled.',
      solution: isTr
        ? 'Apple Core Audio üzerinde doğrudan döngüsel bellek tamponları (circular PCM ring buffers) kullanılarak gecikme 4ms altına indirildi. Aether Command için Apple Vision çerçevesi 30 FPS ve gri tonlamalı optimize matrislerle sınırlandırıldı.'
        : 'Constructed custom circular PCM ring buffers on Apple Core Audio, slashing latency below 4ms. Throttled Apple Vision framework hand-pose detection to 30 FPS with downsampled monochrome frames, reducing CPU overhead below 2%.',
      metrics: [
        { label: isTr ? 'Ses Gecikmesi' : 'Audio Latency', val: '< 3.8 ms' },
        { label: isTr ? 'Ses Profili' : 'Switch Profiles', val: '15+ Profiles' },
        { label: isTr ? 'Arka Plan CPU' : 'Idle CPU Impact', val: '< 2.0%' }
      ],
      details: isTr
        ? [
            'Core Audio ses sunucusu ile sıfır kopyalı bellek aktarımı yapılarak gerçek zamanlı mekanik switch tınıları elde edildi.',
            'macOS Menu Bar entegrasyonu ve SwiftUI görsel dalga analizatörü (FFT) ile anlık WPM daktilo hızı hesaplaması.',
            'Aether Command ile kameradan yumruk, çimdik ve kaydırma hareketleri algılanarak native sistem kısayollarına dönüştürüldü.'
          ]
        : [
            'Implemented zero-copy audio buffer rendering with AVAudioEngine and low-level Core Audio HAL for authentic tactile sound feel.',
            'Integrated macOS Menu Bar status item with real-time Fast Fourier Transform (FFT) visualizer and live typing speed (WPM) telemetry.',
            'Engineered Aether Command hand-gesture parser translating pinch, fist, and swipe vectors into native macOS window management events.'
          ],
      link: 'https://github.com/unitybtw'
    }
  ];

  return (
    <section id="case-studies" className="case-studies-section" aria-labelledby="case-studies-heading">
      <div className="section-header-block">
        <h2 id="case-studies-heading" className="section-title">
          {isTr ? 'Mühendislik Vaka Analizleri' : 'Engineering Case Studies'}
        </h2>
        <p className="section-subtitle">
          {isTr
            ? 'Şablon kopyalamak yerine sıfırdan kurulan sistemler: mimari kararlar, performans darboğazları ve teknik çözümler.'
            : 'Beyond generic marketing copy: authentic architectural breakdowns, performance engineering, and system design decisions.'}
        </p>
      </div>

      <div className="case-studies-grid">
        {caseStudies.map((cs) => {
          const isExpanded = expandedId === cs.id;
          return (
            <article key={cs.id} className="case-study-card bento-card">
              <div className="case-study-top">
                <div className="case-study-category-row">
                  <span className="case-study-category">{cs.category}</span>
                  <div className="case-study-icon-wrap">{cs.icon}</div>
                </div>

                <h3 className="case-study-title">{cs.title}</h3>

                <div className="case-study-badges">
                  {cs.badges.map((b, i) => (
                    <span key={i} className="tech-tag">{b}</span>
                  ))}
                </div>
              </div>

              {/* Problem & Solution Blocks */}
              <div className="case-study-body">
                <div className="case-study-block">
                  <div className="case-study-label">
                    <span className="dot dot-problem" />
                    <strong>{isTr ? 'Darboğaz / Problem' : 'The Engineering Bottleneck'}</strong>
                  </div>
                  <p className="case-study-text">{cs.problem}</p>
                </div>

                <div className="case-study-block">
                  <div className="case-study-label">
                    <span className="dot dot-solution" />
                    <strong>{isTr ? 'Mimari Çözüm' : 'Architectural Solution'}</strong>
                  </div>
                  <p className="case-study-text">{cs.solution}</p>
                </div>
              </div>

              {/* Bottom Actions Cluster */}
              <div className="case-study-footer">
                {/* Metrics Row */}
                <div className="case-study-metrics-row">
                  {cs.metrics.map((m, idx) => (
                    <div key={idx} className="metric-chip">
                      <span className="metric-value">{m.val}</span>
                      <span className="metric-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Expandable Technical Details */}
                <button
                  type="button"
                  className="case-study-expand-btn"
                  onClick={() => toggleExpand(cs.id)}
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? (isTr ? 'Detayları Gizle' : 'Collapse Technical Specs') : (isTr ? 'Teknik Şartnameyi İncele' : 'Inspect Architectural Specs')}</span>
                  <ChevronDown size={15} className={`case-study-chevron ${isExpanded ? 'rotated' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      className="case-study-expanded-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.28, delay: 0.05, ease: 'easeOut' }
                        }
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.18, ease: 'easeIn' }
                        }
                      }}
                    >
                      <div className="case-study-details-box">
                        <h4 className="case-study-details-heading">
                          <Code2 size={15} />
                          <span>{isTr ? 'Temel Mühendislik Kararları' : 'Key Engineering Decisions'}</span>
                        </h4>
                        <ul className="case-study-details-list">
                          {cs.details.map((detail, dIdx) => (
                            <motion.li
                              key={dIdx}
                              className="case-study-detail-item"
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.25, delay: 0.08 + dIdx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <span className="bullet-indicator">✓</span>
                              <span>{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                        {cs.link && (
                          <motion.div
                            className="case-study-link-wrap"
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.22 }}
                          >
                            <a
                              href={cs.link}
                              target={cs.link.startsWith('http') ? '_blank' : '_self'}
                              rel={cs.link.startsWith('http') ? 'noopener noreferrer' : ''}
                              className="btn-outline text-xs inline-flex items-center gap-1.5"
                            >
                              <span>{isTr ? 'Depoyu / Sistemi Gör' : 'View System / Repository'}</span>
                              <ExternalLink size={13} />
                            </a>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
