const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the bubble classes
content = content.replace(
  /'bg-blue-600 text-white rounded-br-sm'/g,
  "'bg-[#007AFF] text-white rounded-br-sm'"
);

// We already applied the #E5E5EA one, let's verify if we need to adjust dark mode
content = content.replace(
  /'bg-\[#E5E5EA\] text-black rounded-bl-sm dark:bg-\[#3A3A3C\] dark:text-white'/g,
  "'bg-[#E5E5EA] text-black rounded-bl-sm dark:bg-[#262628] dark:text-white'"
);

fs.writeFileSync(file, content);
