# Feature Specification: Tags & Categories

**Feature Branch**: `003-tags`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "Let tasks carry one or more tags (e.g. 'urgent', 'blocked') so users can filter a board's tasks by tag. Must not break existing task creation without tags."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tag a task when creating it (Priority: P1)

A user adds one or more tags to a task when creating it, so tasks can be
labeled by category from the start.

**Why this priority**: Nothing else in this feature works without tags existing
on tasks first.

**Independent Test**: Can be fully tested by creating a task with tags and
confirming the response includes them.

**Acceptance Scenarios**:

1. **Given** a board exists, **When** a user creates a task with tags
   `["urgent"]`, **Then** the returned task includes that tag.
2. **Given** a board exists, **When** a user creates a task with no tags
   specified, **Then** it succeeds exactly as before, with an empty tag list.

---

### User Story 2 - Filter a board's tasks by tag (Priority: P2)

A user lists only the tasks on a board that carry a specific tag.

**Why this priority**: Tagging without filtering has no payoff — this is the
reason tags exist.

**Independent Test**: Can be fully tested by creating two tasks with different
tags on the same board and confirming a tag-filtered listing returns only the
matching one.

**Acceptance Scenarios**:

1. **Given** a board with a tagged task and an untagged task, **When** a user
   lists that board's tasks filtered by tag, **Then** only the tagged task is
   returned.
2. **Given** no task on a board has a given tag, **When** filtered by that tag,
   **Then** an empty list is returned, not an error.

---

### User Story 3 - Add a tag to an existing task (Priority: P3)

A user adds a tag to a task after it was already created, without needing to
recreate it.

**Why this priority**: Tags are often decided after the fact (e.g., marking a
task "blocked" once it actually becomes blocked) — lowest priority since US1/US2
deliver value without it.

**Independent Test**: Can be fully tested by creating an untagged task, adding a
tag to it, and confirming a subsequent fetch shows the tag.

**Acceptance Scenarios**:

1. **Given** an existing task with no tags, **When** a user adds a tag to it,
   **Then** subsequent listings show that tag on the task.

---

### Edge Cases

- What happens when the same tag is added to a task twice? Idempotent — the tag
  appears once, not duplicated.
- What happens filtering by a tag no task has ever used? Returns an empty list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-201**: System MUST allow specifying zero or more tags when creating a
  task.
- **FR-202**: System MUST default to an empty tag list when none are specified,
  unchanged from the Core Task Board's existing task creation contract.
- **FR-203**: System MUST allow listing a board's tasks filtered to only those
  carrying a specific tag.
- **FR-204**: System MUST allow adding a tag to an existing task, idempotently.

### Key Entities

- **Task (extended)**: adds a `tags` field — a list of plain string labels, not
  a separate managed entity with its own lifecycle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-201**: A user can create a tagged task and filter for it in two requests.
- **SC-202**: 100% of existing untagged task creation behavior is unchanged
  after this feature merges.
- **SC-203**: Filtering by tag never returns a task that doesn't carry that tag.

## Assumptions

- Tags are free-form strings, not a separate managed vocabulary with its own
  CRUD lifecycle — no "rename a tag everywhere" feature is in scope here.
- Tags are not scoped per-board or per-user; the same tag string can be reused
  across any board.
