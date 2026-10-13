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
            "badge_hire": "Available for indie projects & internships",
            "hero_name": "SİRAÇ GÖKTUĞ ŞİMŞEK",
            "hero_title": "Game Developer & Software Engineer",
            "hero_tagline": "I study Digital Game Design at Istanbul Kultur University. I build 3D games in Unity with custom C# physics, desktop software like Nova Browser with Electron and TypeScript, and performant web systems.",
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
            "about_subtitle": "Game development, desktop architectures, and interactive software systems",
            "about_bio_heading": "Biography",
            "about_stats_heading": "Overview",
            "about_text_1": "I build games and software from first principles. Rather than relying on superficial templates, I focus on the actual mechanics under the hood: tuning physics-based character controllers in Unity C# to feel weightless and responsive, writing zero-allocation game loops for WebGL, and architecting desktop software with Electron and TypeScript.",
            "about_text_2": "Currently studying Digital Game Design at Istanbul Kultur University, I spend my days bridging real-time rendering, gameplay systems, and product engineering. My flagship projects range from Nova Browser (an open-source desktop browser with on-device AI and MCP tools) to native macOS utilities in Swift and playable 3D games published on Itch.io.",
            "about_text_3": "I believe great software unites technical rigor with thoughtful craftsmanship. I maintain open-source projects under @unitybtw, prioritize clean and maintainable architecture, and I'm actively seeking game development and software engineering opportunities where I can solve complex technical problems.",
            "about_stat_1": "Education",
            "about_stat_1_val": "IKU: Digital Game Design",
            "about_stat_2": "Core Technologies",
            "about_stat_2_val": "Unity · C# · TypeScript · Electron",
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
            "skill_languages_desc": "Object-oriented gameplay architecture in C#, combined with TypeScript, React, and Electron for performant desktop and web software.",
            "skill_blender_desc": "3D asset modeling in Blender, low-poly engine optimization, and modern developer workflows with Git, GitHub, Node.js, and Vite.",
            "skill_cat_engines": "Game Engines & Pipelines",
            "skill_cat_languages": "Languages & Frameworks",
            "skill_cat_tools": "3D Design & Developer Tools",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "Education & Journey",
            "timeline_subtitle": "Academic background and engineering milestones.",
            "timeline_event_3_year": "2025 – PRESENT",
            "timeline_event_3_title": "B.Sc. Digital Game Design: Istanbul Kultur University",
            "timeline_event_3_desc": "Studying interactive software architecture, real-time rendering pipelines, gameplay systems, and editor tooling.",
            "timeline_event_3_details": [
                "Undergraduate coursework in game mechanics, 3D pipelines, and interactive systems",
                "Hands-on projects in Unity C# scripting, low-poly Blender modeling, and real-time physics",
                "Designed and prototyped responsive gameplay mechanics for 3D adventure and sandbox games"
            ],
            "timeline_event_2_year": "2024 – PRESENT",
            "timeline_event_2_title": "Desktop Engineering & Open-Source Projects",
            "timeline_event_2_desc": "Architecting desktop applications, browser technology, and open-source utilities.",
            "timeline_event_2_details": [
                "Engineered Nova Browser: an open-source desktop browser built with Electron, React, and TypeScript with local AI and MCP integration",
                "Developed native desktop utilities and audio feedback software with responsive interfaces",
                "Maintained public open-source repositories, developer tools, and web applications"
            ],
            "timeline_event_1_year": "2020 – 2024",
            "timeline_event_1_title": "High School Education: Science & Mathematics",
            "timeline_event_1_desc": "Built foundational knowledge in mathematics, physics, and computer science.",
            "timeline_event_1_details": [
                "Established strong foundations in algorithmic thinking, logic, and coordinate mathematics",
                "Started programming in C# and created initial desktop utilities and game prototypes",
                "Developed passion for interactive software and self-directed software development"
            ],

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
            "arcade_subtitle": "Play PC classics and browser game ports.",
            "arcade_btn": "EXPLORE ARCADE",
            "arcade_portal_badge": "RETRO PORTS · GLOBAL LEADERBOARD",
            "arcade_portal_desc": "PC classics, browser ports and playable demos. Pick a game, check its controls, and play in your browser.",
            "arcade_portal_explore": "Open Arcade Library",
            "arcade_portal_shuffle": "Quick Play",
            "arcade_inside_title": "Arcade Library",
            "arcade_inside_sub": "Playable Retro Web Ports & Classics",
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
            "arcade_scoreboard": "Leaderboard",
            "arcade_games": "GAMES",
            "arcade_section_title": "Arcade & Game Library",
            "arcade_section_subtitle": "PC classics and browser game ports. Demo editions are labelled.",
            "arcade_cat_all": "All Games",
            "arcade_cat_simulation": "3D & Retro Ports",
            "arcade_cat_arcade": "Action Arcade",
            "arcade_cat_puzzle": "Classics & Casual",
            "arcade_search_placeholder": "Search games",
            "arcade_clear_search": "Clear search",
            "arcade_catalog_title": "Pick something to play.",
            "arcade_catalog_description": "PC classics and browser ports. Some games take longer to load.",
            "arcade_result_count_one": "{{count}} game",
            "arcade_result_count_other": "{{count}} games",
            "arcade_in_browser": "Play in browser",
            "arcade_new_tab": "Opens in a new tab",
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
            "footer_subtitle": "Open to game development, software engineering, and internship opportunities.",
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
                "m_desc": "3D adventure game published on Itch.io. Explore levels, find ancient masks, and solve environmental puzzles. Developed in Unity and C#.",
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
            "badge_hire": "Bağımsız projelere ve stajlara açık",
            "hero_name": "SİRAÇ GÖKTUĞ ŞİMŞEK",
            "hero_title": "Oyun Geliştirici & Yazılım Mühendisi",
            "hero_tagline": "İstanbul Kültür Üniversitesi Dijital Oyun Tasarımı öğrencisiyim. Unity ve C# ile 3D aksiyon oyunları geliştiriyor, Electron ve TypeScript ile Nova Browser gibi masaüstü yazılımları mimarilendiriyorum.",
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
            "about_subtitle": "Oyun geliştirme, masaüstü mimarileri ve interaktif yazılım sistemleri",
            "about_bio_heading": "Biyografi",
            "about_stats_heading": "Genel Bakış",
            "about_text_1": "Oyunları ve yazılımları temel mühendislik prensiplerinden yola çıkarak geliştiriyorum. Hazır şablonlar yerine işin çekirdeğindeki mekaniğe odaklanıyorum: Unity C# ile fizik tabanlı karakter kontrollerini kusursuz hissettirmek, WebGL için sıfır-tahsisli oyun döngüleri yazmak ve Electron/TypeScript ile masaüstü mimarileri kurmak.",
            "about_text_2": "İstanbul Kültür Üniversitesi Dijital Oyun Tasarımı bölümünde lisans eğitimime devam ederken; gerçek zamanlı grafik hatları, yazılım mühendisliği ve ürün tasarımını bir araya getiriyorum. Projelerim; yerel yapay zeka ve MCP entegrasyonlu Nova Browser'dan, Swift ile yazılmış native macOS araçlarına ve Itch.io'da yayınlanan 3D oyunlara kadar uzanıyor.",
            "about_text_3": "İyi yazılımın teknik disiplin ve özenli zanaatkarlıkla ortaya çıktığına inanıyorum. @unitybtw altında açık kaynaklı projeler üretiyor, okunabilir ve sürdürülebilir mimarilere öncelik veriyorum. Karmaşık mühendislik problemlerini çözebileceğim oyun geliştirme ve yazılım mühendisliği fırsatlarına açığım.",
            "about_stat_1": "Eğitim",
            "about_stat_1_val": "İKÜ: Dijital Oyun Tasarımı",
            "about_stat_2": "Temel Teknolojiler",
            "about_stat_2_val": "Unity · C# · TypeScript · Electron",
            "about_stat_3": "Tamamlanan Projeler",
            "about_stat_3_val": "3+ Yayınlanmış Proje",
            "about_stat_4": "Çalışma Durumu",
            "about_stat_4_val": "Staj ve Junior Rollerine Açık",

            // ── Skills ────────────────────────────────────────────────────
            "skills_title": "Beceriler",
            "skills_subtitle": "Oyun motorları, programlama dilleri ve geliştirici araçlarındaki yetkinlikler.",
            "skill_level_advanced": "İleri Seviye",
            "skill_level_intermediate": "Orta Seviye",
            "skill_unity_desc": "İleri düzey C# kodlama, URP/HDRP render pipeline yapıları, fizik tabanlı karakter kontrolcüleri ve shader graph sistemleri.",
            "skill_languages_desc": "C# ile nesne yönelimli oyun mekaniği mimarisi; TypeScript, React ve Electron ile performanslı masaüstü ve web yazılımları.",
            "skill_blender_desc": "Blender ile 3D modelleme, oyun motoru optimizasyonu ve Git, GitHub, Node.js, Vite ile modern geliştirici iş akışları.",
            "skill_cat_engines": "Oyun Motorları & Pipeline",
            "skill_cat_languages": "Diller & Teknolojiler",
            "skill_cat_tools": "3D Tasarım & Geliştirici Araçları",

            // ── Timeline / Experience ─────────────────────────────────────
            "timeline_title": "Eğitim & Yolculuk",
            "timeline_subtitle": "Akademik geçmiş ve gelişim süreci.",
            "timeline_event_3_year": "2025 – GÜNÜMÜZ",
            "timeline_event_3_title": "Lisans: Dijital Oyun Tasarımı, İstanbul Kültür Üniversitesi",
            "timeline_event_3_desc": "Etkileşimli yazılım mimarisi, render pipeline yapısı, oyun mekanikleri ve editör araçları üzerine lisans eğitimi.",
            "timeline_event_3_details": [
                "Oyun mekanikleri, 3D render pipeline ve etkileşimli yazılım mimarisi üzerine lisans eğitimi",
                "Unity C# kodlama, Blender ile 3D modelleme ve gerçek zamanlı fizik motorları üzerine uygulamalı çalışmalar",
                "3D macera ve sandbox türlerinde oynanış mekaniği prototipleri tasarımı ve uygulaması"
            ],
            "timeline_event_2_year": "2024 – GÜNÜMÜZ",
            "timeline_event_2_title": "Masaüstü Yazılım & Açık Kaynak Geliştirme",
            "timeline_event_2_desc": "Açık kaynaklı yazılımlar, masaüstü araçları ve modern tarayıcı teknolojileri geliştirme süreci.",
            "timeline_event_2_details": [
                "Electron, React ve TypeScript kullanarak yerel yapay zeka ve MCP entegrasyonuna sahip Nova Browser'ı geliştirdi ve yayınladı",
                "Modern masaüstü sistem araçları ve ses geri bildirimli yazılımlar üretti",
                "Açık kaynaklı repolar ve geliştirici araçları üzerinde sürdürülebilir mimariler kurdu"
            ],
            "timeline_event_1_year": "2020 – 2024",
            "timeline_event_1_title": "Lise Eğitimi: Sayısal Alan",
            "timeline_event_1_desc": "Matematik, fizik ve bilgisayar bilimleri temelleriyle lise eğitimi.",
            "timeline_event_1_details": [
                "Algoritmik düşünce, mantık ve koordinat matematiği üzerine sağlam temeller kurdu",
                "C# ile kodlamaya başlayarak ilk masaüstü araçlarını ve oyun prototiplerini geliştirdi",
                "Etkileşimli yazılımlara ve bağımsız yazılım geliştirmeye olan ilgisini derinleştirdi"
            ],

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
            "arcade_subtitle": "Klasik PC oyunları ve tarayıcı portları.",
            "arcade_btn": "KÜTÜPHANEYİ AÇ",
            "arcade_portal_badge": "RETRO PORTLAR · DÜNYA SKOR TABLOSU",
            "arcade_portal_desc": "Klasik PC oyunları, tarayıcı portları ve oynanabilir demolar. Bir oyun seç, kontrollerine bak ve tarayıcında oyna.",
            "arcade_portal_explore": "Kütüphaneyi Keşfet",
            "arcade_portal_shuffle": "Rastgele Başlat",
            "arcade_inside_title": "Oyun Kütüphanesi",
            "arcade_inside_sub": "Oynanabilir Gerçek Retro Web Portları & Klasikler",
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
            "arcade_scoreboard": "Skor tablosu",
            "arcade_games": "OYUNLAR",
            "arcade_section_title": "Oyun Kütüphanesi & Retro Portlar",
            "arcade_section_subtitle": "Klasik PC oyunları ve tarayıcı portları. Demo sürümler ayrıca belirtilir.",
            "arcade_cat_all": "Tümü",
            "arcade_cat_simulation": "3D & Retro Portlar",
            "arcade_cat_arcade": "Aksiyon & Arcade",
            "arcade_cat_puzzle": "Klasik & Eğlence",
            "arcade_search_placeholder": "Oyun ara",
            "arcade_clear_search": "Aramayı temizle",
            "arcade_catalog_title": "Bir oyun seç, mola ver.",
            "arcade_catalog_description": "Klasik PC oyunları ve tarayıcı portları. Bazı oyunların yüklenmesi zaman alabilir.",
            "arcade_result_count": "{{count}} oyun",
            "arcade_in_browser": "Tarayıcıda oyna",
            "arcade_new_tab": "Yeni sekmede açılır",
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
            "footer_subtitle": "Oyun geliştirme, yazılım mühendisliği rolleri ve staj fırsatlarına açığım.",
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
                "m_desc": "Itch.io üzerinde yayınlanmış 3D macera oyunu. Bölümleri keşfet, antik maskeleri bul ve bulmacaları çöz. Unity ve C# ile geliştirildi.",
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
