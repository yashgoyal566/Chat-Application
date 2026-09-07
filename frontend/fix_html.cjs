const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Inject the helper function right before the ChatWindow component
if (!content.includes('const getPreviewText')) {
  content = content.replace(
    /export default function ChatWindow\(\) \{/,
    "const getPreviewText = (html) => {\n  if (!html) return '';\n  const doc = new DOMParser().parseFromString(html, 'text/html');\n  return doc.body.textContent || '';\n};\n\nexport default function ChatWindow() {"
  );
}

// Fix handleSend to use the helper function so empty spaces are correctly blocked
content = content.replace(
  /const strippedContent = \(htmlContent \|\| ''\)\.replace\(\/<\[\^>\]\*\>\?\/gm, ''\)\.trim\(\);/,
  "const strippedContent = getPreviewText(htmlContent).trim();"
);

// Fix msg.replyTo.content inside the message list
content = content.replace(
  /\{msg\.replyTo\.content\}/g,
  "{getPreviewText(msg.replyTo.content)}"
);

// Fix replyingTo.content inside the floating input area
content = content.replace(
  /\{replyingTo\.content\}/g,
  "{getPreviewText(replyingTo.content)}"
);

fs.writeFileSync(file, content);
console.log('Fixed blank spaces and raw HTML in replies!');
