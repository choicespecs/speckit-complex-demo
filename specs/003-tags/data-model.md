# Data Model: Tags & Categories

## Task (extended)

Adds one field to the Task entity defined in `001-core-task-board`'s
`data-model.md`:

| Field | Type | Notes |
|---|---|---|
| `tags` | string[] | Defaults to `[]` if not specified at creation (FR-202) |

**Validation rules**:
- FR-201: `tags`, if provided, must be an array of strings; non-array/invalid
  values are ignored in favor of `[]` rather than erroring, to keep creation
  permissive.
- FR-204: adding a tag that's already present is a no-op (idempotent).

**No new entities** — tags do not get their own collection; see research.md for
why.
