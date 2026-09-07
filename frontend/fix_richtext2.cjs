const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject parseFormattedText helper function right before the component
const helperFunc = `
const parseFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(<\\/?b>|<\\/?i>|<\\/?u>)/g);
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  
  return parts.map((part, index) => {
    if (part === '<b>') { isBold = true; return null; }
    if (part === '</b>') { isBold = false; return null; }
    if (part === '<i>') { isItalic = true; return null; }
    if (part === '</i>') { isItalic = false; return null; }
    if (part === '<u>') { isUnderline = true; return null; }
    if (part === '</u>') { isUnderline = false; return null; }
    
    if (!part) return null;
    
    let className = "";
    if (isBold) className += "font-bold ";
    if (isItalic) className += "italic ";
    if (isUnderline) className += "underline ";
    
    if (className) {
      return <span key={index} className={className}>{part}</span>;
    }
    return <span key={index}>{part}</span>;
  });
};
`;
if (!content.includes('parseFormattedText')) {
  content = content.replace('export default function ChatWindow() {', helperFunc + '\nexport default function ChatWindow() {');
}

// 2. Inject insertFormatting inside the component (after setContent)
const insertFormattingFunc = `
  const insertFormatting = (tag) => {
    if (!messageInputRef.current) return;
    const input = messageInputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    // We must use the latest content state
    setContent((prev) => {
      const selectedText = prev.substring(start, end);
      const beforeText = prev.substring(0, start);
      const afterText = prev.substring(end);
      
      const newContent = beforeText + \`<\${tag}>\${selectedText}</\${tag}>\` + afterText;
      
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
      }, 0);
      
      return newContent;
    });
  };
`;
if (!content.includes('insertFormatting')) {
  content = content.replace('const handleSend = async (e) => {', insertFormattingFunc + '\n  const handleSend = async (e) => {');
}

// 3. Update the render logic for messages
// Let's find exactly how the message content is rendered
content = content.replace(
  /<span className=\{`block whitespace-pre-wrap break-words[^>]+`\}>\s*\{msg\.content\}\s*<\/span>/g,
  (match) => match.replace('{msg.content}', '{parseFormattedText(msg.content)}')
);

// Update buttons in the toolbar
content = content.replace(
  /<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Bold size=\{18\} strokeWidth=\{2\.5\} \/><\/button>/,
  '<button type="button" onClick={() => insertFormatting(\'b\')} className="hover:text-zinc-600 dark:hover:text-zinc-300"><Bold size={18} strokeWidth={2.5} /></button>'
);
content = content.replace(
  /<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Italic size=\{18\} strokeWidth=\{2\.5\} \/><\/button>/,
  '<button type="button" onClick={() => insertFormatting(\'i\')} className="hover:text-zinc-600 dark:hover:text-zinc-300"><Italic size={18} strokeWidth={2.5} /></button>'
);
content = content.replace(
  /<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Underline size=\{18\} strokeWidth=\{2\.5\} \/><\/button>/,
  '<button type="button" onClick={() => insertFormatting(\'u\')} className="hover:text-zinc-600 dark:hover:text-zinc-300"><Underline size={18} strokeWidth={2.5} /></button>'
);

fs.writeFileSync(file, content);
console.log('Fixed rich text parser!');
