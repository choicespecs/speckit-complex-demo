# Tasks: Core Task Board

**Input**: Design documents from `/specs/001-core-task-board/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — no test framework, per constitution's Illustrative Not
Production principle. `quickstart.md` is the verification method instead.

**Organization**: Tasks are grouped by user story (US1–US3 from spec.md).

## Phase 1: Setup

- [X] T001 Create project structure (`src/`, `src/routes/`) per plan.md
- [X] T002 Initialize Node.js project with Express dependency in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Implement `Board` and `Task` in-memory collections in `src/store.js`
      (FR-001–FR-008 data shape, per data-model.md)
- [X] T004 Wire Express app and mount routers in `src/server.js`, listening on
      port 3000

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Create a board and add tasks to it (Priority: P1) 🎯 MVP

**Goal**: A user can create a board and add tasks to it.

**Independent Test**: Create a board, add two tasks, confirm both are returned by
listing that board's tasks.

### Implementation for User Story 1

- [X] T005 [US1] Implement `POST /boards` in `src/routes/boards.js` (FR-001)
- [X] T006 [US1] Implement `GET /boards` in `src/routes/boards.js` (FR-002)
- [X] T007 [US1] Implement `POST /boards/:boardId/tasks` in `src/routes/tasks.js`,
      rejecting unknown `boardId` (FR-003, FR-004)
- [X] T008 [US1] Add 400 validation for empty `name`/`description` in
      `src/routes/boards.js` and `src/routes/tasks.js`

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - List and complete tasks within a board (Priority: P2)

**Goal**: A user lists a board's tasks and marks tasks done.

**Independent Test**: Add a task to a board, mark it done, confirm the board's
task list reflects the done state and no other board's tasks leak in.

### Implementation for User Story 2

- [X] T009 [US2] Implement `GET /boards/:boardId/tasks` in `src/routes/tasks.js`,
      scoped strictly to that board (FR-005)
- [X] T010 [US2] Implement `POST /tasks/:id/done` in `src/routes/tasks.js`,
      idempotent (FR-006)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Delete a task or a board (Priority: P3)

**Goal**: A user deletes a task, or an entire board and its tasks.

**Independent Test**: Delete a task and confirm it's gone from its board's list;
separately, delete a board and confirm its tasks are gone too.

### Implementation for User Story 3

- [X] T011 [US3] Implement `DELETE /tasks/:id` in `src/routes/tasks.js` (FR-007)
- [X] T012 [US3] Implement `DELETE /boards/:id` in `src/routes/boards.js`,
      cascading to delete that board's tasks in `src/store.js` (FR-008)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish

- [X] T013 Run every scenario in `quickstart.md` against the running server and
      confirm actual responses match documented ones
- [X] T014 Confirm every route handler comments its FR-### per the constitution's
      Traceability principle

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → **Foundational (Phase 2)**, which blocks all user stories.
- **US1 (Phase 3)**: No dependency on US2/US3 — can be demoed alone as the MVP.
- **US2 (Phase 4)**: Depends on US1's board/task creation existing to have
  something to list/complete, but its own endpoints are separate files/routes.
- **US3 (Phase 5)**: Depends on US1's creation endpoints existing to have
  something to delete.
- **Polish (Phase 6)**: After all three stories are complete.

## Implementation Strategy

**MVP First**: Setup → Foundational → US1 → stop and validate with quickstart.md
before continuing. This is also the natural point at which `main` gets frozen and
the three feature branches (Auth, Tags, Reminders) are cut.
