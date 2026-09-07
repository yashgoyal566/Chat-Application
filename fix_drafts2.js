const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('localStorage.getItem(`draft_${selectedUser._id}`) || \'\');\n  }, [selectedUser._id]);')) {
  content = content.replace(
    /useEffect\(\(\) => \{\s*messagesEndRef\.current\?\.scrollIntoView\(\{ behavior: 'smooth' \}\);\s*\}, \[messages\]\);/m,
    `useEffect(() => {
    setContent(localStorage.getItem(\`draft_\${selectedUser._id}\`) || '');
  }, [selectedUser._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);`
  );
  fs.writeFileSync(file, content);
}
