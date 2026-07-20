# Tasks: Auth & User Accounts

**Input**: Design documents from `/specs/002-auth/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — `quickstart.md` is the verification method.

**Organization**: Tasks are grouped by user story (US1–US3 from spec.md).

## Phase 1: Setup

- [X] T101 No new dependencies needed — confirm `crypto` (Node built-in) is
      available, no `package.json` changes required

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T102 Add `users` Map and `tokens` Map, plus `ownerId` field on Task
      creation, in `src/store.js`

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Register an account (Priority: P1) 🎯 MVP

**Goal**: A new user can register.

**Independent Test**: Register a user, confirm response has id/username, never
password.

- [X] T103 [US1] Create `src/routes/auth.js` with `POST /auth/register`
      (FR-101, FR-102, FR-103)
- [X] T104 [US1] Hash passwords with `crypto.createHash('sha256')` before
      storing in `src/store.js` (FR-101)

**Checkpoint**: US1 functional and testable independently.

---

## Phase 4: User Story 2 - Log in and receive a token (Priority: P2)

**Goal**: A registered user logs in and gets a token.

- [X] T105 [US2] Implement `POST /auth/login` in `src/routes/auth.js`
      (FR-104, FR-105)

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - Tasks I create are attributed to me (Priority: P3)

**Goal**: A logged-in user's created tasks carry their `ownerId`; anonymous
creation is unaffected.

- [X] T106 [US3] Extend `POST /boards/:boardId/tasks` in `src/routes/tasks.js`
      to read an optional `Authorization: Bearer <token>` header and set
      `ownerId` (FR-106, FR-107)
- [X] T107 [US3] Mount `src/routes/auth.js` in `src/server.js`

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish

- [X] T108 Run every scenario in `quickstart.md` against a live server
- [X] T109 Confirm every route handler comments its FR-1## per the constitution's
      Traceability principle

---

## Phase 7: Amendment Follow-up (constitution v1.1.0)

- [X] T110 [US1] Make the FR-103 welcome notification opt-in: accept an
      optional `notifyOnSignup` boolean in `POST /auth/register`, default
      `false`, in `src/routes/auth.js`

---

## Dependencies & Execution Order

- Setup → Foundational (blocks all stories) → US1 → US2 → US3 → Polish.
- US3 depends on US1's account existing and US2's token issuance to have
  anything to authenticate with.

## Implementation Strategy

**MVP First**: Setup → Foundational → US1, validated with quickstart.md, before
continuing to US2/US3.
