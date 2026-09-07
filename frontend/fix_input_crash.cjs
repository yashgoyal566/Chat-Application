const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const handleInputChange = \(e\) => \{\s*const text = e\.target\.value;/g,
  `const handleInputChange = (e) => {
    const text = e.currentTarget.innerHTML;`
);

fs.writeFileSync(file, content);
console.log('Fixed handleInputChange!');
