const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

content = content.replace(/\}\s*\}\,\s*setDraft:/g, '},\n  setDraft:');

fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Fixed regex whitespace!');
