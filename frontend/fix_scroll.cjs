const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Insert useRef for previous messages length
if (!content.includes('prevMessagesLengthRef')) {
  content = content.replace(
    /const messagesEndRef = useRef\(null\);/,
    "const messagesEndRef = useRef(null);\n  const prevMessagesLengthRef = useRef(0);"
  );
}

// Replace the naive smooth scrolling with intelligent scrolling
content = content.replace(
  /useEffect\(\(\) => \{\s*messagesEndRef\.current\?\.scrollIntoView\(\{ behavior: 'smooth' \}\);\s*\}, \[messages\]\);/,
  `useEffect(() => {
    const isNewMessage = messages.length === prevMessagesLengthRef.current + 1;
    messagesEndRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto' });
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);`
);

fs.writeFileSync(file, content);
console.log('Fixed scroll animation on load!');
