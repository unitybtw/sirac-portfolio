import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "nav_work": "Work",
            "nav_skills": "Skills",
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
            "footer_title": "Initiate Connection",
            "footer_subtitle": "Ready to co-op on the next big project?",
            "btn_transmit": "Transmit Message",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK. SYSTEM OPERATIONAL.",

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
            "footer_title": "Bağlantı Başlat",
            "footer_subtitle": "Sıradaki büyük projede co-op yapmaya hazır mısın?",
            "btn_transmit": "Mesaj Gönder",
            "footer_copyright": "SİRAÇ GÖKTUĞ ŞİMŞEK. SİSTEM AKTİF.",

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
