# Feature Specification: Due Dates & Reminders

**Feature Branch**: `004-reminders`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Let tasks have a due date, and remind users about tasks approaching their due date. Must comply with constitution v1.1.0 — reminders MUST be opt-in, never a silent background push."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set a due date on a task (Priority: P1)

A user sets a due date on a task when creating it, so the system has something
to remind them about later.

**Why this priority**: Reminders have nothing to reference without a due date
existing first.

**Independent Test**: Can be fully tested by creating a task with a due date and
confirming it's returned in the response.

**Acceptance Scenarios**:

1. **Given** a board exists, **When** a user creates a task with a due date,
   **Then** the returned task includes that due date.
2. **Given** a board exists, **When** a user creates a task with no due date,
   **Then** it succeeds exactly as before, with `dueDate: null`.

---

### User Story 2 - Opt in to reminders for a task (Priority: P2)

A user explicitly opts a specific task into reminders, so only tasks they've
chosen generate a reminder — nothing is reminded by default.

**Why this priority**: This is the constitutionally-required opt-in step
(Principle V) — without it, this feature cannot exist in this repo at all.

**Independent Test**: Can be fully tested by opting a task with a due date into
reminders and confirming a reminder-due check surfaces it, while an
otherwise-identical task that was never opted in does not appear.

**Acceptance Scenarios**:

1. **Given** a task with a due date, **When** a user opts it into reminders,
   **Then** it becomes eligible to appear in a reminders check.
2. **Given** a task with a due date that was never opted in, **When** a
   reminders check runs, **Then** that task never appears, regardless of how
   close its due date is.

---

### User Story 3 - Check which opted-in tasks are due for a reminder (Priority: P3)

A user (or a script standing in for a scheduled job) checks which opted-in
tasks are due within a window, so they can see what needs attention.

**Why this priority**: This is the payoff of US1/US2, but the constitutionally
important part of this feature is the opt-in gate itself, not the checking
mechanism — hence lowest priority.

**Independent Test**: Can be fully tested by opting a task with a near-term due
date into reminders and an opted-in task with a far-future due date, then
confirming a reminders check returns only the near-term one.

**Acceptance Scenarios**:

1. **Given** an opted-in task due within the check window, **When** a reminders
   check runs, **Then** that task is included.
2. **Given** an opted-in task due well outside the check window, **When** a
   reminders check runs, **Then** that task is not included.

---

### Edge Cases

- What happens when a task with no due date is opted into reminders? It's
  accepted but can never appear in a reminders check (nothing to compare a
  window against) — not an error.
- What happens opting the same task into reminders twice? Idempotent.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-301**: System MUST allow specifying a due date when creating a task.
- **FR-302**: System MUST default `dueDate` to `null` when not specified,
  unchanged from existing task creation behavior.
- **FR-303**: System MUST NOT generate a reminder for any task unless a user has
  explicitly opted that specific task into reminders (constitution Principle V).
- **FR-304**: System MUST allow opting a task into reminders, idempotently.
- **FR-305**: System MUST allow checking which opted-in tasks are due within a
  given window, returning only tasks that are both opted in AND have a due date
  within that window.

### Key Entities

- **Task (extended)**: adds `dueDate` (ISO 8601 string or null) and
  `remindersOptIn` (boolean, default false).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-301**: A user can set a due date and opt into reminders in two requests.
- **SC-302**: 100% of tasks that were never opted in are absent from every
  reminders check, regardless of due date.
- **SC-303**: A reminders check never includes a task outside the requested
  window.

## Assumptions

- "Reminder" in this demo means appearing in a checked list, not an actual sent
  email/push — no notification delivery mechanism exists (constitution
  Principle II, Illustrative Not Production).
- There is no default reminder window; the caller of the check must specify
  one — no implicit global policy is assumed.
