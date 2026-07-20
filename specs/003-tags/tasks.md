# Tasks: Tags & Categories

**Input**: Design documents from `/specs/003-tags/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — `quickstart.md` is the verification method.

**Organization**: Tasks are grouped by user story (US1–US3 from spec.md).

## Phase 1: Setup

- [X] T201 No new dependencies needed

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T202 Add `tags` array field (defaulting to `[]`) to Task creation in
      `src/store.js`

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Tag a task when creating it (Priority: P1) 🎯 MVP

**Goal**: Tags can be specified at task creation.

- [X] T203 [US1] Extend `POST /boards/:boardId/tasks` in
      `src/routes/tasks.js` to accept an optional `tags` array (FR-201, FR-202)

**Checkpoint**: US1 functional and testable independently.

---

## Phase 4: User Story 2 - Filter a board's tasks by tag (Priority: P2)

**Goal**: A board's tasks can be filtered by tag.

- [X] T204 [US2] Add `listTasksForBoard` tag-filtering support in
      `src/store.js` (FR-203)
- [X] T205 [US2] Read the `?tag=` query parameter in
      `GET /boards/:boardId/tasks` in `src/routes/tasks.js` (FR-203)

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - Add a tag to an existing task (Priority: P3)

**Goal**: A tag can be added to an already-created task.

- [X] T206 [US3] Add an `addTagToTask` function in `src/store.js`, idempotent
      (FR-204)
- [X] T207 [US3] Implement `POST /tasks/:id/tags` in `src/routes/tasks.js`
      (FR-204)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish

- [X] T208 Run every scenario in `quickstart.md` against a live server
- [X] T209 Confirm every route handler comments its FR-2## per the constitution's
      Traceability principle

---

## Dependencies & Execution Order

- Setup → Foundational (blocks all stories) → US1 → US2 → US3 → Polish.
- US2 and US3 both depend on US1's `tags` field existing on Task.

## Implementation Strategy

**MVP First**: Setup → Foundational → US1, validated with quickstart.md, before
continuing to US2/US3.
