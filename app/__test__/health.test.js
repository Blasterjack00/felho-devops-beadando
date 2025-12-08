// __tests__/health.test.js
const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('visszaadja a { status: "ok" } választ', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
