const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

const brokenEffect = `    useEffect(() => {
      const isNewMessage = messages.length === prevMessagesLengthRef.current + 1;
      messagesEndRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto' });
      prevMessagesLengthRef.current = messages.length;
    }, [messages]);`;

const fixedEffect = `    useEffect(() => {
      if (messages.length !== prevMessagesLengthRef.current) {
        const isNewMessage = messages.length === prevMessagesLengthRef.current + 1;
        messagesEndRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto' });
        prevMessagesLengthRef.current = messages.length;
      }
    }, [messages.length]);`;

content = content.replace(brokenEffect, fixedEffect);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Fixed scroll to bottom bug AGAIN!');
