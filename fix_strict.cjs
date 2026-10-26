const fs = require('fs');
let content = fs.readFileSync('backend/controllers/message.controller.js', 'utf8');

const oldToggle = /message\.isPinned = !message\.isPinned;\s*await message\.save\(\);\s*console\.log\("=> MESSAGE SAVED:", message\.isPinned\);/g;

const newToggle = `const newValue = !message.isPinned;
    // Force the update in DB bypassing schema strict mode in case nodemon didn't restart
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { isPinned: newValue } },
      { new: true, strict: false }
    );
    message.isPinned = newValue;
    console.log("=> MESSAGE SAVED:", updatedMessage.isPinned);`;

content = content.replace(oldToggle, newToggle);

fs.writeFileSync('backend/controllers/message.controller.js', content);
console.log('Fixed backend controller to bypass strict mode!');
