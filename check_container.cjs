const fs = require('fs');
const content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');
const match = content.match(/<div className="flex-1 overflow-y-auto px-6 pt-6 pb-\[140px\] ">/);
if (match) {
  console.log('Found the messages container!');
} else {
  console.log('Could not find the messages container.');
}
