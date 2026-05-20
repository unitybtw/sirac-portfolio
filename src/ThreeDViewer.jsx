import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Stage, PresentationControls } from '@react-three/drei';
import { ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';

const Model = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};

const ScrambleText = ({ text }) => {
  return <span>{text}</span>;
};

export default function ThreeDViewer({ t, theme }) {
  const models = ["model.glb", "model2.glb", "model3.glb"];
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const containerRef = React.useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 968);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.05 }); // Start loading when at least 5% is in view

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const nextModel = () => setCurrentModelIndex((prev) => (prev + 1) % models.length);
  const prevModel = () => setCurrentModelIndex((prev) => (prev - 1 + models.length) % models.length);

  return (
    <motion.section
      id="3d-viewer"
      ref={containerRef}
      className="viewer-section glass-panel"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.2 }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title text-gradient"><ScrambleText text={t('viewer_title')} /></h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('viewer_subtitle')} ({currentModelIndex + 1}/{models.length})</p>
      </div>

      <div className="viewer-container">
        
        {/* Navigation Buttons */}
        <button onClick={prevModel} style={{ position: 'absolute', left: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: isMobile ? '36px' : '50px', height: isMobile ? '36px' : '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-main)', backdropFilter: 'blur(10px)' }}>
          <ChevronLeft size={isMobile ? 18 : 24} />
        </button>
        <button onClick={nextModel} style={{ position: 'absolute', right: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: isMobile ? '36px' : '50px', height: isMobile ? '36px' : '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-main)', backdropFilter: 'blur(10px)' }}>
          <ChevronRight size={isMobile ? 18 : 24} />
        </button>

        {isVisible ? (
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>INITIALIZING 3D ENGINE...</div>}>
            <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 0, 4], fov: 45 }}>
              <color attach="background" args={[theme === 'light' ? '#f0f0f5' : '#050508']} />
              <ambientLight intensity={theme === 'light' ? 0.8 : 0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
              <pointLight position={[-10, -10, -10]} />
              
              <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                <Stage environment={theme === 'light' ? 'studio' : 'city'} intensity={theme === 'light' ? 0.9 : 0.6} contactShadow={false}>
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Model path={`${import.meta.env.BASE_URL}${models[currentModelIndex]}`} />
                  </Float>
                </Stage>
              </PresentationControls>
              
              <OrbitControls enableZoom={true} enablePan={false} makeDefault />
            </Canvas>
          </Suspense>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem', gap: '8px' }}>
            <Gamepad2 size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <span>3D ENGINE STANDBY</span>
          </div>
        )}
        
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-glass)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', pointerEvents: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {t('viewer_hint')}
        </div>
      </div>
    </motion.section>
  );
}
