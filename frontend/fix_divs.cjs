const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<\/form>\s*<\/div>\s*\{showProfilePane && \(/m,
  `        </form>
      </div>
      </div>
      {showProfilePane && (`
);

fs.writeFileSync(file, content);
console.log('Added missing closing div!');
