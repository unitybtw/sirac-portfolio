const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filesToUpdate = {
  indexHtml: path.join(__dirname, 'index.html'),
  adsTxt: path.join(__dirname, 'public', 'ads.txt'),
  adSenseJsx: path.join(__dirname, 'src', 'AdSense.jsx'),
  gameLibraryJsx: path.join(__dirname, 'src', 'GameLibrary.jsx')
};

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '   Google AdSense Configuration Setup Tool');
console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('This script will configure your AdSense setup with your actual credentials.');

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function run() {
  try {
    // 1. Ask for Publisher ID
    let pubId = await askQuestion('\nEnter your Google AdSense Publisher ID (e.g., pub-1234567890123456):\n> ');
    pubId = pubId.trim();
    if (!pubId) {
      console.log('\x1b[31m%s\x1b[0m', 'Error: Publisher ID cannot be empty.');
      rl.close();
      return;
    }
    
    // Ensure format is pub-xxxxxxxxxxxxxxxx or ca-pub-xxxxxxxxxxxxxxxx
    if (!pubId.startsWith('pub-')) {
      if (pubId.startsWith('ca-pub-')) {
        pubId = pubId.substring(3);
      } else {
        pubId = 'pub-' + pubId;
      }
    }
    
    const validPubRegex = /^pub-\d{16}$/;
    if (!validPubRegex.test(pubId)) {
      console.log('\x1b[33m%s\x1b[0m', `Warning: Publisher ID format is typically pub- followed by 16 digits (e.g., pub-1234567890123456). Got: "${pubId}"`);
      const confirm = await askQuestion('Proceed anyway? (y/n): ');
      if (confirm.toLowerCase() !== 'y') {
        rl.close();
        return;
      }
    }

    // 2. Ask for Scoreboard Slot ID
    let scoreboardSlot = await askQuestion('\nEnter your Scoreboard Ad Slot ID (e.g., 1234567890) [Press Enter to keep placeholder]:\n> ');
    scoreboardSlot = scoreboardSlot.trim();
    if (!scoreboardSlot) {
      scoreboardSlot = '0000000000';
    }

    // 3. Ask for Games Grid Slot ID
    let gamesGridSlot = await askQuestion('\nEnter your Games Grid Ad Slot ID (e.g., 1234567890) [Press Enter to keep placeholder]:\n> ');
    gamesGridSlot = gamesGridSlot.trim();
    if (!gamesGridSlot) {
      gamesGridSlot = '0000000000';
    }

    // 4. Ask for Pre-roll Ad Slot ID
    let prerollSlot = await askQuestion('\nEnter your Game Pre-roll Ad Slot ID (e.g., 1234567890) [Press Enter to keep placeholder]:\n> ');
    prerollSlot = prerollSlot.trim();
    if (!prerollSlot) {
      prerollSlot = '0000000000';
    }

    console.log('\n--------------------------------------------------');
    console.log(`Configuring with:`);
    console.log(`  Publisher ID: ${pubId}`);
    console.log(`  Scoreboard Ad Slot: ${scoreboardSlot}`);
    console.log(`  Games Grid Ad Slot: ${gamesGridSlot}`);
    console.log(`  Pre-roll Ad Slot: ${prerollSlot}`);
    console.log('--------------------------------------------------\n');

    // 5. Update index.html
    if (fs.existsSync(filesToUpdate.indexHtml)) {
      let content = fs.readFileSync(filesToUpdate.indexHtml, 'utf8');
      content = content.replace(/client=ca-pub-\d+/g, `client=ca-${pubId}`);
      fs.writeFileSync(filesToUpdate.indexHtml, content, 'utf8');
      console.log('\x1b[32m%s\x1b[0m', '✓ Updated index.html');
    } else {
      console.log('\x1b[31m%s\x1b[0m', '✗ index.html not found!');
    }

    // 6. Update public/ads.txt
    if (fs.existsSync(filesToUpdate.adsTxt)) {
      let content = fs.readFileSync(filesToUpdate.adsTxt, 'utf8');
      content = content.replace(/pub-\d+/g, pubId);
      fs.writeFileSync(filesToUpdate.adsTxt, content, 'utf8');
      console.log('\x1b[32m%s\x1b[0m', '✓ Updated public/ads.txt');
    } else {
      console.log('\x1b[31m%s\x1b[0m', '✗ public/ads.txt not found!');
    }

    // 7. Update src/AdSense.jsx
    if (fs.existsSync(filesToUpdate.adSenseJsx)) {
      let content = fs.readFileSync(filesToUpdate.adSenseJsx, 'utf8');
      content = content.replace(/data-ad-client="ca-pub-\d+"/g, `data-ad-client="ca-${pubId}"`);
      fs.writeFileSync(filesToUpdate.adSenseJsx, content, 'utf8');
      console.log('\x1b[32m%s\x1b[0m', '✓ Updated src/AdSense.jsx');
    } else {
      console.log('\x1b[31m%s\x1b[0m', '✗ src/AdSense.jsx not found!');
    }

    // 8. Update src/GameLibrary.jsx
    if (fs.existsSync(filesToUpdate.gameLibraryJsx)) {
      let content = fs.readFileSync(filesToUpdate.gameLibraryJsx, 'utf8');
      
      // Replace Scoreboard Slot
      const scoreboardAdRegex = /(\{\/\* AdSense Unit in Scoreboard \(Placeholder Slot ID\) \*\/\}\s*<AdSense slot=")\d+(")/;
      content = content.replace(scoreboardAdRegex, `$1${scoreboardSlot}$2`);
      
      // Replace Games Grid Slot
      const gamesGridAdRegex = /(\{\/\* AdSense Unit in Games Grid \(Placeholder Slot ID\) \*\/\}\s*<AdSense slot=")\d+(")/;
      content = content.replace(gamesGridAdRegex, `$1${gamesGridSlot}$2`);

      // Replace Pre-roll Slot
      const prerollAdRegex = /(\{\/\* Pre-roll Ad Unit Slot \(Placeholder Slot ID\) \*\/\}\s*<div[^>]*>\s*<AdSense slot=")\d+(")/;
      content = content.replace(prerollAdRegex, `$1${prerollSlot}$2`);

      fs.writeFileSync(filesToUpdate.gameLibraryJsx, content, 'utf8');
      console.log('\x1b[32m%s\x1b[0m', '✓ Updated src/GameLibrary.jsx');
    } else {
      console.log('\x1b[31m%s\x1b[0m', '✗ src/GameLibrary.jsx not found!');
    }

    console.log('\n\x1b[32m%s\x1b[0m', 'Configuration successfully updated!');
    console.log('\nNext step: Run "npm run deploy" to rebuild and push changes to production.');
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'An error occurred during setup:', error);
  } finally {
    rl.close();
  }
}

run();
