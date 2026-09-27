import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes/index.js';
import { requestLogger } from './server/middleware/loggingMiddleware.js';
import { errorHandler, notFoundHandler } from './server/middleware/errorMiddleware.js';
import { config } from './server/config/env.js';
import { checkDatabaseHealth } from './server/config/db.js';
import { taskScheduler } from './server/schedulers/taskScheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Mount API router
  app.use('/api', apiRouter);

  // Initialize database probe and task scheduler in background
  checkDatabaseHealth()
    .then((connected) => {
      if (connected) {
        console.log('[JanSamadhan DB] Connected to PostgreSQL database pool.');
      } else {
        console.log('[JanSamadhan DB] PostgreSQL pool operating in memory repository fallback mode.');
      }
    })
    .catch(() => {
      console.log('[JanSamadhan DB] Initialized memory repository fallback.');
    });

  taskScheduler.start();

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = config.port || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JanSamadhan Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[JanSamadhan Server] Fatal server startup error:', err);
  process.exit(1);
});
