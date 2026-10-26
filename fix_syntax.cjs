const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

content = content.replace(
  /\}\n    \},\n    setDraft:/,
  `},\n    setDraft:`
);

fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Fixed syntax error!');
