import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { playClick, playHover } from './soundEffects';

const DB_URL = 'https://sirac-portfolio-default-rtdb.europe-west1.firebasedatabase.app';

const NEON_NAMES = [
  'Ghost', 'Phantom', 'Shadow', 'Void', 'Flux', 'Hex', 'Neon', 'Cyber',
  'Pixel', 'Vector', 'Matrix', 'Null', 'Byte', 'Core', 'Sync', 'Grid',
  'Pulse', 'Drift', 'Nova', 'Rogue'
];

const NEON_COLORS = [
  '#00f0ff', '#ff00ff', '#00ff88', '#ffcc00', '#ff4444', '#aa44ff', '#ff8800', '#44ffdd'
];

const EMOJIS = ['🔥', '👾', '🚀', '⚡', '🎮', '🤖', '💜', '✨', '👏', '💯', '😈', '🧠'];

function getOrCreate(key, generator) {
  let val = sessionStorage.getItem(key);
  if (!val) { val = generator(); sessionStorage.setItem(key, val); }
  return val;
}

function generateVisitorId() { return Math.random().toString(36).substr(2, 9); }
function generateNeonName() {
  const n = NEON_NAMES[Math.floor(Math.random() * NEON_NAMES.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${n}-${num}`;
}
function generateColor() { return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]; }

function getCurrentPage() {
  const hash = window.location.hash;
  const scroll = window.scrollY;
  if (hash.includes('contact')) return 'Contact';
  if (hash.includes('skills')) return 'Skills';
  if (hash.includes('projects')) return 'Projects';
  if (scroll > 1200) return 'Exploring';
  return 'Hero';
}

export default function PresencePanel() {
  const [myId] = useState(() => getOrCreate('visitor_id', generateVisitorId));
  const [myName] = useState(() => getOrCreate('visitor_name', generateNeonName));
  const [myColor] = useState(() => getOrCreate('visitor_color', generateColor));

  const [visitors, setVisitors] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const timerRef = useRef(null);
  const seenReactions = useRef(new Set());

  const [useMock, setUseMock] = useState(false);
  const [mockVisitors, setMockVisitors] = useState({});

  const updateMockVisitors = useCallback(() => {
    setUseMock(true);
    setMockVisitors(prev => {
      const now = Date.now();
      const pages = ['Hero', 'About', 'Timeline', 'Projects', 'Skills', 'Contact'];
      
      // If we don't have mock visitors yet, initialize 2-4 mock users
      if (Object.keys(prev).length === 0) {
        const count = Math.floor(Math.random() * 3) + 2; 
        const list = {};
        for (let i = 0; i < count; i++) {
          const id = `mock_${Math.random().toString(36).substr(2, 9)}`;
          list[id] = {
            name: generateNeonName(),
            color: generateColor(),
            page: pages[Math.floor(Math.random() * pages.length)],
            lastSeen: now
          };
        }
        return list;
      }

      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        // 20% chance to change page
        if (Math.random() < 0.2) {
          updated[id] = {
            ...updated[id],
            page: pages[Math.floor(Math.random() * pages.length)],
            lastSeen: now
          };
        }
      });

      // 5% chance to add a new visitor (max 5)
      if (Math.random() < 0.05 && Object.keys(updated).length < 5) {
        const newId = `mock_${Math.random().toString(36).substr(2, 9)}`;
        updated[newId] = {
          name: generateNeonName(),
          color: generateColor(),
          page: pages[Math.floor(Math.random() * pages.length)],
          lastSeen: now
        };
      }

      // 5% chance to remove a visitor (min 1)
      if (Math.random() < 0.05 && Object.keys(updated).length > 1) {
        const keys = Object.keys(updated);
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        delete updated[randKey];
      }

      return updated;
    });
  }, []);

  const registerPresence = useCallback(async () => {
    try {
      await fetch(`${DB_URL}/visitors/${myId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: myName,
          color: myColor,
          lastSeen: Date.now(),
          page: getCurrentPage(),
        }),
      });
    } catch (_e) { void _e; }
  }, [myId, myName, myColor]);

  const removePresence = useCallback(() => {
    try {
      navigator.sendBeacon(`${DB_URL}/visitors/${myId}.json`, '');
    } catch (_e) { void _e; }
    fetch(`${DB_URL}/visitors/${myId}.json`, { method: 'DELETE' }).catch(() => {});
  }, [myId]);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch(`${DB_URL}/visitors.json`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      
      if (!data || data.error) { 
        updateMockVisitors();
        return; 
      }
      
      const cutoff = Date.now() - 75000;
      const activeVisitors = {};
      Object.entries(data).forEach(([id, v]) => {
        if (v && v.lastSeen && v.lastSeen >= cutoff) {
          activeVisitors[id] = v;
        }
      });
      setVisitors(activeVisitors);
      setUseMock(false);
    } catch { 
      updateMockVisitors();
    }
  }, [updateMockVisitors]);

  const fetchReactions = useCallback(async () => {
    try {
      const res = await fetch(`${DB_URL}/reactions.json`);
      const data = await res.json();
      if (!data) return;
      const now = Date.now();
      const fresh = Object.entries(data)
        .filter(([id, r]) => now - r.timestamp < 4000 && !seenReactions.current.has(id))
        .map(([id, r]) => ({ id, ...r }));

      if (fresh.length > 0) {
        fresh.forEach(r => seenReactions.current.add(r.id));
        setFloatingEmojis(prev => [...prev, ...fresh]);
        // Remove from floating after 3.5s
        setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(e => !fresh.find(f => f.id === e.id)));
        }, 3500);
      }
    } catch (_e) { void _e; }
  }, []);

  const sendEmoji = useCallback(async (emoji) => {
    const id = `r_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const reaction = {
      emoji,
      from: myName,
      color: myColor,
      x: Math.random() * 60 + 20, // 20–80% of screen width
      timestamp: Date.now(),
    };
    seenReactions.current.add(id);
    setFloatingEmojis(prev => [...prev, { id, ...reaction }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 3500);

    try {
      await fetch(`${DB_URL}/reactions/${id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reaction),
      });
      setTimeout(() => fetch(`${DB_URL}/reactions/${id}.json`, { method: 'DELETE' }).catch(() => {}), 4500);
    } catch (_e) { void _e; }
  }, [myName, myColor]);

  useEffect(() => {
    registerPresence();
    
    // Defer fetching to avoid synchronous setState inside mount effect
    const deferTimer = setTimeout(() => {
      fetchVisitors();
      fetchReactions();
    }, 100);

    timerRef.current = setInterval(() => {
      registerPresence();
      fetchVisitors();
      fetchReactions();
      if (useMock) updateMockVisitors();
    }, 15000); // Reduced polling frequency to save battery and network

    window.addEventListener('beforeunload', removePresence);
    return () => {
      clearTimeout(deferTimer);
      clearInterval(timerRef.current);
      window.removeEventListener('beforeunload', removePresence);
      removePresence();
    };
  }, [registerPresence, fetchVisitors, fetchReactions, removePresence, useMock, updateMockVisitors]);

  const onlineVisitors = Object.entries(useMock ? mockVisitors : visitors).filter(([id]) => id !== myId);
  const totalOnline = onlineVisitors.length + 1;

  return (
    <>
      {/* Floating Emoji Reactions */}
      <AnimatePresence>
        {floatingEmojis.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -320, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '120px',
              left: `${r.x}%`,
              fontSize: '2.2rem',
              zIndex: 99998,
              pointerEvents: 'none',
              filter: `drop-shadow(0 0 12px ${r.color || '#00f0ff'})`,
            }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Panel */}
      <div style={{ position: 'fixed', bottom: '100px', right: '24px', zIndex: 99999, fontFamily: 'monospace' }}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(8, 8, 18, 0.97)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(0, 240, 255, 0.18)',
                borderRadius: '18px',
                padding: '1rem',
                marginBottom: '10px',
                width: '230px',
                boxShadow: '0 0 40px rgba(0, 240, 255, 0.08), 0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {/* My identity */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '0.75rem', paddingBottom: '0.6rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}>
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ width: '7px', height: '7px', borderRadius: '50%', background: myColor, boxShadow: `0 0 8px ${myColor}`, flexShrink: 0 }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>You</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: myColor, fontWeight: 'bold' }}>{myName}</p>
                </div>
              </div>

              {/* Other visitors */}
              <div style={{ marginBottom: '0.75rem', minHeight: '40px' }}>
                {onlineVisitors.length === 0 ? (
                  <p style={{ color: '#3a3a4a', fontSize: '0.72rem', fontStyle: 'italic', margin: 0, textAlign: 'center', padding: '0.5rem 0' }}>
                    You are the only visitor right now...
                  </p>
                ) : (
                  <div style={{ maxHeight: '110px', overflowY: 'auto' }}>
                    {onlineVisitors.map(([id, v]) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.color, boxShadow: `0 0 6px ${v.color}`, flexShrink: 0 }} />
                        <span style={{ color: v.color, fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>{v.name}</span>
                        <span style={{ color: '#444', fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {v.page}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emoji Reactions */}
              <div>
                <p style={{ color: '#444', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                  SEND REACTION
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {EMOJIS.map(emoji => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.35, y: -2 }}
                      whileTap={{ scale: 0.85 }}
                      onMouseEnter={playHover}
                      onClick={() => { playClick(); sendEmoji(emoji); }}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        padding: '5px',
                        fontSize: '1.05rem',
                        cursor: 'pointer',
                        lineHeight: 1,
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button */}
        <motion.button
          onClick={() => { playClick(); setIsExpanded(p => !p); }}
          onMouseEnter={playHover}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(8, 8, 18, 0.97)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isExpanded ? 'rgba(0,240,255,0.4)' : 'rgba(0,240,255,0.15)'}`,
            borderRadius: '12px',
            padding: '8px 14px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            color: 'white',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', flexShrink: 0 }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#00f0ff', fontWeight: 'bold' }}>
            {totalOnline} online
          </span>
          <Users size={13} color="#00f0ff" />
        </motion.button>
      </div>
    </>
  );
}
