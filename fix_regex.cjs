const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

const regex = /useEffect\(\(\) => \{\s*const isNewMessage = messages\.length === prevMessagesLengthRef\.current \+ 1;\s*messagesEndRef\.current\?\.scrollIntoView\(\{ behavior: isNewMessage \? 'smooth' : 'auto' \}\);\s*prevMessagesLengthRef\.current = messages\.length;\s*\}, \[messages\]\);/g;

const fixedEffect = `useEffect(() => {
    if (messages.length !== prevMessagesLengthRef.current) {
      const isNewMessage = messages.length === prevMessagesLengthRef.current + 1;
      messagesEndRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto' });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);`;

content = content.replace(regex, fixedEffect);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Fixed via regex!');
