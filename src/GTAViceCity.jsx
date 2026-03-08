import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Map, Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GTAViceCity() {
    const { t } = useTranslation();
    const [started, setStarted] = useState(false);
    const iframeRef = useRef(null);

    const toggleFullScreen = () => {
        const elem = document.getElementById("gta-game-wrapper");
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        if (started && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [started]);

    return (
        <div id="gta-game-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
            {!started ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: '#1a0b1c' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', maxWidth: '450px' }}
                    >
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ff66b2', fontFamily: 'serif', fontStyle: 'italic', letterSpacing: '2px', textShadow: '0 0 10px #ff66b2' }}>Vice City</h2>
                        <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>Welcome to the 80s</p>
                        <div style={{ background: 'rgba(255, 102, 178, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 102, 178, 0.2)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ color: '#ff66b2', fontWeight: 'bold', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Map size={16} /> {t('game_common.controls')}
                            </p>
                            <p style={{ color: '#ffcc00', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                ⚠️ {t('game_launch.vc_downloading')}
                            </p>
                            <ul style={{ color: '#bbb', margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem' }}>
                                <li><strong>{t('game_common.controls').includes('K') ? 'Ekrana tıklayarak' : 'Click the screen'}</strong> {t('game_common.controls').includes('K') ? 'fareyi oyun içine kilitleyin.' : 'to lock mouse in game.'}</li>
                                <li><strong>WASD:</strong> {t('game_launch.vc_wasd')}</li>
                                <li><strong>{t('game_common.controls').includes('K') ? 'Fare' : 'Mouse'}:</strong> {t('game_launch.vc_mouse')}</li>
                                <li><strong>{t('game_common.controls').includes('K') ? 'Sol Tık' : 'LMB'}:</strong> {t('game_launch.vc_lmb')}</li>
                                <li><strong>F / Enter:</strong> {t('game_launch.vc_f')}</li>
                                <li><strong>ESC:</strong> {t('game_common.controls').includes('K') ? 'Menü / Duraklat' : 'Menu / Pause'}</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStarted(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: 'linear-gradient(45deg, #ff66b2, #00f0ff)', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(255,102,178,0.5)', textTransform: 'uppercase' }}
                        >
                            <Car size={20} style={{ display: 'inline', marginRight: '8px' }} /> {t('game_launch.vc_btn')}
                        </button>
                    </motion.div>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <iframe
                        ref={iframeRef}
                        srcDoc={`<!doctype html>
<html lang="en-us">

<head>
    <base href="https://cdn.jsdelivr.net/gh/web-ports/vice-city@49409b9dd26b45d0cbfdb5c93dd19f38750e4207/">
    <meta charset="utf-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <title>Grand Theft Auto: Vice City</title>
    <link rel="stylesheet" href="style.css">
    <style>
        html, body {
            margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000;
        }
    </style>
</head>

<body
    data-is-touch="0"
    data-state-car="0"
    data-state-car-gun="0"
    data-state-gun="0"
    data-state-bike="0"
    data-state-menu="1"
    data-state-cutscene="0"
    data-state-mobring="0"
    data-state-job="0"
    data-state-disable-controls="0"
    data-state-panzer="0"
    data-state-car-with-weapon="0"
    data-state-hunter="0"
    data-state-scope-mode="0"
    data-state-scope-gun="0"
>
    <div id="loading-text" style="color: white; font-size: 24px; font-family: monospace; text-align: center; margin-top: 40vh; letter-spacing: 2px;"> ${t('game_common.loading')} </div>
    <div class="wasted-container" hidden>

    </div>
    <div class="intro-container" hidden>
        </video>

        <div class="loader-container">
            <div class="progress-bar-container" id='spinner'>
                <div class="progress-bar-fill"></div>
            </div>
            <div id="status">Downloading...</div>
            <div>
                <progress id="progress"></progress>
            </div>
        </div>
    </div>

    <input type="file" id="original-game-file" hidden>


    <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()"></canvas>

    <div class="touch-controls-wrapper" style="display:none;">
        <div id="move"></div>
        <div id="look"></div>

        <div class="touch-control radio"></div>
        <div class="touch-control weapon"></div>
        <div class="touch-control menu"></div>
        <div class="touch-control fist"></div>
        <div class="touch-control drift"></div>
        <div class="touch-control run"></div>
        <div class="touch-control car getIn"></div>
        <div class="touch-control left"></div>
        <div class="touch-control right"></div>
        <div class="touch-control jump"></div>
        <div class="touch-control car getOut"></div>
        <div class="touch-control camera"></div>
        <div class="touch-control mobile"></div>
        <div class="touch-control job"></div>
        <div class="touch-control horn"></div>
        <div class="touch-control fireRight"></div>
        <div class="touch-control fireLeft"></div>
    </div>

<script>
const loadingText = document.querySelector("#loading-text");
let loadedBytes = 0;
const DB_NAME = "gameFilesDB_VC";
const STORE_NAME = "files";

// Open or create IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = e => resolve(e.target.result);
        request.onerror = e => reject(e.target.error);
    });
}

// Save file to IndexedDB
async function saveFile(name, buffer) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.put(buffer, name);
            tx.oncomplete = () => resolve();
            tx.onerror = e => reject(e.target.error);
        });
    } catch(e) { console.log("IndexedDB Save Blocked", e); }
}

// Get file from IndexedDB
async function getFile(name) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(name);
            request.onsuccess = e => resolve(e.target.result);
            request.onerror = e => reject(e.target.error);
        });
    } catch(e) { return null; }
}

// Fetch with progress and caching
async function fetchWithCache(name, url) {
    let cached = await getFile(name);
    if (cached) return cached; // Return cached version

    const response = await fetch(url);
    const reader = response.body.getReader();
    let chunks = [];
    let received = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        loadedBytes += value.length;
        chunks.push(value);

        let mbDone = (loadedBytes / (1024 * 1024)).toFixed(2);
        let mbTotal = '633.45';
        loadingText.textContent = \`\${'${t('game_common.loading')}'} \${mbDone} MB / \${mbTotal} MB\`;
    }

    let fullBuffer = new Uint8Array(received);
    let offset = 0;
    for (let chunk of chunks) {
        fullBuffer.set(chunk, offset);
        offset += chunk.length;
    }

    await saveFile(name, fullBuffer.buffer); // Cache it
    return fullBuffer.buffer;
}

// Merge multiple parts
async function mergeFiles(fileParts, namePrefix) {
    const buffers = [];
    for (let i = 0; i < fileParts.length; i++) {
        const buffer = await fetchWithCache(\`\${namePrefix}.part\${i+1}\`, fileParts[i]);
        buffers.push(buffer);
    }
    const mergedBlob = new Blob(buffers);
    return URL.createObjectURL(mergedBlob);
}

// Generate part URLs
function getParts(file, start, end) {
    let parts = [];
    for (let i = start; i <= end; i++) {
        parts.push(file + ".part" + i);
    }
    return parts;
}

// Start fetching and caching SEQUENTIALLY to save memory
async function loadGameData() {
    try {
        const indexdataurl = await mergeFiles(getParts("index.data", 1, 7), "index.data");
        const EMOTIONadfurl = await mergeFiles(getParts("audio/emotion.adf", 1, 3), "emotion.adf");
        const ESPANTadfurl = await mergeFiles(getParts("audio/espant.adf", 1, 3), "espant.adf");
        const FEVERadfurl = await mergeFiles(getParts("audio/fever.adf", 1, 3), "fever.adf");
        const FLASHadfurl = await mergeFiles(getParts("audio/flash.adf", 1, 3), "flash.adf");
        const KCHATadfurl = await mergeFiles(getParts("audio/kchat.adf", 1, 3), "kchat.adf");
        const VCPRadfurl = await mergeFiles(getParts("audio/vcpr.adf", 1, 2), "vcpr.adf");
        const VROCKadfurl = await mergeFiles(getParts("audio/vrock.adf", 1, 4), "vrock.adf");
        const WAVEadfurl = await mergeFiles(getParts("audio/wave.adf", 1, 4), "wave.adf");
        const WILDadfurl = await mergeFiles(getParts("audio/wild.adf", 1, 4), "wild.adf");

        // Override fetch to use cached URLs
        const originalFetch = window.fetch;
        window.fetch = async function(input, init) {
            let urlString = input instanceof Request ? input.url : String(input);
            let target = null;
            if (urlString.toLowerCase().includes("index.data".toLowerCase())) target = indexdataurl;
            else if (urlString.toLowerCase().includes("emotion.adf".toLowerCase())) target = EMOTIONadfurl;
            else if (urlString.toLowerCase().includes("espant.adf".toLowerCase())) target = ESPANTadfurl;
            else if (urlString.toLowerCase().includes("fever.adf".toLowerCase())) target = FEVERadfurl;
            else if (urlString.toLowerCase().includes("flash.adf".toLowerCase())) target = FLASHadfurl;
            else if (urlString.toLowerCase().includes("kchat.adf".toLowerCase())) target = KCHATadfurl;
            else if (urlString.toLowerCase().includes("vcpr.adf".toLowerCase())) target = VCPRadfurl;
            else if (urlString.toLowerCase().includes("vrock.adf".toLowerCase())) target = VROCKadfurl;
            else if (urlString.toLowerCase().includes("wave.adf".toLowerCase())) target = WAVEadfurl;
            else if (urlString.toLowerCase().includes("wild.adf".toLowerCase())) target = WILDadfurl;
            
            if (target) return originalFetch(target, init);
            return originalFetch(input, init);
        };

        // Similarly override XHR
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            let u = url.toLowerCase();
            if (u.includes("https://cdn.dos.zone/vcsky/fetched/".toLowerCase())) url = url.replace("https://cdn.dos.zone/vcsky/fetched/", "")
            if (u.includes("index.data".toLowerCase())) url = indexdataurl;
            else if (u.includes("emotion.adf".toLowerCase())) url = EMOTIONadfurl;
            else if (u.includes("espant.adf".toLowerCase())) url = ESPANTadfurl;
            else if (u.includes("fever.adf".toLowerCase())) url = FEVERadfurl;
            else if (u.includes("flash.adf".toLowerCase())) url = FLASHadfurl;
            else if (u.includes("kchat.adf".toLowerCase())) url = KCHATadfurl;
            else if (u.includes("vcpr.adf".toLowerCase())) url = VCPRadfurl;
            else if (u.includes("vrock.adf".toLowerCase())) url = VROCKadfurl;
            else if (u.includes("wave.adf".toLowerCase())) url = WAVEadfurl;
            else if (u.includes("wild.adf".toLowerCase())) url = WILDadfurl;
            return originalOpen.call(this, method, url, ...rest);
        };

        // Load game scripts
        ["gamepademulator.js", "idbfs.js", "game.js"].forEach(src => {
            const script = document.createElement("script");
            script.src = src;
            document.body.appendChild(script);
        });

        if(loadingText) loadingText.remove();
    } catch(err) {
        if(loadingText) loadingText.textContent = "Yukleme Basarisiz (OOM veya Baglanti): " + err.message;
        console.error(err);
    }
}

loadGameData();
</script>

</body>

</html>`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="GTA Vice City Web"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms blob: *"
                        allow="autoplay; fullscreen; keyboard-lock; pointer-lock"
                        allowFullScreen
                        onLoad={() => {
                            if (iframeRef.current) iframeRef.current.focus();
                        }}
                    />
                    <button
                        onClick={toggleFullScreen}
                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '5px', borderRadius: '5px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(5px)' }}
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
