const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
const formIndex = lines.findIndex(line => line.includes('<form'));

if (formIndex !== -1 && lines[formIndex - 2] && lines[formIndex - 2].includes(')}')) {
  lines.splice(formIndex - 2, 1);
} else if (formIndex !== -1 && lines[formIndex - 1] && lines[formIndex - 1].includes(')}')) {
  lines.splice(formIndex - 1, 1);
}

fs.writeFileSync(file, lines.join('\n'));
