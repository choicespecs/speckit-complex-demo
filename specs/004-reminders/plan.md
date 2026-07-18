# Implementation Plan: Due Dates & Reminders

**Branch**: `004-reminders` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-reminders/spec.md`

## Summary

Add `dueDate` and `remindersOptIn` fields to Task, plus a reminders-check
function that only ever considers opted-in tasks. No delivery mechanism —
"reminder" means "appears in a checked list," per the constitution's
Illustrative Not Production principle.

## Technical Context

**Language/Version**: Node.js 20, JavaScript (matches main)

**Primary Dependencies**: Express 4.x only

**Storage**: In-memory — `dueDate` and `remindersOptIn` become fields on the
existing Task object in `store.js`

**Testing**: `quickstart.md` curl runbook

**Target Platform**: Same Node process as Core Task Board

**Project Type**: Single project extension

**Constraints**: Must never surface a task in a reminders check unless
`remindersOptIn` is true (FR-303) — this is a hard constitutional gate, not a
preference

## Constitution Check

| Principle | Check | Verdict |
|---|---|---|
| I. Simplicity & Legibility | Two new fields, one filter function, no scheduler/queue | PASS |
| II. Illustrative Not Production | No real notification delivery — a checked list stands in for it | PASS |
| III. Fair Parity Between Concurrent Features | Same spec/plan/tasks rigor as Auth and Tags | PASS |
| IV. Traceability From Spec to Code | FR-301–FR-305 referenced in code comments | PASS |
| V. Notifications Are Opt-In, Never Silent | FR-303 makes opt-in a hard requirement of the reminders check itself, not an optional flag a caller could skip | PASS — this principle exists *because of* this feature |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-reminders/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── store.js          # extended: dueDate + remindersOptIn on Task, checkReminders()
├── routes/
│   └── tasks.js        # extended: accepts dueDate at creation, opt-in endpoint, reminders-check endpoint
└── server.js          # unchanged
```

**Structure Decision**: Extend `tasks.js`/`store.js` directly, same pattern as
Tags — no separate reminders router, since this feature adds a filter and two
small endpoints, not an independent resource.

## Complexity Tracking

*No violations — table omitted.*
