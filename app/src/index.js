// src/index.js
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./tasksRouter');

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(cors());
app.use(express.json());

// healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// tasks API
app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Taskboard backend listening on port ${PORT}`);
});

module.exports = app; // tesztekhez kell majd
