const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `        </form>
      </div>
    </div>
  );
}`;

const replacement = `        </form>
      </div>
      {showProfilePane && (
        <RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />
      )}
    </div>
  );
}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Successfully injected at the bottom!');
} else {
  console.log('Target string NOT FOUND at the bottom!');
}
