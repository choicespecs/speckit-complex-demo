# Implementation Plan: Auth & User Accounts

**Branch**: `002-auth` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-auth/spec.md`

## Summary

Add a `User` entity and token-based login on top of the frozen Core Task Board.
Task creation optionally accepts a bearer token; when present and valid, the
created task's `ownerId` is set. Anonymous creation keeps working unchanged.

## Technical Context

**Language/Version**: Node.js 20, JavaScript (matches main)

**Primary Dependencies**: Express 4.x only — no JWT library, no bcrypt

**Storage**: In-memory (new `users` Map + `tokens` Map alongside existing
boards/tasks Maps in `store.js`)

**Testing**: `quickstart.md` curl runbook, consistent with main

**Target Platform**: Same Node process as Core Task Board (this feature extends
it, doesn't stand up a separate service)

**Project Type**: Single project extension

**Constraints**: Must not change any existing Core Task Board endpoint's
contract for callers who don't authenticate (FR-107)

## Constitution Check

| Principle | Check | Verdict |
|---|---|---|
| I. Simplicity & Legibility | Plain random-token auth, no JWT/OAuth library | PASS |
| II. Illustrative Not Production | Simple hash (Node's built-in `crypto`), no salting/bcrypt, no session expiry | PASS |
| III. Fair Parity Between Concurrent Features | This spec/plan/tasks carries the same rigor as Tags and Reminders | PASS |
| IV. Traceability From Spec to Code | FR-101–FR-107 referenced in code comments at implementation | PASS (enforced in tasks.md) |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-auth/
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
├── store.js          # extended: users Map, tokens Map, ownerId on Task
├── routes/
│   ├── auth.js        # NEW: register, login
│   ├── boards.js       # unchanged
│   └── tasks.js        # extended: reads Authorization header, sets ownerId
└── server.js          # extended: mount auth router
```

**Structure Decision**: Extend the existing single-project layout rather than
splitting into a separate auth service — the constitution's Simplicity
principle and this feature's small scope don't justify a second service.

## Complexity Tracking

*No violations — table omitted.*
