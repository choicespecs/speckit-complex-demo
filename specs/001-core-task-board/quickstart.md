# Quickstart: Core Task Board

## Prerequisites

```bash
npm install
npm start   # listens on :3000
```

## Validation scenarios

**US1 — Create a board and add a task**

```bash
curl -s -X POST localhost:3000/boards -H 'Content-Type: application/json' \
  -d '{"name":"Sprint 12"}'
# → 201, { "id": 1, "name": "Sprint 12", ... }

curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -d '{"description":"Write demo script"}'
# → 201, { "id": 1, "boardId": 1, "description": "Write demo script", "done": false, ... }
```

**US2 — List and complete tasks**

```bash
curl -s localhost:3000/boards/1/tasks
# → 200, array containing the task above, done: false

curl -s -X POST localhost:3000/tasks/1/done
# → 200, same task with done: true

curl -s localhost:3000/boards/1/tasks
# → 200, task now shows done: true
```

**US3 — Delete a task, then delete a board**

```bash
curl -s -X DELETE localhost:3000/tasks/1
# → 204

curl -s -X DELETE localhost:3000/boards/1
# → 204
```

**Edge cases**

```bash
curl -s -X POST localhost:3000/boards/999/tasks -H 'Content-Type: application/json' \
  -d '{"description":"orphan?"}'
# → 404, { "error": "board not found" }

curl -s localhost:3000/boards/999/tasks
# → 404, { "error": "board not found" }
```

See [`contracts/task-board-api.md`](./contracts/task-board-api.md) for the full
request/response contract per endpoint, and [`data-model.md`](./data-model.md)
for entity field definitions.
