import { spawn } from 'child_process';
import { chromium, devices } from 'playwright';

(async () => {
  console.log('Starting preview...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: '/Users/siracsimsek/denemeapp1',
    shell: true
  });

  server.stdout.on('data', (data) => console.log(`[Vite]: ${data.toString().trim()}`));
  await new Promise(resolve => setTimeout(resolve, 3000));

  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const context = await browser.newContext(iPhone12);
  const page = await context.newPage();

  page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
  page.on('pageerror', err => console.error(`BROWSER ERROR: ${err.message}`));

  try {
    console.log('Visiting page...');
    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(5000);
  } catch (e) {
    console.error('Visit failed:', e);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
})();
