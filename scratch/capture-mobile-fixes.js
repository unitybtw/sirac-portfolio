import { spawn } from 'child_process';
import { chromium, devices } from 'playwright';

(async () => {
  console.log('Starting Vite preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: '/Users/siracsimsek/denemeapp1',
    shell: true
  });

  // Let server output to logs
  server.stdout.on('data', (data) => console.log(`[Server]: ${data.toString().trim()}`));
  server.stderr.on('data', (data) => console.error(`[Server Error]: ${data.toString().trim()}`));

  // Wait 3 seconds for server to boot
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext(iPhone12);
  const page = await context.newPage();

  try {
    // Go to local server
    console.log('Navigating to http://localhost:4173/ ...');
    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(2000);

    // --- 1. DARK MODE MENU OPEN ---
    console.log('Opening hamburger menu in dark mode...');
    const toggleBtn = page.locator('.nav-toggle-btn');
    await toggleBtn.click();
    await page.waitForTimeout(500);

    console.log('Capturing mobile dark menu expanded...');
    await page.screenshot({ path: 'mobile-dark-menu.png' });

    // Close menu
    await toggleBtn.click();
    await page.waitForTimeout(500);

    // --- 2. DARK MODE FULL SCROLL ---
    console.log('Scrolling down for full dark page capture...');
    const maxScroll = 11000;
    for (let y = 0; y <= maxScroll; y += 400) {
      await page.evaluate((scrollVal) => window.scrollTo(0, scrollVal), y);
      await page.waitForTimeout(80);
    }
    console.log('Capturing full mobile page in dark mode...');
    await page.screenshot({ path: 'mobile-dark-full.png', fullPage: true });

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // --- 3. TOGGLE TO LIGHT MODE ---
    console.log('Toggling to light mode...');
    // Open menu again to access mobile controls
    await toggleBtn.click();
    await page.waitForTimeout(500);

    const themeBtn = page.locator('.mobile-menu-utilities button[aria-label="Toggle Theme"]');
    await themeBtn.click();
    await page.waitForTimeout(1000);

    console.log('Capturing mobile light menu expanded...');
    await page.screenshot({ path: 'mobile-light-menu.png' });

    // Close menu
    await toggleBtn.click();
    await page.waitForTimeout(500);

    // --- 5. LIGHT MODE FULL SCROLL ---
    console.log('Scrolling down for full light page capture...');
    for (let y = 0; y <= maxScroll; y += 400) {
      await page.evaluate((scrollVal) => window.scrollTo(0, scrollVal), y);
      await page.waitForTimeout(80);
    }
    console.log('Capturing full mobile page in light mode...');
    await page.screenshot({ path: 'mobile-light-full.png', fullPage: true });

    console.log('All screenshots captured successfully.');
  } catch (error) {
    console.error('Error during capture:', error);
  } finally {
    await browser.close();
    console.log('Stopping Vite preview server...');
    try {
      server.kill();
    } catch (e) {}
    try {
      // In case child process remains on macOS/Unix:
      process.kill(-server.pid, 'SIGINT');
    } catch (e) {}
  }
})();
