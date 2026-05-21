import { chromium } from 'playwright';

(async () => {
  console.log('Starting very bottom light mode screenshot capture...');
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
  
  // Toggle theme to light mode
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const html = await button.innerHTML();
    if (html.includes('lucide-moon') || html.includes('lucide-sun') || html.includes('width="38"')) {
      await button.click();
      console.log('Theme button clicked!');
      break;
    }
  }
  
  await page.waitForTimeout(2000);
  
  const scrollSteps = [4800, 5200, 5600, 6000, 6400, 6800];
  
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
    
    await page.screenshot({ path: `light-bottom-${scrollY}.png` });
    console.log(`Saved light-bottom-${scrollY}.png`);
  }
  
  await browser.close();
  console.log('Done!');
})();
