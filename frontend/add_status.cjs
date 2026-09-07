const fs = require('fs');
const file = 'src/components/chat/ContactInfo.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useSocketStore')) {
  content = content.replace(
    /import React from 'react';/,
    "import React from 'react';\nimport { useSocketStore } from '../../context/useSocketStore';"
  );
}

content = content.replace(
  /export default function ContactInfo\(\{ user, onClose \}\) \{/g,
  `export default function ContactInfo({ user, onClose }) {
  const { onlineUsers } = useSocketStore();
  const isOnline = user?.isGroup ? false : onlineUsers.includes(user?._id);`
);

content = content.replace(
  /<p className="text-\[14px\] text-zinc-500 mt-1">\{user\.email\}<\/p>/,
  `<p className="text-[14px] text-zinc-500 mt-1">{user.email}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={\`h-2 w-2 rounded-full \${isOnline ? 'bg-green-500' : 'bg-zinc-400'}\`}></span>
          <p className={\`text-[14px] font-medium \${isOnline ? 'text-green-500' : 'text-zinc-500'}\`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>`
);

fs.writeFileSync(file, content);
console.log('Added online status to ContactInfo.jsx');
