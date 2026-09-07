const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 2. Remove handleImageChange and removeImage
content = content.replace(/const handleImageChange = \([\s\S]*?const removeImage = \([\s\S]*?fileInputRef\.current\.value = '';\n  \};/m, "");

// 4. Remove preview block
content = content.replace(/\{image && \([\s\S]*?<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/m, "");

// 5. Remove file input and button
content = content.replace(/<input\s+type="file"[\s\S]*?<ImageIcon size=\{18\} \/>\s*<\/button>/m, "");

fs.writeFileSync(file, content);
