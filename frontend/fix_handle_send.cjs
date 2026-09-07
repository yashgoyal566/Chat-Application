const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandleSend = /const handleSend = async \(e\) => \{[\s\S]*?socket\?\.emit\('stop_typing', \{ receiverId: selectedUser\._id \}\);\n\s*\};/m;

const newHandleSend = `const handleSend = async (e) => {
    e.preventDefault();
    const htmlContent = messageInputRef.current ? messageInputRef.current.innerHTML : content;
    const strippedContent = (htmlContent || '').replace(/<[^>]*>?/gm, '').trim();
    if (!strippedContent) return;
    if (isSending) return;
    
    setIsSending(true);
    await sendMessage({ content: htmlContent });
    setIsSending(false);
    
    setContent('');
    if (messageInputRef.current) messageInputRef.current.innerHTML = '';
    localStorage.removeItem(\`draft_\${selectedUser._id}\`);
    socket?.emit('stop_typing', { receiverId: selectedUser._id });
    if (replyingTo) setReplyingTo(null);
  };`;

content = content.replace(oldHandleSend, newHandleSend);

fs.writeFileSync(file, content);
console.log('Fixed handleSend!');
