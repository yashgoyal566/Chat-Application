const fs = require('fs');
const file = 'src/context/useAuthStore.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useChatStore \} from '\.\/useChatStore';\r?\n?/g, '');

fs.writeFileSync(file, content);
console.log('Fixed circular dependency!');
