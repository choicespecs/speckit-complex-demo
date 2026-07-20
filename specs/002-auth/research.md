# Phase 0 Research: Auth & User Accounts

## Decision: Opaque random tokens, not JWT

**Rationale**: No expiry, no claims, no revocation logic needed for a demo — a
random string mapped to a user id in memory does everything FR-104/FR-106 need.

**Alternatives considered**: `jsonwebtoken`. Rejected — adds a dependency and
signing-key management for no benefit at this scale, violating Simplicity.

## Decision: Node's built-in `crypto.createHash('sha256')` for passwords, no salt

**Rationale**: Avoids storing plaintext without pulling in `bcrypt`. Explicitly
not production-grade — the constitution's Illustrative Not Production principle
says this is acceptable, and pretending otherwise would misrepresent the demo's
purpose.

**Alternatives considered**: `bcrypt`/`argon2`. Rejected as a dependency add
disproportionate to the lesson being taught.

## Decision: Auth is additive to task creation, not a gate

**Rationale**: FR-107 requires existing anonymous task creation to keep working.
Making the Authorization header optional (rather than required) satisfies both
this feature's ownership goal and backward compatibility with the frozen Core
Task Board contract in one design, without a breaking-change discussion.

**Alternatives considered**: Requiring auth on all task creation going forward.
Rejected — would break the Core Task Board's already-published contract, which
the constitution's Repository Layout section treats as a stable base other
branches build on, not something to be renegotiated mid-project.
