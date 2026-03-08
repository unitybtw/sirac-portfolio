import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterTitle = ({ title1, title2 }) => {
    const [text, setText] = useState('');
    const [phase, setPhase] = useState(0); // 0: typing, 1: erasing, 2: final
    const codeString = "public class GameDev {\n  string title = \"ARCHITECT\";\n}";

    useEffect(() => {
        if (phase === 0) {
            if (text.length < codeString.length) {
                const timeout = setTimeout(() => {
                    setText(codeString.slice(0, text.length + 1));
                }, Math.random() * 40 + 20);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => setPhase(1), 1000);
                return () => clearTimeout(timeout);
            }
        } else if (phase === 1) {
            if (text.length > 0) {
                const timeout = setTimeout(() => {
                    setText(text.slice(0, -1));
                }, 15);
                return () => clearTimeout(timeout);
            } else {
                setPhase(2);
            }
        }
    }, [text, phase]);

    if (phase === 2) {
        return (
            <motion.h1
                className="hero-title"
                initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
            >
                <span className="text-gradient">{title1}</span><br />
                <span className="text-accent-gradient">{title2}</span>
            </motion.h1>
        );
    }

    return (
        <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontFamily: 'monospace', fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', textAlign: 'left', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap', lineHeight: '1.4', margin: 0 }}>
                {text}<span className="cursor-blink">|</span>
            </h1>
        </div>
    );
};

export default TypewriterTitle;
