import { chromium } from 'playwright';

(async () => {
  console.log('Starting step-by-step scroll screenshot capture...');
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
  
  // Scroll down step by step to trigger all animations
  const totalHeight = 7200;
  const step = 400;
  for (let y = 0; y <= totalHeight; y += step) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, y);
    await page.waitForTimeout(100);
  }
  
  // Now take screenshot of viewer and footer
  const targets = [5400, 6250, 7050];
  for (const target of targets) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, target);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `light-scrolled-${target}.png` });
    console.log(`Saved light-scrolled-${target}.png`);
  }
  
  await browser.close();
  console.log('Done!');
})();
