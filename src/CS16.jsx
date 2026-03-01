import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CS16() {
  const [started, setStarted] = useState(false);

  // play-cs.com is one of the only reliable ones that allows embedding, but they have Cloudflare in front.
  // We'll give them the option to play in a new tab if iframe is blocked by CF.
  
  return (
    <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 md:px-8 bg-black/50"
         style={{ paddingTop: '5rem' }}>

      <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 10, borderBottom: '1px solid #ff9900'
      }}>
          <h1 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-white mb-2">
              COUNTER-STRIKE 1.6
          </h1>
      </div>

      {!started ? (
          <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid #ff9900', textAlign: 'center', background: 'rgba(0,0,0,0.9)', marginTop: '2rem' }}
          >
              <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#ff9900' }}>CS 1.6 BROWSER EDITION</h2>
              <p style={{ color: '#bbb', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                  Efsanevi Counter-Strike 1.6 oyununu indirmeden doğrudan tarayıcında oyna. (Play-CS sunucuları üzerinden çalışır).
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                      onClick={() => setStarted(true)}
                      className="btn btn-primary"
                      style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: '#ff9900', border: 'none', color: '#000', fontWeight: 'bold' }}
                  >
                      PLAY IN BROWSER
                  </button>

                  <button
                      onClick={() => window.open('https://play-cs.com/en/', '_blank')}
                      className="btn btn-secondary"
                      style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: '#2b65ec', border: 'none', color: '#fff', fontWeight: 'bold' }}
                  >
                      PLAY IN NEW TAB
                  </button>
              </div>
          </motion.div>
      ) : (
          <div style={{ width: '100%', height: 'calc(100vh - 150px)', marginTop: '20px', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ff9900' }}>
            <iframe
                src="https://play-cs.com/en/"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Counter Strike 1.6"
                allow="keyboard-map *; pointer-lock *"
                allowFullScreen
                tabIndex="0"
                onLoad={(e) => e.target.focus()}
                onPointerEnter={(e) => e.target.focus()}
            />
          </div>
      )}
    </div>
  );
}
