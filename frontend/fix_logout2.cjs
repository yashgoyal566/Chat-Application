const fs = require('fs');
const file = 'src/context/useAuthStore.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\s*useChatStore\.getState\(\)\.setSelectedUser\(null\);/g,
  ""
);

fs.writeFileSync(file, content);
console.log('Fixed useAuthStore.js!');
