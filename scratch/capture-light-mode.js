import { chromium, devices } from 'playwright';

(async () => {
  console.log('Launching browser to capture light mode validation...');
  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext(iPhone12);
  const page = await context.newPage();
  
  // Go to site
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(2000);
  
  // Toggle to light mode (click theme toggle button)
  console.log('Toggling theme to light mode...');
  const themeBtn = page.locator('.nav-utilities button:has(svg.lucide-moon, svg.lucide-sun)');
  await themeBtn.click();
  await page.waitForTimeout(1000);
  
  // Click hamburger menu to expand it
  console.log('Opening hamburger menu in light mode...');
  const toggleBtn = page.locator('.nav-toggle-btn');
  await toggleBtn.click();
  await page.waitForTimeout(500);
  
  console.log('Capturing mobile light menu expanded...');
  await page.screenshot({ path: 'mobile-light-menu.png' });
  
  // Close menu
  await toggleBtn.click();
  await page.waitForTimeout(300);
  
  // Click presence panel trigger to expand it
  console.log('Opening presence panel in light mode...');
  const presenceBtn = page.locator('.presence-panel-trigger');
  await presenceBtn.click();
  await page.waitForTimeout(500);
  
  console.log('Capturing presence panel light mode state...');
  await page.screenshot({ path: 'mobile-light-presence.png' });
  
  // Scroll down and capture full page in light mode
  console.log('Scrolling down for full light page capture...');
  const maxScroll = 11000;
  for (let y = 0; y <= maxScroll; y += 400) {
    await page.evaluate((scrollVal) => {
      window.scrollTo(0, scrollVal);
    }, y);
    await page.waitForTimeout(100);
  }
  
  console.log('Capturing full mobile page in light mode...');
  await page.screenshot({ path: 'mobile-light-full.png', fullPage: true });
  
  await browser.close();
  console.log('Light mode screenshots captured successfully.');
})();
