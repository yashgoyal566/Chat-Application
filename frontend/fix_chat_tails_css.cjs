const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the inline SVGs and the bubble classes with the new classes
const svgRegex = /\{\/\* iMessage SVG Tails \*\/\}\s*\{isMe \? \(\s*<svg viewBox="0 0 8 13" width="8" height="13" className="absolute -right-\[7px\] bottom-\[0px\] text-\[#007AFF\] fill-current">\s*<path d="M\.522\.616c\.394 2\.82 2\.19 6\.208 7\.373 8\.356v3\.136c-5\.748-1\.547-8\.326-6\.136-7\.89-11\.492H\.523Z" \/>\s*<\/svg>\s*\) : \(\s*<svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-\[7px\] bottom-\[0px\] text-\[#E5E5EA\] dark:text-\[#262628\] fill-current">\s*<path d="M7\.478\.616C7\.084 3\.436 5\.288 6\.824\.105 8\.972v3\.136c5\.748-1\.547 8\.326-6\.136 7\.89-11\.492H7\.477Z" \/>\s*<\/svg>\s*\)\}/m;

content = content.replace(svgRegex, '');

// Update the bubble's class string to inject 'imessage-outgoing' or 'imessage-incoming'
content = content.replace(
  /isMe\s*\?\s*'bg-\[#007AFF\] text-white rounded-br-\[4px\]'\s*:\s*'bg-\[#E5E5EA\] text-black rounded-bl-\[4px\] dark:bg-\[#262628\] dark:text-white'/m,
  "isMe\n                                ? 'bg-[#007AFF] text-white imessage-outgoing'\n                                : 'bg-[#E5E5EA] text-black imessage-incoming dark:bg-[#262628] dark:text-white'"
);

fs.writeFileSync(file, content);
console.log('Done!');
