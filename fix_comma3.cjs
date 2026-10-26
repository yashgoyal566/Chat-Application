const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

// I will just locate the exact string block
const brokenBlock = `      const errMsg = error?.response?.data?.message || error.message || "Unknown error";
      toast.error(\`Failed: \${errMsg}\`);
    }
  }
  setDraft: (userId, text) => set((state) => {`;

const fixedBlock = `      const errMsg = error?.response?.data?.message || error.message || "Unknown error";
      toast.error(\`Failed: \${errMsg}\`);
    }
  },
  setDraft: (userId, text) => set((state) => {`;

content = content.replace(brokenBlock, fixedBlock);
// And also fallback generic whitespace replacement
content = content.replace(/\}\s*setDraft:/g, '},\n  setDraft:');

fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Fixed syntax error!');
