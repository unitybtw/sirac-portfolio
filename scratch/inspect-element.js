import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext(iPhone12);
  const page = await context.newPage();
  
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(2000);
  
  const results = await page.evaluate(() => {
    const btn = document.querySelector('.nav-toggle-btn');
    const lang = document.querySelector('.lang-selector-container');
    const utils = document.querySelector('.nav-utilities');
    
    return {
      btn: btn ? {
        className: btn.className,
        display: window.getComputedStyle(btn).display,
        visibility: window.getComputedStyle(btn).visibility,
        opacity: window.getComputedStyle(btn).opacity,
        width: window.getComputedStyle(btn).width,
        height: window.getComputedStyle(btn).height,
        color: window.getComputedStyle(btn).color,
        rect: btn.getBoundingClientRect(),
        outerHTML: btn.outerHTML
      } : 'not found',
      lang: lang ? {
        display: window.getComputedStyle(lang).display,
        width: window.getComputedStyle(lang).width,
        height: window.getComputedStyle(lang).height,
        rect: lang.getBoundingClientRect(),
        outerHTML: lang.outerHTML
      } : 'not found',
      utils: utils ? {
        display: window.getComputedStyle(utils).display,
        width: window.getComputedStyle(utils).width,
        height: window.getComputedStyle(utils).height,
        rect: utils.getBoundingClientRect()
      } : 'not found'
    };
  });
  
  console.log('Inspection results:', JSON.stringify(results, null, 2));
  await browser.close();
})();
