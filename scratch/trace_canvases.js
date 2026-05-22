import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log("Starting preview server...");
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Launching Playwright...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:4173');
  await page.waitForLoadState('networkidle');

  // Open arcade
  await page.locator('.arcade-portal-card').click();
  await page.waitForTimeout(1000);

  // Set nickname
  const nicknameInput = await page.locator('input[placeholder="Enter username..."]');
  if (await nicknameInput.isVisible()) {
    await nicknameInput.fill('TesterGuy');
    await page.locator('.glass-panel button.btn-primary').click();
    await page.waitForTimeout(1000);
  }

  // Open Neon Snake
  await page.locator('.arcade-game-card:has-text("Neon Snake")').click();
  await page.waitForTimeout(1500);

  // Click PLAY button
  const playBtn = await page.locator('button:has-text("PLAY")').first();
  if (await playBtn.isVisible()) {
    await playBtn.click();
    await page.waitForTimeout(1000);
  }

  // Inspect all canvas elements
  const canvases = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).map(c => {
      const computed = window.getComputedStyle(c);
      // Let's also trace parent path
      const path = [];
      let current = c;
      while (current) {
        path.push(`${current.tagName}.${current.className || ''}${current.id ? '#' + current.id : ''}`);
        current = current.parentElement;
      }
      return {
        outerHTML: c.outerHTML.substring(0, 150),
        id: c.id,
        className: c.className,
        visibility: computed.visibility,
        pointerEvents: computed.pointerEvents,
        opacity: computed.opacity,
        display: computed.display,
        path: path.reverse().join(' > ')
      };
    });
  });

  console.log("CANVASES:", JSON.stringify(canvases, null, 2));

  await browser.close();
  previewProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
