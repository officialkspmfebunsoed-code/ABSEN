const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const iconTag = '\n  <link rel="icon" type="image/png" href="assets/logo.png">\n  <link rel="apple-touch-icon" href="assets/logo.png">';

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('rel="icon"')) {
    content = content.replace('</title>', '</title>' + iconTag);
    fs.writeFileSync(file, content);
    console.log('Added icon to ' + file);
  }
});
