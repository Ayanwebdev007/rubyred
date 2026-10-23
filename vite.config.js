import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function mediaStoragePlugin() {
  return {
    name: 'media-storage-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/media')) {
          return next();
        }

        const imagesDir = path.resolve(process.cwd(), 'public/images');
        if (!fs.existsSync(imagesDir)) {
          fs.mkdirSync(imagesDir, { recursive: true });
        }

        // 1. GET /api/media/list
        if (req.method === 'GET' && (req.url === '/api/media/list' || req.url.startsWith('/api/media/list?'))) {
          try {
            const files = fs.readdirSync(imagesDir);
            const mediaList = files
              .filter(file => !file.startsWith('.'))
              .map(file => {
                const filePath = path.join(imagesDir, file);
                const stats = fs.statSync(filePath);
                return {
                  name: file,
                  url: `/images/${encodeURIComponent(file)}`,
                  size: (stats.size / 1024).toFixed(1) + ' KB',
                  sizeBytes: stats.size,
                  modified: stats.mtime
                };
              });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, files: mediaList }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        // 2. POST /api/media/upload
        if (req.method === 'POST' && req.url === '/api/media/upload') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, base64Data } = JSON.parse(body);
              if (!filename || !base64Data) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Missing filename or base64Data' }));
                return;
              }
              const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
              const targetPath = path.join(imagesDir, cleanName);
              const base64Pure = base64Data.replace(/^data:([A-Za-z-+/0-9]+);base64,/, '');
              fs.writeFileSync(targetPath, Buffer.from(base64Pure, 'base64'));

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                file: {
                  name: cleanName,
                  url: `/images/${encodeURIComponent(cleanName)}`
                }
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // 3. DELETE /api/media/delete?filename=...
        if (req.method === 'DELETE' && req.url.startsWith('/api/media/delete')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const filename = urlObj.searchParams.get('filename');
            if (!filename) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Missing filename' }));
              return;
            }
            const cleanName = path.basename(filename);
            const targetPath = path.join(imagesDir, cleanName);
            if (fs.existsSync(targetPath)) {
              fs.unlinkSync(targetPath);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, deleted: cleanName }));
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'File not found' }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    mediaStoragePlugin()
  ],
})

