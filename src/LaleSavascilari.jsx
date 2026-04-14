import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LaleSavascilari = ({ onGameOver }) => {
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [phase, setPhase] = useState('boot'); // boot, menu, game, gameover
    const [score, setScore] = useState(0);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    const bootSequence = [
        "Starting MS-DOS...",
        "HIMEM is testing extended memory...done.",
        "C:\\> CD LALE",
        "C:\\LALE> LALE.EXE",
        "Loading Graphics...",
        "Loading Sound Drivers (SoundBlaster 16)...",
        "===============================================",
        "   İSTANBUL EFSANELERİ: LALE SAVAŞÇILARI (1997)",
        "   SiliconWorx & CompuTronic",
        "===============================================",
        "1. Yeni Oyun",
        "2. Çıkış",
        "Seçiminiz (1/2): "
    ];

    const gameScenarios = [
        {
            text: "Karanlık bir İstanbul sokağındasın. Etrafta neon tabelalar ve çöpler var. Karşıdan bir Mutant Lale Askeri yaklaşıyor!",
            options: ["1. Ateş et", "2. Saklan", "3. Konuşmaya çalış"],
            correct: 1,
            reward: 50,
            failText: "Mutant Lale seni fark etti ve zehirli polenleriyle saldırdı! (Oyun Bitti)"
        },
        {
            text: "Eminönü'nde terk edilmiş bir vapurun içindesin. Gizli Direniş Karargahı'na giden bir kapı buldun fakat şifreli.",
            options: ["1. Şifreyi tahmin et (1453)", "2. Kapıyı kır", "3. Sistemi hackle"],
            correct: 3,
            reward: 100,
            failText: "Yanlış hamle! Alarmlar çalmaya başladı ve Lale Muhafızları etrafını sardı. (Oyun Bitti)"
        },
        {
            text: "Galata Kulesi'nin tepesinde Baş Mutant ile karşı karşıyasın! Elinde sadece eski bir plazma tüfeği var.",
            options: ["1. Doğrudan Göğsüne Ateş Et", "2. Gözünü Kör Etmeye Çalış", "3. Kuleden Aşağı Atla"],
            correct: 2,
            reward: 200,
            failText: "Baş Mutant mermiye karşı şerbetli! Seni tek vuruşta aşağı fırlattı. (Oyun Bitti)"
        }
    ];

    const [currentScenario, setCurrentScenario] = useState(0);

    const addLine = (text, delay = 0) => {
        setTimeout(() => {
            setLines(prev => [...prev, text]);
        }, delay);
    };

    useEffect(() => {
        if (lines.length > 0) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [lines]);

    useEffect(() => {
        let delay = 500;
        bootSequence.forEach((line) => {
            addLine(line, delay);
            delay += Math.random() * 400 + 200;
        });
        setTimeout(() => setPhase('menu'), delay + 500);
        
        // Auto focus
        setTimeout(() => inputRef.current?.focus(), delay + 600);
    }, []);

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            const val = input.trim();
            addLine(`> ${val}`);
            setInput('');

            if (phase === 'menu') {
                if (val === '1') {
                    setLines([]);
                    addLine("Oyun yükleniyor... Disk 1 okundu.", 200);
                    setTimeout(() => {
                        setPhase('game');
                        playScenario(0);
                    }, 1000);
                } else if (val === '2') {
                    addLine("C:\\>");
                    setTimeout(() => onGameOver(score), 1000);
                } else {
                    addLine("Geçersiz seçim. 1 veya 2 tuşlayın:");
                }
            } else if (phase === 'game') {
                const scenario = gameScenarios[currentScenario];
                if (['1', '2', '3'].includes(val)) {
                    if (parseInt(val) === scenario.correct) {
                        const newScore = score + scenario.reward;
                        setScore(newScore);
                        addLine(`[BAŞARILI] +${scenario.reward} PUAN. Toplam: ${newScore}`, 500);
                        
                        setTimeout(() => {
                            if (currentScenario + 1 < gameScenarios.length) {
                                setCurrentScenario(curr => curr + 1);
                                playScenario(currentScenario + 1);
                            } else {
                                addLine("=============================================", 500);
                                addLine("TEBRİKLER! LALE İMPARATORLUĞUNU ÇÖKERTTİN!", 1000);
                                addLine("İSTANBUL EFSANESİ OLDUN!", 1500);
                                addLine(`TOPLAM SKOR: ${newScore}`, 2000);
                                setPhase('gameover');
                                setTimeout(() => onGameOver(newScore), 4000);
                            }
                        }, 2000);
                    } else {
                        addLine(`[ÖLÜM] ${scenario.failText}`, 500);
                        addLine(`OYUN BİTTİ. Skorunuz: ${score}`, 1000);
                        setPhase('gameover');
                        setTimeout(() => onGameOver(score), 3000);
                    }
                } else {
                    addLine("Lütfen 1, 2 veya 3 seçin.");
                }
            }
        }
    };

    const playScenario = (idx) => {
        const scenario = gameScenarios[idx];
        addLine("---------------------------------------------");
        addLine(scenario.text, 500);
        setTimeout(() => {
            scenario.options.forEach((opt, i) => addLine(opt, i * 200));
            addLine("Ne yapacaksın (1/2/3)? ", scenario.options.length * 200 + 200);
        }, 1000);
    };

    return (
        <div 
            onClick={() => inputRef.current?.focus()}
            style={{ 
                width: '100%', height: '100%', background: '#000', color: '#c0c0c0', 
                fontFamily: '"Russo One", monospace', padding: '20px', overflowY: 'auto',
                boxSizing: 'border-box', cursor: 'text',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
            }}
        >
            <div style={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap', lineHeight: '1.5', textShadow: '0 0 2px #c0c0c0' }}>
                {lines.map((line, i) => (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}
                        key={i}
                    >
                        {line}
                    </motion.div>
                ))}
                
                {phase !== 'gameover' && phase !== 'boot' && (
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <span>_ </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleInput}
                            style={{ 
                                background: 'transparent', border: 'none', color: '#fff', 
                                fontFamily: 'inherit', fontSize: 'inherit', outline: 'none',
                                flex: 1, marginLeft: '5px'
                            }}
                            autoFocus
                        />
                    </div>
                )}
                {phase === 'boot' && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>}
                <div ref={endRef} />
            </div>
            
            {/* CRT Screen Scanlines */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%',
                pointerEvents: 'none',
                opacity: 0.6
            }} />
        </div>
    );
};

export default LaleSavascilari;
