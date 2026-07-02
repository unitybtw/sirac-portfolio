import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const LINKEDIN_URL = 'https://www.linkedin.com/in/sira%C3%A7-g%C3%B6ktu%C4%9F-%C5%9Fim%C5%9Fek-a5a7a735a';

export { LINKEDIN_URL };

const resources = {
    en: {
        translation: {
            // ── Navigation ────────────────────────────────────────────────
            "nav_name": "SIRAÇ G. ŞİMŞEK.",
            "nav_name_mobile": "SIRAÇ.",
            "nav_work": "projects.git",
            "nav_skills": "skills.css",
            "nav_about": "about.jsx",
            "nav_timeline": "experience.json",
            "nav_arcade": "arcade.exe",
            "nav_contact": "contact.sh",

            // ── Hero ──────────────────────────────────────────────────────
            "badge_hire": "OPEN TO OPPORTUNITIES",
            "hero_title_1": "GAME DEVELOPER & ",
            "hero_title_2": "UI ENGINEER",
            "hero_subtitle_1": "Unity · SwiftUI · React · Blender",
            "hero_subtitle_2": "Digital Game Design @ Istanbul Kultur University",
            "btn_explore": "View Projects",
            "btn_repos": "GitHub",
            "btn_view_cv": "Download CV",
            "scroll_down": "SCROLL DOWN",

            // ── CV Modal ──────────────────────────────────────────────────
            "cv_modal_title": "Curriculum Vitae",
            "cv_print_btn": "Print / Save PDF",
            "cv_close_btn": "Close",

            // ── About / Summary ───────────────────────────────────────────
            "about_title": "// 01. <About />",
            "about_subtitle": "PROFESSIONAL SUMMARY",
            "about_text_1": "I'm Siraç Göktuğ Şimşek — a game developer and UI engineer based in İstanbul. I build interactive software across Unity, SwiftUI, and React, with a focus on performance, clean architecture, and polished UX.",
            "about_text_2": "Currently pursuing a B.Sc. in Digital Game Design at Istanbul Kultur University. My work spans native macOS utilities, 3D game titles published on Itch.io, and browser-based interactive platforms using WebGL and Canvas.",
            "about_text_3": "I thrive at the intersection of systems engineering and creative design — from writing shader code in HLSL to crafting glassmorphic SwiftUI interfaces. Always shipping, always iterating.",
            "about_stat_1": "Education",
            "about_stat_1_val": "IKU — Game Design",
            "about_stat_2": "Primary Stack",
            "about_stat_2_val": "Unity · C# · SwiftUI",
            "about_stat_3": "Published Projects",
            "about_stat_3_val": "4+ Shipped Titles",
            "about_stat_4": "Status",
            "about_stat_4_val": "Open to Work",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "// 04. <Skills />",
            "skills_subtitle": "Technical proficiency across engines, languages and tools.",
            "skill_sys": "System Architecture",
            "skill_unity_desc": "Advanced C# scripting, URP/HDRP render pipelines, physics-based systems, shader graphs. 3+ shipped Unity titles.",
            "skill_swift_desc": "Native macOS app development with SwiftUI and Combine. Premium glassmorphism UI focus.",
            "skill_blender_desc": "Hard-surface modeling, procedural texturing, and low-poly optimization for real-time game engines.",
            "skill_sys_desc": "Modular React frontend architecture, Firebase real-time DB integration, WebGL canvas rendering.",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "// 02. <Experience />",
            "timeline_subtitle": "Professional development history.",
            "timeline_event_1_year": "2021 – PRESENT",
            "timeline_event_1_title": "Freelance Unity Developer",
            "timeline_event_1_desc": "Building game mechanics, shaders, and physics systems in Unity/C#. Multiple titles published on Itch.io — 500+ downloads combined.",
            "timeline_event_2_year": "2022 – PRESENT",
            "timeline_event_2_title": "macOS Native App Developer",
            "timeline_event_2_desc": "Designing lightweight, high-performance macOS utilities using SwiftUI and Combine. Focus on premium glassmorphism UI patterns.",
            "timeline_event_3_year": "2023 – PRESENT",
            "timeline_event_3_title": "B.Sc. Digital Game Design — IKU",
            "timeline_event_3_desc": "Istanbul Kultur University. Coursework in game engine architecture, 3D art pipelines, game theory, and interactive systems design.",
            "timeline_event_4_year": "2024 – PRESENT",
            "timeline_event_4_title": "Frontend & UI Engineer",
            "timeline_event_4_desc": "Architecting modular React SPAs, custom WebGL integration layers, and Tokyo Night-themed design systems. Delivered this CV site.",

            // ── Projects ──────────────────────────────────────────────────
            "archives_title": "// 03. <Projects />",
            "archives_subtitle": "Selected shipped work — click to view.",

            // ── Featured modules ──────────────────────────────────────────
            "featured_title": "// 03. <Builds />",
            "featured_subtitle": "50+ interactive browser games integrated into the platform.",

            // ── Stats / Telemetry ─────────────────────────────────────────
            "stats_title": "SYSTEM TELEMETRY",
            "stats_games": "50+ Games Built",
            "stats_lines": "15,000+ Lines Written",
            "stats_uptime": "100% Uptime",
            "stats_users": "Live Visitors",

            // ── Status Bar ────────────────────────────────────────────────
            "status_level": "STATUS: OPEN TO WORK · IKU SOPHOMORE",
            "status_quest": "Current Focus: Advanced Game Systems · React Architecture · SwiftUI",

            // ── Arcade ────────────────────────────────────────────────────
            "arcade_button": "Playground",
            "arcade_title": "Arcade Library",
            "arcade_subtitle": "50 custom HTML5 Canvas games.",
            "arcade_btn": "ARCADE LIBRARY",
            "arcade_inside_title": "The Playground",
            "arcade_inside_sub": "50 Interactive Modules",
            "arcade_play": "PLAY",
            "arcade_exit": "EXIT",
            "arcade_set_nickname": "Set Pilot Identity",
            "arcade_save_continue": "AUTHORIZE & CONNECT",
            "arcade_scoreboard": "LEADERBOARD",
            "arcade_games": "LIBRARY",
            "arcade_section_title": "// 05. <Playground />",
            "arcade_section_subtitle": "50 custom-coded browser games — keyboard & mouse required.",

            // ── Contact / Footer ──────────────────────────────────────────
            "footer_title": "// 06. <Contact />",
            "footer_subtitle": "Available for freelance, internships, and full-time roles.",
            "footer_copyright": "SIRAÇ GÖKTUĞ ŞİMŞEK · OPEN TO WORK",
            "btn_transmit": "Send Message",

            // ── 3D Viewer ─────────────────────────────────────────────────
            "viewer_title": "Interactive 3D Workspace",
            "viewer_subtitle": "Real-time Blender artifacts — drag to rotate.",
            "viewer_hint": "Drag to rotate | Scroll to zoom",

            // ── Drone companion messages ───────────────────────────────────
            "drone_m_morning": "Good morning! Ready to build something?",
            "drone_m_afternoon": "Good afternoon! Systems online.",
            "drone_m_evening": "Good evening! Still shipping?",
            "drone_m_night": "Late night session? Same.",
            "drone_c_github": "Open source is the way.",
            "drone_c_linkedin": "Professional network engaged.",
            "drone_c_mail": "Communication protocols ready.",
            "drone_c_game": "Nice game! Try playing it.",
            "drone_c_project": "Solid architecture right here.",
            "drone_c_click": "Let's see what this does!",
            "drone_s_bottom": "Bottom of the mainframe reached.",
            "drone_s_top": "Back to the top.",
            "drone_scan_start": "Deep scan initiated... Stand by.",
            "drone_scan_complete": "Scan complete. All clear.",
            "drone_battery_low": "Battery at 15%. Saving power.",
            "drone_reboot": "Rebooting systems...",
            "drone_click_1": "Diagnostics: 100% efficient.",
            "drone_click_2": "Mechanical interference detected.",
            "drone_click_3": "Scanning for hidden protocols...",
            "drone_click_4": "WARNING: AI CORE OVERHEATING.",
            "drone_click_5": "Security engaged. Stand down.",
            "drone_tooltip": "Click to interact · Double-click to scan · 3x for root terminal",
            "drone_idle": [
                "Need help debugging?",
                "That game looks fun.",
                "Monitoring your CPU...",
                "Running telemetry.",
                "Try Neon 2048!",
                "50 games in the library.",
                "Analyzing component load...",
                "Hover over things.",
                "High skill levels detected.",
                "Unity + C# = great combo.",
                "Running at 60fps.",
                "Awaiting input."
            ],

            // ── Game titles & descriptions ────────────────────────────────
            "games": {
                "m_title": "Legend of the Three Masks",
                "m_desc": "3D adventure game published on Itch.io — explore levels, find ancient masks, uncover mysteries. Unity / C#.",
                "fb_desc": "Classic arcade-style reflex game with high-score tracking and tight gameplay loops. Unity / C# / 2D.",
                "macos_title": "macOS Glassmorphic Utilities",
                "macos_desc": "Lightweight native macOS utility suite built with SwiftUI and Combine. Premium glassmorphism UI design.",
                "arcade_title": "Cyber Arcade Core",
                "arcade_desc": "Browser-based interactive platform hosting 50 custom HTML5 Canvas games. Built with React and modern CSS."
            },

            // ── Game UI strings ───────────────────────────────────────────
            "game_common": {
                "controls": "CONTROLS:",
                "loading": "LOADING...",
                "downloading": "DOWNLOADING...",
                "start": "START",
                "launch": "LAUNCH",
                "enter": "ENTER",
                "back": "BACK",
                "fullscreen": "FULLSCREEN"
            },
            "game_launch": {
                "doom_btn": "ENTER HELL",
                "doom_note": "Click START when game loads.",
                "doom_wasd": "Move",
                "doom_fire": "Fire",
                "doom_open": "Open Doors",
                "doom_weapon": "Change Weapon",
                "vc_downloading": "DOWNLOADING GAME FILES... (800MB)",
                "vc_btn": "START GAME",
                "vc_wasd": "Move / Drive",
                "vc_mouse": "Look / Aim",
                "vc_lmb": "Fire / Attack",
                "vc_f": "Enter / Exit Vehicle",
                "vc_space": "Jump / Handbrake",
                "vc_climb": "Climb",
                "subway_mouse": "Drag to Move & Jump",
                "subway_space": "Hoverboard",
                "hl_wasd": "Move",
                "hl_lmb": "Fire",
                "hl_r": "Reload",
                "hl_space": "Jump",
                "hl_ctrl": "Crouch"
            },
            "boot": {
                "mounting": "MOUNTING SYSTEM KERNEL...",
                "arcade": "LOADING ARCADE MODULES...",
                "drone": "WAKING UP COMPANION DRONE...",
                "matrix": "INITIALIZING MATRIX BACKGROUND...",
                "graphics": "OPTIMIZING GRAPHICS ENGINE...",
                "ready": "SYSTEM OPERATIONAL.",
                "access": "ACCESS GRANTED"
            }
        }
    },
    tr: {
        translation: {
            // ── Navigation ────────────────────────────────────────────────
            "nav_name": "SİRAÇ G. ŞİMŞEK.",
            "nav_name_mobile": "SİRAÇ.",
            "nav_work": "projects.git",
            "nav_skills": "skills.css",
            "nav_about": "about.jsx",
            "nav_timeline": "experience.json",
            "nav_arcade": "arcade.exe",
            "nav_contact": "contact.sh",

            // ── Hero ──────────────────────────────────────────────────────
            "badge_hire": "İŞ TEKLİFLERİNE AÇIK",
            "hero_title_1": "OYUN GELİŞTİRİCİ & ",
            "hero_title_2": "ARAYÜZ MÜHENDİSİ",
            "hero_subtitle_1": "Unity · SwiftUI · React · Blender",
            "hero_subtitle_2": "Dijital Oyun Tasarımı @ İstanbul Kültür Üniversitesi",
            "btn_explore": "Projeleri Gör",
            "btn_repos": "GitHub",
            "btn_view_cv": "CV İndir",
            "scroll_down": "AŞAĞI KAYDIR",

            // ── CV Modal ──────────────────────────────────────────────────
            "cv_modal_title": "Özgeçmiş",
            "cv_print_btn": "Yazdır / PDF Kaydet",
            "cv_close_btn": "Kapat",

            // ── About / Summary ───────────────────────────────────────────
            "about_title": "// 01. <Hakkımda />",
            "about_subtitle": "PROFESYONEL ÖZET",
            "about_text_1": "Ben Siraç Göktuğ Şimşek — İstanbul merkezli bir oyun geliştiricisi ve arayüz mühendisiyim. Unity, SwiftUI ve React üzerinde; performans, temiz mimari ve kaliteli kullanıcı deneyimine odaklanarak yazılım geliştiriyorum.",
            "about_text_2": "İstanbul Kültür Üniversitesi'nde Dijital Oyun Tasarımı lisans öğrencisiyim. Çalışmalarım; native macOS araçlarını, Itch.io'da yayınlanmış 3D oyun projelerini ve WebGL + Canvas kullanan tarayıcı tabanlı platformları kapsıyor.",
            "about_text_3": "Sistem mühendisliği ile yaratıcı tasarımın kesişiminde çalışıyorum — HLSL ile shader yazarken bir yandan SwiftUI'da glassmorphism arayüzler tasarlıyorum. Her zaman üretiyorum, her zaman geliştiriyorum.",
            "about_stat_1": "Eğitim",
            "about_stat_1_val": "İKÜ — Oyun Tasarımı",
            "about_stat_2": "Ana Stack",
            "about_stat_2_val": "Unity · C# · SwiftUI",
            "about_stat_3": "Yayınlanan Projeler",
            "about_stat_3_val": "4+ Tamamlanmış Proje",
            "about_stat_4": "Durum",
            "about_stat_4_val": "İş Tekliflerine Açık",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "// 04. <Beceriler />",
            "skills_subtitle": "Motor, dil ve araçlardaki teknik yetkinlik düzeyleri.",
            "skill_sys": "Sistem Mimarisi",
            "skill_unity_desc": "İleri düzey C# script, URP/HDRP render pipeline, fizik tabanlı sistemler ve shader graph. 3+ yayınlanmış Unity oyunu.",
            "skill_swift_desc": "SwiftUI ve Combine ile native macOS uygulama geliştirme. Premium cam tasarımı (glassmorphism) arayüz odağı.",
            "skill_blender_desc": "Hard-surface modelleme, prosedürel doku ve oyun motorları için low-poly optimizasyonu.",
            "skill_sys_desc": "Modüler React SPA mimarisi, Firebase gerçek zamanlı DB entegrasyonu, WebGL canvas render.",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "// 02. <Deneyim />",
            "timeline_subtitle": "Profesyonel gelişim geçmişi.",
            "timeline_event_1_year": "2021 – GÜNÜMÜZ",
            "timeline_event_1_title": "Freelance Unity Geliştiricisi",
            "timeline_event_1_desc": "Unity/C# ile oyun mekaniği, shader ve fizik sistemi geliştirme. Itch.io'da birden fazla oyun yayınlandı — 500+ toplam indirme.",
            "timeline_event_2_year": "2022 – GÜNÜMÜZ",
            "timeline_event_2_title": "macOS Native Uygulama Geliştiricisi",
            "timeline_event_2_desc": "SwiftUI ve Combine ile hafif, yüksek performanslı macOS yardımcı programları. Premium glassmorphism UI desenleri odağı.",
            "timeline_event_3_year": "2023 – GÜNÜMÜZ",
            "timeline_event_3_title": "Lisans: Dijital Oyun Tasarımı — İKÜ",
            "timeline_event_3_desc": "İstanbul Kültür Üniversitesi. Oyun motoru mimarisi, 3D sanat pipeline'ları, oyun teorisi ve etkileşimli sistem tasarımı dersleri.",
            "timeline_event_4_year": "2024 – GÜNÜMÜZ",
            "timeline_event_4_title": "Frontend & Arayüz Mühendisi",
            "timeline_event_4_desc": "Modüler React SPA'lar, özel WebGL entegrasyon katmanları ve Tokyo Night temalı tasarım sistemleri geliştirdi. Bu CV sitesini teslim etti.",

            // ── Projects ──────────────────────────────────────────────────
            "archives_title": "// 03. <Projeler />",
            "archives_subtitle": "Seçilmiş yayınlanmış çalışmalar — görüntülemek için tıkla.",

            // ── Featured modules ──────────────────────────────────────────
            "featured_title": "// 03. <Yapılar />",
            "featured_subtitle": "Platforma entegre edilmiş 50'den fazla etkileşimli tarayıcı oyunu.",

            // ── Stats / Telemetry ─────────────────────────────────────────
            "stats_title": "SİSTEM TELEMETRİSİ",
            "stats_games": "50+ Oyun Üretildi",
            "stats_lines": "15.000+ Satır Kod",
            "stats_uptime": "%100 Çalışma Süresi",
            "stats_users": "Canlı Ziyaretçi",

            // ── Status Bar ────────────────────────────────────────────────
            "status_level": "DURUM: İŞE AÇIK · İKÜ 2. SINIF",
            "status_quest": "Odak: İleri Oyun Sistemleri · React Mimarisi · SwiftUI",

            // ── Arcade ────────────────────────────────────────────────────
            "arcade_button": "Oyun Alanı",
            "arcade_title": "Arcade Kütüphanesi",
            "arcade_subtitle": "50 özel HTML5 Canvas oyunu.",
            "arcade_btn": "ARCADE KÜTÜPHANESİ",
            "arcade_inside_title": "Oyun Alanı",
            "arcade_inside_sub": "50 Etkileşimli Modül",
            "arcade_play": "OYNA",
            "arcade_exit": "ÇIKIŞ",
            "arcade_set_nickname": "Pilot Kimliği Belirle",
            "arcade_save_continue": "YETKİLENDİR & BAĞLAN",
            "arcade_scoreboard": "SKOR TABLOSU",
            "arcade_games": "KÜTÜPHANE",
            "arcade_section_title": "// 05. <Oyun Alanı />",
            "arcade_section_subtitle": "50 özel tarayıcı oyunu — klavye ve fare gereklidir.",

            // ── Contact / Footer ──────────────────────────────────────────
            "footer_title": "// 06. <İletişim />",
            "footer_subtitle": "Freelance, staj ve tam zamanlı pozisyonlara açığım.",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK · İŞE AÇIK",
            "btn_transmit": "Mesaj Gönder",

            // ── 3D Viewer ─────────────────────────────────────────────────
            "viewer_title": "Etkileşimli 3D Çalışma Alanı",
            "viewer_subtitle": "Gerçek zamanlı Blender eserleri — döndürmek için sürükle.",
            "viewer_hint": "Döndürmek için sürükle | Yakınlaştırmak için kaydır",

            // ── Drone companion messages ───────────────────────────────────
            "drone_m_morning": "Günaydın! Bir şeyler yapalım mı?",
            "drone_m_afternoon": "İyi öğleden sonraları! Sistem aktif.",
            "drone_m_evening": "İyi akşamlar! Hâlâ mı üretiyorsun?",
            "drone_m_night": "Gece mesaisi mi? Anladım.",
            "drone_c_github": "Açık kaynak en iyisi.",
            "drone_c_linkedin": "Profesyonel ağlar devreye alındı.",
            "drone_c_mail": "İletişim protokolleri hazır.",
            "drone_c_game": "Güzel oyun! Oynamayı dene.",
            "drone_c_project": "Sağlam bir mimari.",
            "drone_c_click": "Bakalım ne olacak!",
            "drone_s_bottom": "Ana sistemin dibine ulaşıldı.",
            "drone_s_top": "Başa dönüldü.",
            "drone_scan_start": "Derin tarama başlatıldı... Bekle.",
            "drone_scan_complete": "Tarama tamamlandı. Temiz.",
            "drone_battery_low": "Batarya %15. Güç tasarrufu.",
            "drone_reboot": "Sistem yeniden başlatılıyor...",
            "drone_click_1": "Tanı: %100 verimli.",
            "drone_click_2": "Mekanik müdahale algılandı.",
            "drone_click_3": "Gizli protokoller taranıyor...",
            "drone_click_4": "UYARI: YZ ÇEKİRDEĞİ ISINIYOR.",
            "drone_click_5": "Güvenlik devreye girdi. Dur.",
            "drone_tooltip": "Etkileşim için tıkla · Tarama için çift tıkla · Root terminal için 3x tıkla",
            "drone_idle": [
                "Hata ayıklamaya yardım lazım mı?",
                "Şu oyun çok eğlenceli.",
                "İşlemci sıcaklığını izliyorum...",
                "Telemetri analizi yapılıyor.",
                "Neon 2048 oynamayı dene!",
                "Kütüphanede 50 oyun var.",
                "Sistem yükü analiz ediliyor...",
                "Üstlerine gel, bakalım ne olacak.",
                "Yüksek beceri seviyesi algılandı.",
                "Unity + C# harika bir ikili.",
                "60fps akıcılığında çalışıyor.",
                "Giriş bekleniyor."
            ],

            // ── Game titles & descriptions ────────────────────────────────
            "games": {
                "m_title": "Üç Maskenin Efsanesi",
                "m_desc": "Itch.io'da yayınlanmış 3D macera oyunu — bölümleri keşfet, eski maskeleri bul, gizemleri çöz. Unity / C#.",
                "fb_desc": "Klasik arcade tarzı refleks oyunu, yüksek skor takibi ile. Unity / C# / 2D.",
                "macos_title": "macOS Cam Tasarımlı Araçlar",
                "macos_desc": "SwiftUI ve Combine ile geliştirilen native macOS araç paketi. Premium glassmorphism arayüz tasarımı.",
                "arcade_title": "Sanal Oyun Salonu Portalı",
                "arcade_desc": "React ve modern CSS ile inşa edilmiş, 50 özel HTML5 Canvas oyunu barındıran tarayıcı platformu."
            },

            // ── Game UI strings ───────────────────────────────────────────
            "game_common": {
                "controls": "KONTROLLER:",
                "loading": "YÜKLENİYOR...",
                "downloading": "İNDİRİLİYOR...",
                "start": "BAŞLAT",
                "launch": "BAŞLAT",
                "enter": "GİR",
                "back": "GERİ",
                "fullscreen": "TAM EKRAN"
            },
            "game_launch": {
                "doom_btn": "CEHENNEME GİR",
                "doom_note": "Oyun yüklendiğinde START'a tıkla.",
                "doom_wasd": "Hareket",
                "doom_fire": "Ateş",
                "doom_open": "Kapı Aç",
                "doom_weapon": "Silah Değiştir",
                "vc_downloading": "OYUN DOSYALARI İNDİRİLİYOR... (800MB)",
                "vc_btn": "OYUNU BAŞLAT",
                "vc_wasd": "Hareket / Sürüş",
                "vc_mouse": "Bakış / Nişan",
                "vc_lmb": "Ateş / Saldırı",
                "vc_f": "Araca Bin / İn",
                "vc_space": "Zıpla / El Freni",
                "vc_climb": "Tırman",
                "subway_mouse": "Sürükleyerek Hareket Et & Zıpla",
                "subway_space": "Kaykay",
                "hl_wasd": "Hareket",
                "hl_lmb": "Ateş",
                "hl_r": "Şarjör",
                "hl_space": "Zıpla",
                "hl_ctrl": "Eğil"
            },
            "boot": {
                "mounting": "SİSTEM ÇEKİRDEĞİ YÜKLENİYOR...",
                "arcade": "ARCADE MODÜLLERİ HAZIRLANIYOR...",
                "drone": "REFAKATÇİ DRONE UYANDIRILIYOR...",
                "matrix": "MATRİS ARKAPLANI BAŞLATILIYOR...",
                "graphics": "GRAFİK MOTORU OPTİMİZE EDİLİYOR...",
                "ready": "SİSTEM AKTİF.",
                "access": "ERİŞİM ONAYLANDI"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
