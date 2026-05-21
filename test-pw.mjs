import { chromium } from 'playwright';

(async () => {
  console.log('Starting Playwright...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    }
  });
  
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
    console.log('Navigation error/timeout:', e.message);
  }
  
  // Wait for initial load
  await page.waitForTimeout(2000);
  
  // Scroll down step by step to record animations
  console.log('Scrolling down...');
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => {
      if (window.lenis) {
        window.lenis.scrollTo(window.scrollY + 600, { duration: 0.8 });
      } else {
        window.scrollBy(0, 600);
      }
    });
    await page.waitForTimeout(1200);
  }
  
  // Scroll up step by step
  console.log('Scrolling up...');
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => {
      if (window.lenis) {
        window.lenis.scrollTo(window.scrollY - 600, { duration: 0.8 });
      } else {
        window.scrollBy(0, -600);
      }
    });
    await page.waitForTimeout(1200);
  }
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log('Screenshot saved to screenshot.png');
  
  await context.close();
  await browser.close();
  console.log('Video saved to videos/ directory.');
})();
