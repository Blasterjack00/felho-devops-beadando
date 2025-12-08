// src/tasksRouter.js
const express = require('express');
const router = express.Router();

// IDEIGLENES in-memory tároló (később jöhet PostgreSQL)
let tasks = [
  { id: 1, title: 'Első feladat', description: 'Demo task', status: 'todo' },
];

let nextId = 2;

// GET /tasks - lista
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST /tasks - új feladat
router.post('/', (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const task = {
    id: nextId++,
    title,
    description: description || '',
    status: status || 'todo',
  };

  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id - módosítás
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description, status } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;

  res.json(task);
});

// DELETE /tasks/:id - törlés
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === before) {
    return res.status(404).json({ error: 'task not found' });
  }

  res.status(204).send();
});

module.exports = router;
