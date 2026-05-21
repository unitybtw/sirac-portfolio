import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  await page.goto('https://unitybtw.github.io/sirac-portfolio/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const rects = await page.evaluate(() => {
    const getRect = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        id,
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
        height: r.height
      };
    };
    return {
      skills: getRect('skills'),
      viewer: getRect('3d-viewer'),
      contact: getRect('contact'),
      bodyHeight: document.body.scrollHeight
    };
  });
  
  console.log('Element Rects:', JSON.stringify(rects, null, 2));
  await browser.close();
})();
