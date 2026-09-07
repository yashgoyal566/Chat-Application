const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Use a very robust regex to find the start of the return statement
content = content.replace(
  /return \(\s*<div\s+className="relative flex h-full flex-col dark:bg-zinc-900"/m,
  `return (
    <div className="flex h-full w-full overflow-hidden">
      <div 
        className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"`
);

// We know the file ends with:
//         <RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />
//       )}
//     </div>
//   );
// }
// Wait, maybe they saved again and the bottom is broken too?
// Let's just fix the top first.

fs.writeFileSync(file, content);
console.log('Fixed the top wrapper AGAIN!');
