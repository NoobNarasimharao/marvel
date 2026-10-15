'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
function createServer(port = 4173) {
  return http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
    // Serve the production allowlist at both / and a simulated repository subpath.
    pathname = pathname.replace(/^\/marvel-watchlist(?=\/)/, '');
    if (pathname === '/') pathname = '/index.html';
    if (!/^\/(index\.html|css\/style\.css|js\/[a-z]+\.js|assets\/[a-zA-Z0-9_./-]+)$/.test(pathname) || pathname.includes('..')) { res.writeHead(404).end(); return; }
    const file = path.join(root, pathname);
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      res.writeHead(200, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(), microphone=(), geolocation=()', 'Content-Security-Policy':"frame-ancestors 'none'"}); res.end(data);
    });
  }).listen(port, '127.0.0.1');
}
module.exports = {createServer};
if (require.main === module) { const server = createServer(Number(process.env.PORT || 4173)); server.on('listening', () => console.log(`Local: http://127.0.0.1:${server.address().port}`)); }
