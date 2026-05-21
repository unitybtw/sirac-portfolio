import { chromium } from 'playwright';

(async () => {
  console.log('Starting local light mode screenshot capture...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
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
  
  // Toggle theme to light mode
  const buttons = await page.$$('button');
  let themeButton = null;
  for (const button of buttons) {
    const html = await button.innerHTML();
    if (html.includes('lucide-moon') || html.includes('lucide-sun') || html.includes('width="38"')) {
      themeButton = button;
      break;
    }
  }
  
  if (themeButton) {
    await themeButton.click();
    console.log('Theme toggled to Light Mode!');
  } else {
    console.log('Theme button not found!');
  }
  
  await page.waitForTimeout(2000);
  
  // Scroll down step-by-step to trigger all lazy-load intersection observers and scroll animations
  const targetScrolls = [0, 800, 1600, 2800, 4800, 5400, 6250, 7050];
  const maxScroll = 7200;
  const step = 200;
  
  console.log('Scrolling down step-by-step...');
  for (let y = 0; y <= maxScroll; y += step) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, y);
    await page.waitForTimeout(50);
  }
  
  console.log('Capturing screenshots at key locations...');
  for (const target of targetScrolls) {
    await page.evaluate((scrollVal) => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollVal, { immediate: true });
      } else {
        window.scrollTo(0, scrollVal);
      }
    }, target);
    
    await page.waitForTimeout(1500); // Allow layouts to stabilize
    
    const filename = `light-local-${target}.png`;
    await page.screenshot({ path: filename });
    console.log(`Saved screenshot: ${filename}`);
  }
  
  await browser.close();
  console.log('All screenshots captured successfully!');
})();
