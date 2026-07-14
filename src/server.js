const express = require('express');
const boardsRouter = require('./routes/boards');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(express.json());

app.use('/boards', boardsRouter);
app.use('/', tasksRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Task Board API listening on :${PORT}`);
});

module.exports = app;
