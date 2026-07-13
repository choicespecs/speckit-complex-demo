# Feature Specification: Core Task Board

**Feature Branch**: `main`

**Created**: 2026-07-23

**Status**: Draft

**Input**: User description: "Extend the task-list API into a Task Board: tasks are organized into boards/lists rather than one flat list. This is the foundational feature built on main before any team member branches off to build Auth, Tags, or Reminders on top of it."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a board and add tasks to it (Priority: P1)

A user creates a named board (e.g. "Sprint 12") and adds tasks to it, so that tasks
are grouped by the project or context they belong to instead of sitting in one
undifferentiated list.

**Why this priority**: Without boards, this is just the original task-list demo
again. Boards are the one structural change every other concurrent feature (Auth,
Tags, Reminders) will attach to — it must exist first and work correctly.

**Independent Test**: Can be fully tested by creating a board, adding two tasks to
it, and confirming both tasks are returned when listing that board's tasks.

**Acceptance Scenarios**:

1. **Given** no boards exist, **When** a user creates a board named "Sprint 12",
   **Then** the board exists and has zero tasks.
2. **Given** a board exists, **When** a user adds a task with a description to it,
   **Then** the task appears when listing that board's tasks, marked not done.

---

### User Story 2 - List and complete tasks within a board (Priority: P2)

A user lists all tasks on a board and marks individual tasks done, so they can
track progress within that board specifically.

**Why this priority**: This is the core day-to-day interaction once boards and
tasks exist — without it, boards are just containers with no way to track status.

**Independent Test**: Can be fully tested by adding a task to a board, marking it
done, and confirming the board's task list reflects the done state.

**Acceptance Scenarios**:

1. **Given** a board with two tasks, **When** a user lists that board's tasks,
   **Then** both tasks are returned and tasks from other boards are not included.
2. **Given** a task that is not done, **When** a user marks it done, **Then**
   subsequent listings show that task as done.

---

### User Story 3 - Delete a task or a board (Priority: P3)

A user removes a task they no longer need, or deletes an entire board (and its
tasks) once a project is finished.

**Why this priority**: Cleanup matters but isn't required for the MVP loop of
creating and tracking work — it's the lowest-priority of the three stories.

**Independent Test**: Can be fully tested by deleting a task and confirming it no
longer appears in that board's task list, and separately by deleting a board and
confirming its tasks are gone too.

**Acceptance Scenarios**:

1. **Given** a board with a task, **When** a user deletes that task, **Then** it no
   longer appears in the board's task list.
2. **Given** a board with tasks, **When** a user deletes the board, **Then** the
   board and all of its tasks are gone.

---

### Edge Cases

- What happens when a task is added to a board that doesn't exist? System MUST
  reject the request rather than silently creating an orphaned task.
- How does the system handle marking an already-done task done again? It MUST be
  idempotent — no error, state unchanged.
- What happens when listing tasks for a board with zero tasks? System MUST return
  an empty list, not an error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating a board with a name.
- **FR-002**: System MUST allow listing all boards.
- **FR-003**: System MUST allow adding a task with a description to an existing
  board.
- **FR-004**: System MUST reject adding a task to a board ID that does not exist.
- **FR-005**: System MUST allow listing all tasks belonging to a specific board.
- **FR-006**: System MUST allow marking a task done, idempotently.
- **FR-007**: System MUST allow deleting a single task.
- **FR-008**: System MUST allow deleting a board, which also removes all of that
  board's tasks.

### Key Entities

- **Board**: A named grouping of tasks. Attributes: id, name, createdAt.
- **Task**: A single unit of work belonging to exactly one board. Attributes: id,
  boardId (references Board), description, done (boolean), createdAt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a board and add a task to it in a single short
  interaction, with no more than 2 requests.
- **SC-002**: Listing a board's tasks never returns tasks belonging to a different
  board.
- **SC-003**: 100% of the four core operations (create board, add task, mark done,
  delete) behave correctly when exercised against an empty board and against a
  board with existing data.

## Assumptions

- Boards and tasks are stored in memory only, per the constitution's Illustrative
  Not Production principle — no persistence across restarts is required.
- There is exactly one implicit "workspace" — boards are not scoped to individual
  users yet. User-scoping is deliberately deferred to the Auth feature branch.
- No authentication exists at this stage; anyone with API access can act on any
  board. This is acceptable because Auth is a separate, later concurrent feature.
