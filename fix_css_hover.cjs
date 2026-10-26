const fs = require('fs');
const file = 'frontend/src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Remove container scaling
content = content.replace(/\.reaction-incoming:hover\s*\{.*?transform: scale\(1\.1\).*?\}/, '');
content = content.replace(/\.reaction-outgoing:hover\s*\{.*?transform: scale\(1\.1\).*?\}/, '');

// Also fix the weird "peanut" shape in the screenshot if gap/padding isn't right.
// The peanut shape happened because it's rendering two circles overlapping, or something?
// No, the peanut shape is probably because there are TWO `::before` or something, or just the border-radius.
// Actually, it looks like a peanut because maybe the height is 36px and width is auto, border-radius 20px is fine. Let's make it a clean pill.

fs.writeFileSync(file, content);
console.log('Removed container scaling from index.css!');
