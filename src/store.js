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
function createTask(boardId, description) {
  const task = {
    id: nextTaskId++,
    boardId,
    description,
    done: false,
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
};
