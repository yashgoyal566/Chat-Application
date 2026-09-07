const fs = require('fs');
const file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Append the CSS for the iMessage tails
const tailCss = `

/* iMessage CSS Tails */
.imessage-outgoing {
  border-bottom-right-radius: 4px !important;
}
.imessage-outgoing::before {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 0;
  right: -8px;
  height: 20px;
  width: 20px;
  background: #007AFF;
  border-bottom-left-radius: 15px;
}
.imessage-outgoing::after {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 0;
  right: -10px;
  width: 10px;
  height: 20px;
  background: #ffffff;
  border-bottom-left-radius: 10px;
}

.imessage-incoming {
  border-bottom-left-radius: 4px !important;
}
.imessage-incoming::before {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 0;
  left: -8px;
  height: 20px;
  width: 20px;
  background: #E5E5EA;
  border-bottom-right-radius: 15px;
}
.imessage-incoming::after {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 0;
  left: -10px;
  width: 10px;
  height: 20px;
  background: #ffffff;
  border-bottom-right-radius: 10px;
}

.dark .imessage-outgoing::after,
.dark .imessage-incoming::after {
  background: #18181b; /* bg-zinc-900 */
}
.dark .imessage-incoming::before {
  background: #262628;
}
`;

if (!content.includes('.imessage-outgoing')) {
  fs.writeFileSync(file, content + tailCss);
}
