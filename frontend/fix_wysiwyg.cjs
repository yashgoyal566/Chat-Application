const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the old insertFormatting function
content = content.replace(/const insertFormatting = \(tag\) => \{[\s\S]*?return newContent;\n    \}\);\n  \};\n/m, '');

// Inject executeCommand
const executeCommandFunc = `
  const executeCommand = (command) => {
    document.execCommand(command, false, null);
    if (messageInputRef.current) {
      messageInputRef.current.focus();
      setContent(messageInputRef.current.innerHTML);
    }
  };
`;
content = content.replace('const handleSend = async (e) => {', executeCommandFunc + '\n  const handleSend = async (e) => {');

// Update handleSend to read innerHTML
content = content.replace(
  /const handleSend = async \(e\) => \{\n\s*e\.preventDefault\(\);\n\s*if \(\!content\.trim\(\)\) return;/m,
  `const handleSend = async (e) => {
      e.preventDefault();
      const htmlContent = messageInputRef.current ? messageInputRef.current.innerHTML : content;
      const strippedContent = htmlContent.replace(/<[^>]*>?/gm, '').trim();
      if (!strippedContent) return;`
);

// Update sendMessage call in handleSend
content = content.replace(
  /await sendMessage\(\{ content \}\);/m,
  'await sendMessage({ content: htmlContent });'
);

// Update clearing input
content = content.replace(
  /setContent\(''\);\n\s*localStorage\.removeItem/m,
  `setContent('');
      if (messageInputRef.current) messageInputRef.current.innerHTML = '';
      localStorage.removeItem`
);

// Update handleInputChange to handle InputEvent from contentEditable
content = content.replace(
  /const handleInputChange = \(e\) => \{\n\s*const text = e\.target\.value;/m,
  `const handleInputChange = (e) => {
      const text = e.currentTarget.innerHTML;`
);

// Replace textarea with contentEditable div
const textareaRegex = /<textarea[\s\S]*?className="w-full resize-none bg-transparent px-1 py-1 text-\[15px\] outline-none placeholder:text-zinc-400 dark:text-zinc-50 min-h-\[40px\]"\s*\/>/m;

const editableDiv = `<div
            ref={messageInputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent px-1 py-1 text-[15px] outline-none dark:text-zinc-50 min-h-[40px] max-h-[120px] overflow-y-auto empty:before:content-[attr(placeholder)] empty:before:text-zinc-400"
            placeholder="Enter to send, Shift + Enter to add new line"
          />`;
          
content = content.replace(textareaRegex, editableDiv);

// Update formatting buttons to use executeCommand onMouseDown
content = content.replace(
  /<button type="button" onClick=\{\(\) => insertFormatting\('b'\)\} className="/,
  '<button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand(\'bold\'); }} className="'
);
content = content.replace(
  /<button type="button" onClick=\{\(\) => insertFormatting\('i'\)\} className="/,
  '<button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand(\'italic\'); }} className="'
);
content = content.replace(
  /<button type="button" onClick=\{\(\) => insertFormatting\('u'\)\} className="/,
  '<button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand(\'underline\'); }} className="'
);

fs.writeFileSync(file, content);
console.log('Converted to true WYSIWYG!');
