const fs = require('fs');
const fileLayout = 'src/components/layout/ChatLayout.jsx';
let contentLayout = fs.readFileSync(fileLayout, 'utf8');

// Add useEffect and useSocketStore to ChatLayout
if (!contentLayout.includes('listenToMessages')) {
  contentLayout = contentLayout.replace(
    /import \{ useChatStore \} from '\.\.\/\.\.\/context\/useChatStore';/,
    "import { useChatStore } from '../../context/useChatStore';\nimport { useSocketStore } from '../../context/useSocketStore';\nimport { useEffect } from 'react';"
  );
  
  contentLayout = contentLayout.replace(
    /const \{ selectedUser \} = useChatStore\(\);/,
    `const { selectedUser, listenToMessages, stopListeningToMessages } = useChatStore();
  const { socket } = useSocketStore();

  // Listen globally to messages so unread counts work even on the home screen!
  useEffect(() => {
    listenToMessages();
    return () => stopListeningToMessages();
  }, [listenToMessages, stopListeningToMessages, socket]);`
  );
  fs.writeFileSync(fileLayout, contentLayout);
  console.log('Added listener to ChatLayout.jsx');
}

const fileWindow = 'src/components/chat/ChatWindow.jsx';
let contentWindow = fs.readFileSync(fileWindow, 'utf8');

// Remove the listener from ChatWindow
contentWindow = contentWindow.replace(
  /  \/\/ Bind real-time listener when socket connects or user changes\s*useEffect\(\(\) => \{\s*listenToMessages\(\);\s*return \(\) => stopListeningToMessages\(\);\s*\}, \[selectedUser\._id, listenToMessages, stopListeningToMessages, socket\]\);/m,
  "  // Global listener is now in ChatLayout.jsx to fix the unread bug!"
);

// We should also remove the stopListeningToMessages import/destructuring from ChatWindow if it's there
// Or just leave it, it's harmless if unused.

fs.writeFileSync(fileWindow, contentWindow);
console.log('Removed listener from ChatWindow.jsx');
