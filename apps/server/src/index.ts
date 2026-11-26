import { createApp } from './app';
const port = Number(process.env.PORT ?? 3001);
const server = createApp().listen(port, '127.0.0.1', () =>
  console.log(`Servidor: http://127.0.0.1:${port}`),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => server.close());
