import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function test() {
  console.log('Starting dev server...');
  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: '/Users/siracsimsek/denemeapp1',
    shell: true
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const widths = [1200, 1100, 1050, 1000, 975, 960];
  const results = {};

  for (const w of widths) {
    console.log(`Testing width: ${w}px`);
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: `/Users/siracsimsek/denemeapp1/scratch/navbar_${w}.png` });

    results[w] = await page.evaluate(() => {
      const container = document.querySelector('.theme-toggle-container');
      const button = document.querySelector('.theme-toggle-btn-desktop');
      const navUtilities = document.querySelector('.nav-utilities');
      const nav = document.querySelector('nav');
      const body = document.body;

      function getElementInfo(el, name) {
        if (!el) return { name, exists: false };
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          exists: true,
          x: rect.x,
          width: rect.width,
          display: styles.display,
          opacity: styles.opacity
        };
      }

      return {
        bodyWidth: body.clientWidth,
        nav: getElementInfo(nav, 'nav'),
        navUtilities: getElementInfo(navUtilities, 'navUtilities'),
        container: getElementInfo(container, 'container'),
        button: getElementInfo(button, 'button')
      };
    });
  }

  console.log('Results:', JSON.stringify(results, null, 2));

  await browser.close();
  devServer.kill('SIGINT');
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
