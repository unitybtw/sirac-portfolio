import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
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
  
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log('Body height after toggle:', bodyHeight);
  
  // Check if body class has light-mode
  const bodyClass = await page.evaluate(() => document.body.className);
  console.log('Body classes:', bodyClass);
  
  // Let's scroll to 5000 and check if any elements are visible
  await page.evaluate(() => {
    window.scrollTo(0, 5000);
  });
  await page.waitForTimeout(1000);
  
  const elementStyles = await page.evaluate(() => {
    const skills = document.getElementById('skills');
    if (!skills) return 'skills not found';
    const style = window.getComputedStyle(skills);
    return {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      height: skills.offsetHeight,
      rect: skills.getBoundingClientRect()
    };
  });
  console.log('Skills styling under scroll:', elementStyles);
  
  await browser.close();
})();
