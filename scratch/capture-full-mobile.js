import { chromium, devices } from 'playwright';

(async () => {
  console.log('Capturing full mobile page screenshot...');
  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext({
    ...iPhone12,
    deviceScaleFactor: 2,
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }
  
  await page.waitForTimeout(3000);
  
  // Trigger lenis scrolling to load lazy elements
  const maxScroll = 12000;
  for (let y = 0; y <= maxScroll; y += 400) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, y);
    await page.waitForTimeout(100);
  }
  
  // Go back to top so it captures cleanly if needed or just capture full page
  await page.screenshot({ path: 'mobile-full.png', fullPage: true });
  console.log('Saved full mobile page screenshot: mobile-full.png');
  
  await browser.close();
})();
