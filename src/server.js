const express = require('express');
const boardsRouter = require('./routes/boards');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/boards', boardsRouter);
app.use('/', tasksRouter);
app.use('/auth', authRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Task Board API listening on :${PORT}`);
});

module.exports = app;
