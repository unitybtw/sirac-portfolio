import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, ShieldAlert, Ghost, Search, Terminal, BookOpen, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// This is a shared endpoint for the Ghost Chat. 
// Note: In a production app, use Firebase/Supabase for real-time.
const CHAT_BIN_URL = 'https://api.npoint.io/18462ec747790767d5f0';

const GhostChat = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('ghost_nick') || `Ghost_${Math.floor(Math.random() * 9000) + 1000}`);
    const [isStealth, setIsStealth] = useState(false);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const chatInterval = useRef(null);

    // Initial load and sync
    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            chatInterval.current = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        } else {
            clearInterval(chatInterval.current);
        }
        return () => clearInterval(chatInterval.current);
    }, [isOpen]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStealth]);

    // Listen for Stealth Key (F2 or Panic Key)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F2') {
                setIsStealth(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen && !isStealth) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isStealth, onClose]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(CHAT_BIN_URL);
            const data = await res.json();
            if (data && data.messages) {
                // Filter messages older than 2 hours
                const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
                const activeMessages = data.messages.filter(m => m.timestamp > twoHoursAgo);
                setMessages(activeMessages);
            }
        } catch (e) {
            console.error("Sync failed", e);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        setLoading(true);

        const newMessage = {
            id: Date.now(),
            user: username,
            text: input.trim(),
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, newMessage].slice(-50); // Keep last 50

        try {
            await fetch(CHAT_BIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            });
            setInput('');
            setMessages(updatedMessages);
        } catch (e) {
            console.error("Send failed", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        position: 'fixed', bottom: '20px', right: '20px',
                        width: '350px', height: '500px',
                        zIndex: 1000000, display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', borderRadius: '16px',
                        boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
                        border: '1px solid var(--accent-cyan)',
                        background: '#050508'
                    }}
                >
                    {isStealth ? (
                        /* STEALTH VIEW (Fake Study Notes) */
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', color: '#1a1a1b', padding: '1.5rem', fontFamily: 'serif' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Lecture Notes: Data Structures</span>
                                <Clock size={16} />
                            </div>
                            <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                <p><strong>1. Binary Search Trees (BST)</strong></p>
                                <p>A binary search tree is a rooted binary tree data structure with the key of each internal node being greater than all the keys in the node's left subtree and less than those in its right subtree.</p>
                                <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '0.7rem' }}>
                                    {`struct Node {
  int data;
  struct Node *left, *right;
};`}
                                </pre>
                                <p>Analysis of BST operations... [Click F2 to resume]</p>
                            </div>
                            <button onClick={onClose} style={{ marginTop: 'auto', background: '#eee', border: '1px solid #ccc', padding: '5px' }}>Close</button>
                        </div>
                    ) : (
                        /* REAL CHAT VIEW */
                        <>
                            {/* Header */}
                            <div style={{
                                padding: '1rem', background: 'rgba(0, 240, 255, 0.1)',
                                borderBottom: '1px solid var(--accent-cyan)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Ghost size={18} color="var(--accent-cyan)" />
                                        <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#0f0', borderRadius: '50%', border: '2px solid #000' }}></div>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', letterSpacing: '1px' }}>GHOST CHAT</h3>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>[ F2: Stealth Mode ]</span>
                                    </div>
                                </div>
                                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Info Banner */}
                            <div style={{ background: 'rgba(255,0,0,0.1)', padding: '5px 10px', fontSize: '0.7rem', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <ShieldAlert size={12} /> Messages self-destruct after 2 hours.
                            </div>

                            {/* Messages Area */}
                            <div
                                ref={scrollRef}
                                style={{
                                    flex: 1, overflowY: 'auto', padding: '1rem',
                                    display: 'flex', flexDirection: 'column', gap: '0.8rem',
                                    fontFamily: 'monospace', fontSize: '0.85rem'
                                }}
                            >
                                {messages.length === 0 ? (
                                    <div style={{ textAlign: 'center', marginTop: '20%', opacity: 0.3, color: 'var(--accent-cyan)' }}>
                                        <Terminal size={40} style={{ margin: '0 auto 10px' }} />
                                        <p>TERMINAL IDLE...<br />WAITING FOR DATA...</p>
                                    </div>
                                ) : (
                                    messages.map((m) => (
                                        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', borderLeft: '2px solid rgba(0, 240, 255, 0.2)', paddingLeft: '8px' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{m.user}</span>
                                                <span style={{ opacity: 0.5 }}>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div style={{ color: '#e0e0e0', wordBreak: 'break-word', marginTop: '2px' }}>{m.text}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type message..."
                                        style={{
                                            flex: 1, background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px', color: '#fff', padding: '10px',
                                            fontSize: '0.85rem', outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={loading || !input.trim()}
                                        style={{
                                            background: 'var(--accent-cyan)', color: '#000',
                                            border: 'none', borderRadius: '8px', padding: '0 15px',
                                            cursor: 'pointer', opacity: (loading || !input.trim()) ? 0.5 : 1
                                        }}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ID: </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            localStorage.setItem('ghost_nick', e.target.value);
                                        }}
                                        style={{
                                            background: 'transparent', border: 'none',
                                            color: 'var(--accent-cyan)', fontSize: '0.65rem',
                                            textAlign: 'right', outline: 'none', width: '100px'
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GhostChat;
