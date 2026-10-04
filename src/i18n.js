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
            "nav_about": "about",
            "nav_timeline": "experience.json",
            "nav_arcade": "arcade.exe",
            "nav_contact": "contact",

            // ── Hero ──────────────────────────────────────────────────────
            "badge_hire": "Available for opportunities",
            "hero_name": "SIRAÇ GÖKTUĞ ŞİMŞEK",
            "hero_title": "Game Developer & Systems Engineer",
            "hero_tagline": "Digital Game Design student at Istanbul Kultur University focused on interactive systems and gameplay architecture. Engineering responsive physics mechanics, optimized 3D pipelines, and native software with Unity, C#, and Blender.",
            "hero_location": "İstanbul, TR",
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
            "about_subtitle": "GAME DEVELOPER & INTERACTIVE SYSTEMS",
            "about_bio_heading": "Biography",
            "about_stats_heading": "Overview",
            "about_text_1": "I'm Siraç Göktuğ Şimşek — a game developer based in İstanbul. I build interactive software and games across Unity and C#, with a focus on gameplay programming, mechanics design, and optimized 3D pipelines.",
            "about_text_2": "I study Digital Game Design at Istanbul Kultur University (completed 1st year). My work focuses on creating responsive game mechanics and clean, maintainable systems.",
            "about_text_3": "I thrive at the intersection of game systems engineering and creative art — from writing clean gameplay scripts to real-time engine optimization.",
            "about_stat_1": "Education",
            "about_stat_1_val": "IKU — Game Design (1st Year Completed)",
            "about_stat_2": "Primary Stack",
            "about_stat_2_val": "Unity · C# · Blender",
            "about_stat_3": "Shipped Projects",
            "about_stat_3_val": "3+ Shipped Projects",
            "about_stat_4": "Availability",
            "about_stat_4_val": "Open to Internship & Junior Roles",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "Skills",
            "skills_subtitle": "Technical proficiency across engines, languages and tools.",
            "skill_level_advanced": "Advanced",
            "skill_level_intermediate": "Intermediate",
            "skill_unity_desc": "Advanced C# scripting, URP/HDRP render pipelines, physics-based character controllers, and shader graphs.",
            "skill_languages_desc": "Object-oriented gameplay architecture in C#, native macOS applications in SwiftUI, and responsive frontends in React.",
            "skill_blender_desc": "Hard-surface 3D modeling, UV unwrapping, and low-poly asset optimization for real-time engines.",
            "skill_cat_engines": "Game Engines & Pipelines",
            "skill_cat_languages": "Languages & Frameworks",
            "skill_cat_tools": "3D Design & Developer Tools",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "Education & Journey",
            "timeline_subtitle": "Academic background and engineering milestones.",
            "timeline_event_3_year": "2025 – PRESENT",
            "timeline_event_3_title": "B.Sc. Digital Game Design — Istanbul Kultur University",
            "timeline_event_3_desc": "Studying interactive software architecture, real-time rendering pipelines, gameplay systems, and editor tooling.",
            "timeline_event_3_details": ["Completed 1st year with honors", "Coursework in Unity C# scripting, low-poly Blender modeling, URP lighting bakes", "Designed gameplay architecture prototypes for multiple platformer and physics sandbox projects"],
            "timeline_event_2_year": "2023 – 2025",
            "timeline_event_2_title": "Game Development & Apple Developer Certifications",
            "timeline_event_2_desc": "Completed self-taught game engineering curricula and native iOS/macOS utility development courses.",
            "timeline_event_2_details": ["Acquired advanced Unity Game Development credentials (C#, physics, shaders)", "Completed native SwiftUI/AppKit desktop app development certifications", "Engineered and published experimental open-source macOS menu-bar tools"],
            "timeline_event_1_year": "2020 – 2024",
            "timeline_event_1_title": "High School Graduation — Science & Math Focus",
            "timeline_event_1_desc": "Graduated with a focus on advanced mathematics, physics, and computer science foundations.",
            "timeline_event_1_details": ["Formed foundational logic, algorithms, and 3D coordinate system principles", "Built first desktop utility tools and learned basic C# coding paradigms", "Participated in regional math olympiad tournaments"],

            // ── Projects ──────────────────────────────────────────────────
            "archives_title": "Projects",
            "archives_subtitle": "Featured games, applications, and tools.",

            // ── GitHub Activity ───────────────────────────────────────────
            "github_section_title": "Commit Activity",
            "github_section_subtitle": "Real-time contribution calendar and commit history from @unitybtw.",
            "github_badge_live": "LIVE FROM GITHUB",
            "github_filter_all": "All Repositories",
            "github_view_profile": "View @unitybtw on GitHub",
            "github_commit_hash": "Commit",
            "github_synced_desc": "Auto-synced with GitHub REST API across active public repositories.",

            // ── Arcade ────────────────────────────────────────────────────
            "arcade_button": "Playground",
            "arcade_title": "Arcade & Retro Ports",
            "arcade_subtitle": "Play 75+ browser games and retro ports with zero ads.",
            "arcade_btn": "EXPLORE ARCADE",
            "arcade_portal_badge": "75+ GAMES · GLOBAL LEADERBOARD",
            "arcade_portal_desc": "Zero install, zero ads. Jump into 3D retro classics (GTA Vice City, Half-Life, Quake III, Minecraft) and responsive custom arcade games right in your browser.",
            "arcade_portal_explore": "Open Arcade Library",
            "arcade_portal_shuffle": "Quick Play",
            "arcade_inside_title": "Arcade Library",
            "arcade_inside_sub": "75+ Playable Web Ports & Arcade Modules",
            "arcade_play": "PLAY",
            "arcade_exit": "EXIT",
            "arcade_fullscreen": "FULLSCREEN",
            "arcade_minimize": "MINIMIZE",
            "arcade_restart": "RESTART",
            "arcade_back_to_library": "Back to Games",
            "arcade_set_nickname": "Player Identity",
            "arcade_nickname_sub": "Choose your gamertag to save and compare high scores on the global leaderboard.",
            "arcade_save_continue": "START PLAYING",
            "arcade_enter_name": "Enter gamertag...",
            "arcade_gen_random": "Random Tag",
            "arcade_scoreboard": "HALL OF FAME",
            "arcade_games": "GAMES",
            "arcade_section_title": "Arcade & Game Library",
            "arcade_section_subtitle": "75+ ad-free, instantly playable retro 3D ports and indie games right in your browser.",
            "arcade_cat_all": "All Games",
            "arcade_cat_simulation": "3D & Retro Ports",
            "arcade_cat_arcade": "Action Arcade",
            "arcade_cat_puzzle": "Puzzles & Logic",
            "arcade_search_placeholder": "Search 75+ games...",
            "arcade_random_pick": "Shuffle",
            "arcade_personal_best": "Personal Best",
            "arcade_ready": "READY",
            "arcade_no_games": "No games found matching your search",
            "arcade_reset_filters": "Reset Filters",
            "arcade_top_records": "Global Hall of Fame",
            "arcade_my_records": "My Best Records",
            "arcade_connected_as": "Player:",
            "arcade_edit_name": "Edit",
            "arcade_filter_game": "Filter by Game",
            "arcade_loading_game": "Loading game...",

            // ── Contact / Footer ──────────────────────────────────────────
            "footer_title": "Contact",
            "footer_subtitle": "Available for game development roles and internship opportunities.",
            "footer_copyright": "SIRAÇ GÖKTUĞ ŞİMŞEK · OPEN TO WORK",
            "btn_transmit": "Send Message",
            "form_name": "Name",
            "form_email": "Email Address",
            "form_message": "Message",
            "form_submit": "Send Message",
            "form_sending": "Sending...",
            "form_success": "Message sent successfully! I will get back to you soon.",
            "form_error": "Something went wrong. Please try again or email me directly at sgoktug34@gmail.com.",
            "form_placeholder_name": "Your Name",
            "form_placeholder_email": "your.email@example.com",
            "form_placeholder_message": "Write your message here...",

            // ── Projects descriptions ─────────────────────────────────────
            "games": {
                "nova_title": "Nova Browser",
                "nova_desc": "An open-source desktop browser for developers built with Electron, React, TypeScript, and Vite. Features a native Model Context Protocol (MCP) server, on-device WebGPU execution, zero-knowledge E2EE multi-device sync, Chrome extension support, and dual-view split screen.",
                "m_title": "Legend of the Three Masks",
                "m_desc": "3D adventure game published on Itch.io — explore levels, find ancient masks, and solve environmental puzzles. Developed in Unity and C#.",
                "signal_title": "Signal: Audio Feedback Utility",
                "signal_desc": "A premium macOS menu bar application providing real-time mechanical keyboard audio feedback (15+ sound profiles) with a refined native UI, dynamic audio visualizer, and WPM analytics. Built with Swift and Core Audio.",
                "aether_title": "Aether Command: Gesture Controller",
                "aether_desc": "Touchless gesture-based desktop control app using your Mac's camera. Map movements (Pinch, Fist, Swipes) to system actions. Built with power-efficient tracking and a native AppKit interface.",
                "badge_released": "RELEASED",
                "badge_open_source": "OPEN SOURCE"
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
            "nav_about": "hakkımda",
            "nav_timeline": "experience.json",
            "nav_arcade": "arcade.exe",
            "nav_contact": "İletişim",

            // ── Hero ──────────────────────────────────────────────────────
            "badge_hire": "İş ve staj fırsatlarına açık",
            "hero_name": "SİRAÇ GÖKTUĞ ŞİMŞEK",
            "hero_title": "Oyun Geliştirici & Sistem Mühendisi",
            "hero_tagline": "İstanbul Kültür Üniversitesi Dijital Oyun Tasarımı öğrencisi. Unity, C# ve Blender odaklı; akıcı oynanış mekanikleri, optimize edilmiş 3D render pipeline'ları ve etkileşimli yazılımlar geliştiriyorum.",
            "hero_location": "İstanbul, TR",
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
            "about_subtitle": "OYUN GELİŞTİRİCİ & ETKİLEŞİMLİ SİSTEMLER",
            "about_bio_heading": "Biyografi",
            "about_stats_heading": "Genel Bakış",
            "about_text_1": "Ben Siraç Göktuğ Şimşek — İstanbul'da yaşayan bir oyun geliştiricisiyim. Unity ve C# odaklı; oynanış programlama, mekanik mimarisi ve optimize edilmiş 3D pipeline'lar üzerine çalışıyorum.",
            "about_text_2": "İstanbul Kültür Üniversitesi Dijital Oyun Tasarımı bölümü öğrencisiyim (1. sınıfı tamamladım). Çalışmalarım akıcı oyun hissi ve temiz, sürdürülebilir kod mimarisi inşa etmeye odaklanır.",
            "about_text_3": "Oyun mekaniği mühendisliği ile görsel sanatın kesişiminde üretiyorum — temiz C# kodlarından oyun motoru optimizasyonuna kadar.",
            "about_stat_1": "Eğitim",
            "about_stat_1_val": "İKÜ — Dijital Oyun Tasarımı (1. Sınıf Tamamlandı)",
            "about_stat_2": "Temel Araçlar",
            "about_stat_2_val": "Unity · C# · Blender",
            "about_stat_3": "Tamamlanan Projeler",
            "about_stat_3_val": "3+ Yayınlanmış Proje",
            "about_stat_4": "Çalışma Durumu",
            "about_stat_4_val": "Staj ve Junior Rollerine Açık",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "Beceriler",
            "skills_subtitle": "Oyun motorları, programlama dilleri ve 3D araçlardaki yetkinlikler.",
            "skill_level_advanced": "İleri Seviye",
            "skill_level_intermediate": "Orta Seviye",
            "skill_unity_desc": "İleri düzey C# kodlama, URP/HDRP render pipeline yapıları, fizik tabanlı karakter kontrolcüleri ve shader graph sistemleri.",
            "skill_languages_desc": "C# ile nesne yönelimli oyun mekanikleri mimarisi, SwiftUI ile native macOS masaüstü araçları ve React ile arayüz geliştirme.",
            "skill_blender_desc": "Hard-surface 3D modelleme, UV haritalama ve oyun motorları için low-poly optimizasyonu.",
            "skill_cat_engines": "Oyun Motorları & Pipeline",
            "skill_cat_languages": "Diller & Teknolojiler",
            "skill_cat_tools": "3D Tasarım & Geliştirici Araçları",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "Eğitim & Yolculuk",
            "timeline_subtitle": "Akademik geçmiş ve gelişim süreci.",
            "timeline_event_3_year": "2025 – GÜNÜMÜZ",
            "timeline_event_3_title": "Lisans: Dijital Oyun Tasarımı — İstanbul Kültür Üniversitesi",
            "timeline_event_3_desc": "Etkileşimli yazılım mimarisi, render pipeline yapısı, oyun mekanikleri ve editör araçları üzerine lisans eğitimi.",
            "timeline_event_3_details": ["1. sınıfı yüksek başarı ortalamasıyla tamamladı", "Unity C# scripting, Blender ile low-poly modelleme ve URP ışık fırınlama dersleri", "Farklı platform ve fizik tabanlı sandbox oyun projeleri için oynanış mekaniği prototipleri tasarladı"],
            "timeline_event_2_year": "2023 – 2025",
            "timeline_event_2_title": "Oyun Geliştirme & Apple Geliştirici Sertifikaları",
            "timeline_event_2_desc": "Bireysel çalışmalar ile oyun mühendisliği müfredatları ve native iOS/macOS araç geliştirme eğitimlerinin tamamlanması.",
            "timeline_event_2_details": ["İleri düzey Unity Oyun Geliştirme sertifikaları (C#, fizik motoru, shader)", "Native SwiftUI/AppKit macOS masaüstü uygulama geliştirme eğitimleri", "Deneysel, açık kaynaklı macOS menü çubuğu araçları geliştirdi ve paylaştı"],
            "timeline_event_1_year": "2020 – 2024",
            "timeline_event_1_title": "Lise Mezuniyeti — Sayısal Ağırlıklı",
            "timeline_event_1_desc": "Temel algoritma, fizik, ileri matematik ve bilgisayar bilimleri temelleriyle lise mezuniyeti.",
            "timeline_event_1_details": ["Algoritma mantığı ve 3B kartezyen koordinat sistemleri temel prensiplerini kavradı", "İlk masaüstü araçlarını geliştirdi ve C# yazılım dili temellerini öğrendi", "Bölgesel matematik olimpiyatı turnuvalarına katıldı"],

            // ── Projects ──────────────────────────────────────────────────
            "archives_title": "Projeler",
            "archives_subtitle": "Öne çıkan oyunlar, uygulamalar ve araçlar.",

            // ── GitHub Activity ───────────────────────────────────────────
            "github_section_title": "GitHub Katkı Haritası",
            "github_section_subtitle": "@unitybtw hesabı altındaki güncel kod commit'leri ve geliştirme akışı.",
            "github_badge_live": "GITHUB CANLI AKIŞ",
            "github_filter_all": "Tüm Repolar",
            "github_view_profile": "GitHub'da @unitybtw Profilini Gör",
            "github_commit_hash": "Commit",
            "github_synced_desc": "Açık kaynaklı repolardan GitHub REST API ile anlık senkronize edilir.",

            // ── Arcade ────────────────────────────────────────────────────
            "arcade_button": "Oyun Alanı",
            "arcade_title": "Arcade & Retro Portlar",
            "arcade_subtitle": "Sıfır reklamla 75+ tarayıcı oyunu ve retro port.",
            "arcade_btn": "KÜTÜPHANEYİ AÇ",
            "arcade_portal_badge": "75+ OYUN · DÜNYA SKOR TABLOSU",
            "arcade_portal_desc": "Sıfır kurulum, sıfır reklam. Retro 3D klasikler (GTA Vice City, Half-Life, Quake III, Minecraft) ve hafif arcade oyunları tarayıcında anında oyna.",
            "arcade_portal_explore": "Kütüphaneyi Keşfet",
            "arcade_portal_shuffle": "Rastgele Başlat",
            "arcade_inside_title": "Oyun Kütüphanesi",
            "arcade_inside_sub": "75+ Oynanabilir Web Portu ve Arcade Modülü",
            "arcade_play": "OYNA",
            "arcade_exit": "ÇIKIŞ",
            "arcade_fullscreen": "TAM EKRAN",
            "arcade_minimize": "KÜÇÜLT",
            "arcade_restart": "YENİDEN BAŞLAT",
            "arcade_back_to_library": "Kütüphaneye Dön",
            "arcade_set_nickname": "Oyuncu Kimliği",
            "arcade_nickname_sub": "Skorlarını dünya sıralamasına kaydetmek için bir kullanıcı adı belirle.",
            "arcade_save_continue": "OYUNA BAŞLA",
            "arcade_enter_name": "Kullanıcı adı girin...",
            "arcade_gen_random": "Rastgele",
            "arcade_scoreboard": "SKOR TABLOSU",
            "arcade_games": "OYUNLAR",
            "arcade_section_title": "Oyun Kütüphanesi & Retro Portlar",
            "arcade_section_subtitle": "Tarayıcıda anında oynanabilir reklamsız 75+ retro 3D port ve bağımsız oyun.",
            "arcade_cat_all": "Tümü",
            "arcade_cat_simulation": "3D & Retro Portlar",
            "arcade_cat_arcade": "Klasik Arcade",
            "arcade_cat_puzzle": "Bulmaca & Mantık",
            "arcade_search_placeholder": "75+ oyun içinde ara...",
            "arcade_random_pick": "Rastgele",
            "arcade_personal_best": "Kişisel Rekor",
            "arcade_ready": "HAZIR",
            "arcade_no_games": "Arama kriterlerine uygun oyun bulunamadı",
            "arcade_reset_filters": "Filtreleri Sıfırla",
            "arcade_top_records": "Dünya Sıralaması",
            "arcade_my_records": "Kişisel Rekorlarım",
            "arcade_connected_as": "Oyuncu:",
            "arcade_edit_name": "Düzenle",
            "arcade_filter_game": "Oyuna Göre Filtrele",
            "arcade_loading_game": "Oyun yükleniyor...",

            // ── Contact / Footer ──────────────────────────────────────────
            "footer_title": "İletişim",
            "footer_subtitle": "Oyun geliştirme rolleri ve staj fırsatlarına açığım.",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK · İŞE AÇIK",
            "btn_transmit": "Mesaj Gönder",
            "form_name": "İsim",
            "form_email": "E-posta Adresi",
            "form_message": "Mesaj",
            "form_submit": "Mesaj Gönder",
            "form_sending": "Gönderiliyor...",
            "form_success": "Mesajınız başarıyla gönderildi! En kısa sürede geri dönüş yapacağım.",
            "form_error": "Bir hata oluştu. Lütfen tekrar deneyin veya doğrudan sgoktug34@gmail.com adresinden bana e-posta gönderin.",
            "form_placeholder_name": "Adınız Soyadınız",
            "form_placeholder_email": "e-posta.adresiniz@ornek.com",
            "form_placeholder_message": "Mesajınızı buraya yazın...",

            // ── Projects descriptions ─────────────────────────────────────
            "games": {
                "nova_title": "Nova Browser",
                "nova_desc": "Geliştiriciler için Electron, React, TypeScript ve Vite ile geliştirilmiş açık kaynaklı masaüstü web tarayıcısı. Dahili Model Context Protocol (MCP) sunucusu, cihaz üzerinde WebGPU yapay zeka çalıştırma, sıfır-bilgi (E2EE) cihazlar arası bulut senkronizasyonu, Chrome eklenti desteği ve çift ekran bölünmüş görünüm sunar.",
                "m_title": "Legend of the Three Masks",
                "m_desc": "Itch.io üzerinde yayınlanmış 3D macera oyunu — bölümleri keşfet, antik maskeleri bul ve bulmacaları çöz. Unity ve C# ile geliştirildi.",
                "signal_title": "Signal: Tuş Sesi Geri Bildirimi",
                "signal_desc": "Yazdığın her tuşa gerçek zamanlı mekanik klavye ses geri bildirimi veren (15+ ses profili), akıcı modern arayüzlü ve WPM takipli macOS menü çubuğu uygulaması. Native Swift ve Core Audio ile geliştirildi.",
                "aether_title": "Aether Command: Hareket Denetleyici",
                "aether_desc": "Mac kamerasını kullanarak sistemi el hareketleriyle (Pinch, Fist, Swipes) yönetmeni sağlayan native macOS uygulaması. Düşük güç tüketimli görüntü işleme motoru ve modern masaüstü arayüzüne sahiptir.",
                "badge_released": "YAYINDA",
                "badge_open_source": "AÇIK KAYNAK"
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
