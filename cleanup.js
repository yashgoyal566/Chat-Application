const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Use a simple split and join to safely remove everything between line 78 and line 96
const lines = content.split('\n');

const startIndex = lines.findIndex(line => line.includes('const handleImageChange ='));
const endIndex = lines.findIndex(line => line.includes('const handleSend ='));

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex);
}

// Remove the JSX button and input
const inputIndex = lines.findIndex(line => line.includes('type="file"'));
if (inputIndex !== -1) {
  // The input and button take up around 14 lines
  lines.splice(inputIndex - 1, 14);
}

// Remove the preview block
const previewIndex = lines.findIndex(line => line.includes('{image && ('));
if (previewIndex !== -1) {
  lines.splice(previewIndex, 12);
}

fs.writeFileSync(file, lines.join('\n'));
