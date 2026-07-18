# Data Model: Due Dates & Reminders

## Task (extended)

Adds two fields to the Task entity defined in `001-core-task-board`'s
`data-model.md`:

| Field | Type | Notes |
|---|---|---|
| `dueDate` | ISO 8601 string \| null | Defaults to `null` if not specified at creation (FR-302) |
| `remindersOptIn` | boolean | Defaults to `false` (FR-303) — never settable to `true` implicitly |

**Validation rules**:
- FR-304: opting in when already opted in is a no-op (idempotent).
- FR-305: a reminders check requires both `remindersOptIn === true` AND
  `dueDate` present and within the requested window — both conditions, not
  either.
