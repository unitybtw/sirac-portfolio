import { spawn } from 'child_process';
import { chromium } from 'playwright';

(async () => {
  console.log('Starting dev server...');
  const server = spawn('npx', ['vite', '--port', '5173'], {
    cwd: '/Users/siracsimsek/denemeapp1',
    shell: true
  });

  server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('5173')) {
      console.log('Vite dev server is ready.');
    }
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`BROWSER CONSOLE ERROR: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    console.error(`BROWSER RUNTIME ERROR:\nStack: ${err.stack}\nMessage: ${err.message}`);
  });

  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  } catch (e) {
    console.error('Failed to navigate:', e);
  } finally {
    console.log('Closing browser and server...');
    await browser.close();
    server.kill('SIGINT');
    process.exit(0);
  }
})();
