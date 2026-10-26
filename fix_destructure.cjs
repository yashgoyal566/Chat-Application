const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

// The destructuring line:
// const { messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, drafts = {}, setDraft } = useChatStore();

content = content.replace(
  /const \{ messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, drafts = \{\}, setDraft \} = useChatStore\(\);/,
  "const { messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, drafts = {}, setDraft, togglePinMessage } = useChatStore();"
);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Added togglePinMessage to ChatWindow.jsx!');
