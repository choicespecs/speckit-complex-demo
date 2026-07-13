# Implementation Plan: Core Task Board

**Branch**: `main` | **Date**: 2026-07-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-core-task-board/spec.md`

## Summary

Extend the original flat task-list API with a `Board` entity: tasks now belong to
a board, and all task operations (add, list, mark done, delete) are scoped to a
board. This is the foundational feature — it is built once on `main`, then frozen,
so that three team members can each branch off it to build Auth, Tags, and
Reminders concurrently without the base shifting under them.

## Technical Context

**Language/Version**: Node.js 20, JavaScript (no TypeScript, per Simplicity principle)

**Primary Dependencies**: Express 4.x only

**Storage**: In-memory (two parallel Maps/arrays: boards, tasks) — no database

**Testing**: Manual verification via `quickstart.md` curl runbook (no test framework,
consistent with the constitution's Illustrative Not Production principle)

**Target Platform**: Local Node server (`npm start`), single process

**Project Type**: Single small web-service project

**Performance Goals**: N/A — illustrative demo, not a production service

**Constraints**: In-memory only; single process; no auth (deferred to a later branch)

**Scale/Scope**: A handful of boards, a few dozen tasks — enough to demo the API, not to stress-test it

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Verdict |
|---|---|---|
| I. Simplicity & Legibility | Single Express app, two entities, no framework beyond Express | PASS |
| II. Illustrative Not Production | In-memory storage, no auth, no real deployment concerns | PASS |
| III. Fair Parity Between Concurrent Features | N/A at this stage — this is the shared foundation, not a concurrent feature itself; parity applies once Auth/Tags/Reminders specs exist | PASS (not yet applicable) |
| IV. Traceability From Spec to Code | Every FR/SC ID from spec.md will be referenced in code comments at the point of implementation | PASS (enforced in tasks.md) |

No violations. Complexity Tracking table omitted — nothing to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-task-board/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/             # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── store.js          # In-memory Board + Task state, isolated from route handlers
├── routes/
│   ├── boards.js      # Board endpoints
│   └── tasks.js       # Task endpoints (scoped by :boardId)
└── server.js          # Express app wiring

package.json
```

**Structure Decision**: Single small Express project at the repo root (Option 1,
single project). State lives in `src/store.js` rather than inline in route
handlers — the same decision `speckit-demo`'s `research.md` made, carried forward
here for the same reason: it is the one place all three later feature branches
(Auth, Tags, Reminders) will need to extend, so it must not be tangled into route
logic.

## Complexity Tracking

*No violations — table omitted.*
