const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove List and ListOrdered buttons
content = content.replace(
  /<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><List size=\{18\} strokeWidth=\{2\.5\} \/><\/button>\s*<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><ListOrdered size=\{18\} strokeWidth=\{2\.5\} \/><\/button>/g,
  ''
);

fs.writeFileSync(file, content);
console.log('Removed list icons');
