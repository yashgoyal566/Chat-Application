const fs = require('fs');
const file = 'backend/sockets/socket.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "if (userId) {\n      delete userSocketMap[userId];",
  "if (userId && userSocketMap[userId] === socket.id) {\n      delete userSocketMap[userId];"
);

// also fix the console log if it was placed awkwardly
fs.writeFileSync(file, content);
