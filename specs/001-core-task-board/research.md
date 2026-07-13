# Phase 0 Research: Core Task Board

## Decision: State isolated in `store.js`, not inline in route handlers

**Rationale**: Three separate feature branches will each extend this state (Auth
adds a user/owner field, Tags adds a tag list, Reminders adds a due date) without
being able to see each other's work. A single, narrow module for state makes each
branch's diff to `store.js` small and easy to reason about in isolation, and
easy to merge-conflict-resolve deliberately (per the constitution's Team Workflow
section) rather than by accident.

**Alternatives considered**: Inlining state in each route file, as the original
`vibe-coded/` demo did. Rejected — that pattern is exactly what `speckit-demo`
used to illustrate the *lack* of a paper trail; repeating it here would blur the
lesson this repo is telling.

## Decision: Boards and Tasks as separate in-memory collections, task references board by ID

**Rationale**: A flat `Map` keyed by numeric ID for each entity is the simplest
structure that supports "list tasks for board X" (filter by `boardId`) and "delete
board cascades to its tasks" (filter-then-delete) without a database.

**Alternatives considered**: Nesting tasks as an array field inside each board
object. Rejected — flat collections make the later Tags feature's job easier (tags
can reference tasks by ID the same way boards do) and keeps deletion logic
symmetric between the two entities.

## Decision: No auth, no per-user scoping, at this stage

**Rationale**: The constitution defers user-scoping to the Auth branch by design.
Building it here would mean the Auth branch has nothing left to do, defeating the
concurrent-feature demonstration.

**Alternatives considered**: Adding a placeholder `ownerId` field now. Rejected —
this would preempt the Auth branch's own `data-model.md` decision about how
ownership should work, undermining Fair Parity Between Concurrent Features.

## Decision: Incrementing integer IDs, not UUIDs

**Rationale**: Same reasoning as `speckit-demo`'s `research.md` — no dependency
needed, human-readable in a live demo (`board 1`, `task 3`), and collisions aren't
a concern for a single in-memory process.

**Alternatives considered**: `uuid` package. Rejected — adds a dependency for no
benefit at this scale, violating Simplicity & Legibility.
