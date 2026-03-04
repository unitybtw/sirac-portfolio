# Siraç Göktuğ Şimşek | Digital Game Developer 🎮

Welcome to my interactive portfolio and game hub! This project is a modern, web-based showcase of my work as a Game Developer, designed with a sleek "cyber/neon" aesthetic. It's not just a collection of my professional details, but also a fully functional **Arcade** where visitors can play classic and web-based games directly in their browser.

## 🌟 Features

*   **Interactive UI:** A glassmorphic, futuristic user interface with glowing neon accents and smooth Framer Motion animations.
*   **The Arcade (Game Library):** A dedicated section hosting a variety of playable web games.
    *   **Classics:** DOOM, Quake 3, Super Mario 64, Half-Life, GTA Vice City.
    *   **Modern Web Ports:** Hollow Knight, ULTRAKILL, Subway Surfers, Geometry Dash.
    *   **Features:** All games are fully sandboxed for security (`allow-popups` disabled to prevent ads/redirects), with localized loading mechanisms and full-screen support.
*   **Performance Optimization:** 
    *   Dynamic code splitting via `React.lazy()` ensures fast initial load times.
    *   Games load their assets (some up to 800MB) smartly inside their own iframe wrappers.
*   **Multilanguage Support:** Seamlessly switches between English and Turkish using `react-i18next`.

## 🛠️ Tech Stack

*   **Frontend:** React 18
*   **Styling:** CSS3 (Custom properties, Glassmorphism, Neon effects)
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Build Tool:** Vite
*   **Deployment:** GitHub Pages

## 🚀 Running Locally

To run this project on your local machine:

1.  Clone the repository: \`git clone [repo_url]\`
2.  Navigate to the project directory: \`cd [project_dir]\`
3.  Install dependencies: \`npm install\`
4.  Start the development server: \`npm run dev\`

## 📝 Notes on Game Embeds

The games hosted in the Arcade section are fetched via secure `iframe` elements using community-created open web ports (like `reVC`, `ioquake3` js ports, etc.). They have been configured with strict sandbox policies to prevent external redirects and block popup advertisements.

---
*Built with passion for gaming and clean code.*
