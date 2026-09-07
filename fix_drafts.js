const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update content useState
content = content.replace(
  "const [content, setContent] = useState('');",
  "const [content, setContent] = useState(() => localStorage.getItem(`draft_${selectedUser._id}`) || '');"
);

// Update handleInputChange
content = content.replace(
  /const handleInputChange = \(e\) => {[\s\S]*?setContent\(e\.target\.value\);/m,
  "const handleInputChange = (e) => {\n    const text = e.target.value;\n    setContent(text);\n    localStorage.setItem(`draft_${selectedUser._id}`, text);"
);

// Update handleSend
content = content.replace(
  /setContent\(''\);\n\s*setImage\(null\);/m,
  "setContent('');\n    localStorage.removeItem(`draft_${selectedUser._id}`);\n    setImage(null);"
);

// Also need to handle switching users: when selectedUser changes, the draft should update!
// Let's add a useEffect to listen to selectedUser._id and update content
const useEffectDraftLogic = `
  useEffect(() => {
    setContent(localStorage.getItem(\`draft_\${selectedUser._id}\`) || '');
  }, [selectedUser._id]);
`;

content = content.replace(
  "useEffect(() => {\n    messagesEndRef.current?.scrollIntoView",
  useEffectDraftLogic + "\n  useEffect(() => {\n    messagesEndRef.current?.scrollIntoView"
);

fs.writeFileSync(file, content);
