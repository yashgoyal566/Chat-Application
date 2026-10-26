const fs = require('fs');
const file = 'frontend/src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Update reaction-incoming
content = content.replace(
  /\.reaction-incoming \{[\s\S]*?width: 36px;\s*height: 36px;/,
  `.reaction-incoming {
    position: absolute;
    top: -18px;
    right: -15px;
    background-color: #0042d5;
    color: #FFFFFF;
    border-radius: 20px;
    width: auto;
    min-width: 36px;
    height: 36px;
    padding: 0 12px;
    gap: 12px;`
);

// Update reaction-outgoing
content = content.replace(
  /\.reaction-outgoing \{[\s\S]*?width: 36px;\s*height: 36px;/,
  `.reaction-outgoing {
    position: absolute;
    top: -18px;
    left: -15px;
    background-color: #E5E5EA;
    color: #8E8E93;
    border-radius: 20px;
    width: auto;
    min-width: 36px;
    height: 36px;
    padding: 0 12px;
    gap: 12px;`
);

fs.writeFileSync(file, content);
console.log('Fixed CSS for reaction menu!');
