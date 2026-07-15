const express = require('express');
const store = require('../store');

const router = express.Router();

// FR-101, FR-102, FR-103
router.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const user = store.createUser(username, password);
  if (!user) {
    return res.status(409).json({ error: 'username already registered' });
  }
  // FR-103: welcome notification — currently unconditional, will become
  // opt-in once the notifications-are-opt-in constitution principle lands.
  console.log(`[notification] welcome, ${user.username}!`);
  res.status(201).json({ id: user.id, username: user.username, createdAt: user.createdAt });
});

// FR-104, FR-105
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = store.findUserByUsername(username);
  if (!user || !store.verifyPassword(user, password)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = store.createToken(user.id);
  res.status(200).json({ token });
});

module.exports = router;
