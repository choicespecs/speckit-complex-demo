# API Contract: Auth & User Accounts

## `POST /auth/register`
**FR-101, FR-102, FR-103**. Request: `{ "username": "priya", "password": "..." }`
Response `201`: `{ "id": 1, "username": "priya", "createdAt": "..." }` (never
includes password/hash)
Response `409` if username taken: `{ "error": "username already registered" }`
Response `400` if username/password missing: `{ "error": "username and password are required" }`

## `POST /auth/login`
**FR-104, FR-105**. Request: `{ "username": "priya", "password": "..." }`
Response `200`: `{ "token": "..." }`
Response `401` if credentials invalid: `{ "error": "invalid credentials" }`

## `POST /boards/:boardId/tasks` (extended)
**FR-106, FR-107**. Same as `001-core-task-board`'s contract, plus: if header
`Authorization: Bearer <token>` is present and the token is valid, the response
task includes `"ownerId": <userId>`. If absent or invalid, behaves exactly as
before with `"ownerId": null`. Never errors due to auth alone.
