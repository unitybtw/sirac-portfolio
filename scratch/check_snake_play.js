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
  await page.goto('http://localhost:4173');
  await page.waitForLoadState('networkidle');

  // Launch arcade
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

  // Check initial DOM in Neon Snake container
  const initialDOM = await page.evaluate(() => {
    const activeView = document.querySelector('.arcade-modal-body');
    return activeView ? activeView.innerHTML.substring(0, 1000) : 'not found';
  });
  console.log("Initial Neon Snake DOM inside modal body:\n", initialDOM);

  // Click PLAY button
  console.log("Clicking PLAY...");
  const playBtn = await page.locator('button:has-text("PLAY")').first();
  await playBtn.click();
  await page.waitForTimeout(1000);

  // Check DOM after PLAY clicked
  const afterPlayDOM = await page.evaluate(() => {
    const activeView = document.querySelector('.arcade-modal-body');
    return activeView ? activeView.innerHTML.substring(0, 1000) : 'not found';
  });
  console.log("After PLAY DOM inside modal body:\n", afterPlayDOM);

  await browser.close();
  previewProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
