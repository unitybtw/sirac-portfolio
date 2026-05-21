import { chromium } from 'playwright';

(async () => {
  console.log('Starting light mode screenshot capture on live site...');
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
  
  console.log('Toggling theme to light mode...');
  // Click the theme button (the button that contains the moon icon initially)
  // Let's locate buttons and click the one containing an SVG
  const buttons = await page.$$('button');
  let clicked = false;
  for (const button of buttons) {
    const html = await button.innerHTML();
    if (html.includes('lucide-moon') || html.includes('lucide-sun') || html.includes('svg')) {
      // Let's filter specifically for moon or sun icon
      if (html.includes('lucide-moon') || html.includes('lucide-sun') || html.includes('width="38"') || html.includes('38px')) {
        await button.click();
        clicked = true;
        console.log('Theme button clicked!');
        break;
      }
    }
  }
  
  if (!clicked) {
    console.log('Could not find specific theme button by HTML content, attempting selector...');
    try {
      await page.click('button:has(svg.lucide-moon)');
      console.log('Fallback theme selector clicked!');
    } catch (err) {
      console.log('Fallback click failed:', err.message);
    }
  }
  
  await page.waitForTimeout(2000);
  
  const scrollSteps = [0, 800, 1600, 2000, 2400, 2800];
  
  for (let i = 0; i < scrollSteps.length; i++) {
    const scrollY = scrollSteps[i];
    console.log(`Scrolling to ${scrollY} in light mode...`);
    
    await page.evaluate((y) => {
      if (window.lenis) {
        window.lenis.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }
    }, scrollY);
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: `light-scroll-${scrollY}.png` });
    console.log(`Saved light-scroll-${scrollY}.png`);
  }
  
  await browser.close();
  console.log('Done!');
})();
