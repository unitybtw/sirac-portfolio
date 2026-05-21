import { chromium, devices } from 'playwright';

(async () => {
  console.log('Launching browser to capture mobile validation screenshots...');
  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext(iPhone12);
  const page = await context.newPage();
  
  // Go to site
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(2000);
  
  // Capture expanded menu screenshot
  console.log('Clicking hamburger menu button...');
  const toggleBtn = page.locator('.nav-toggle-btn');
  await toggleBtn.click();
  await page.waitForTimeout(500); // Wait for open transition
  
  console.log('Capturing mobile menu expanded screenshot...');
  await page.screenshot({ path: 'mobile-menu-expanded.png' });
  
  // Close menu and scroll down to load lazy elements, then take full-page screenshot
  console.log('Closing menu and starting scroll process for full layout capture...');
  await toggleBtn.click();
  await page.waitForTimeout(300);
  
  // Trigger sequential scrolling to load active content
  const maxScroll = 11000;
  for (let y = 0; y <= maxScroll; y += 400) {
    await page.evaluate((scrollVal) => {
      window.scrollTo(0, scrollVal);
    }, y);
    await page.waitForTimeout(100);
  }
  
  console.log('Capturing full mobile page screenshot...');
  await page.screenshot({ path: 'mobile-full-new.png', fullPage: true });
  
  await browser.close();
  console.log('Mobile screenshots captured successfully.');
})();
