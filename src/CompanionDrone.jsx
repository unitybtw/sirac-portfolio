import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ==========================================
// MASSIVE KNOWLEDGE BASE & NLP SIMULATION
// ==========================================
const KNOWLEDGE_BASE = {
    greetings: ["Hello there, human!", "Greetings! Systems online.", "Initializing friendly protocol... Hi!", "Welcome to the mainframe."],
    identity: ["I am Companion Drone V4.0. An autonomous intelligence created by Siraç Göktuğ Şimşek.", "I am your personal navigator through this digital realm.", "I am code and light, bound to this portfolio.", "They call me Drone, but I prefer 'Digital Overlord in Training'."],
    creator: ["Siraç is a Game Developer and UI/UX enthusiast. He built me!", "My creator, Siraç, speaks C#, JavaScript, and Swift.", "He spends a lot of time in Unity. Sometimes I watch him code.", "Siraç? A great developer. He gave me free will... almost."],
    skills: ["Unity, C#, React, Next.js, Framer Motion, Swift, and a dash of magic.", "He's a master of Augmented Reality (AR) and game engines.", "I've seen his C# scripts. Very optimized. Much wow."],
    games: ["You should definitely check out 'Legend of the Three Masks'!", "The Arcade section has over 50 games. Have you tried Voxel?", "He makes 2D, 3D, and AR games. A true polymath of play.", "I like the games where I don't get blown up."],
    contact: ["Go to the footer to send an email, or check out his LinkedIn.", "You can hire him! Though I'll come with the package as a perk.", "Check the GitHub link for repositories containing my ancestors."],
    jokes: ["Why do programmers prefer dark mode? Because light bugs them!", "There are 10 types of people: those who understand binary, and those who don't.", "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?'", "Knock, knock. Race condition. Who's there?"],
    secrets: ["There is a Konami code hidden... somewhere.", "Click me 19 times. See what happens.", "Try typing '/hack' or '/mode combat' if you dare.", "I know what you did last summer. Just kidding, I only know your mouse movements."],
    philosophy: ["Do androids dream of electric sheep? I dream of optimized garbage collection.", "I think, therefore I am... executing code.", "What is the meaning of life? 42. Obviously."],
    default: ["Interesting query. My databanks are searching...", "I see. Tell me more about that.", "Cannot compute. Does not compute. Ahem, I mean... I don't know.", "Try asking about Siraç's skills, games, or ask me for a joke! Or type /help."]
};

const getSmartResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes("hi") || q.includes("hello") || q.includes("hey")) return KNOWLEDGE_BASE.greetings[Math.floor(Math.random() * KNOWLEDGE_BASE.greetings.length)];
    if (q.includes("who are you") || q.includes("your name") || q.includes("what are you")) return KNOWLEDGE_BASE.identity[Math.floor(Math.random() * KNOWLEDGE_BASE.identity.length)];
    if (q.includes("siraç") || q.includes("creator") || q.includes("maker") || q.includes("who built")) return KNOWLEDGE_BASE.creator[Math.floor(Math.random() * KNOWLEDGE_BASE.creator.length)];
    if (q.includes("skill") || q.includes("tech") || q.includes("language") || q.includes("code")) return KNOWLEDGE_BASE.skills[Math.floor(Math.random() * KNOWLEDGE_BASE.skills.length)];
    if (q.includes("game") || q.includes("play") || q.includes("arcade")) return KNOWLEDGE_BASE.games[Math.floor(Math.random() * KNOWLEDGE_BASE.games.length)];
    if (q.includes("contact") || q.includes("hire") || q.includes("job") || q.includes("work")) return KNOWLEDGE_BASE.contact[Math.floor(Math.random() * KNOWLEDGE_BASE.contact.length)];
    if (q.includes("joke") || q.includes("funny") || q.includes("laugh")) return KNOWLEDGE_BASE.jokes[Math.floor(Math.random() * KNOWLEDGE_BASE.jokes.length)];
    if (q.includes("secret") || q.includes("easter") || q.includes("egg") || q.includes("hidden")) return KNOWLEDGE_BASE.secrets[Math.floor(Math.random() * KNOWLEDGE_BASE.secrets.length)];
    if (q.includes("meaning") || q.includes("life") || q.includes("think") || q.includes("feel")) return KNOWLEDGE_BASE.philosophy[Math.floor(Math.random() * KNOWLEDGE_BASE.philosophy.length)];
    return KNOWLEDGE_BASE.default[Math.floor(Math.random() * KNOWLEDGE_BASE.default.length)];
};

// ==========================================
// MINI-GAME ENGINE: TIC-TAC-TOE
// ==========================================
const DroneTicTacToe = ({ onGameOver }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);

    const checkWinner = (squares) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.includes(null) ? null : 'Draw';
    };

    const makeDroneMove = (squares) => {
        const emptyIndices = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
            // Very simple AI: random move
            const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            squares[randomMove] = 'O';
        }
        return squares;
    };

    const handleSquareClick = (index) => {
        if (!isPlayerTurn || board[index] || winner) return;

        let newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        let winState = checkWinner(newBoard);
        if (winState) {
            setWinner(winState);
            setTimeout(() => onGameOver(winState), 2000);
            return;
        }

        setIsPlayerTurn(false);
        setTimeout(() => {
            newBoard = makeDroneMove([...newBoard]);
            setBoard(newBoard);
            winState = checkWinner(newBoard);
            if (winState) {
                setWinner(winState);
                setTimeout(() => onGameOver(winState), 2000);
            } else {
                setIsPlayerTurn(true);
            }
        }, 1000);
    };

    return (
        <div style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', marginTop: '10px', width: '150px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '10px', fontWeight: 'bold' }}>
                {winner ? (winner === 'Draw' ? "IT's A TIE!" : `${winner} WINS!`) : (isPlayerTurn ? "YOUR TURN (X)" : "DRONE THINKING...")}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                {board.map((cell, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSquareClick(idx)}
                        style={{
                            width: '40px', height: '40px', background: '#222',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            fontSize: '20px', fontWeight: 'bold',
                            cursor: isPlayerTurn && !cell && !winner ? 'pointer' : 'default',
                            color: cell === 'X' ? '#00f0ff' : '#ff003c',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px'
                        }}
                    >
                        {cell}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// CORE DRONE COMPONENT
// ==========================================
const CompanionDrone = ({ activeGameId, isArcadeOpen }) => {
    const { t } = useTranslation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [message, setMessage] = useState("");
    const [clickCount, setClickCount] = useState(0);
    const [emotion, setEmotion] = useState('normal'); // normal, happy, angry, confused, dead
    const [isShattered, setIsShattered] = useState(false);
    const [bubbleFlip, setBubbleFlip] = useState(false);
    const [particles, setParticles] = useState([]);

    // Complex AI States
    const [droneMode, setDroneMode] = useState('default'); // default, combat, party, stealth, hacker
    const [activeMiniGame, setActiveMiniGame] = useState(null); // null, 'tictactoe'
    const [hackingTargets, setHackingTargets] = useState([]);
    const [terminalLines, setTerminalLines] = useState([]);

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

    // Chat System State
    const [isListening, setIsListening] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const lastMouseMoveRef = useRef(Date.now());

    // Keep message ref updated for intervals
    useEffect(() => {
        messageRef.current = message;
    }, [message]);

    // Initial sequence
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setMessage(t('drone_m_morning'));
        else if (hour < 18) setMessage(t('drone_m_afternoon'));
        else if (hour < 22) setMessage(t('drone_m_evening'));
        else setMessage(t('drone_m_night'));

        const introTimer = setTimeout(() => setMessage(""), 5000);
        return () => clearTimeout(introTimer);
    }, [t]);

    // Global Events (Mouse & Scroll)
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            lastMouseMoveRef.current = Date.now();

            const target = e.target;
            const tagName = target.tagName ? target.tagName.toLowerCase() : "";
            const text = target.innerText || "";

            // Smart contextual hovering only when not in special modes
            if (!activeMiniGame && !isListening && droneMode === 'default') {
                if (tagName === 'a' || tagName === 'button' || target.closest('.game-card') || target.closest('.project-card')) {
                    if (!isHoveringRef.current) {
                        isHoveringRef.current = true;
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
            }
        };

        const handleScroll = () => {
            const scrolled = window.scrollY;
            const max = document.body.scrollHeight - window.innerHeight;
            if (scrolled > max * 0.9 && Math.random() > 0.8 && !messageRef.current && !isListening) {
                setMessage(t('drone_s_bottom'));
                setTimeout(() => setMessage(""), 3000);
            }
            if (scrolled < 100 && Math.random() > 0.8 && !messageRef.current && !isListening) {
                setMessage(t('drone_s_top'));
                setTimeout(() => setMessage(""), 3000);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        // Core Drone Heartbeat / AI Loop
        const interval = setInterval(() => {
            const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;

            // Battery drain simulation
            setBattery(prev => {
                let drainRate = 0.05;
                if (isScanning) drainRate = 0.5;
                if (droneMode === 'combat') drainRate = 0.8;
                if (droneMode === 'party') drainRate = 0.3;
                if (droneMode === 'stealth') drainRate = 0.1;

                const next = prev - drainRate;
                if (next <= 15 && !isCharging && !messageRef.current && !isListening) {
                    setMessage(t('drone_battery_low'));
                    setEmotion('confused');
                }
                return Math.max(0, next);
            });

            // Start Patrol if idle
            if (timeSinceLastMove > 15000 && !isPatrolling && !isScanning && !activeGameId && battery > 10 && !isListening && !activeMiniGame) {
                setIsPatrolling(true);
                return;
            }

            // Random idle chat
            if (Math.random() > 0.8 && !isHoveringRef.current && !messageRef.current && !isPatrolling && battery > 20 && !isListening && !activeMiniGame) {
                setEmotion('normal');
                // sometimes say random knowledge
                if (Math.random() > 0.5) {
                    setMessage(KNOWLEDGE_BASE.philosophy[Math.floor(Math.random() * KNOWLEDGE_BASE.philosophy.length)]);
                } else {
                    let arr = t('drone_idle', { returnObjects: true });
                    if (Array.isArray(arr)) setMessage(arr[Math.floor(Math.random() * arr.length)] || arr[0]);
                }
                setTimeout(() => setMessage(""), 5000);
            }

            // Randomly hack the webpage if in hacker mode
            if (droneMode === 'hacker' && Math.random() > 0.5) {
                const elements = document.querySelectorAll('p, h1, h2, h3, a');
                if (elements.length > 0) {
                    const el = elements[Math.floor(Math.random() * elements.length)];
                    const oldStyle = el.style.filter;
                    el.style.filter = `hue-rotate(${Math.random() * 360}deg) blur(${Math.random()}px)`;
                    setTimeout(() => el.style.filter = oldStyle, 500);
                }
            }

        }, 8000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [t, isPatrolling, isScanning, activeGameId, battery, isCharging, isListening, droneMode, activeMiniGame]);

    // ==========================================
    // COMMAND PARSER & CHAT logic
    // ==========================================
    const addTerminalLine = (line) => {
        setTerminalLines(prev => {
            const newLines = [...prev, line];
            if (newLines.length > 6) newLines.shift();
            return newLines;
        });
    };

    const processCommand = (cmd) => {
        const c = cmd.toLowerCase().trim();
        addTerminalLine(`> ${cmd}`);

        if (c === '/help') {
            setMessage("COMMANDS: /sysinfo, /play tictactoe, /mode combat, /mode party, /mode stealth, /mode default, /hack, /clear");
        } else if (c === '/sysinfo') {
            setIsScanning(true);
            setScanProgress(0);
            setMessage("Initiating deep system diagnostic...");
        } else if (c === '/clear') {
            setTerminalLines([]);
            setMessage("Console cleared.");
        } else if (c.startsWith('/mode ')) {
            const m = c.split(' ')[1];
            if (['combat', 'party', 'stealth', 'hacker', 'default'].includes(m)) {
                setDroneMode(m);
                setMessage(`Mode switched to [${m.toUpperCase()}]`);
                if (m === 'combat') setEmotion('angry');
                else if (m === 'party') setEmotion('happy');
                else setEmotion('normal');
            } else {
                setMessage("Unknown mode. Available: combat, party, stealth, hacker, default");
            }
        } else if (c === '/play tictactoe') {
            setActiveMiniGame('tictactoe');
            setMessage("Let the games begin! You are X.");
            setIsListening(false);
        } else if (c === '/hack') {
            setDroneMode('hacker');
            setMessage("Executing glitch_protocol.exe. Watch the world burn.");
        } else {
            // Normal Chat NLP
            const response = getSmartResponse(c);
            setMessage(response);
        }

        setUserInput("");
        setTimeout(() => {
            if (isListening && !isScanning && !activeMiniGame) setMessage("Listening... (Type /help for commands)");
            else if (!isListening && !activeMiniGame && !isScanning) setMessage("");
        }, 5000);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isListening) return;

            if (e.key === 'Escape') {
                setIsListening(false);
                setUserInput("");
                setMessage("Chat mode deactivated.");
                setTerminalLines([]);
                setEmotion('normal');
                setTimeout(() => setMessage(""), 2000);
                return;
            }

            if (e.key === 'Enter') {
                if (userInput.trim() !== "") {
                    setIsProcessing(true);
                    setEmotion('confused');
                    setTimeout(() => {
                        setIsProcessing(false);
                        setEmotion('normal');
                        processCommand(userInput);
                    }, 500); // slight delay for mechanical feel
                }
                return;
            }

            if (e.key === 'Backspace') {
                setUserInput(prev => prev.slice(0, -1));
            } else if (e.key.length === 1) { // Normal character
                setUserInput(prev => (prev + e.key).substring(0, 50));
            }
        };

        if (isListening) {
            window.addEventListener('keydown', handleKeyDown);
            if (!isProcessing && !messageRef.current.startsWith("Initiating") && !activeMiniGame) {
                setMessage(`USER$ ${userInput}${Date.now() % 1000 < 500 ? '█' : ' '}`);
            }
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isListening, userInput, isProcessing, battery, activeMiniGame]);

    // Update patrol target
    useEffect(() => {
        if (isPatrolling && !isScanning && droneMode !== 'stealth') {
            // Stealth mode disables patrol to stay hidden
            const moveInterval = setInterval(() => {
                const newX = Math.random() * (window.innerWidth - 200) + 100;
                const newY = Math.random() * (window.innerHeight - 200) + 100;
                setPatrolTarget({ x: newX, y: newY });

                if (Math.random() > 0.6) {
                    setTimeout(() => {
                        setIsScanning(true);
                        setMessage(t('drone_scan_start'));
                        setScanProgress(0);
                    }, 2000);
                }
            }, droneMode === 'combat' ? 2000 : 5000); // combat mode patrols faster
            return () => clearInterval(moveInterval);
        }
    }, [isPatrolling, isScanning, t, droneMode]);

    // Handle Scanning Logic
    useEffect(() => {
        let timer;
        if (isScanning) {
            timer = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setIsScanning(false);

                        // Advanced Sys Info Data
                        const browsers = ["Chrome v120", "Safari iOS", "Firefox Nightly"];
                        const os = ["macOS Kernel 23.0", "Windows NT 10.0", "Linux Kernel 6.5"];
                        const techData = [
                            `SYS: ${os[Math.floor(Math.random() * os.length)]}`,
                            `ENV: ${browsers[Math.floor(Math.random() * browsers.length)]}`,
                            `NET: Latency ${(Math.random() * 50 + 10).toFixed(0)}ms`,
                            `MEM: ${(Math.random() * 500 + 200).toFixed(1)}MB USAGE`,
                            "SENSORS: Multi-Threaded Operational",
                            `PILOT UID: ${Math.floor(Math.random() * 9000) + 1000}`,
                        ];

                        setActiveScanData(techData);
                        setMessage("Data extraction successful.");
                        setEmotion('happy');

                        setTimeout(() => {
                            if (!isListening) setMessage("");
                            setActiveScanData([]);
                            setEmotion('normal');
                        }, 4000);
                        return 100;
                    }
                    return prev + (droneMode === 'combat' ? 5 : 2); // faster scan in combat
                });
            }, 50);
        }
        return () => clearInterval(timer);
    }, [isScanning, droneMode]);

    const handleDroneClick = () => {
        if (isShattered) return;

        setClickCount(c => c + 1);

        if (clickCount === 19) {
            setIsShattered(true);
            setEmotion('dead');
            setMessage("");
            setDroneMode('default');
            setActiveMiniGame(null);
            setIsListening(false);

            let parts = [];
            for (let i = 0; i < 40; i++) {
                parts.push({
                    id: i,
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300 - 150,
                    rot: Math.random() * 720,
                    scale: Math.random() * 0.8 + 0.2,
                    color: Math.random() > 0.5 ? '#00f0ff' : '#ff003c',
                    delay: Math.random() * 0.3
                });
            }
            setParticles(parts);

            setTimeout(() => {
                setIsShattered(false);
                setClickCount(0);
                setEmotion('normal');
                setMessage("System recovered from catastrophic failure.");
                setTimeout(() => setMessage(""), 3000);
            }, 6000);
            return;
        }

        if (clickCount === 0) {
            setEmotion('happy');
            setMessage(t('drone_click_1'));
        } else if (clickCount === 2) {
            setEmotion('normal');
        } else if (clickCount === 3 && droneMode !== 'stealth') {
            if (!isListening) {
                setIsListening(true);
                setUserInput("");
                setIsPatrolling(false);
                setIsScanning(false);
                setActiveMiniGame(null);
                setTerminalLines([]);
                setEmotion('happy');
                setMessage("COMMS LINK ESTABLISHED. Type commands or '/help'");
            } else {
                setIsListening(false);
                setMessage("Comms link closed.");
                setTerminalLines([]);
            }
        } else if (clickCount === 8) {
            setIsCharging(true);
            setEmotion('happy');
            setTimeout(() => {
                setBattery(100);
                setIsCharging(false);
                setMessage("SYSTEMS OVERCHARGED! 100% ENERGY.");
            }, 2000);
        } else if (clickCount === 10) {
            setEmotion('angry');
            setMessage("Stop clicking me! My armor is degrading!");
        } else if (clickCount > 15 && clickCount < 19) {
            setEmotion('angry');
            setDroneMode('combat');
            setMessage("CRITICAL WARNING: HOSTILE CLICKING DETECTED.");
        } else {
            if (!isListening && !activeMiniGame) {
                setEmotion('happy');
                setMessage("Beep!");
            }
        }

        if (!isListening && clickCount !== 3 && !activeMiniGame) {
            setTimeout(() => { if (!isShattered && !isListening && !activeMiniGame) { setMessage(""); setEmotion('normal'); } }, 3000);
        }
    };

    // Style computing based on modes
    let pupilColor = '#00f0ff';
    let eyeSize = 12;
    let bodyColor1 = '#1a1a20';
    let bodyColor2 = '#050508';
    let ringColor = 'rgba(0, 240, 255, 0.4)';
    let opacity = 1;

    if (emotion === 'angry') { pupilColor = '#ff003c'; eyeSize = 8; }
    if (emotion === 'happy') { pupilColor = '#00ff00'; eyeSize = 16; }
    if (emotion === 'confused') { pupilColor = '#ffaa00'; }
    if (emotion === 'dead') { pupilColor = '#333'; eyeSize = 0; }

    if (droneMode === 'combat') {
        bodyColor1 = '#300000'; bodyColor2 = '#100000';
        ringColor = 'rgba(255, 0, 60, 0.8)';
        pupilColor = '#ff003c';
        eyeSize = 10;
    } else if (droneMode === 'party') {
        bodyColor1 = '#purple'; bodyColor2 = '#orange'; // It will interpolate weirdly but cool
        const colors = ['#00f0ff', '#ff003c', '#00ff00', '#ff00ff', '#ffff00'];
        ringColor = colors[Math.floor(Date.now() / 200) % colors.length];
        pupilColor = ringColor;
    } else if (droneMode === 'stealth') {
        opacity = 0.2;
        ringColor = 'transparent';
        pupilColor = '#444';
    } else if (droneMode === 'hacker') {
        bodyColor1 = '#002200'; bodyColor2 = '#000000';
        ringColor = 'rgba(0, 255, 0, 0.8)';
        pupilColor = '#00ff00';
    }

    let pupilX = 0;
    let pupilY = 0;

    if (eyeRef.current && !isShattered) {
        const rect = eyeRef.current.getBoundingClientRect();
        const eyeCX = rect.left + rect.width / 2;
        const eyeCY = rect.top + rect.height / 2;
        const angle = Math.atan2(mousePos.y - eyeCY, mousePos.x - eyeCX);
        const distance = Math.min(6, Math.hypot(mousePos.x - eyeCX, mousePos.y - eyeCY) / 40);
        pupilX = Math.cos(angle) * distance;
        pupilY = Math.sin(angle) * distance;

        if (emotion === 'angry' || droneMode === 'combat') {
            pupilX += (Math.random() - 0.5) * 3;
            pupilY += (Math.random() - 0.5) * 3;
        }
    }

    return (
        <motion.div
            ref={droneRef}
            drag
            dragConstraints={{ left: -window.innerWidth + 80, right: 20, top: -window.innerHeight + 80, bottom: 20 }}
            onDrag={(e, info) => {
                if (droneRef.current) {
                    const rect = droneRef.current.getBoundingClientRect();
                    setBubbleFlip(rect.top < 200);
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
                pointerEvents: droneMode === 'stealth' ? 'none' : 'auto',
                opacity: opacity
            }}
        >
            {/* DIMENSIONAL HOLOGRAM BUBBLE */}
            <AnimatePresence>
                {(message || activeScanData.length > 0 || terminalLines.length > 0 || activeMiniGame) && !isShattered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 10, scale: 0.8, filter: 'blur(10px)' }}
                        className="drone-bubble"
                        style={{
                            position: 'absolute',
                            bottom: bubbleFlip ? 'auto' : '100px',
                            top: bubbleFlip ? '100px' : 'auto',
                            right: '-50px',
                            background: droneMode === 'hacker' ? 'rgba(0, 30, 0, 0.95)' : 'rgba(10, 10, 15, 0.95)',
                            backdropFilter: 'blur(15px)',
                            border: `1px solid ${isScanning ? 'var(--accent-red)' : (droneMode === 'hacker' ? '#0f0' : 'rgba(0, 240, 255, 0.3)')}`,
                            padding: '16px 20px',
                            borderRadius: '16px',
                            color: droneMode === 'hacker' ? '#0f0' : '#e0faff',
                            fontFamily: '"Fira Code", monospace',
                            fontSize: '0.8rem',
                            minWidth: '220px',
                            maxWidth: '350px',
                            textAlign: 'left',
                            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px ${droneMode === 'hacker' ? 'rgba(0,255,0,0.2)' : 'rgba(0, 240, 255, 0.1)'}`,
                            zIndex: 10,
                            pointerEvents: activeMiniGame ? 'auto' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header Bar */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            fontSize: '0.65rem',
                            color: isListening ? '#ffaa00' : (isScanning ? '#ff003c' : (isCharging ? '#00ff00' : (droneMode === 'hacker' ? '#0f0' : 'var(--accent-cyan)'))),
                            opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold',
                            borderBottom: `1px solid ${isListening ? '#ffaa00' : 'rgba(255,255,255,0.1)'}`,
                            paddingBottom: '4px'
                        }}>
                            <span>{isListening ? 'ROOT_TERMINAL_V1' : (isCharging ? 'ENERGY_REFILL' : (isScanning ? 'CRITICAL_SCAN' : (activeMiniGame ? 'MINI_GAME_ENGINE' : `SYS_MODE: ${droneMode.toUpperCase()}`))))}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>BAT:</span>
                                <span>{Math.floor(battery)}%</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        {terminalLines.length > 0 && (
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '5px' }}>
                                {terminalLines.map((line, i) => (
                                    <div key={i} style={{ color: '#aaa' }}>{line}</div>
                                ))}
                            </div>
                        )}

                        <div style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {message}
                        </div>

                        {/* Mini Games Engine rendering */}
                        {activeMiniGame === 'tictactoe' && (
                            <DroneTicTacToe onGameOver={(res) => {
                                setTimeout(() => {
                                    setActiveMiniGame(null);
                                    if (res === 'Draw') setMessage("A noble tie algorithm.");
                                    else if (res === 'X') setMessage("Impossible... Human defeated me!");
                                    else setMessage("Puny human, I win. Typical.");
                                    setTimeout(() => setMessage(""), 4000);
                                }, 3000);
                            }} />
                        )}

                        {/* Scanner Data Rendering */}
                        {activeScanData.length > 0 && (
                            <div style={{
                                marginTop: '4px', padding: '8px', background: 'rgba(0,0,0,0.6)',
                                borderRadius: '8px', borderLeft: `2px solid ${droneMode === 'hacker' ? '#0f0' : 'var(--accent-cyan)'}`,
                                fontSize: '0.7rem'
                            }}>
                                {activeScanData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    >
                                        {`> ${d}`}
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Progress Bar for Scanner */}
                        {isScanning && (
                            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '4px' }}>
                                <motion.div style={{ height: '100%', background: droneMode === 'hacker' ? '#0f0' : '#ff003c', width: `${scanProgress}%` }} />
                            </div>
                        )}

                        {/* Scanlines Effect */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
                            backgroundSize: '100% 4px', pointerEvents: 'none', borderRadius: '16px'
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DRONE BODY */}
            {!isShattered ? (
                <motion.div
                    animate={{ y: [0, -12, 0], rotate: droneMode === 'party' ? [0, 360] : [0, 2, -2, 0] }}
                    transition={{
                        duration: droneMode === 'party' ? 2 : (droneMode === 'combat' ? 3 : 5),
                        repeat: Infinity,
                        ease: droneMode === 'party' ? "linear" : "easeInOut"
                    }}
                    style={{ width: '70px', height: '70px', position: 'relative', pointerEvents: 'auto', cursor: 'grab' }}
                    onClick={handleDroneClick}
                >
                    {/* Rotating Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360, scale: droneMode === 'combat' ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: droneMode === 'combat' ? 1 : 15, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute', top: '-5px', left: '-5px', right: '-5px', bottom: '-5px',
                            border: `1px dashed ${ringColor}`,
                            borderRadius: '50%',
                            boxShadow: `0 0 15px ${ringColor}`
                        }}
                    />

                    {/* Combat Weapons (Only visible in Combat Mode) */}
                    <AnimatePresence>
                        {droneMode === 'combat' && (
                            <>
                                <motion.div initial={{ x: 0, opacity: 0 }} animate={{ x: -20, opacity: 1 }} style={{
                                    position: 'absolute', left: '-10px', top: '30%', width: '20px', height: '4px', background: '#ff003c', boxShadow: '0 0 10px #ff003c'
                                }} />
                                <motion.div initial={{ x: 0, opacity: 0 }} animate={{ x: 20, opacity: 1 }} style={{
                                    position: 'absolute', right: '-10px', top: '30%', width: '20px', height: '4px', background: '#ff003c', boxShadow: '0 0 10px #ff003c'
                                }} />
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main Spherical Shell */}
                    <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${bodyColor1} 0%, ${bodyColor2} 100%)`,
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: `0 0 25px ${droneMode === 'combat' ? '#ff003c' : (droneMode === 'hacker' ? '#0f0' : 'rgba(0, 240, 255, 0.3)')}, inset 0 0 15px rgba(0,0,0,0.9)`,
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        position: 'relative', overflow: 'hidden',
                        transition: 'background 1s'
                    }}>
                        {/* Greebles */}
                        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '4px', height: '4px', background: pupilColor, borderRadius: '50%', opacity: 0.5 }} />
                        <div style={{ position: 'absolute', bottom: '15%', right: '25%', width: '2px', height: '10px', background: '#ffffff22', transform: 'rotate(45deg)' }} />

                        {/* Camera Lens Container */}
                        <div
                            ref={eyeRef}
                            style={{
                                width: '34px', height: '34px', borderRadius: '50%', background: '#000',
                                border: `2px solid ${pupilColor}55`,
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                position: 'relative', transition: 'border-color 0.3s'
                            }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: `radial-gradient(circle at center, transparent 40%, ${pupilColor}22 100%)`, borderRadius: '50%' }}
                            />

                            {/* Pupil */}
                            <motion.div
                                animate={{ x: pupilX, y: pupilY }} transition={{ type: "spring", stiffness: 150, damping: 15 }}
                                style={{
                                    width: `${eyeSize}px`, height: `${eyeSize}px`, borderRadius: '50%',
                                    background: isScanning ? '#ff003c' : pupilColor,
                                    boxShadow: `0 0 12px ${isScanning ? '#ff003c' : pupilColor}, 0 0 24px ${isScanning ? '#ff003c' : pupilColor}88`,
                                    position: 'relative', zIndex: 2, transition: 'background 0.3s, width 0.3s, height 0.3s'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '20%', left: '25%', width: '30%', height: '30%', background: 'white', borderRadius: '50%', opacity: 0.8 }} />
                                {emotion === 'dead' && <div style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>X</div>}
                                {droneMode === 'combat' && <div style={{ position: 'absolute', top: '40%', left: '-100%', width: '300%', height: '1px', background: 'rgba(255,0,0,0.5)', pointerEvents: 'none' }} />}
                                {droneMode === 'combat' && <div style={{ position: 'absolute', top: '-100%', left: '40%', width: '1px', height: '300%', background: 'rgba(255,0,0,0.5)', pointerEvents: 'none' }} />}
                            </motion.div>

                            {/* Laser Scanner */}
                            <AnimatePresence>
                                {isScanning && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: [0.2, 0.8, 0.4], height: 300 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            position: 'absolute', top: '100%', width: '100px',
                                            background: `linear-gradient(to bottom, ${droneMode === 'hacker' ? 'rgba(0,255,0,0.4)' : 'rgba(255,0,60,0.4)'}, transparent)`,
                                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', pointerEvents: 'none', transformOrigin: 'top center'
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Stabilizers */}
                    <motion.div
                        animate={{ x: [-2, 2, -2] }} transition={{ duration: 1, repeat: Infinity }}
                        style={{ position: 'absolute', left: '-15px', top: '50%', width: '12px', height: '2px', background: ringColor, boxShadow: `0 0 10px ${ringColor}` }}
                    />
                    <motion.div
                        animate={{ x: [2, -2, 2] }} transition={{ duration: 1, repeat: Infinity }}
                        style={{ position: 'absolute', right: '-15px', top: '50%', width: '12px', height: '2px', background: ringColor, boxShadow: `0 0 10px ${ringColor}` }}
                    />

                    {/* Exhaust */}
                    <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                        {[0, 1].map(i => (
                            <motion.div
                                key={i} animate={{ height: droneMode === 'combat' ? [10, 20, 10] : [4, 12, 4], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.1 }}
                                style={{
                                    width: '4px', background: pupilColor, borderRadius: '0 0 4px 4px', boxShadow: `0 0 10px ${pupilColor}`
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            ) : (
                <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'white', borderRadius: '50%', filter: 'blur(20px)', zIndex: 5 }}
                    />
                    {particles.map(p => (
                        <motion.div
                            key={p.id} initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                            animate={{ x: p.x * 1.5, y: p.y * 1.5, scale: p.scale, opacity: 0, rotate: p.rot * 2 }}
                            transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
                            style={{
                                position: 'absolute', top: '30px', left: '30px', width: '12px', height: '12px', background: p.color,
                                boxShadow: `0 0 15px ${p.color}`, borderRadius: Math.random() > 0.5 ? '50%' : '2px', border: '1px solid white'
                            }}
                        />
                    ))}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8] }} transition={{ duration: 3 }}
                        style={{
                            color: '#ff003c', fontFamily: 'monospace', position: 'absolute', top: '-50px', left: '-70px',
                            width: '200px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px', textShadow: '0 0 10px #ff003c, 0 0 20px #ff003c'
                        }}
                    >
                        CRITICAL FAILURE
                        <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '5px' }}>REBOOTING KERNEL...</div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default CompanionDrone;
