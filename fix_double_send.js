const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add isSending state
content = content.replace(
  "const [isTyping, setIsTyping] = useState(false);",
  "const [isTyping, setIsTyping] = useState(false);\n  const [isSending, setIsSending] = useState(false);"
);

// Update handleSend
content = content.replace(
  /const handleSend = async \(e\) => {[\s\S]*?await sendMessage\(\{ content, image \}\);/m,
  `const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    if (isSending) return;
    
    setIsSending(true);
    await sendMessage({ content, image });
    setIsSending(false);`
);

// Update submit button disabled state
content = content.replace(
  "disabled={!content.trim() && !image}",
  "disabled={(!content.trim() && !image) || isSending}"
);

fs.writeFileSync(file, content);
