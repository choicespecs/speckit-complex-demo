# Tasks: Due Dates & Reminders

**Input**: Design documents from `/specs/004-reminders/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — `quickstart.md` is the verification method.

**Organization**: Tasks are grouped by user story (US1–US3 from spec.md).

## Phase 1: Setup

- [X] T301 No new dependencies needed

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T302 Add `dueDate` (default `null`) and `remindersOptIn` (default
      `false`) fields to Task creation in `src/store.js`

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Set a due date on a task (Priority: P1) 🎯 MVP

- [X] T303 [US1] Extend `POST /boards/:boardId/tasks` in
      `src/routes/tasks.js` to accept an optional `dueDate` (FR-301, FR-302)

**Checkpoint**: US1 functional and testable independently.

---

## Phase 4: User Story 2 - Opt in to reminders for a task (Priority: P2)

- [X] T304 [US2] Add an `optInToReminders` function in `src/store.js`,
      idempotent (FR-304)
- [X] T305 [US2] Implement `POST /tasks/:id/reminders-opt-in` in
      `src/routes/tasks.js` (FR-304)

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - Check which opted-in tasks are due (Priority: P3)

- [X] T306 [US3] Add a `checkReminders(withinHours)` function in
      `src/store.js` that hard-filters on `remindersOptIn === true` AND due
      date within the window (FR-303, FR-305) — this is the constitutional
      gate, not optional filtering logic
- [X] T307 [US3] Implement `GET /reminders?withinHours=` in
      `src/routes/tasks.js` (FR-305)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish

- [X] T308 Run every scenario in `quickstart.md` against a live server,
      including confirming a non-opted-in but overdue task never appears
- [X] T309 Confirm every route handler comments its FR-3## per the
      constitution's Traceability principle, and that T306 explicitly notes
      its Principle V compliance in a code comment

---

## Dependencies & Execution Order

- Setup → Foundational (blocks all stories) → US1 → US2 → US3 → Polish.
- US2 and US3 both depend on US1's `dueDate` field existing on Task.
- US3 depends on US2's `remindersOptIn` field existing.

## Implementation Strategy

**MVP First**: Setup → Foundational → US1, validated with quickstart.md,
before continuing to US2/US3.
