const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{\(content \|\| ''\)\.replace\(\/<\[\^>\]\*\>\?\/gm, ''\)\.trim\(\) && \(/g,
  "{getPreviewText(content).trim() && ("
);

// There might be another place where the toolbar left-side formatting icons are shown?
// Let's check for any other .replace(/<[^>]*>?/gm, '')
content = content.replace(
  /\{\(\(content \|\| ''\)\.replace\(\/<\[\^>\]\*\>\?\/gm, ''\)\.trim\(\) \|\| isInputFocused\) \? \(/g,
  "{((getPreviewText(content).trim()) || isInputFocused) ? ("
);

fs.writeFileSync(file, content);
console.log('Fixed button visibility!');
