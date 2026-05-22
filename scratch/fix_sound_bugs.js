import fs from 'fs';
import path from 'path';

const srcDir = '/Users/siracsimsek/denemeapp1/src';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Replace new (window.AudioContext || window.webkitAudioContext)() with a shared version
  // and resume if suspended.
  // We look for where the audioCtx is declared and instantiated.
  // Pattern: const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const searchPattern = /const\s+audioCtx\s*=\s*new\s*\(\s*window\.AudioContext\s*\|\|\s*window\.webkitAudioContext\s*\)\(\);/g;
  const replacement = `const audioCtx = window.sharedAudioCtx || (window.sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)());
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }`;

  content = content.replace(searchPattern, replacement);

  // We also have one case in CyberPiano.jsx: if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const pianoPattern = /if\s*\(!audioCtx\)\s*audioCtx\s*=\s*new\s*\(\s*window\.AudioContext\s*\|\|\s*window\.webkitAudioContext\s*\)\(\);/g;
  const pianoReplacement = `if (!audioCtx) {
                audioCtx = window.sharedAudioCtx || (window.sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)());
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume().catch(() => {});
                }
            }`;
  content = content.replace(pianoPattern, pianoReplacement);

  // 2. Fix the collision logic where playSound is called outside the if block.
  // Look for lines like: if (CONDITION) STATEMENT; playSound('bump');
  const lines = content.split('\n');
  const processedLines = lines.map(line => {
    // Check if the line has `if`, doesn't have `{`, contains a semicolon followed by `playSound`, and matches collision patterns.
    // e.g., if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.dy *= -1; playSound('bump');
    const regex = /^(\s*)if\s*\(([^)]+)\)\s*([^;{]+);\s*(playSound\([^)]+\);)/;
    const match = line.match(regex);
    if (match) {
      const indent = match[1];
      const condition = match[2];
      const statement = match[3].trim();
      const playSoundCall = match[4].trim();
      console.log(`Fixing collision in ${path.basename(filePath)}: ${line.trim()}`);
      return `${indent}if (${condition}) { ${statement}; ${playSoundCall} }`;
    }
    return line;
  });

  content = processedLines.join('\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        scanDir(fullPath);
      }
    } else if (file.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

scanDir(srcDir);
console.log('Done processing all files.');
