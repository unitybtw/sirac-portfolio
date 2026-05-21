import { chromium } from 'playwright';

(async () => {
  console.log('Starting screenshot capture on live site...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://unitybtw.github.io/sirac-portfolio/', { waitUntil: 'networkidle', timeout: 20000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }
  
  await page.waitForTimeout(3000);
  
  const scrollSteps = [0, 400, 800, 1200, 1600, 2000, 2400, 2800];
  
  for (let i = 0; i < scrollSteps.length; i++) {
    const scrollY = scrollSteps[i];
    console.log(`Scrolling to ${scrollY}...`);
    
    await page.evaluate((y) => {
      if (window.lenis) {
        window.lenis.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }
    }, scrollY);
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: `scroll-${scrollY}.png` });
    console.log(`Saved scroll-${scrollY}.png`);
  }
  
  await browser.close();
  console.log('Done!');
})();
