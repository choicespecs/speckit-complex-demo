# API Contract: Core Task Board

Base URL: `http://localhost:3000`

## Boards

### `POST /boards`
**FR-001**. Request: `{ "name": "Sprint 12" }`
Response `201`: `{ "id": 1, "name": "Sprint 12", "createdAt": "..." }`
Response `400` if `name` missing/empty: `{ "error": "name is required" }`

### `GET /boards`
**FR-002**. Response `200`: `[{ "id": 1, "name": "Sprint 12", "createdAt": "..." }, ...]`

### `DELETE /boards/:id`
**FR-008**. Response `204` on success (board and all its tasks removed).
Response `404` if board doesn't exist: `{ "error": "board not found" }`

## Tasks

### `POST /boards/:boardId/tasks`
**FR-003, FR-004**. Request: `{ "description": "Write demo script" }`
Response `201`: `{ "id": 1, "boardId": 1, "description": "Write demo script", "done": false, "createdAt": "..." }`
Response `404` if board doesn't exist: `{ "error": "board not found" }`
Response `400` if `description` missing/empty: `{ "error": "description is required" }`

### `GET /boards/:boardId/tasks`
**FR-005**. Response `200`: array of tasks belonging to that board only.
Response `404` if board doesn't exist: `{ "error": "board not found" }`

### `POST /tasks/:id/done`
**FR-006**. Marks a task done. Idempotent — calling it twice is not an error.
Response `200`: the updated task.
Response `404` if task doesn't exist: `{ "error": "task not found" }`

### `DELETE /tasks/:id`
**FR-007**. Response `204` on success.
Response `404` if task doesn't exist: `{ "error": "task not found" }`

## Error shape

Every error response body is `{ "error": "<message>" }` — consistent across every
endpoint, matching the convention `speckit-demo`'s `spec-driven/` implementation
established.
