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

  // Trace ancestors of canvas
  const trace = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'Canvas not found';
    
    const path = [];
    let current = canvas;
    while (current) {
      const computed = window.getComputedStyle(current);
      path.push({
        tagName: current.tagName,
        id: current.id,
        className: current.className,
        pointerEvents: computed.pointerEvents,
        visibility: computed.visibility,
        display: computed.display,
        opacity: computed.opacity,
        zIndex: computed.zIndex,
        styleAttr: current.getAttribute('style') || ''
      });
      current = current.parentElement;
    }
    return path;
  });

  console.log("DOM TRACE:");
  console.log(JSON.stringify(trace, null, 2));

  await browser.close();
  previewProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
