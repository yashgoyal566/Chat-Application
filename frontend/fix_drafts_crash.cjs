const fs = require('fs');

// Fix ChatSidebar.jsx
let file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /const \{ users, getUsers, selectedUser, setSelectedUser, isUsersLoading, conversations, drafts \} = useChatStore\(\);/,
  'const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading, conversations, drafts = {} } = useChatStore();'
);
fs.writeFileSync(file, content);

// Fix ChatWindow.jsx
file = 'src/components/chat/ChatWindow.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /const \{ messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, drafts, setDraft \} = useChatStore\(\);/,
  'const { messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, drafts = {}, setDraft } = useChatStore();'
);
fs.writeFileSync(file, content);

console.log('Bulletproofed drafts!');
