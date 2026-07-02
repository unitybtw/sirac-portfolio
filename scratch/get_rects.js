import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function test() {
  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: '/Users/siracsimsek/denemeapp1',
    shell: true
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  const rects = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const logo = document.querySelector('.nav-logo');
    const links = document.querySelector('.nav-links');
    const utils = document.querySelector('.nav-utilities');
    
    function getRect(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        right: r.right
      };
    }

    return {
      nav: getRect(nav),
      logo: getRect(logo),
      links: getRect(links),
      utils: getRect(utils)
    };
  });

  console.log('RECTS AT 1000px:', JSON.stringify(rects, null, 2));

  await browser.close();
  devServer.kill('SIGINT');
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
