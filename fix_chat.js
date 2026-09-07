const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'useChatStore();`n  const { socket }',
  'useChatStore();\n  const { socket }'
);

content = content.replace(
  '  }, [selectedUser._id, getMessages, listenToMessages, stopListeningToMessages]);',
  '  }, [selectedUser._id, getMessages, listenToMessages, stopListeningToMessages, socket]);'
);

fs.writeFileSync(file, content);
