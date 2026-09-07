const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The block to replace
const originalUseEffect = `  useEffect(() => {
    getMessages(selectedUser._id);
    listenToMessages();
    return () => stopListeningToMessages();
  }, [selectedUser._id, getMessages, listenToMessages, stopListeningToMessages, socket]);`;

const newUseEffects = `  // Fetch history when user changes
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  // Bind real-time listener when socket connects or user changes
  useEffect(() => {
    listenToMessages();
    return () => stopListeningToMessages();
  }, [selectedUser._id, listenToMessages, stopListeningToMessages, socket]);`;

content = content.replace(originalUseEffect, newUseEffects);

fs.writeFileSync(file, content);
