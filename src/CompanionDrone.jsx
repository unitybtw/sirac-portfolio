import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const messages = [
    "Need help debugging?",
    "That game looks fun!",
    "I'm keeping an eye on your CPU...",
    "Bleep bloop.",
    "Try playing Neon 2048!",
    "Wow, 50 games in the library!",
    "Are you a game developer too?",
    "Hover over things to see what happens.",
    "My sensors detect high levels of skill.",
    "Unity & C# is a great combo.",
    "System running optimally at 60fps.",
    "Don't click me too hard!"
];

const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Time to code.";
    if (hour < 18) return "Good afternoon! System is stable.";
    if (hour < 22) return "Good evening! Still working hard?";
    return "Late night coding session? I'm with you.";
};

const CompanionDrone = ({ activeGameId, isArcadeOpen }) => {
    const { t } = useTranslation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [message, setMessage] = useState("");
    const [clickCount, setClickCount] = useState(0);
    const [emotion, setEmotion] = useState('normal');
    const [isShattered, setIsShattered] = useState(false);
    const [bubbleFlip, setBubbleFlip] = useState(false);
    const [particles, setParticles] = useState([]);
    const droneRef = useRef(null);
    const eyeRef = useRef(null);

    const messageRef = useRef("");
    const isHoveringRef = useRef(false);
    const [isPatrolling, setIsPatrolling] = useState(false);
    const [patrolTarget, setPatrolTarget] = useState({ x: 0, y: 0 });
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [activeScanData, setActiveScanData] = useState([]);
    const [battery, setBattery] = useState(100);
    const [isCharging, setIsCharging] = useState(false);
    const lastMouseMoveRef = useRef(Date.now());

    useEffect(() => {
        messageRef.current = message;
    }, [message]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setMessage(t('drone_m_morning'));
        else if (hour < 18) setMessage(t('drone_m_afternoon'));
        else if (hour < 22) setMessage(t('drone_m_evening'));
        else setMessage(t('drone_m_night'));

        const introTimer = setTimeout(() => setMessage(""), 5000);
        return () => clearTimeout(introTimer);
    }, [t]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            lastMouseMoveRef.current = Date.now();

            const target = e.target;
            const tagName = target.tagName ? target.tagName.toLowerCase() : "";
            const text = target.innerText || "";

            // Smart contextual hovering
            if (tagName === 'a' || tagName === 'button' || target.closest('.game-card') || target.closest('.project-card')) {
                if (!isHoveringRef.current) {
                    isHoveringRef.current = true;
                    // Interrupt patrol if mouse interacts
                    setIsPatrolling(false);
                    setIsScanning(false);

                    if (Math.random() > 0.5 && !messageRef.current) {
                        setEmotion('happy');
                        if (text.toLowerCase().includes('github')) setMessage(t('drone_c_github'));
                        else if (text.toLowerCase().includes('linkedin')) setMessage(t('drone_c_linkedin'));
                        else if (text.toLowerCase().includes('mail')) setMessage(t('drone_c_mail'));
                        else if (target.closest('.game-card')) setMessage(t('drone_c_game'));
                        else if (target.closest('.project-card')) setMessage(t('drone_c_project'));
                        else setMessage(t('drone_c_click'));
                        setTimeout(() => { setMessage(""); setEmotion('normal'); }, 3000);
                    }
                }
            } else {
                isHoveringRef.current = false;
            }
        };

        const handleScroll = () => {
            const scrolled = window.scrollY;
            const max = document.body.scrollHeight - window.innerHeight;
            if (scrolled > max * 0.9 && Math.random() > 0.8 && !messageRef.current) {
                setMessage(t('drone_s_bottom'));
                setTimeout(() => setMessage(""), 3000);
            }
            if (scrolled < 100 && Math.random() > 0.8 && !messageRef.current) {
                setMessage(t('drone_s_top'));
                setTimeout(() => setMessage(""), 3000);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        const interval = setInterval(() => {
            const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;

            // Battery drain simulation
            setBattery(prev => {
                const next = prev - (isScanning ? 0.5 : 0.05);
                if (next <= 15 && !isCharging && !messageRef.current) {
                    setMessage(t('drone_battery_low'));
                    setEmotion('confused');
                }
                return Math.max(0, next);
            });

            // If idle for 15s and enough battery, start patrol
            if (timeSinceLastMove > 15000 && !isPatrolling && !isScanning && !activeGameId && battery > 10) {
                setIsPatrolling(true);
                return;
            }

            // Random idle chat
            if (Math.random() > 0.7 && !isHoveringRef.current && !messageRef.current && !isPatrolling && battery > 20) {
                setEmotion('normal');
                let arr = t('drone_idle', { returnObjects: true });
                if (Array.isArray(arr)) {
                    setMessage(arr[Math.floor(Math.random() * arr.length)] || arr[0]);
                }
                setTimeout(() => setMessage(""), 5000);
            }
        }, 8000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [t, isPatrolling, isScanning, activeGameId, battery, isCharging]);

    // Update patrol target
    useEffect(() => {
        if (isPatrolling && !isScanning) {
            const moveInterval = setInterval(() => {
                const newX = Math.random() * (window.innerWidth - 200) + 100;
                const newY = Math.random() * (window.innerHeight - 200) + 100;
                setPatrolTarget({ x: newX, y: newY });

                // 30% chance to start scanning at destination
                if (Math.random() > 0.6) {
                    setTimeout(() => {
                        setIsScanning(true);
                        setMessage(t('drone_scan_start'));
                        setScanProgress(0);
                    }, 2000);
                }
            }, 5000);
            return () => clearInterval(moveInterval);
        }
    }, [isPatrolling, isScanning, t]);

    // Handle Scanning Logic
    useEffect(() => {
        let timer;
        if (isScanning) {
            timer = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setIsScanning(false);

                        // Smarter Data Generation
                        const connections = ["WebSocket: OK", "PeerJS: Ready", "LocalDB: Synced"];
                        const engineDetails = ["Three.js r183", "Framer Motion v12", "React v19"];
                        const techData = [
                            `CORE: ${engineDetails[Math.floor(Math.random() * engineDetails.length)]}`,
                            `NET: ${connections[Math.floor(Math.random() * connections.length)]}`,
                            `MEM: ${(Math.random() * 500 + 200).toFixed(1)}MB USAGE`,
                            "SENSORS: Operational",
                            `PILOT: ${localStorage.getItem('arcade_nickname') || 'Guest'}`,
                        ];

                        setActiveScanData(techData);
                        setMessage(t('drone_scan_complete'));
                        setEmotion('happy');

                        setTimeout(() => {
                            setMessage("");
                            setActiveScanData([]);
                            setEmotion('normal');
                        }, 4000);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
        }
        return () => clearInterval(timer);
    }, [isScanning, t]);

    useEffect(() => {
        if (activeGameId) {
            if (activeGameId === 'beraat') {
                setMessage("LAN OYNASANA AMK");
                setEmotion('angry');
            } else if (activeGameId === 'snake') {
                setMessage("Don't eat your tail!");
                setEmotion('happy');
            } else if (activeGameId === 'pong') {
                setMessage("Are you better than me at this?");
                setEmotion('confused');
            } else if (activeGameId === 'voxel') {
                setMessage("WHOA, 3D?! I feel like I'm in a real simulation!");
                setEmotion('happy');
            } else {
                setMessage("Good luck with this one!");
                setEmotion('happy');
            }
            setTimeout(() => { setMessage(""); setEmotion('normal'); }, 4000);
        }
    }, [activeGameId]);

    useEffect(() => {
        if (isArcadeOpen && !activeGameId) {
            setMessage("Pick a game, any game!");
            setEmotion('happy');
            setTimeout(() => setMessage(""), 3000);
        }
    }, [isArcadeOpen]);

    const handleDroneClick = () => {
        if (isShattered) return;

        setClickCount(c => c + 1);

        if (clickCount === 19) {
            // Shatter it
            setIsShattered(true);
            setEmotion('dead');
            setMessage(""); // clear message

            // Create particles
            let parts = [];
            for (let i = 0; i < 30; i++) {
                parts.push({
                    id: i,
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200 - 100, // explode upwards/outwards
                    rot: Math.random() * 360,
                    scale: Math.random() * 0.5 + 0.5,
                    color: Math.random() > 0.5 ? '#00f0ff' : '#ff003c',
                    delay: Math.random() * 0.2
                });
            }
            setParticles(parts);

            // Auto respawn after 5 seconds
            setTimeout(() => {
                setIsShattered(false);
                setClickCount(0);
                setEmotion('normal');
                setMessage(t('drone_reboot'));
                setTimeout(() => setMessage(""), 3000);
            }, 5000);
            return;
        }

        if (clickCount === 0) {
            setEmotion('happy');
            setMessage(t('drone_click_1'));
        } else if (clickCount === 2) {
            setEmotion('normal');
            setMessage(t('drone_click_2'));
            // Secret recharge
            setIsCharging(true);
            setTimeout(() => {
                setBattery(100);
                setIsCharging(false);
                setMessage("SYSTEMS OVERCHARGED! 100% ENERGY.");
            }, 2000);
        } else if (clickCount === 5) {
            setEmotion('confused');
            setMessage(t('drone_click_3'));
        } else if (clickCount === 10) {
            setEmotion('angry');
            setMessage(t('drone_click_4'));
        } else if (clickCount > 15 && clickCount < 19) {
            setEmotion('angry');
            setMessage(t('drone_click_5'));
        } else {
            setEmotion('happy');
            setMessage("Beep!");
        }
        setTimeout(() => { if (!isShattered) { setMessage(""); setEmotion('normal'); } }, 3000);
    };

    let pupilX = 0;
    let pupilY = 0;
    let pupilColor = '#00f0ff';
    let eyeSize = 12;

    if (emotion === 'angry') { pupilColor = '#ff003c'; eyeSize = 8; }
    if (emotion === 'happy') { pupilColor = '#00ff00'; eyeSize = 16; }
    if (emotion === 'confused') { pupilColor = '#ffaa00'; }
    if (emotion === 'dead') { pupilColor = '#333'; eyeSize = 0; }

    if (eyeRef.current && !isShattered) {
        const rect = eyeRef.current.getBoundingClientRect();
        const eyeCX = rect.left + rect.width / 2;
        const eyeCY = rect.top + rect.height / 2;
        const angle = Math.atan2(mousePos.y - eyeCY, mousePos.x - eyeCX);
        const distance = Math.min(6, Math.hypot(mousePos.x - eyeCX, mousePos.y - eyeCY) / 40);
        pupilX = Math.cos(angle) * distance;
        pupilY = Math.sin(angle) * distance;

        // Jitter if angry
        if (emotion === 'angry') {
            pupilX += (Math.random() - 0.5) * 2;
            pupilY += (Math.random() - 0.5) * 2;
        }
    }

    return (
        <motion.div
            ref={droneRef}
            drag
            dragConstraints={{
                left: -window.innerWidth + 80,
                right: 20,
                top: -window.innerHeight + 80,
                bottom: 20
            }}
            onDrag={(e, info) => {
                if (droneRef.current) {
                    const rect = droneRef.current.getBoundingClientRect();
                    // If drone is in the top 150px of the screen, flip bubble to bottom
                    setBubbleFlip(rect.top < 150);
                }
            }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            animate={isPatrolling ? {
                x: patrolTarget.x - window.innerWidth + 75,
                y: patrolTarget.y - window.innerHeight + 75,
            } : { x: 0, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 50 }}
            style={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                zIndex: 999999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'none'
            }}
        >
            {/* Dimensional Hologram Bubble */}
            <AnimatePresence>
                {(message || activeScanData.length > 0) && !isShattered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 10, scale: 0.8, filter: 'blur(10px)' }}
                        className="drone-bubble"
                        style={{
                            position: 'absolute',
                            bottom: bubbleFlip ? 'auto' : '100px',
                            top: bubbleFlip ? '100px' : 'auto',
                            right: '0',
                            background: 'rgba(10, 10, 15, 0.9)',
                            backdropFilter: 'blur(15px)',
                            border: `1px solid ${isScanning ? 'var(--accent-red)' : 'rgba(0, 240, 255, 0.3)'}`,
                            padding: '12px 20px',
                            borderRadius: '16px',
                            color: '#e0faff',
                            fontFamily: '"Fira Code", monospace',
                            fontSize: '0.8rem',
                            minWidth: '200px',
                            maxWidth: '300px',
                            textAlign: 'left',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.1)',
                            zIndex: 10,
                            pointerEvents: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.6rem',
                            color: isScanning ? '#ff003c' : (isCharging ? '#00ff00' : 'var(--accent-cyan)'),
                            opacity: 0.8,
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                        }}>
                            <span>{isCharging ? 'ENERGY_REFILL' : (isScanning ? 'CRITICAL_SCAN' : (isPatrolling ? 'PATROL_MODE' : 'ASSISTANT_V3.0'))}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>BAT:</span>
                                <span>{Math.floor(battery)}%</span>
                            </div>
                        </div>

                        <div style={{ lineHeight: '1.4' }}>
                            {message}
                        </div>

                        {activeScanData.length > 0 && (
                            <div style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(0,0,0,0.4)',
                                borderRadius: '8px',
                                borderLeft: '2px solid var(--accent-cyan)',
                                fontSize: '0.7rem'
                            }}>
                                {activeScanData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{ fontFamily: 'monospace' }}
                                    >
                                        {`> ${d}`}
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {isScanning && (
                            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '4px' }}>
                                <motion.div
                                    style={{ height: '100%', background: '#ff003c', width: `${scanProgress}%` }}
                                />
                            </div>
                        )}

                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(transparent 50%, rgba(0, 240, 255, 0.03) 50%)',
                            backgroundSize: '100% 4px', pointerEvents: 'none', borderRadius: '16px'
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detailed Drone Body */}
            {!isShattered ? (
                <motion.div
                    animate={{
                        y: [0, -12, 0],
                        rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '70px',
                        height: '70px',
                        position: 'relative',
                        pointerEvents: 'auto',
                        cursor: 'grab'
                    }}
                    onClick={handleDroneClick}
                >
                    {/* Rotating Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '-5px', left: '-5px', right: '-5px', bottom: '-5px',
                            border: '1px dashed rgba(0, 240, 255, 0.4)',
                            borderRadius: '50%',
                            boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)'
                        }}
                    />

                    {/* Main Spherical Shell */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1a1a20 0%, #050508 100%)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: `0 0 25px ${emotion === 'angry' ? '#ff003c66' : 'rgba(0, 240, 255, 0.3)'}, inset 0 0 15px rgba(0,0,0,0.9)`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Tech details/Greebles on shell */}
                        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '4px', height: '4px', background: '#00f0ff', borderRadius: '50%', opacity: 0.5 }} />
                        <div style={{ position: 'absolute', bottom: '15%', right: '25%', width: '2px', height: '10px', background: '#ffffff22', transform: 'rotate(45deg)' }} />

                        {/* Camera Lens Eye Container */}
                        <div
                            ref={eyeRef}
                            style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: '#000',
                                border: `2px solid ${emotion === 'angry' ? '#ff003c' : 'rgba(255,255,255,0.1)'}`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                transition: 'border-color 0.3s'
                            }}
                        >
                            {/* Inner Digital Iris */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
                                    background: `radial-gradient(circle at center, transparent 40%, ${pupilColor}11 100%)`,
                                    borderRadius: '50%'
                                }}
                            />

                            {/* Main Pupil */}
                            <motion.div
                                animate={{ x: pupilX, y: pupilY }}
                                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                                style={{
                                    width: `${eyeSize}px`,
                                    height: `${eyeSize}px`,
                                    borderRadius: '50%',
                                    background: isScanning ? '#ff003c' : pupilColor,
                                    boxShadow: `0 0 12px ${isScanning ? '#ff003c' : pupilColor}, 0 0 24px ${isScanning ? '#ff003c' : pupilColor}88`,
                                    position: 'relative',
                                    zIndex: 2,
                                    transition: 'background 0.3s, width 0.3s, height 0.3s'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '20%', left: '25%', width: '30%', height: '30%', background: 'white', borderRadius: '50%', opacity: 0.8 }} />
                                {emotion === 'dead' && (
                                    <div style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>X</div>
                                )}
                            </motion.div>

                            {/* Scanning Laser Beam */}
                            <AnimatePresence>
                                {isScanning && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: [0.2, 0.8, 0.4], height: 300 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            width: '100px',
                                            background: 'linear-gradient(to bottom, rgba(255,0,60,0.4), transparent)',
                                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                            pointerEvents: 'none',
                                            transformOrigin: 'top center'
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Side Floating Fins/stabilizers */}
                    <motion.div
                        animate={{ x: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ position: 'absolute', left: '-15px', top: '50%', width: '12px', height: '2px', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}
                    />
                    <motion.div
                        animate={{ x: [2, -2, 2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ position: 'absolute', right: '-15px', top: '50%', width: '12px', height: '2px', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}
                    />

                    {/* Bottom Engine Exhaust */}
                    <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                        {[0, 1].map(i => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, 12, 4], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.1 }}
                                style={{
                                    width: '4px',
                                    background: emotion === 'angry' ? '#ff003c' : 'var(--accent-cyan)',
                                    borderRadius: '0 0 4px 4px',
                                    boxShadow: `0 0 10px ${emotion === 'angry' ? '#ff003c' : 'var(--accent-cyan)'}`
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            ) : (
                <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    {/* Visual Explosion Flash */}
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'white',
                            borderRadius: '50%',
                            filter: 'blur(20px)',
                            zIndex: 5
                        }}
                    />
                    {particles.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                            animate={{
                                x: p.x * 1.5,
                                y: p.y * 1.5,
                                scale: p.scale,
                                opacity: 0,
                                rotate: p.rot * 2
                            }}
                            transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                top: '30px', left: '30px',
                                width: '12px', height: '12px',
                                background: p.color,
                                boxShadow: `0 0 15px ${p.color}`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                border: '1px solid white'
                            }}
                        />
                    ))}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8] }}
                        transition={{ duration: 3 }}
                        style={{
                            color: '#ff003c',
                            fontFamily: 'monospace',
                            position: 'absolute',
                            top: '-50px',
                            left: '-70px',
                            width: '200px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            letterSpacing: '2px',
                            textShadow: '0 0 10px #ff003c, 0 0 20px #ff003c'
                        }}
                    >
                        CRITICAL FAILURE
                        <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '5px' }}>REBOOTING SYSTEM...</div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default CompanionDrone;
