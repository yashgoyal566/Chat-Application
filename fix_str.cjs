const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

// I will just locate the exact string block
const brokenBlock = `      } catch (error) {
        console.error(error);
        toast.error('Failed to pin/unpin message');
      }
    }
    },
    setDraft: (userId, text) => set((state) => {`;

const fixedBlock = `      } catch (error) {
        console.error(error);
        toast.error('Failed to pin/unpin message');
      }
    },
    setDraft: (userId, text) => set((state) => {`;

content = content.replace(brokenBlock, fixedBlock);

fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Fixed syntax error via string replacement!');
