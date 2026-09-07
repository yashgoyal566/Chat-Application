const fs = require('fs');
const file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Remove the hardcoded media query for the body
content = content.replace(
  /@media \(prefers-color-scheme: dark\) \{\s*body \{\s*background-color: var\(--color-zinc-950\);\s*color: var\(--color-zinc-50\);\s*\}\s*\}/g,
  ""
);

// Inject the custom variant to switch Tailwind to class-based dark mode
content = content.replace(
  /@import "tailwindcss";/,
  `@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));`
);

fs.writeFileSync(file, content);
