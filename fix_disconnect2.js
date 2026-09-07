const fs = require('fs');
const file = 'backend/sockets/socket.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /if \(userId\) \{\s*delete userSocketMap\[userId\];/m,
  "if (userId && userSocketMap[userId] === socket.id) {\n      delete userSocketMap[userId];"
);

fs.writeFileSync(file, content);
