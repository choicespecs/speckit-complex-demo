# Quickstart: Tags & Categories

## Prerequisites

```bash
npm install && npm start   # listens on :3000
```

## Validation scenarios

**US1 — Tag a task at creation**

```bash
curl -s -X POST localhost:3000/boards -H 'Content-Type: application/json' -d '{"name":"Sprint 12"}'
curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -d '{"description":"Fix the outage","tags":["urgent"]}'
# → 201, tags: ["urgent"]

curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -d '{"description":"Write docs"}'
# → 201, tags: [] — unchanged default
```

**US2 — Filter by tag**

```bash
curl -s "localhost:3000/boards/1/tasks?tag=urgent"
# → 200, only the tagged task

curl -s "localhost:3000/boards/1/tasks?tag=nonexistent"
# → 200, []
```

**US3 — Add a tag after creation**

```bash
curl -s -X POST localhost:3000/tasks/2/tags -H 'Content-Type: application/json' -d '{"tag":"blocked"}'
# → 200, task 2 now has tags: ["blocked"]
```

See [`contracts/tags-api.md`](./contracts/tags-api.md) for the full contract.
