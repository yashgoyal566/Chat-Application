const fs = require('fs');

// Fix ChatSidebar.jsx
let file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /const rawDraft = drafts\[item\._id\] \|\| '';/g,
  "const rawDraft = (drafts || {})[item._id] || '';"
);
fs.writeFileSync(file, content);

// Fix ChatWindow.jsx
file = 'src/components/chat/ChatWindow.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /const \[content, setContent\] = useState\(drafts\[selectedUser\._id\] \|\| ''\);/g,
  "const [content, setContent] = useState((drafts || {})[selectedUser._id] || '');"
);
content = content.replace(
  /const draftText = drafts\[selectedUser\._id\] \|\| '';/g,
  "const draftText = (drafts || {})[selectedUser._id] || '';"
);
fs.writeFileSync(file, content);

console.log('Bulletproofed drafts even further!');
