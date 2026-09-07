const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("const [image, setImage] = useState(null);", "");
content = content.replace("const fileInputRef = useRef(null);", "");
content = content.replace("if (!content.trim() && !image) return;", "if (!content.trim()) return;");
content = content.replace("await sendMessage({ content, image });", "await sendMessage({ content });");
content = content.replace("disabled={(!content.trim() && !image) || isSending}", "disabled={!content.trim() || isSending}");

fs.writeFileSync(file, content);
