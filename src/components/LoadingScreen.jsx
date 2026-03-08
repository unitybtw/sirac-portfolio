import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="loading-content">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{ marginBottom: '2rem', color: 'var(--accent-cyan)' }}
                >
                    <Box size={50} />
                </motion.div>

                <div className="loading-bar-container">
                    <motion.div
                        className="loading-bar-fill"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                <div className="loading-text" style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                    SYSTEM INITIALIZING... {Math.min(progress, 100)}%
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
