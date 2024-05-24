const ejs = require('ejs');
const fs = require('fs');

// Đọc file EJS
const ejsFile = fs.readFileSync('views/home.ejs', 'utf-8');

// Render file EJS thành HTML
const html = ejs.render(ejsFile);

// Ghi HTML ra file
fs.writeFileSync('index.html', html);

console.log('EJS file has been converted to HTML.');
