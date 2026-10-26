const fs = require('fs');
let content = fs.readFileSync('backend/controllers/message.controller.js', 'utf8');

// Replace the try block to add logs
content = content.replace(
  /export const togglePinMessage = async \(req, res\) => \{\s*try \{/,
  `export const togglePinMessage = async (req, res) => {\n  try {\n    console.log("=> TOGGLE PIN API HIT for message:", req.params.id);`
);

content = content.replace(
  /message\.isPinned = !message\.isPinned;\s*await message\.save\(\);/,
  `message.isPinned = !message.isPinned;\n    await message.save();\n    console.log("=> MESSAGE SAVED:", message.isPinned);`
);

content = content.replace(
  /if \(socketId\) \{\s*io\.to\(socketId\)\.emit\("message_updated"/g,
  `if (socketId) {\n          console.log("=> EMITTING TO SOCKET:", socketId);\n          io.to(socketId).emit("message_updated"`
);

content = content.replace(
  /console\.error\("Error toggling pin:", error\);/,
  `console.error("=> ERROR TOGGLING PIN:", error);`
);

fs.writeFileSync('backend/controllers/message.controller.js', content);
console.log('Injected backend logs!');
