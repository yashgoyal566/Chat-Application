const fs = require('fs');
const file = 'src/context/useAuthStore.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { useChatStore } from './useChatStore';\n", "");
content = content.replace("      useChatStore.getState().setSelectedUser(null);\n", "");

fs.writeFileSync(file, content);
console.log('Reverted useAuthStore.js');
