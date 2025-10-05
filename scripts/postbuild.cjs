// scripts/postbuild.js
const fs = require('fs');
const path = require('path');

const htaccessContent = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /vue_dashboard/

  # Si la requête correspond à un fichier ou répertoire existant, ne rien réécrire
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Réécriture vers index.html **relatif à RewriteBase**
  RewriteRule . index.html [L]
</IfModule>
`;

const distPath = path.resolve(__dirname, '../dist/.htaccess');

fs.writeFileSync(distPath, htaccessContent, 'utf8');
console.log('.htaccess created in dist/');
