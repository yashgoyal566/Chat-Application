const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find and replace using regex to ignore line ending issues
const originalRegex = /useEffect\(\(\) => \{\s*getMessages\(selectedUser\._id\);\s*listenToMessages\(\);\s*return \(\) => stopListeningToMessages\(\);\s*\}, \[selectedUser\._id, getMessages, listenToMessages, stopListeningToMessages, socket\]\);/m;

const newUseEffects = `  // Fetch history when user changes
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  // Bind real-time listener when socket connects or user changes
  useEffect(() => {
    listenToMessages();
    return () => stopListeningToMessages();
  }, [selectedUser._id, listenToMessages, stopListeningToMessages, socket]);`;

content = content.replace(originalRegex, newUseEffects);
fs.writeFileSync(file, content);
