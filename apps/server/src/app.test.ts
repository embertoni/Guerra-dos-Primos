// @vitest-environment node
import { it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app';
it('oferece health check sem criar APIs de partida na fase 1', async () => {
  const app = createApp();
  expect((await request(app).get('/health')).body).toEqual({
    status: 'ok',
    phase: 1,
  });
  expect((await request(app).post('/api/sessions')).status).toBe(404);
});
