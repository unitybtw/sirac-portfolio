import{r,j as e}from"./vendor-three-BKnJn67O.js";import{c as s,u as d,m as u}from"./index-C8r2Fx4V.js";import{M as f}from"./maximize-WXO11zWL.js";const m=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],h=s("car",m);const g=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],p=s("map",g);function y(){const{t}=d(),[n,c]=r.useState(!0),a=r.useRef(null),l=()=>{const o=document.getElementById("gta-game-wrapper");o&&(document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():o.requestFullscreen().catch(i=>{console.error(`Error attempting to enable full-screen mode: ${i.message} (${i.name})`)}))};return r.useEffect(()=>{n&&a.current&&a.current.focus()},[n]),e.jsx("div",{id:"gta-game-wrapper",style:{width:"100%",height:"100%",display:"flex",flexDirection:"column",background:"#000",position:"relative"},children:n?e.jsxs("div",{style:{flex:1,position:"relative",overflow:"hidden"},children:[e.jsx("iframe",{ref:a,srcDoc:`<!doctype html>
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
    <div id="loading-text" style="color: white; font-size: 24px; font-family: monospace; text-align: center; margin-top: 40vh; letter-spacing: 2px;"> ${t("game_common.loading")} </div>
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
var Module = {
    preRun: [],
    postRun: [],
    print: (function() { return function(text) { console.log(text); }; })(),
    canvas: (function() {
        var canvas = document.getElementById('canvas');
        canvas.addEventListener("webglcontextlost", function(e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);
        return canvas;
    })(),
    statusElement: document.getElementById('status'),
    activeAudioContext: null,
    // Try to prevent OOM
    TOTAL_MEMORY: 1073741824, // 1GB
    // Performance tuning for heavy games
    arguments: ["-f", "60"], // Force 60fps limit to prevent runaway CPU
};

const originalFetch = window.fetch;
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
        loadingText.textContent = \`\${'${t("game_common.loading")}'} \${mbDone} MB / \${mbTotal} MB\`;
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

// Merge multiple parts and save as a single entry in IndexedDB
async function mergeAndCache(fileParts, finalName) {
    let existing = await getFile(finalName);
    if (existing) return;

    const buffers = [];
    for (let i = 0; i < fileParts.length; i++) {
        const buffer = await fetchWithCache(\`\${finalName}.part\${i+1}\`, fileParts[i]);
        buffers.push(buffer);
    }
    let totalLength = buffers.reduce((acc, b) => acc + b.byteLength, 0);
    let combined = new Uint8Array(totalLength);
    let offset = 0;
    for (let b of buffers) {
        combined.set(new Uint8Array(b), offset);
        offset += b.byteLength;
    }
    await saveFile(finalName, combined.buffer);
    buffers.length = 0;
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
        await mergeAndCache(getParts("index.data", 1, 7), "index.data");
        await mergeAndCache(getParts("audio/emotion.adf", 1, 3), "emotion.adf");
        await mergeAndCache(getParts("audio/espant.adf", 1, 3), "espant.adf");
        await mergeAndCache(getParts("audio/fever.adf", 1, 3), "fever.adf");
        await mergeAndCache(getParts("audio/flash.adf", 1, 3), "flash.adf");
        await mergeAndCache(getParts("audio/kchat.adf", 1, 3), "kchat.adf");
        await mergeAndCache(getParts("audio/vcpr.adf", 1, 2), "vcpr.adf");
        await mergeAndCache(getParts("audio/vrock.adf", 1, 4), "vrock.adf");
        await mergeAndCache(getParts("audio/wave.adf", 1, 4), "wave.adf");
        await mergeAndCache(getParts("audio/wild.adf", 1, 4), "wild.adf");

        // Optimized fetch override to use Response from IndexedDB directly
        window.fetch = async function(input, init) {
            let urlString = input instanceof Request ? input.url : String(input);
            const fileName = urlString.split('/').pop().split('?')[0];
            
            // Check if we have this file in our virtual filesystem
            const cached = await getFile(fileName);
            if (cached) {
                return new Response(cached);
            }
            return originalFetch(input, init);
        };

        // Similarly override XHR to use Blobs directly to save RAM
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            // Fix: Restore the redirection for dos.zone URLs
            let u = url.toString();
            if (u.toLowerCase().includes("https://cdn.dos.zone/vcsky/fetched/".toLowerCase())) {
                u = u.replace("https://cdn.dos.zone/vcsky/fetched/", "");
            }
            this._url = u;
            return originalOpen.call(this, method, u, ...rest);
        };
        
        XMLHttpRequest.prototype.send = async function(body) {
            const fileName = this._url.split('/').pop().split('?')[0];
            
            // Try to serve from IndexedDB cache
            const cached = await getFile(fileName);
            if (cached) {
                const blob = new Blob([cached]);
                const blobUrl = URL.createObjectURL(blob);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 30000); // 30s buffer
                
                // Re-open with the local blob URL
                originalOpen.call(this, 'GET', blobUrl, true);
                return originalSend.call(this);
            }
            
            // Fallback to original send if not in cache
            return originalSend.call(this, body);
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
<\/script>

</body>

</html>`,style:{width:"100%",height:"100%",border:"none"},title:"GTA Vice City Web",sandbox:"allow-scripts allow-same-origin allow-pointer-lock allow-forms blob: *",allow:"autoplay; fullscreen; keyboard-lock; pointer-lock",allowFullScreen:!0,onLoad:()=>{a.current&&a.current.focus()}}),e.jsx("button",{onClick:l,style:{position:"absolute",bottom:"10px",right:"10px",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",padding:"5px",borderRadius:"5px",cursor:"pointer",zIndex:10,backdropFilter:"blur(5px)"},children:e.jsx(f,{size:16})})]}):e.jsx("div",{style:{flex:1,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px",background:"#1a0b1c"},children:e.jsxs(u.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},style:{textAlign:"center",maxWidth:"450px"},children:[e.jsx("h2",{className:"text-gradient",style:{fontSize:"2.5rem",marginBottom:"0.5rem",color:"#ff66b2",fontFamily:"serif",fontStyle:"italic",letterSpacing:"2px",textShadow:"0 0 10px #ff66b2"},children:"Vice City"}),e.jsx("p",{style:{color:"#fff",fontSize:"0.9rem",marginBottom:"1.5rem",textTransform:"uppercase",letterSpacing:"4px"},children:"Welcome to the 80s"}),e.jsxs("div",{style:{background:"rgba(255, 102, 178, 0.05)",padding:"1rem",borderRadius:"8px",border:"1px solid rgba(255, 102, 178, 0.2)",marginBottom:"1.5rem",textAlign:"left",fontSize:"0.9rem"},children:[e.jsxs("p",{style:{color:"#ff66b2",fontWeight:"bold",marginBottom:"0.3rem",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(p,{size:16})," ",t("game_common.controls")]}),e.jsxs("p",{style:{color:"#ffcc00",fontSize:"0.8rem",fontStyle:"italic",marginBottom:"1rem"},children:["⚠️ ",t("game_launch.vc_downloading")]}),e.jsxs("ul",{style:{color:"#bbb",margin:0,paddingLeft:"1.2rem",fontSize:"0.8rem"},children:[e.jsxs("li",{children:[e.jsx("strong",{children:t("game_common.controls").includes("K")?"Ekrana tıklayarak":"Click the screen"})," ",t("game_common.controls").includes("K")?"fareyi oyun içine kilitleyin.":"to lock mouse in game."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"WASD:"})," ",t("game_launch.vc_wasd")]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[t("game_common.controls").includes("K")?"Fare":"Mouse",":"]})," ",t("game_launch.vc_mouse")]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[t("game_common.controls").includes("K")?"Sol Tık":"LMB",":"]})," ",t("game_launch.vc_lmb")]}),e.jsxs("li",{children:[e.jsx("strong",{children:"F / Enter:"})," ",t("game_launch.vc_f")]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ESC:"})," ",t("game_common.controls").includes("K")?"Menü / Duraklat":"Menu / Pause"]})]})]}),e.jsxs("button",{onClick:()=>c(!0),className:"btn btn-primary",style:{width:"100%",padding:"1.2rem",fontSize:"1.2rem",background:"linear-gradient(45deg, #ff66b2, #00f0ff)",color:"#fff",fontWeight:"bold",borderRadius:"8px",border:"none",boxShadow:"0 0 20px rgba(255,102,178,0.5)",textTransform:"uppercase"},children:[e.jsx(h,{size:20,style:{display:"inline",marginRight:"8px"}})," ",t("game_launch.vc_btn")]})]})})})}export{y as default};
