const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update useChatStore imports and destructuring
content = content.replace(
  /const \{ messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo \} = useChatStore\(\);/,
  'const { messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, drafts, setDraft } = useChatStore();'
);

// Update initialization to use drafts from store, and update the editable div
const oldState = /const \[content, setContent\] = useState\(\(\) => localStorage\.getItem\(`draft_\$\{selectedUser\._id\}`\) \|\| ''\);/m;
const newState = `const [content, setContent] = useState(drafts[selectedUser._id] || '');
  
  useEffect(() => {
    const draftText = drafts[selectedUser._id] || '';
    setContent(draftText);
    if (messageInputRef.current && messageInputRef.current.innerHTML !== draftText) {
      messageInputRef.current.innerHTML = draftText;
    }
  }, [selectedUser._id]);`;

content = content.replace(oldState, newState);

// Update handleInputChange to save to store instead of localStorage
content = content.replace(
  /localStorage\.setItem\(`draft_\$\{selectedUser\._id\}`, text\);/g,
  'setDraft(selectedUser._id, text);'
);

// Update handleSend to clear the draft from the store
content = content.replace(
  /localStorage\.removeItem\(`draft_\$\{selectedUser\._id\}`\);/g,
  'setDraft(selectedUser._id, "");'
);

fs.writeFileSync(file, content);
console.log('Fixed chat window drafts!');
