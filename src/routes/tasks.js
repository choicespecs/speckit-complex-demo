const express = require('express');
const store = require('../store');

const router = express.Router();

// FR-003, FR-004
// FR-301, FR-302: dueDate is optional, defaults to null
router.post('/boards/:boardId/tasks', (req, res) => {
  const boardId = Number(req.params.boardId);
  if (!store.getBoard(boardId)) {
    return res.status(404).json({ error: 'board not found' });
  }
  const { description, dueDate } = req.body || {};
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'description is required' });
  }
  const task = store.createTask(boardId, description, dueDate ?? null);
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

// FR-304
router.post('/tasks/:id/reminders-opt-in', (req, res) => {
  const id = Number(req.params.id);
  const task = store.optInToReminders(id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.status(200).json(task);
});

// FR-303, FR-305: constitution Principle V — only opted-in tasks can ever appear here
router.get('/reminders', (req, res) => {
  const withinHours = Number(req.query.withinHours);
  if (!withinHours || withinHours <= 0) {
    return res.status(400).json({ error: 'withinHours is required and must be positive' });
  }
  res.status(200).json(store.checkReminders(withinHours));
});

module.exports = router;
