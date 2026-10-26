const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

// I will just use regex to wrap everything between </header> and <div className="absolute bottom-0... (Input Floating)

// Wait, the banner currently has:
//       {/* Pinned Messages Banner - Telegram Style */}
//       {(() => { ... return <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-2 shadow-sm relative z-10 dark:bg-zinc-800/60 dark:border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"> ... </div> })()}
//       <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[140px] ">
//         ...messages...
//       </div>
//       {/* Input (Floating) */}

const oldBannerRegex = /\{\/\* Pinned Messages Banner \- Telegram Style \*\/\}\s*\{\(\(\) => \{[\s\S]*?return \(\s*<div\s+onClick=\{handleBannerClick\}\s+className="bg-zinc-50/g;
content = content.replace(oldBannerRegex, `      {/* Pinned Messages Banner - Telegram Style */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
      {(() => {`);

// Now replace the banner div class to absolute
const oldBannerDiv = `return (
          <div 
            onClick={handleBannerClick}
            className="bg-zinc-50 border-b`;
const newBannerDiv = `return (
          <div 
            onClick={handleBannerClick}
            className="absolute top-0 left-0 right-0 z-20 bg-zinc-50/95 backdrop-blur-sm border-b`;
content = content.replace(oldBannerDiv, newBannerDiv);

// Now change the messages container padding from pt-6 to pt-14
const oldMessagesDiv = `<div className="flex-1 overflow-y-auto px-6 pt-6 pb-[140px] ">`;
const newMessagesDiv = `<div className="flex-1 overflow-y-auto px-6 pt-16 pb-[140px] ">`;
content = content.replace(oldMessagesDiv, newMessagesDiv);

// Now close the new wrapper BEFORE the Input
const oldInputMarker = `{/* Input (Floating) */}`;
const newInputMarker = `</div>\n\n      {/* Input (Floating) */}`;
content = content.replace(oldInputMarker, newInputMarker);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Successfully wrapped banner and messages!');
