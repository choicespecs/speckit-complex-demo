# Feature Specification: Auth & User Accounts

**Feature Branch**: `002-auth`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "Add user accounts on top of the Core Task Board: register, log in, and attribute tasks a logged-in user creates to that user. Must not break the existing anonymous task API."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register an account (Priority: P1)

A new user registers with a username and password so they can later log in and
have their tasks attributed to them.

**Why this priority**: Nothing else in this feature is possible without an
account existing first.

**Independent Test**: Can be fully tested by registering a user and confirming
the response contains an id and username but never the password.

**Acceptance Scenarios**:

1. **Given** no user with that username exists, **When** someone registers with a
   username and password, **Then** an account is created and a welcome
   notification is sent to them.
2. **Given** a username that's already registered, **When** someone tries to
   register it again, **Then** the request is rejected.

---

### User Story 2 - Log in and receive a token (Priority: P2)

A registered user logs in with their username and password and receives a token
they can use on subsequent requests.

**Why this priority**: Registration alone doesn't let anyone prove who they are
on later requests — login is what makes ownership (US3) possible.

**Independent Test**: Can be fully tested by registering, logging in, and
confirming a token is returned that differs per login.

**Acceptance Scenarios**:

1. **Given** a registered user, **When** they log in with the correct password,
   **Then** they receive a token.
2. **Given** a registered user, **When** they log in with the wrong password,
   **Then** the request is rejected and no token is issued.

---

### User Story 3 - Tasks I create are attributed to me (Priority: P3)

A logged-in user creates a task, and it's recorded as belonging to them, so that
task ownership is visible without breaking the existing anonymous task API.

**Why this priority**: This is the payoff of the first two stories, but the
Core Task Board must keep working for anyone who doesn't authenticate — this is
additive, not a breaking change.

**Independent Test**: Can be fully tested by creating a task with a valid token
and confirming the returned task includes the caller's user id as owner, then
separately creating a task with no token and confirming it still works exactly
as it did before this feature existed.

**Acceptance Scenarios**:

1. **Given** a valid token, **When** a user creates a task, **Then** the task is
   returned with an `ownerId` matching that user.
2. **Given** no token is provided, **When** a task is created, **Then** it
   succeeds exactly as the Core Task Board spec already defines, with `ownerId`
   absent/null.

---

### Edge Cases

- What happens when registering with an empty username or password? Rejected.
- What happens when a task is created with an invalid or expired token? Treated
  the same as no token — anonymous creation, not an error (fail open, since
  auth is additive here, not a gate).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-101**: System MUST allow registering a new account with a unique username
  and a password.
- **FR-102**: System MUST reject registration for a username that already exists.
- **FR-103**: System MUST send a welcome notification when an account is
  registered.
- **FR-104**: System MUST allow logging in with a username and password and
  return a token on success.
- **FR-105**: System MUST reject login with an incorrect password.
- **FR-106**: System MUST attribute a task's `ownerId` to the authenticated user
  when a valid token is presented at creation time.
- **FR-107**: System MUST continue to allow task creation without a token,
  unchanged from the Core Task Board contract (FR-003, FR-004).

### Key Entities

- **User**: id, username (unique), password (stored, not returned by any
  endpoint), createdAt.
- **Token**: an opaque string mapped to a user id, issued at login.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-101**: A user can register and log in in two requests.
- **SC-102**: 100% of existing Core Task Board anonymous-creation behavior is
  unchanged after this feature merges.
- **SC-103**: Every task created with a valid token has a correct, non-null
  `ownerId` in the response.

## Assumptions

- Password storage uses a simple one-way hash, not a production-grade algorithm
  (bcrypt/argon2) or salting — per the constitution's Illustrative Not Production
  principle.
- Tokens are opaque random strings held in memory with no expiry — session
  expiry is out of scope for this illustrative feature.
- "Welcome notification" (FR-103) is implemented as an in-memory log entry, not
  a real email/push send — no external notification service exists in this demo.
