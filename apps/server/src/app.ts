import express from 'express';
import { resolve } from 'node:path';
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.get('/health', (_req, res) => res.json({ status: 'ok', phase: 1 }));
  const webRoot = resolve(import.meta.dirname, '../../web/dist');
  app.use(express.static(webRoot));
  return app;
}
