const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the end of the conditional rendering block to add a fallback div
content = content.replace(
  /<\/div>\n\s*\)\}/m,
  '</div>\n            ) : <div />}'
);

fs.writeFileSync(file, content);
console.log('Fixed flexbox spacing!');
