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

  // Check if PLAY button exists before
  const btnBefore = await page.evaluate(() => {
    const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('PLAY'));
    return playBtn ? playBtn.outerHTML : 'not found';
  });
  console.log("PLAY button before click:", btnBefore);

  // Click PLAY button
  const playBtnLocator = await page.locator('button:has-text("PLAY")').first();
  await playBtnLocator.click();
  await page.waitForTimeout(1000);

  // Check if PLAY button exists after
  const btnAfter = await page.evaluate(() => {
    const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('PLAY'));
    return playBtn ? playBtn.outerHTML : 'not found';
  });
  console.log("PLAY button after click:", btnAfter);

  // Check if 'Score:' text is visible on the page
  const scoreTextVisible = await page.evaluate(() => {
    return document.body.innerText.includes('Score: 0') || document.body.innerText.includes('Score:');
  });
  console.log("Is 'Score:' text visible?", scoreTextVisible);

  await browser.close();
  previewProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
