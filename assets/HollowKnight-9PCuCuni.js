import{r as l,j as e,m as a}from"./index-CzbwDWUI.js";import{Z as c}from"./GameLibrary-CWNYkGIX.js";import{M as d}from"./maximize-X7sHFTSZ.js";function h(){const[r,s]=l.useState(!1),t=l.useRef(null),i=()=>{const n=document.getElementById("hollow-game-wrapper");n&&(document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():n.requestFullscreen().catch(o=>{console.error(`Error attempting to enable full-screen mode: ${o.message} (${o.name})`)}))};return l.useEffect(()=>{r&&t.current&&t.current.focus()},[r]),e.jsx("div",{id:"hollow-game-wrapper",style:{width:"100%",height:"100%",display:"flex",flexDirection:"column",background:"#000",position:"relative"},children:r?e.jsxs("div",{style:{flex:1,position:"relative",overflow:"hidden"},children:[e.jsx("iframe",{ref:t,srcDoc:`<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title>Hollow Knight | Web Port</title>
    <style>
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; color: white; display: flex; justify-content: center; align-items: center; font-family: cursive; }
        #loading-text { font-size: 24px; text-align: center; }
        canvas { width: 100% !important; height: 100% !important; display: none; }
    </style>
</head>
<body>
    <div id="loading-text">YÜKLENİYOR... 0.00 MB / 860.36 MB</div>
    <canvas id="unity-canvas"></canvas>

    <script>
        const baseUrl = "https://cdn.jsdelivr.net/gh/web-ports/hollow-knight@latest/";
        const loadingText = document.querySelector("#loading-text");
        let loadedBytes = 0;

        async function fetchWithProgress(url) {
            const response = await fetch(baseUrl + url);
            const reader = response.body.getReader();
            let chunks = [];
            let received = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                received += value.length;
                loadedBytes += value.length;
                chunks.push(value);
                loadingText.textContent = \`YÜKLENİYOR... \${(loadedBytes / (1024 * 1024)).toFixed(2)} MB / 860.36 MB\`;
            }
            let fullBuffer = new Uint8Array(received);
            let offset = 0;
            for (let chunk of chunks) {
                fullBuffer.set(chunk, offset);
                offset += chunk.length;
            }
            return fullBuffer.buffer;
        }

        async function mergeFiles(prefix, count) {
            const parts = Array.from({length: count}, (_, i) => \`\${prefix}.part\${i+1}\`);
            const buffers = await Promise.all(parts.map(fetchWithProgress));
            return URL.createObjectURL(new Blob(buffers));
        }

        (async () => {
            try {
                const [dataUrl, wasmUrl] = await Promise.all([
                    mergeFiles("Build/hk.data", 42),
                    mergeFiles("Build/hk.wasm", 2)
                ]);

                const config = {
                    dataUrl: dataUrl,
                    frameworkUrl: baseUrl + "Build/hk.framework.js",
                    codeUrl: wasmUrl,
                    streamingAssetsUrl: baseUrl + "StreamingAssets",
                    companyName: "Team Cherry",
                    productName: "Hollow Knight",
                    productVersion: "1.0",
                };

                const script = document.createElement("script");
                script.src = baseUrl + "Build/hk.loader.js";
                script.onload = () => {
                    createUnityInstance(document.querySelector("#unity-canvas"), config, (progress) => {
                        loadingText.textContent = \`OYUN BAŞLATILIYOR... \${Math.round(progress * 100)}%\`;
                    }).then(() => {
                        loadingText.style.display = "none";
                        document.querySelector("#unity-canvas").style.display = "block";
                    });
                };
                document.body.appendChild(script);
            } catch (err) {
                loadingText.textContent = "Yükleme hatası. Lütfen sayfayı yenileyin.";
                console.error(err);
            }
        })();
    <\/script>
</body>
</html>`,style:{width:"100%",height:"100%",border:"none"},title:"Hollow Knight",sandbox:"allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals blob: *",allow:"autoplay; fullscreen; keyboard-lock; pointer-lock",allowFullScreen:!0,onLoad:()=>{t.current&&t.current.focus()}}),e.jsx("button",{onClick:i,style:{position:"absolute",bottom:"10px",right:"10px",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",padding:"5px",borderRadius:"5px",cursor:"pointer",zIndex:10},children:e.jsx(d,{size:16})})]}):e.jsx("div",{style:{flex:1,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px",background:"#050508"},children:e.jsxs(a.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},style:{textAlign:"center",maxWidth:"400px"},children:[e.jsx("h2",{className:"text-gradient",style:{fontSize:"2.5rem",marginBottom:"1rem",color:"#aab8c2"},children:"HOLLOW KNIGHT"}),e.jsxs("div",{style:{background:"rgba(170, 184, 194, 0.05)",padding:"1rem",borderRadius:"8px",border:"1px solid rgba(170, 184, 194, 0.2)",marginBottom:"1.5rem",textAlign:"left",fontSize:"0.9rem"},children:[e.jsxs("p",{style:{color:"#aab8c2",fontWeight:"bold",marginBottom:"0.3rem",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(c,{size:16})," BİLGİ & KONTROLLER:"]}),e.jsx("p",{style:{color:"#ff6666",fontSize:"0.8rem",fontStyle:"italic",marginBottom:"1rem"},children:"⚠️ Uyarı: Oyun boyutu yüksektir, yüklenmesi birkaç dakika sürebilir."}),e.jsxs("ul",{style:{color:"#bbb",margin:0,paddingLeft:"1.2rem",fontSize:"0.8rem"},children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Ok Tuşları:"})," Hareket"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Z:"})," Zıplama"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"X:"})," Saldırı"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"C:"})," Dash (İleri Atılma)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"A:"})," Büyü Odaklanma / Cast"]})]})]}),e.jsx("button",{onClick:()=>s(!0),className:"btn btn-primary",style:{width:"100%",padding:"1rem",fontSize:"1.1rem",background:"#aab8c2",color:"#000",fontWeight:"bold",borderRadius:"12px",border:"none"},children:"HALLOWNEST'E İN"})]})})})}export{h as default};
