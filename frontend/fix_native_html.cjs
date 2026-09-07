const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Use dangerouslySetInnerHTML instead of the custom parser so it natively handles `<br>`, `<div>`, `<b>`, `<strong>` etc. from contentEditable.
content = content.replace(
  /\{msg\.content && <span className="mb-0\.5 whitespace-pre-wrap">\{parseFormattedText\(msg\.content\)\}<\/span>\}/g,
  '{msg.content && <span className="mb-0.5 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.content }} />}'
);

content = content.replace(
  /<span className="line-clamp-2">\{parseFormattedText\(msg\.replyTo\.content\)\}<\/span>/g,
  '<span className="line-clamp-2" dangerouslySetInnerHTML={{ __html: msg.replyTo.content }} />'
);

fs.writeFileSync(file, content);
console.log('Switched to native HTML rendering for WYSIWYG support!');
