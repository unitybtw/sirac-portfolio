import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log("Starting preview server...");
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Launching Playwright...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER LOG [${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`BROWSER EXCEPTION: ${err.message}\n${err.stack}`);
  });

  await page.setViewportSize({ width: 1440, height: 900 });

  console.log("Navigating to app...");
  await page.goto('http://localhost:4173');
  await page.waitForLoadState('networkidle');

  // Launch arcade
  console.log("Clicking .arcade-portal-card...");
  await page.locator('.arcade-portal-card').click();
  await page.waitForTimeout(1000);

  // Set nickname
  const nicknameInput = await page.locator('input[placeholder="Enter username..."]');
  if (await nicknameInput.isVisible()) {
    console.log("Nickname input visible. Entering tag...");
    await nicknameInput.fill('TesterGuy');
    await page.locator('.glass-panel button.btn-primary').click();
    await page.waitForTimeout(1000);
  }

  // Open Neon Snake
  console.log("Opening Neon Snake...");
  await page.locator('.arcade-game-card:has-text("Neon Snake")').click();
  await page.waitForTimeout(1500);

  // Setup input logger inside the browser context
  console.log("Setting up event listeners in browser...");
  await page.evaluate(() => {
    window.eventsLog = [];
    
    // Log keydown
    window.addEventListener('keydown', (e) => {
      console.log(`[EVENT keydown] key=${e.key} code=${e.code} target=${e.target.tagName}.${e.target.className}`);
      window.eventsLog.push({ type: 'keydown', key: e.key, code: e.code });
    }, { capture: true });

    // Log mousedown
    window.addEventListener('mousedown', (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      console.log(`[EVENT mousedown] target=${e.target.tagName}.${e.target.className} elementFromPoint=${el ? el.tagName + '.' + el.className : 'null'}`);
      window.eventsLog.push({ type: 'mousedown', x: e.clientX, y: e.clientY });
    }, { capture: true });
    
    // Check active element
    setInterval(() => {
      console.log(`[ACTIVE ELEMENT] ${document.activeElement.tagName}.${document.activeElement.className}`);
    }, 1000);
  });

  // Click PLAY button
  console.log("Locating PLAY button...");
  const playBtn = await page.locator('button:has-text("PLAY")').first();
  await playBtn.click();
  await page.waitForTimeout(1000);

  // Click on the game canvas to focus it
  console.log("Clicking Neon Snake canvas...");
  const canvas = await page.locator('.arcade-modal-overlay canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await page.waitForTimeout(1000);

  // Press keys
  console.log("Pressing ArrowUp and ArrowRight...");
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1000);

  // Check if canvas is receiving pointer-events
  const pointerEventsCheck = await page.evaluate(() => {
    const canvas = document.querySelector('.arcade-modal-overlay canvas');
    if (!canvas) return 'canvas not found';
    const computedStyle = window.getComputedStyle(canvas);
    return {
      pointerEvents: computedStyle.pointerEvents,
      cursor: computedStyle.cursor,
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      parentStyle: window.getComputedStyle(canvas.parentElement).pointerEvents
    };
  });
  console.log("Canvas styles check:", JSON.stringify(pointerEventsCheck, null, 2));

  await page.screenshot({ path: '/Users/siracsimsek/.gemini/antigravity/brain/2c981e96-f2bb-4785-a09d-a156e36cf345/test_input_result.png' });

  await browser.close();
  previewProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
