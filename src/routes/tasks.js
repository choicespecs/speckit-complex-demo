const express = require('express');
const store = require('../store');

const router = express.Router();

// FR-003, FR-004
router.post('/boards/:boardId/tasks', (req, res) => {
  const boardId = Number(req.params.boardId);
  if (!store.getBoard(boardId)) {
    return res.status(404).json({ error: 'board not found' });
  }
  const { description } = req.body || {};
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'description is required' });
  }
  const task = store.createTask(boardId, description);
  res.status(201).json(task);
});

// FR-005
router.get('/boards/:boardId/tasks', (req, res) => {
  const boardId = Number(req.params.boardId);
  if (!store.getBoard(boardId)) {
    return res.status(404).json({ error: 'board not found' });
  }
  res.status(200).json(store.listTasksForBoard(boardId));
});

// FR-006: idempotent
router.post('/tasks/:id/done', (req, res) => {
  const id = Number(req.params.id);
  const task = store.markTaskDone(id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.status(200).json(task);
});

// FR-007
router.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.status(204).end();
});

module.exports = router;
