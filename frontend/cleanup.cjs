const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the duplicate wrappers at the top
content = content.replace(
  /return \(\s*<div className="flex h-full w-full overflow-hidden">\s*<div className="flex h-full w-full overflow-hidden">\s*<div\s+className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"/m,
  `return (
    <div className="flex h-full w-full overflow-hidden">
      <div 
        className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"`
);

// Fix the bottom closing tags (removing any duplicate </div>)
content = content.replace(
  /<\/form>\s*<\/div>\s*\{showProfilePane && \(\s*<RightProfilePane user=\{selectedUser\} onClose=\{\(\) => setShowProfilePane\(false\)\} \/>\s*\)\}\s*<\/div>\s*<\/div>\s*\);\s*\}/m,
  `        </form>
      </div>
      {showProfilePane && (
        <RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />
      )}
    </div>
  );
}`
);

// If the bottom was already fine, just do a normal replace
content = content.replace(
  /<\/form>\s*<\/div>\s*\{showProfilePane && \(\s*<RightProfilePane user=\{selectedUser\} onClose=\{\(\) => setShowProfilePane\(false\)\} \/>\s*\)\}\s*<\/div>\s*\);\s*\}/m,
  `        </form>
      </div>
      {showProfilePane && (
        <RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />
      )}
    </div>
  );
}`
);

fs.writeFileSync(file, content);
console.log('Cleaned up the duplicate tags!');
