const fs = require('fs');
const file = '../backend/controllers/group.controller.js';
let content = fs.readFileSync(file, 'utf8');

// Add population for lastMessage
content = content.replace(
  /\.populate\('participants', '-password'\)/g,
  ".populate('participants', '-password').populate('lastMessage')"
);

fs.writeFileSync(file, content);
