# Quickstart: Auth & User Accounts

## Prerequisites

```bash
npm install && npm start   # listens on :3000, same server as Core Task Board
```

## Validation scenarios

**US1 — Register**

```bash
curl -s -X POST localhost:3000/auth/register -H 'Content-Type: application/json' \
  -d '{"username":"priya","password":"hunter2"}'
# → 201, { "id": 1, "username": "priya", "createdAt": "..." }
```

**US2 — Log in**

```bash
curl -s -X POST localhost:3000/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"priya","password":"hunter2"}'
# → 200, { "token": "..." }
```

**US3 — Task ownership**

```bash
TOKEN=$(curl -s -X POST localhost:3000/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"priya","password":"hunter2"}' | node -e 'process.stdin.once("data",d=>console.log(JSON.parse(d).token))')

curl -s -X POST localhost:3000/boards -H 'Content-Type: application/json' -d '{"name":"Priya board"}'
curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" -d '{"description":"owned task"}'
# → 201, ownerId: 1

curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
  -d '{"description":"anonymous task"}'
# → 201, ownerId: null — unchanged from Core Task Board behavior
```

See [`contracts/auth-api.md`](./contracts/auth-api.md) for the full contract.
