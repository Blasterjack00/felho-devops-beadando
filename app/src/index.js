// src/index.js
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./tasksRouter');

// prometheus
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

const app = express();
const PORT = process.env.PORT || 8080;

// ========== MIDDLEWARES ==========
app.use(cors());
app.use(express.json());

// ========== PROMETHEUS ==========
collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
  });
  next();
});

// ========== ROUTES ==========
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/tasks', tasksRouter);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// ========== EXPORT FOR TESTS ==========
module.exports = app;

// ========== SERVER START ==========
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Taskboard backend listening on port ${PORT}`);
  });
}