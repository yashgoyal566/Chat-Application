const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "</AnimatePresence>\n\n        )}\n\n        <form",
  "</AnimatePresence>\n\n        <form"
);

fs.writeFileSync(file, content);
