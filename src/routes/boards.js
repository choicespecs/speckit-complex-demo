const express = require('express');
const store = require('../store');

const router = express.Router();

// FR-001
router.post('/', (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const board = store.createBoard(name);
  res.status(201).json(board);
});

// FR-002
router.get('/', (req, res) => {
  res.status(200).json(store.listBoards());
});

// FR-008
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.deleteBoard(id);
  if (!deleted) {
    return res.status(404).json({ error: 'board not found' });
  }
  res.status(204).end();
});

module.exports = router;
