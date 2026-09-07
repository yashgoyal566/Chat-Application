const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes('RightProfilePane')) {
  content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport RightProfilePane from './RightProfilePane';"
  );
}

// 2. Add showProfilePane state
if (!content.includes('showProfilePane')) {
  content = content.replace(
    /const \[isSending, setIsSending\] = useState\(false\);/,
    "const [isSending, setIsSending] = useState(false);\n  const [showProfilePane, setShowProfilePane] = useState(false);"
  );
}

// 3. Update the layout wrapper
content = content.replace(
  /<div \n\s*className="relative flex h-full flex-col dark:bg-zinc-900"/m,
  `<div className="flex h-full w-full overflow-hidden">
      <div 
        className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"`
);

// 4. Update the header to be clickable
content = content.replace(
  /<div className="flex items-center gap-3">/g,
  `<div onClick={() => setShowProfilePane(!showProfilePane)} className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">`
);

// 5. Append the RightProfilePane before the final closing div of the component
// Since we wrapped it in a new div, we need to add a closing div and the pane at the very end
content = content.replace(
  /<\/div>\n\s*\);\n\}\n$/m,
  `    </div>\n      {showProfilePane && (\n        <RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />\n      )}\n    </div>\n  );\n}\n`
);

fs.writeFileSync(file, content);
console.log('Updated ChatWindow.jsx!');
