const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The bottom of the file
content = content.replace(
  /<\/form>\s*<\/div>\s*<\/div>\s*\);\s*\}/,
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
console.log('Fixed using robust whitespace regex!');
