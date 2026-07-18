# Quickstart: Due Dates & Reminders

## Prerequisites

```bash
npm install && npm start   # listens on :3000
```

## Validation scenarios

**US1 — Due date at creation**

```bash
curl -s -X POST localhost:3000/boards -H 'Content-Type: application/json' -d '{"name":"Sprint 12"}'
curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -d '{"description":"Ship the release","dueDate":"2026-07-19T00:00:00.000Z"}'
# → 201, dueDate set

curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -d '{"description":"Someday task"}'
# → 201, dueDate: null
```

**US2 — Opt in to reminders**

```bash
curl -s -X POST localhost:3000/tasks/1/reminders-opt-in
# → 200, remindersOptIn: true
```

**US3 — Check reminders**

```bash
curl -s "localhost:3000/reminders?withinHours=48"
# → 200, includes task 1 (opted in, due soon) — never task 2 (not opted in),
#   regardless of how close its due date might be
```

See [`contracts/reminders-api.md`](./contracts/reminders-api.md) for the full
contract.
