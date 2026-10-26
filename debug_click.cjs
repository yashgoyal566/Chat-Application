const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

content = content.replace(
  /onClick=\{\(e\) => \{ e\.stopPropagation\(\); togglePinMessage\(msg\._id\); \}\}/g,
  `onClick={(e) => { 
    e.stopPropagation(); 
    console.log("PIN BUTTON CLICKED FOR:", msg._id);
    togglePinMessage(msg._id); 
  }}`
);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Added console.log to Pin button onClick!');
