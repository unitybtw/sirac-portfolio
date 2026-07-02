import { chromium, devices } from 'playwright';

(async () => {
  console.log('Launching browser with iPhone 12 emulation...');
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 12']);
  const page = await context.newPage();
  
  console.log('Navigating to local site...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  
  // Take screenshot before opening menu
  await page.screenshot({ path: 'scratch/mobile-before-menu.png' });
  
  // Open the mobile menu drawer
  console.log('Opening mobile menu...');
  const menuBtn = page.locator('.nav-toggle-btn');
  await menuBtn.click();
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'scratch/mobile-menu-open.png' });
  
  // Find both language buttons
  const getLangSwitchersInfo = await page.evaluate(() => {
    const desktopLang = document.querySelector('.nav-utilities .lang-selector-container');
    const mobileLang = document.querySelector('.mobile-lang-switcher');
    
    return {
      desktop: desktopLang ? {
        top: desktopLang.getBoundingClientRect().top,
        left: desktopLang.getBoundingClientRect().left,
        width: desktopLang.getBoundingClientRect().width,
        height: desktopLang.getBoundingClientRect().height,
        display: window.getComputedStyle(desktopLang).display,
        opacity: window.getComputedStyle(desktopLang).opacity,
      } : null,
      mobile: mobileLang ? {
        top: mobileLang.getBoundingClientRect().top,
        left: mobileLang.getBoundingClientRect().left,
        width: mobileLang.getBoundingClientRect().width,
        height: mobileLang.getBoundingClientRect().height,
        display: window.getComputedStyle(mobileLang).display,
        opacity: window.getComputedStyle(mobileLang).opacity,
      } : null
    };
  });
  
  console.log('Language switcher rects before change:', getLangSwitchersInfo);
  
  // Let's scroll down inside the page, or just click TR in the mobile menu
  console.log('Clicking TR in mobile menu...');
  const mobileTrButton = page.locator('.mobile-lang-switcher button:has-text("TR")');
  await mobileTrButton.click();
  
  // Capture transition frames
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(50);
    await page.screenshot({ path: `scratch/mobile-after-tr-${i}.png` });
  }
  
  const getLangSwitchersInfoAfter = await page.evaluate(() => {
    const desktopLang = document.querySelector('.nav-utilities .lang-selector-container');
    const mobileLang = document.querySelector('.mobile-lang-switcher');
    return {
      desktop: desktopLang ? desktopLang.getBoundingClientRect().top : null,
      mobile: mobileLang ? mobileLang.getBoundingClientRect().top : null
    };
  });
  console.log('Language switcher rects after change:', getLangSwitchersInfoAfter);
  
  await browser.close();
  console.log('Done!');
})();
