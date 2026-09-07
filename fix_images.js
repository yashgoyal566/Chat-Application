const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove useState and useRef
content = content.replace("const [image, setImage] = useState(null);\n  ", "");
content = content.replace("const fileInputRef = useRef(null);\n  ", "");

// 2. Remove handleImageChange and removeImage
content = content.replace(/const handleImageChange = \(e\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n  \};\n\n  const removeImage = \(\) => \{[\s\S]*?fileInputRef\.current\.value = '';\n  \};\n\n/m, "");

// 3. Update handleSend
content = content.replace("if (!content.trim() && !image) return;", "if (!content.trim()) return;");
content = content.replace("await sendMessage({ content, image });", "await sendMessage({ content });");
content = content.replace("setImage(null);\n    if (fileInputRef.current) fileInputRef.current.value = '';\n    ", "");

// 4. Remove preview block
content = content.replace(/\{image && \([\s\S]*?<\/button>\n            <\/div>\n          <\/div>\n        \)\}\n/m, "");

// 5. Remove file input and button
content = content.replace(/<input\n\s*type="file"[\s\S]*?onChange=\{handleImageChange\}\n\s*\/>\n\s*<button\n\s*type="button"[\s\S]*?<ImageIcon size=\{18\} \/>\n\s*<\/button>\n/m, "");

// 6. Update disabled prop
content = content.replace("disabled={(!content.trim() && !image) || isSending}", "disabled={!content.trim() || isSending}");

fs.writeFileSync(file, content);
