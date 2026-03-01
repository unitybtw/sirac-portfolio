import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "nav_work": "Work",
            "nav_skills": "Skills",
            "nav_arcade": "Arcade",
            "nav_contact": "Contact",
            "badge_hire": "AVAILABLE FOR HIRE",
            "hero_title_1": "ARCHITECT OF ",
            "hero_title_2": "DIGITAL REALITIES",
            "hero_subtitle_1": "Unity Developer | Swift Enthusiast",
            "hero_subtitle_2": "Game Developer at IKU",
            "btn_explore": "Explore Quests",
            "btn_repos": "Repos",
            "archives_title": "The Archives",
            "archives_subtitle": "Missions completed and artifacts forged.",
            "skills_title": "Skill Tree Mastery",
            "skills_subtitle": "Core attributes and current proficiency.",
            "skill_sys": "System Design",
            "status_level": "LEVEL: FRESHMAN AT IKU",
            "status_quest": "Current Quest: Prepping for YKS & Mastering M2 Silicon",
            "arcade_button": "ARCADE",
            "footer_title": "Initiate Connection",
            "footer_subtitle": "Ready to co-op on the next big project?",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK. SYSTEM OPERATIONAL.",
            "btn_transmit": "Transmit Message",
            "arcade_title": "Arcade Library",
            "arcade_subtitle": "50 full 2D Canvas games embedded internally.",
            "arcade_btn": "ARCADE LIBRARY",
            "arcade_inside_title": "The Arcade",
            "arcade_inside_sub": "50 Interactive Modules Ready",
            "arcade_play": "PLAY_MODULE",
            "arcade_exit": "EXIT MODULE",
            "arcade_set_nickname": "Establish Pilot Identity",
            "arcade_save_continue": "AUTHORIZE & CONNECT",
            "arcade_scoreboard": "HALL OF FAME",
            "arcade_games": "LIBRARY",

            "drone_m_morning": "Good morning! Time to code.",
            "drone_m_afternoon": "Good afternoon! System is stable.",
            "drone_m_evening": "Good evening! Still working hard?",
            "drone_m_night": "Late night session? I'm with you.",
            "drone_c_github": "Oh, I love open source!",
            "drone_c_linkedin": "Professional networking engaged.",
            "drone_c_mail": "Preparing communication protocols.",
            "drone_c_game": "That's a great game. You should play it!",
            "drone_c_project": "Impressive architecture here.",
            "drone_c_click": "Click it, let's see what happens!",
            "drone_s_bottom": "We've reached the bottom of the mainframe.",
            "drone_s_top": "Back to the top level.",
            "drone_reboot": "System restarting...",
            "drone_click_1": "Diagnostics complete! 100% Awesome.",
            "drone_click_2": "Hey.. that tickles.",
            "drone_click_3": "Are you trying to find a hidden feature?",
            "drone_click_4": "WARNING: CORE OVERHEATING! Just kidding.",
            "drone_click_5": "STOP POKING ME!",
            "drone_idle": [
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
            ],

            "games": {
                "m_title": "Legend of the Three Masks",
                "m_desc": "An immersive 3D adventure game published on itch.io where you explore levels to find ancient masks and uncover mysteries.",
                "fb_desc": "A fun, challenging classic arcade-style game testing reflexes with high-score tracking and quick gameplay loops."
            }
        }
    },
    tr: {
        translation: {
            "nav_work": "Projeler",
            "nav_skills": "Yetenekler",
            "nav_arcade": "Oyunlar",
            "nav_contact": "İletişim",
            "badge_hire": "İŞ TEKLİFLERİNE AÇIK",
            "hero_title_1": "DİJİTAL GERÇEKLİKLERİN ",
            "hero_title_2": "MİMARI",
            "hero_subtitle_1": "Unity Geliştiricisi | Swift Kodlayıcı",
            "hero_subtitle_2": "İKÜ'de Oyun Geliştiricisi",
            "btn_explore": "Görevleri Keşfet",
            "btn_repos": "Kodlar",
            "archives_title": "Arşivler",
            "archives_subtitle": "Tamamlanmış görevler ve üretilen eserler.",
            "skills_title": "Yetenek Ağacı",
            "skills_subtitle": "Temel özellikler ve güncel başarı seviyeleri.",
            "skill_sys": "Sistem Tasarımı",
            "status_level": "SEVİYE: İKÜ'DE 1. SINIF",
            "status_quest": "Mevcut Görev: YKS'ye Hazırlık & M2 İşlemcilerde Ustalaşma",
            "arcade_button": "OYUNLAR",
            "footer_title": "Bağlantı Başlat",
            "footer_subtitle": "Sıradaki büyük projede co-op yapmaya hazır mısın?",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK. SİSTEM AKTİF.",
            "btn_transmit": "Mesaj Gönder",
            "arcade_title": "Arcade Kütüphanesi",
            "arcade_subtitle": "50 adet yerleşik 2D HTML5 Canvas oyunu.",
            "arcade_btn": "ARCADE KÜTÜPHANESİ",
            "arcade_inside_title": "Oyun Salonu",
            "arcade_inside_sub": "50 Etkileşimli Oyun Hazır",
            "arcade_play": "OYNA",
            "arcade_exit": "ÇIKIŞ YAP",
            "arcade_set_nickname": "Pilot Kimliği Oluştur",
            "arcade_save_continue": "YETKİLENDİR VE BAĞLAN",
            "arcade_scoreboard": "ONUR TABLOSU",
            "arcade_games": "KÜTÜPHANE",

            "drone_m_morning": "Günaydın! Kodlama vakti.",
            "drone_m_afternoon": "İyi öğleden sonraları! Sistem stabil.",
            "drone_m_evening": "İyi akşamlar! Hala çalışıyor musun?",
            "drone_m_night": "Gece mesaisi mi? Seninleyim.",
            "drone_c_github": "Açık kaynağa bayılırım!",
            "drone_c_linkedin": "Profesyonel ağlara bağlanılıyor.",
            "drone_c_mail": "İletişim protokolleri hazır.",
            "drone_c_game": "Harika oyun, bence hemen oynamalısın!",
            "drone_c_project": "Buradaki mimari cidden etkileyici.",
            "drone_c_click": "Tıkla bakalım ne olacak!",
            "drone_s_bottom": "Ana sistemin dibine indik.",
            "drone_s_top": "En üst düzeye geri dönüldü.",
            "drone_reboot": "Sistem Yeniden Başlatılıyor...",
            "drone_click_1": "Sistem taraması: %100 Harika!",
            "drone_click_2": "Hey.. gıdıklanıyorum.",
            "drone_click_3": "Gizli bir özellik falan mı arıyorsun?",
            "drone_click_4": "UYARI: ÇEKİRDEK ISINIYOR! Şaka şaka.",
            "drone_click_5": "DÜRTÜP DURMA BENİ!",
            "drone_idle": [
                "Hata ayıklamaya yardım lazım mı?",
                "Şu oyun çok eğlenceli duruyor!",
                "İşlemci sıcaklığına göz kulak oluyorum...",
                "Bip bop.",
                "Bence biraz Neon 2048 oyna!",
                "Vay canına, tam 50 oyun var!",
                "Sen de mi oyun geliştiricisisin?",
                "Neler olacağını görmek için üstlerinde bekle.",
                "Sensörlerim yüksek ustalık seviyesi algılıyor.",
                "Unity ve C# gerçekten harika bir ikili.",
                "Sistem 60fps akıcılığında çalışıyor.",
                "Bana çok sert tıklama!"
            ],

            "games": {
                "m_title": "Üç Maskenin Efsanesi",
                "m_desc": "itch.io üzerinde yayınlanmış, eski maskeleri bulup gizemleri çözmek için bölümleri keşfettiğiniz sürükleyici 3D macera oyunu.",
                "fb_desc": "Hızlı oyun döngüsü ve yüksek skor takibi ile refleksleri test eden, eğlenceli, zorlu klasik atari tarzı oyun."
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
