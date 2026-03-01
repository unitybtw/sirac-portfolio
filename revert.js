const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/```javascript\n/, '');
code = code.replace(/```\n/, '');
fs.writeFileSync('src/App.jsx', code);
