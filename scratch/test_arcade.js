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

  console.log("Finding and clicking .arcade-portal-card...");
  const portalCard = await page.locator('.arcade-portal-card');
  await portalCard.click();
  console.log("Clicked arcade portal card.");

  await page.waitForTimeout(1000);

  // Enter a nickname
  const nicknameInput = await page.locator('input[placeholder="Enter username..."]');
  if (await nicknameInput.isVisible()) {
    console.log("Nickname input visible. Entering tag...");
    await nicknameInput.fill('TesterGuy');
    await page.waitForTimeout(500);
    // Find the save button (it's the primary button under nickname view)
    const saveBtn = await page.locator('.glass-panel button.btn-primary');
    await saveBtn.click();
    console.log("Clicked save/continue button.");
    await page.waitForTimeout(1000);
  }

  // Take screenshot of game grid
  await page.screenshot({ path: '/Users/siracsimsek/.gemini/antigravity/brain/2c981e96-f2bb-4785-a09d-a156e36cf345/arcade_grid.png' });

  // Click Neon Snake Game card
  console.log("Finding Neon Snake card...");
  const snakeCard = await page.locator('.arcade-game-card:has-text("Neon Snake")');
  await snakeCard.click();
  console.log("Clicked Neon Snake card.");
  await page.waitForTimeout(1000);

  // Take screenshot of active game view
  await page.screenshot({ path: '/Users/siracsimsek/.gemini/antigravity/brain/2c981e96-f2bb-4785-a09d-a156e36cf345/arcade_game_view.png' });

  // Click PLAY button in the game
  console.log("Finding PLAY button in game...");
  // The play button is inside the active game canvas/UI container
  // It has class "btn btn-primary" and contains text "PLAY"
  const playBtn = await page.locator('button:has-text("PLAY")').first();
  if (await playBtn.isVisible()) {
    console.log("PLAY button is visible. Clicking it...");
    await playBtn.click();
    await page.waitForTimeout(1000);
    // Take screenshot after play
    await page.screenshot({ path: '/Users/siracsimsek/.gemini/antigravity/brain/2c981e96-f2bb-4785-a09d-a156e36cf345/arcade_game_playing.png' });
  } else {
    console.log("PLAY button is not visible!");
  }

  await browser.close();
  previewProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
