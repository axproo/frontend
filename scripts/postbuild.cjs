// scripts/postbuild.js
const fs = require('fs');
const path = require('path');

const htaccessContent = `
# Activer la réécriture d'URL
RewriteEngine On

# Si la requête correspond à un fichier ou un répertoire existant, Apache ne réécrit pas l'URL
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Réécrire toutes les requêtes vers index.html pour gérer la SPA (Single Page Application)
RewriteRule ^ index.html [QSA,L]

# Redirection HTTP vers HTTPS (optionnel)
# Si ton site utilise HTTPS, décommente cette section pour forcer la redirection vers HTTPS
# RewriteCond %{HTTPS} off
# RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache des fichiers statiques pour améliorer la performance
<FilesMatch "\.(jpg|jpeg|png|gif|css|js|woff|woff2|ttf|eot|svg|otf)$">
 Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Gérer la sécurité en limitant l'accès à certains fichiers
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|git)">
 Order Allow,Deny
 Deny from all
</FilesMatch>

# Sécuriser les en-têtes HTTP (optionnel mais recommandé)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Prévenir les attaques de type clickjacking
Header always set X-Frame-Options "DENY"

# php -- BEGIN cPanel-generated handler, do not edit
# Set the “ea-php81” package as the default “PHP” programming language.
<IfModule mime_module>
  AddHandler application/x-httpd-ea-php81 .php .php8 .phtml
</IfModule>
# php -- END cPanel-generated handler, do not edit
`;

const distPath = path.resolve(__dirname, '../dist/.htaccess');

fs.writeFileSync(distPath, htaccessContent, 'utf8');
console.log('.htaccess created in dist/');
