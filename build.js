const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const root = path.join(__dirname, '..'), www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'fonts'), { recursive: true });

// 1) Tailwind -> ملف CSS محلي
execSync('npx tailwindcss -i src/input.css -o www/tw.css --minify', { cwd: root, stdio: 'inherit' });

// 2) خط Cairo محلي
const ranges = {
  arabic: 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC',
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
};
let css = '';
for (const w of [400, 600, 700, 800]) for (const sub of Object.keys(ranges)) {
  const f = `cairo-${sub}-${w}-normal.woff2`;
  const src = path.join(root, 'node_modules/@fontsource/cairo/files', f);
  if (!fs.existsSync(src)) { console.warn('missing font', f); continue; }
  fs.copyFileSync(src, path.join(www, 'fonts', f));
  css += `@font-face{font-family:'Cairo';font-style:normal;font-weight:${w};font-display:swap;src:url(fonts/${f}) format('woff2');unicode-range:${ranges[sub]}}\n`;
}
fs.writeFileSync(path.join(www, 'style.css'), css + fs.readFileSync(path.join(www, 'tw.css'), 'utf8'));
fs.rmSync(path.join(www, 'tw.css'));

// 3) الصفحة
fs.copyFileSync(path.join(root, 'src/index.html'), path.join(www, 'index.html'));
console.log('www ready');
