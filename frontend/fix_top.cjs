const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The exact string to replace:
const target = `  return (
    <div 
      className="relative flex h-full flex-col dark:bg-zinc-900"
      style={{
        backgroundImage: "url('/chat-bg.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '400px',
        backgroundColor: '#F2F2F7'
      }}
    >`;

const replacement = `  return (
    <div className="flex h-full w-full overflow-hidden">
      <div 
        className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"
        style={{
          backgroundImage: "url('/chat-bg.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          backgroundColor: '#F2F2F7'
        }}
      >`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Fixed the top wrapper layout!');
