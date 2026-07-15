# Phase 0 Research: Tags & Categories

## Decision: Tags as a plain string array field on Task, not a separate entity

**Rationale**: FR-201–FR-204 only need "a task has zero or more tag strings" —
no rename-everywhere, no tag ownership, no tag metadata. A separate `Tag`
entity with its own table/Map would be structure the requirements don't ask for.

**Alternatives considered**: A `tags` Map (id, name) with tasks referencing tag
IDs. Rejected — adds a join with no requirement driving it; revisit only if a
future feature needs tag renaming or per-tag metadata.

## Decision: Filtering via a query parameter (`?tag=`) on the existing list endpoint

**Rationale**: Reuses `GET /boards/:boardId/tasks` rather than adding a new
endpoint, keeping the surface area small.

**Alternatives considered**: A dedicated `GET /boards/:boardId/tasks/by-tag/:tag`
endpoint. Rejected — an extra route for what's really just a filter on an
existing one.
