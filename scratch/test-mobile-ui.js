import { chromium, devices } from 'playwright';

(async () => {
  console.log('Starting mobile UI screenshot capture...');
  const browser = await chromium.launch();
  
  // Emulate iPhone 12
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext({
    ...iPhone12,
    deviceScaleFactor: 3, // High DPI
  });
  
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }
  
  await page.waitForTimeout(3000);
  
  // Scroll down step-by-step to trigger all lazy-load intersection observers and scroll animations
  const targetScrolls = [0, 800, 1600, 2800, 4800, 5400, 6250, 7050];
  const maxScroll = 7200;
  const step = 150;
  
  console.log('Scrolling down step-by-step...');
  for (let y = 0; y <= maxScroll; y += step) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, y);
    await page.waitForTimeout(40);
  }
  
  console.log('Capturing mobile screenshots at key locations...');
  for (const target of targetScrolls) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, target);
    
    await page.waitForTimeout(1000); // Allow layouts to stabilize
    
    const filename = `mobile-${target}.png`;
    await page.screenshot({ path: filename });
    console.log(`Saved screenshot: ${filename}`);
  }
  
  await browser.close();
  console.log('All mobile screenshots captured successfully!');
})();
