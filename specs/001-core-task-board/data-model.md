# Data Model: Core Task Board

## Board

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Auto-incrementing, starts at 1 |
| `name` | string | Required, non-empty |
| `createdAt` | ISO 8601 string | Set on creation, never updated |

**Validation rules** (from FR-001): `name` must be a non-empty string; reject
creation otherwise.

## Task

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Auto-incrementing, starts at 1, unique across all boards |
| `boardId` | integer | Must reference an existing Board (FR-004) |
| `description` | string | Required, non-empty |
| `done` | boolean | Defaults to `false` |
| `createdAt` | ISO 8601 string | Set on creation, never updated |

**Validation rules**:
- FR-003/FR-004: `boardId` must reference an existing board; reject with an error
  otherwise (no orphaned tasks).
- FR-006: Marking a task done when it is already done is a no-op, not an error
  (idempotent per Edge Cases in spec.md).

**State transitions**: `done` only ever transitions `false → true`. There is no
requirement to un-mark a task as done at this stage (not requested in spec.md;
would be a natural follow-up but is out of scope here).

**Relationships**: Task.boardId → Board.id (many tasks to one board). Deleting a
Board (FR-008) cascades: all Tasks with that `boardId` are deleted too.
