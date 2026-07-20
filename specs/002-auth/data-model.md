# Data Model: Auth & User Accounts

## User

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Auto-incrementing, starts at 1 |
| `username` | string | Required, unique (FR-101, FR-102) |
| `passwordHash` | string | SHA-256 hash of the password, never returned by any endpoint |
| `createdAt` | ISO 8601 string | Set on creation |

## Token

| Field | Type | Notes |
|---|---|---|
| `token` | string | Random opaque string, the Map key |
| `userId` | integer | References User.id |

Not persisted as its own entity in API responses — it's an internal lookup
structure returned once, at login, as `{ "token": "..." }`.

## Task (extended)

Adds one field to the Task entity defined in `001-core-task-board`'s
`data-model.md`:

| Field | Type | Notes |
|---|---|---|
| `ownerId` | integer \| null | Set to the authenticated user's id if a valid token was presented at creation (FR-106); `null` for anonymous creation (FR-107) |

**Relationships**: Task.ownerId → User.id (optional, many tasks to one user).
