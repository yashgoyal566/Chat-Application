const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

const brokenStr = `    }
  }
  },
  setDraft:`;

const fixedStr = `    }
  },
  setDraft:`;

content = content.replace(brokenStr, fixedStr);
fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Fixed str!');
