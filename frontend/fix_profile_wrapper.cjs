const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Wrap the return statement
content = content.replace(
  /return \(\n\s*<div \n\s*className="relative flex h-full flex-col dark:bg-zinc-900"/m,
  `return (
    <div className="flex h-full w-full overflow-hidden">
      <div 
        className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"`
);

// 2. Add the profile pane at the end
content = content.replace(
  /<\/div>\n\s*\);\n\}\n$/m,
  `      </div>
      {showProfilePane && (
        <RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />
      )}
    </div>
  );
}\n`
);

fs.writeFileSync(file, content);
console.log('Fixed the profile pane wrapper!');
