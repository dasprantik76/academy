import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
try { process.loadEnvFile(path.join(root, '.env.local')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const routes = new Set(['google-login', 'data', 'imagekit-auth', 'pincode', 'validate-email']);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2' };

const server = http.createServer(async (req, res) => {
  res.status = code => { res.statusCode = code; return res; };
  res.send = body => res.end(body);
  res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      const route = url.pathname.slice(5).replace(/\.js$/, '');
      if (!routes.has(route)) return res.status(404).end('Not found');
      req.query = Object.fromEntries(url.searchParams);
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 5 * 1024 * 1024) return res.status(413).end('Request too large');
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString('utf8');
      try {
        req.body = req.headers['content-type']?.includes('application/json')
          ? (body ? JSON.parse(body) : {}) : Object.fromEntries(new URLSearchParams(body));
      } catch { return res.status(400).end('Invalid request body'); }
      const { default: handler } = await import(`./api/${route}.js`);
      return await handler(req, res);
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return res.status(405).end('Method not allowed');
    }
    if (url.pathname === '/login.html') {
      res.setHeader('Location', '/');
      return res.status(302).end();
    }
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const publicRoot = path.join(root, 'public');
    const file = path.resolve(publicRoot, relative);
    if (!file.startsWith(publicRoot + path.sep) || relative.split('/').some(part => part.startsWith('.'))) {
      return res.status(404).end('Not found');
    }
    const info = await stat(file);
    if (!info.isFile()) return res.status(404).end('Not found');
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(req.method === 'HEAD' ? undefined : await readFile(file));
  } catch (error) {
    console.error('Local request failed:', error.message);
    if (!res.headersSent) res.status(error.code === 'ENOENT' ? 404 : 500);
    res.end('Request failed');
  }
});
server.listen(Number(process.env.PORT || 4000), '127.0.0.1', () => {
  console.log(`Academy portal: http://localhost:${server.address().port}`);
});
