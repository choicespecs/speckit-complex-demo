# Implementation Plan: Tags & Categories

**Branch**: `003-tags` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-tags/spec.md`

## Summary

Add a `tags` field (array of strings) to Task, settable at creation and
appendable afterward, plus a tag-filtered variant of listing a board's tasks.

## Technical Context

**Language/Version**: Node.js 20, JavaScript (matches main)

**Primary Dependencies**: Express 4.x only

**Storage**: In-memory — `tags` becomes a plain array field on the existing
Task object in `store.js`, no new collection needed

**Testing**: `quickstart.md` curl runbook

**Target Platform**: Same Node process as Core Task Board

**Project Type**: Single project extension

**Constraints**: Must not change task creation's contract for callers who don't
specify tags (FR-202)

## Constitution Check

| Principle | Check | Verdict |
|---|---|---|
| I. Simplicity & Legibility | Tags are a plain string array, no separate Tag entity/lifecycle | PASS |
| II. Illustrative Not Production | No tag autocomplete, no per-org tag vocabulary | PASS |
| III. Fair Parity Between Concurrent Features | Same spec/plan/tasks rigor as Auth and Reminders | PASS |
| IV. Traceability From Spec to Code | FR-201–FR-204 referenced in code comments | PASS |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-tags/
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
├── store.js          # extended: tags field on Task, tag-filtered listing, addTag
├── routes/
│   ├── boards.js       # unchanged
│   └── tasks.js        # extended: accepts tags at creation, ?tag= query filter, add-tag endpoint
└── server.js          # unchanged (no new router — tags live inside tasks.js)
```

**Structure Decision**: Extend `tasks.js`/`store.js` directly rather than a
separate tags router — tags aren't an independent resource with their own
endpoints beyond filtering, so a new file would be structure for its own sake
(violates Simplicity).

## Complexity Tracking

*No violations — table omitted.*
