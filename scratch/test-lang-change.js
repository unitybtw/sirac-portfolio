import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to a desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  
  console.log('Navigating to local site...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  // Measure initial language selector location
  const getSelectorRect = async () => {
    return await page.evaluate(() => {
      const el = document.querySelector('.lang-selector-container');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        outerHTML: el.outerHTML
      };
    });
  };
  
  console.log('Initial rect:', await getSelectorRect());
  await page.screenshot({ path: 'scratch/lang-before-scroll.png' });
  
  // Scroll down to activate .scrolled header class
  console.log('Scrolling down...');
  await page.evaluate(() => {
    window.scrollTo(0, 500);
  });
  await page.waitForTimeout(1000);
  
  console.log('Rect after scroll:', await getSelectorRect());
  await page.screenshot({ path: 'scratch/lang-after-scroll.png' });
  
  // Now click TR to change language and measure
  console.log('Clicking TR...');
  // Find the TR button inside lang-selector-container
  const trButton = await page.locator('.lang-selector-container button:has-text("TR")');
  
  // Capture screenshot during transition or right after
  await page.screenshot({ path: 'scratch/lang-clicking-tr.png' });
  await trButton.click();
  
  // Take screenshot right after click to see any layout transition/glitch
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(50);
    await page.screenshot({ path: `scratch/lang-after-tr-${i}.png` });
  }
  
  console.log('Final rect:', await getSelectorRect());
  
  await browser.close();
  console.log('Done!');
})();
