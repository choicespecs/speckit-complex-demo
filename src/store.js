// In-memory state for Board and Task entities. Isolated here (research.md,
// "State isolated in store.js") so concurrent feature branches can each extend
// this one module without tangling their changes into route handlers.

const crypto = require('crypto');

let nextBoardId = 1;
let nextTaskId = 1;
let nextUserId = 1;

const boards = new Map();
const tasks = new Map();
const users = new Map();
const usersByUsername = new Map();
const tokens = new Map();

// FR-001
function createBoard(name) {
  const board = { id: nextBoardId++, name, createdAt: new Date().toISOString() };
  boards.set(board.id, board);
  return board;
}

// FR-002
function listBoards() {
  return Array.from(boards.values());
}

function getBoard(id) {
  return boards.get(id);
}

// FR-008: deleting a board cascades to its tasks
function deleteBoard(id) {
  if (!boards.has(id)) return false;
  boards.delete(id);
  for (const task of tasks.values()) {
    if (task.boardId === id) tasks.delete(task.id);
  }
  return true;
}

// FR-003, FR-004: caller must check the board exists before calling this
// FR-106, FR-107: ownerId is optional — anonymous creation must keep working
// FR-201, FR-202: tags defaults to [] when not specified
// FR-301, FR-302: dueDate defaults to null when not specified
function createTask(boardId, description, ownerId = null, tags = [], dueDate = null) {
  const task = {
    id: nextTaskId++,
    boardId,
    description,
    done: false,
    ownerId,
    tags: Array.isArray(tags) ? tags : [],
    dueDate,
    remindersOptIn: false,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  return task;
}

// FR-005: scoped strictly to one board
// FR-203: optional tag filter
function listTasksForBoard(boardId, tag) {
  return Array.from(tasks.values()).filter(
    (t) => t.boardId === boardId && (!tag || t.tags.includes(tag))
  );
}

function getTask(id) {
  return tasks.get(id);
}

// FR-006: idempotent
function markTaskDone(id) {
  const task = tasks.get(id);
  if (!task) return undefined;
  task.done = true;
  return task;
}

// FR-007
function deleteTask(id) {
  return tasks.delete(id);
}

// FR-204: idempotent
function addTagToTask(id, tag) {
  const task = tasks.get(id);
  if (!task) return undefined;
  if (!task.tags.includes(tag)) task.tags.push(tag);
  return task;
}

// FR-304: idempotent
function optInToReminders(id) {
  const task = tasks.get(id);
  if (!task) return undefined;
  task.remindersOptIn = true;
  return task;
}

// FR-303, FR-305: this is the ONLY path that can ever surface a reminder —
// the remindersOptIn check happens here, inside the filter itself, so no
// caller can accidentally bypass constitution Principle V by forgetting to
// filter on their end.
function checkReminders(withinHours) {
  const now = Date.now();
  const cutoff = now + withinHours * 60 * 60 * 1000;
  return Array.from(tasks.values()).filter((t) => {
    if (!t.remindersOptIn || !t.dueDate) return false;
    const due = new Date(t.dueDate).getTime();
    return due >= now && due <= cutoff;
  });
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// FR-101, FR-102
function createUser(username, password) {
  if (usersByUsername.has(username)) return undefined;
  const user = {
    id: nextUserId++,
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.set(user.id, user);
  usersByUsername.set(username, user);
  return user;
}

function findUserByUsername(username) {
  return usersByUsername.get(username);
}

// FR-104, FR-105
function verifyPassword(user, password) {
  return user.passwordHash === hashPassword(password);
}

function createToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  tokens.set(token, userId);
  return token;
}

// FR-106: returns undefined for missing/invalid tokens, callers treat that as anonymous
function getUserIdForToken(token) {
  return tokens.get(token);
}

module.exports = {
  createBoard,
  listBoards,
  getBoard,
  deleteBoard,
  createTask,
  listTasksForBoard,
  getTask,
  markTaskDone,
  deleteTask,
  addTagToTask,
  optInToReminders,
  checkReminders,
  createUser,
  findUserByUsername,
  verifyPassword,
  createToken,
  getUserIdForToken,
};
