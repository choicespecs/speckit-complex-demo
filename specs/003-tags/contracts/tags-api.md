# API Contract: Tags & Categories

## `POST /boards/:boardId/tasks` (extended)
**FR-201, FR-202**. Request may now include `"tags": ["urgent"]`. If omitted,
`tags` defaults to `[]` — unchanged from `001-core-task-board`'s contract
otherwise.

## `GET /boards/:boardId/tasks?tag=<tag>` (extended)
**FR-203**. When a `tag` query parameter is present, only tasks whose `tags`
array includes it are returned. Without the parameter, behaves exactly as
`001-core-task-board`'s contract.

## `POST /tasks/:id/tags`
**FR-204**. Request: `{ "tag": "blocked" }`
Response `200`: the updated task, with the tag added (idempotent).
Response `404` if task doesn't exist: `{ "error": "task not found" }`
