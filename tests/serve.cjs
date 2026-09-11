const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.argv[2]);
const port = Number(process.argv[3] || 4173);
http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (name.endsWith('/') ? name + 'index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log('Preview on http://127.0.0.1:' + port));
