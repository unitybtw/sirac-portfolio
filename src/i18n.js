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
            "nav_contact": "contact",

            // ── Hero ──────────────────────────────────────────────────────
            "badge_hire": "OPEN TO OPPORTUNITIES",
            "hero_title_1": "GAME DEVELOPER",
            "hero_title_2": "",
            "hero_subtitle_1": "Unity · C# · Blender · 3D Design",
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
            "about_title": "About",
            "about_subtitle": "PROFESSIONAL SUMMARY",
            "about_text_1": "I'm Siraç Göktuğ Şimşek — a game developer based in İstanbul. I build interactive software and games across Unity and C#, with a focus on gameplay programming, mechanics design, and optimized 3D pipelines.",
            "about_text_2": "I entered Istanbul Kultur University in 2025 to study Digital Game Design, where I have successfully completed my 1st year. My work focuses on creating responsive game mechanics and clean, maintainable systems.",
            "about_text_3": "I thrive at the intersection of game systems engineering and creative art — from writing clean gameplay scripts to optimization for real-time engines. Always shipping, always iterating.",
            "about_stat_1": "Education",
            "about_stat_1_val": "IKU — Game Design (1st Year Completed)",
            "about_stat_2": "Primary Stack",
            "about_stat_2_val": "Unity · C# · Blender",
            "about_stat_3": "Published Projects",
            "about_stat_3_val": "3+ Shipped Projects",
            "about_stat_4": "Status",
            "about_stat_4_val": "Open to Work",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "Skills",
            "skills_subtitle": "Technical proficiency across engines, languages and tools.",
            "skill_sys": "System Architecture",
            "skill_unity_desc": "Advanced C# scripting, URP/HDRP render pipelines, physics-based systems, shader graphs. Unity game projects.",
            "skill_swift_desc": "Native iOS/macOS layout patterns.",
            "skill_blender_desc": "Hard-surface modeling, procedural texturing, and low-poly optimization for real-time game engines.",
            "skill_sys_desc": "WebGL integration, custom interactive rendering layers.",
            "skill_cat_engines": "Engines & Renderers",
            "skill_cat_languages": "Languages & Frameworks",
            "skill_cat_tools": "3D Design & DevOps",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "Education",
            "timeline_subtitle": "Academic and development history.",
            "timeline_event_3_year": "2025 – PRESENT",
            "timeline_event_3_title": "B.Sc. Digital Game Design — IKU",
            "timeline_event_3_desc": "Entered Istanbul Kultur University in 2025. Successfully completed the 1st year. Coursework in game engine architecture, 3D art pipelines, game theory, and interactive systems design.",

            // ── Projects ──────────────────────────────────────────────────
            "archives_title": "Projects",
            "archives_subtitle": "Selected projects.",

            // ── Featured modules ──────────────────────────────────────────
            "featured_title": "Builds",
            "featured_subtitle": "Interactive browser prototypes.",

            // ── Stats / Telemetry ─────────────────────────────────────────
            "stats_title": "SYSTEM TELEMETRY",
            "stats_games": "Projects Built",
            "stats_lines": "Lines Written",
            "stats_uptime": "100% Uptime",
            "stats_users": "Live Visitors",

            // ── Status Bar ────────────────────────────────────────────────
            "status_level": "STATUS: OPEN TO WORK · IKU 1ST YEAR COMPLETED",
            "status_quest": "Current Focus: Advanced Game Systems · 3D Design",

            // ── Arcade ────────────────────────────────────────────────────
            "arcade_button": "Playground",
            "arcade_title": "Arcade Library",
            "arcade_subtitle": "Canvas games.",
            "arcade_btn": "ARCADE LIBRARY",
            "arcade_inside_title": "The Playground",
            "arcade_inside_sub": "Interactive Modules",
            "arcade_play": "PLAY",
            "arcade_exit": "EXIT",
            "arcade_set_nickname": "Set Identity",
            "arcade_save_continue": "AUTHORIZE",
            "arcade_scoreboard": "LEADERBOARD",
            "arcade_games": "LIBRARY",
            "arcade_section_title": "Playground",
            "arcade_section_subtitle": "Custom-coded browser games.",

            // ── Contact / Footer ──────────────────────────────────────────
            "footer_title": "Contact",
            "footer_subtitle": "Available for game development roles and internship opportunities.",
            "footer_copyright": "SIRAÇ GÖKTUĞ ŞİMŞEK · OPEN TO WORK",
            "btn_transmit": "Send Message",

            // ── 3D Viewer ─────────────────────────────────────────────────
            "viewer_title": "3D Workspace",
            "viewer_subtitle": "Real-time Blender artifacts.",
            "viewer_hint": "Drag to rotate",

            // ── Drone companion messages ───────────────────────────────────
            "drone_m_morning": "Good morning! Ready to build?",
            "drone_m_afternoon": "Good afternoon!",
            "drone_m_evening": "Good evening!",
            "drone_m_night": "Late night session?",
            "drone_c_github": "Open source is the way.",
            "drone_c_linkedin": "Professional network engaged.",
            "drone_c_mail": "Communication protocols ready.",
            "drone_c_game": "Nice gameplay!",
            "drone_c_project": "Solid framework.",
            "drone_c_click": "Let's see!",
            "drone_s_bottom": "Bottom reached.",
            "drone_s_top": "Top reached.",
            "drone_scan_start": "Scanning...",
            "drone_scan_complete": "Scan complete.",
            "drone_battery_low": "Battery low.",
            "drone_reboot": "Rebooting...",
            "drone_click_1": "Diagnostics: 100% efficient.",
            "drone_click_2": "Mechanical interference.",
            "drone_click_3": "Scanning...",
            "drone_click_4": "Warning.",
            "drone_click_5": "Security engaged.",
            "drone_tooltip": "Click to interact",
            "drone_idle": [
                "Awaiting input."
            ],

            // ── Game titles & descriptions ────────────────────────────────
            "games": {
                "m_title": "Legend of the Three Masks",
                "m_desc": "3D adventure game published on Itch.io — explore levels, find ancient masks, and uncover mysteries. Built with Unity and C#.",
                "fb_desc": "Classic arcade-style reflex game with high-score tracking and tight gameplay loops.",
                "macos_title": "macOS Glassmorphic Utilities",
                "macos_desc": "Native macOS utility projects built with SwiftUI. Focus on clean layout patterns.",
                "arcade_title": "Arcade Core",
                "arcade_desc": "Custom browser-based prototypes.",
                "signal_title": "Signal: Audio Feedback Utility",
                "signal_desc": "A premium macOS menu bar application providing real-time mechanical keyboard sound feedback (15+ audio profiles) with a pure glassmorphic UI, dynamic audio pulse visualizer, and WPM analytics. Built with native Swift and low-latency Core Audio.",
                "aether_title": "Aether Command: Gesture Controller",
                "aether_desc": "Touchless gesture-based desktop control app using your Mac's camera. Map movements (Pinch, Fist, Swipes) to system actions. Built with power-efficient tracking and a premium glassmorphic UI.",
                "arcade_engine_title": "Zero-Ads Arcade Engine",
                "arcade_engine_desc": "A lightweight, open-source (MIT) TypeScript engine for embedding ad-free games into any web app. Features built-in gamepad support, multi-touch virtual controls (joysticks/buttons), persistent session analytics, global sound management, and strict origin validation—all under a 50KB footprint."
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
            "nav_contact": "contact",

            // ── Hero ──────────────────────────────────────────────────────
            "badge_hire": "İŞ TEKLİFLERİNE AÇIK",
            "hero_title_1": "OYUN GELİŞTİRİCİ",
            "hero_title_2": "",
            "hero_subtitle_1": "Unity · C# · Blender · 3D Tasarım",
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
            "about_title": "Hakkımda",
            "about_subtitle": "PROFESYONEL ÖZET",
            "about_text_1": "Ben Siraç Göktuğ Şimşek — İstanbul merkezli bir oyun geliştiricisiyim. Unity ve C# kullanarak; oynanış programlama, mekanik tasarımı ve optimize edilmiş 3D pipeline'lar üzerine odaklanarak yazılım geliştiriyorum.",
            "about_text_2": "İstanbul Kültür Üniversitesi'nde Dijital Oyun Tasarımı bölümüne 2025 yılında girdim ve 1. sınıfı başarıyla tamamladım. Çalışmalarım, duyarlı oyun mekanikleri ve temiz, bakımı kolay sistemler oluşturmaya odaklanıyor.",
            "about_text_3": "Oyun sistemleri mühendisliği ile yaratıcı sanatın kesişiminde çalışıyorum — temiz oynanış kodları yazmaktan gerçek zamanlı motorlar için optimizasyona kadar. Her zaman üretiyorum, her zaman geliştiriyorum.",
            "about_stat_1": "Eğitim",
            "about_stat_1_val": "İKÜ — Oyun Tasarımı (1. Sınıf Tamamlandı)",
            "about_stat_2": "Ana Stack",
            "about_stat_2_val": "Unity · C# · Blender",
            "about_stat_3": "Yayınlanan Projeler",
            "about_stat_3_val": "3+ Tamamlanmış Proje",
            "about_stat_4": "Durum",
            "about_stat_4_val": "İş Tekliflerine Açık",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "Beceriler",
            "skills_subtitle": "Teknik yetkinlik seviyeleri.",
            "skill_sys": "Sistem Mimarisi",
            "skill_unity_desc": "İleri düzey C# script, URP/HDRP render pipeline, fizik tabanlı sistemler ve shader graph.",
            "skill_swift_desc": "SwiftUI ile arayüz düzenleri.",
            "skill_blender_desc": "Hard-surface modelleme, prosedürel doku ve oyun motorları için low-poly optimizasyonu.",
            "skill_sys_desc": "WebGL ve canvas render entegrasyonu.",
            "skill_cat_engines": "Oyun & Render Motorları",
            "skill_cat_languages": "Diller & Teknolojiler",
            "skill_cat_tools": "3D Tasarım & Araçlar",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "Eğitim",
            "timeline_subtitle": "Akademik geçmiş ve gelişim süreci.",
            "timeline_event_3_year": "2025 – GÜNÜMÜZ",
            "timeline_event_3_title": "Lisans: Dijital Oyun Tasarımı — İKÜ",
            "timeline_event_3_desc": "İstanbul Kültür Üniversitesi'ne 2025 yılında giriş yaptı. 1. sınıfı başarıyla tamamladı. Oyun motoru mimarisi, 3D sanat pipeline'ları, oyun teorisi ve etkileşimli sistem tasarımı dersleri.",

            // ── Projects ──────────────────────────────────────────────────
            "archives_title": "Projeler",
            "archives_subtitle": "Seçilmiş çalışmalar.",

            // ── Featured modules ──────────────────────────────────────────
            "featured_title": "Yapılar",
            "featured_subtitle": "Tarayıcı prototipleri.",

            // ── Stats / Telemetry ─────────────────────────────────────────
            "stats_title": "SİSTEM TELEMETRİSİ",
            "stats_games": "Üretilen Projeler",
            "stats_lines": "Yazılan Kod",
            "stats_uptime": "%100 Çalışma Süresi",
            "stats_users": "Ziyaretçi",

            // ── Status Bar ────────────────────────────────────────────────
            "status_level": "DURUM: İŞE AÇIK · İKÜ 1. SINIF TAMAMLANDI",
            "status_quest": "Odak: İleri Oyun Sistemleri · 3D Tasarım",

            // ── Arcade ────────────────────────────────────────────────────
            "arcade_button": "Oyun Alanı",
            "arcade_title": "Arcade Kütüphanesi",
            "arcade_subtitle": "Canvas oyunları.",
            "arcade_btn": "ARCADE KÜTÜPHANESİ",
            "arcade_inside_title": "Oyun Alanı",
            "arcade_inside_sub": "Etkileşimli Modüller",
            "arcade_play": "OYNA",
            "arcade_exit": "ÇIKIŞ",
            "arcade_set_nickname": "Kimlik Belirle",
            "arcade_save_continue": "BAĞLAN",
            "arcade_scoreboard": "SKOR TABLOSU",
            "arcade_games": "KÜTÜPHANE",
            "arcade_section_title": "Oyun Alanı",
            "arcade_section_subtitle": "Tarayıcı oyunları.",

            // ── Contact / Footer ──────────────────────────────────────────
            "footer_title": "İletişim",
            "footer_subtitle": "Oyun geliştirme rolleri ve staj fırsatlarına açığım.",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK · İŞE AÇIK",
            "btn_transmit": "Mesaj Gönder",

            // ── 3D Viewer ─────────────────────────────────────────────────
            "viewer_title": "3D Çalışma Alanı",
            "viewer_subtitle": "Gerçek zamanlı Blender modelleri.",
            "viewer_hint": "Döndürmek için sürükle",

            // ── Drone companion messages ───────────────────────────────────
            "drone_m_morning": "Günaydın!",
            "drone_m_afternoon": "Tünaydın!",
            "drone_m_evening": "İyi akşamlar!",
            "drone_m_night": "İyi geceler!",
            "drone_c_github": "Açık kaynak en iyisi.",
            "drone_c_linkedin": "LinkedIn aktif.",
            "drone_c_mail": "E-posta hazır.",
            "drone_c_game": "Güzel oyun!",
            "drone_c_project": "Harika mimari.",
            "drone_c_click": "Bakalım!",
            "drone_s_bottom": "Sonuna ulaşıldı.",
            "drone_s_top": "Başa dönüldü.",
            "drone_scan_start": "Taranıyor...",
            "drone_scan_complete": "Tarama bitti.",
            "drone_battery_low": "Düşük pil.",
            "drone_reboot": "Yeniden başlatılıyor...",
            "drone_click_1": "Sorunsuz çalışıyor.",
            "drone_click_2": "Hata tespiti.",
            "drone_click_3": "Taranıyor...",
            "drone_click_4": "Uyarı.",
            "drone_click_5": "Güvenlik devrede.",
            "drone_tooltip": "Etkileşim için tıkla",
            "drone_idle": [
                "Giriş bekleniyor."
            ],

            // ── Game titles & descriptions ────────────────────────────────
            "games": {
                "m_title": "Üç Maskenin Efsanesi",
                "m_desc": "Itch.io'da yayınlanmış 3D macera oyunu — bölümleri keşfet, eski maskeleri bul, gizemleri çöz. Unity / C#.",
                "fb_desc": "Klasik arcade tarzı refleks oyunu, yüksek skor takibi ile.",
                "macos_title": "macOS Cam Tasarımlı Araçlar",
                "macos_desc": "SwiftUI ile geliştirilen native macOS araç projeleri. Temiz arayüz düzenleri odağı.",
                "arcade_title": "Arcade Portalı",
                "arcade_desc": "Özel tarayıcı prototipleri.",
                "signal_title": "Signal: Tuş Sesi Geri Bildirimi",
                "signal_desc": "Yazdığın her tuşa gerçek zamanlı mekanik klavye ses geri bildirimi veren (15+ ses profili), saf cam arayüzlü (glassmorphism), WPM takipli premium macOS menü çubuğu uygulaması. Native Swift ve düşük gecikmeli Core Audio ile geliştirildi.",
                "aether_title": "Aether Command: Hareket Denetleyici",
                "aether_desc": "Mac kamerasını kullanarak sistemi el hareketleriyle (Pinch, Fist, Swipes) yönetmeni sağlayan native macOS uygulaması. Güç tasarruflu izleme motoru ve premium cam görsel efekt paneline sahiptir.",
                "arcade_engine_title": "Zero-Ads Arcade Engine",
                "arcade_engine_desc": "Herhangi bir web uygulamasına reklamsız oyunlar gömmek için geliştirilmiş hafif, açık kaynaklı (MIT) TypeScript motoru. Entegre gamepad desteği, dokunmatik sanal denetleyiciler (joystick/butonlar), kalıcı oturum analitikleri, ses yönetimi ve iframe güvenlik katmanına sahiptir (50KB altı boyut)."
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
