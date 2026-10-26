const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The current buttons in ChatWindow.jsx look like this:
// className="hover:opacity-80 transition-opacity"

// We want to replace it with a button hover effect that adds a background circle and scales the icon slightly.
// For incoming (blue pill), hover:bg-white/20
// For outgoing (grey pill), hover:bg-black/10

const incomingMenuRegex = /<div className=\{isMe \? 'reaction-outgoing flex items-center gap-2' : 'reaction-incoming flex items-center gap-2'\}>\s*<button[\s\S]*?<\/div>/m;

const match = content.match(incomingMenuRegex);

if (match) {
  const newMenu = `
                            {/* Floating Hover Actions */}
                            <div className={isMe ? 'reaction-outgoing flex items-center gap-1' : 'reaction-incoming flex items-center gap-1'}>
                              <button
                                type="button"
                                onClick={() => togglePinMessage(msg._id)}
                                aria-label="Pin message"
                                className={\`p-1.5 rounded-full transition-all \${isMe ? 'hover:bg-black/10' : 'hover:bg-white/20 hover:scale-110'}\`}
                              >
                                <Pin size={17} className={msg.isPinned ? "fill-current" : ""} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setReplyingTo(msg)}
                                aria-label="Reply to message"
                                className={\`p-1.5 rounded-full transition-all \${isMe ? 'hover:bg-black/10' : 'hover:bg-white/20 hover:scale-110'}\`}
                              >
                                <Reply size={17} />
                              </button>
                            </div>`;
                            
  content = content.replace(match[0], newMenu.trim());
  fs.writeFileSync(file, content);
  console.log('Updated ChatWindow button hovers!');
}
