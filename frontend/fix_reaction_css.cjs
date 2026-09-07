const fs = require('fs');
const cssFile = 'src/index.css';
let cssContent = fs.readFileSync(cssFile, 'utf8');

const reactionCss = `
/* --- Floating Reaction/Reply Bubble --- */
.reaction-incoming {
  position: absolute;
  top: -18px;
  right: -15px;
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 2px #FFFFFF; 
  z-index: 10;
  cursor: pointer;
  transition: transform 0.15s ease-out;
}
.reaction-incoming:hover { transform: scale(1.1); }
.reaction-incoming::before {
  content: "";
  position: absolute;
  bottom: -4px;
  right: 6px;
  width: 10px;
  height: 10px;
  background-color: #007AFF;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #FFFFFF;
  z-index: -1;
}
.reaction-incoming::after {
  content: "";
  position: absolute;
  bottom: -10px;
  right: 0px;
  width: 5px;
  height: 5px;
  background-color: #007AFF;
  border-radius: 50%;
  z-index: -1;
}

.reaction-outgoing {
  position: absolute;
  top: -18px;
  left: -15px;
  background-color: #E5E5EA;
  color: #8E8E93;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 2px #FFFFFF; 
  z-index: 10;
  cursor: pointer;
  transition: transform 0.15s ease-out;
}
.reaction-outgoing:hover { transform: scale(1.1); }
.reaction-outgoing::before {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 6px;
  width: 10px;
  height: 10px;
  background-color: #E5E5EA;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #FFFFFF;
  z-index: -1;
}
.reaction-outgoing::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0px;
  width: 5px;
  height: 5px;
  background-color: #E5E5EA;
  border-radius: 50%;
  z-index: -1;
}

.dark .reaction-incoming,
.dark .reaction-incoming::before,
.dark .reaction-outgoing,
.dark .reaction-outgoing::before {
  box-shadow: 0 0 0 2px #18181b;
}
.dark .reaction-outgoing {
  background-color: #262628;
}
.dark .reaction-outgoing::before,
.dark .reaction-outgoing::after {
  background-color: #262628;
}
`;

if (!cssContent.includes('.reaction-incoming')) {
  fs.writeFileSync(cssFile, cssContent + reactionCss);
}

const jsxFile = 'src/components/chat/ChatWindow.jsx';
let jsxContent = fs.readFileSync(jsxFile, 'utf8');

// Replace the messy Tailwind button with the clean CSS classes
const buttonRegex = /\{\/\* Floating Reply Button \(iMessage Reaction Style\) \*\/\}\s*<button[\s\S]*?<\/button>/m;

const newButton = `{/* Floating Reply Button (iMessage Reaction Style) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyingTo(msg);
                              }}
                              className={\`\${isMe ? 'reaction-outgoing' : 'reaction-incoming'} hidden group-hover:flex\`}
                            >
                              <Reply size={15} className="mt-[1px]" />
                            </button>`;

jsxContent = jsxContent.replace(buttonRegex, newButton);

fs.writeFileSync(jsxFile, jsxContent);
console.log('CSS applied!');
