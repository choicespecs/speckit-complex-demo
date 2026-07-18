// In-memory state for Board and Task entities. Isolated here (research.md,
// "State isolated in store.js") so concurrent feature branches can each extend
// this one module without tangling their changes into route handlers.

let nextBoardId = 1;
let nextTaskId = 1;

const boards = new Map();
const tasks = new Map();

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
// FR-301, FR-302: dueDate defaults to null when not specified
function createTask(boardId, description, dueDate = null) {
  const task = {
    id: nextTaskId++,
    boardId,
    description,
    done: false,
    dueDate,
    remindersOptIn: false,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  return task;
}

// FR-005: scoped strictly to one board
function listTasksForBoard(boardId) {
  return Array.from(tasks.values()).filter((t) => t.boardId === boardId);
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
  optInToReminders,
  checkReminders,
};
