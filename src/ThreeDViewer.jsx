import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Stage, PresentationControls } from '@react-three/drei';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const Model = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};

export default function ThreeDViewer({ t, theme }) {
  const models = [
    "barrel.glb", "bottle.glb", "horn.glb", 
    "mug.glb", "shield.glb", "waterbottle.glb"
  ];
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.02 }); // Lower threshold for earlier activation

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const nextModel = () => setCurrentModelIndex((prev) => (prev + 1) % models.length);
  const prevModel = () => setCurrentModelIndex((prev) => (prev - 1 + models.length) % models.length);

  return (
    <div
      ref={containerRef}
      className="bento-card bento-col-12"
      style={{ minHeight: '520px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t('viewer_title')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {t('viewer_subtitle')} ({currentModelIndex + 1}/{models.length})
        </p>
      </div>

      <div className="viewer-container" style={{ flexGrow: 1, position: 'relative', minHeight: '350px' }}>
        {/* Navigation Buttons */}
        <button 
          onClick={prevModel} 
          className="btn-outline"
          style={{ 
            position: 'absolute', 
            left: isMobile ? '8px' : '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 10, 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            padding: 0,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <button 
          onClick={nextModel} 
          className="btn-outline"
          style={{ 
            position: 'absolute', 
            right: isMobile ? '8px' : '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 10, 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            padding: 0,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <ChevronRight size={18} />
        </button>

        {hasBeenVisible ? (
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              INITIALIZING 3D ENGINE...
            </div>
          }>
            <Canvas 
              dpr={isMobile ? [1, 1.2] : [1, 1.5]} 
              performance={{ min: 0.5 }} 
              camera={{ position: [0, 0, 4.5], fov: 45 }}
              frameloop={isVisible ? 'always' : 'never'}
            >
              <color attach="background" args={[theme === 'light' ? '#f9f9fb' : '#111113']} />
              <ambientLight intensity={theme === 'light' ? 1.0 : 0.6} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Stage environment={theme === 'light' ? 'studio' : 'city'} intensity={theme === 'light' ? 1.0 : 0.7} shadows={false} adjustCamera={0.9}>
                <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
                  <Model path={`${import.meta.env.BASE_URL}${models[currentModelIndex]}`} />
                </Float>
              </Stage>
              
              <OrbitControls enableZoom={true} enablePan={false} makeDefault />
            </Canvas>
          </Suspense>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.85rem', gap: '8px' }}>
            <RotateCcw size={20} style={{ opacity: 0.5 }} />
            <span>3D ENGINE STANDBY</span>
          </div>
        )}
        
        <div style={{ 
          position: 'absolute', 
          bottom: '12px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-subtle)',
          padding: '4px 12px', 
          borderRadius: '100px', 
          fontSize: '0.7rem', 
          color: 'var(--text-secondary)', 
          pointerEvents: 'none', 
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          {t('viewer_hint')}
        </div>
      </div>
    </div>
  );
}
