<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: none renamed
- Added principles: V. Notifications Are Opt-In, Never Silent
- Added sections: none
- Removed sections: none
- Rationale for this amendment: while designing 004-reminders, the natural
  implementation is a background process that pushes reminder notifications to
  users. Nothing in v1.0.0 constrained how/whether background notification
  behavior should be surfaced to the user, and 002-auth's already-shipped
  welcome notification (FR-103) turns out to be exactly this kind of silent
  background side-effect. Rather than let Reminders set an implicit precedent,
  the team is naming the rule explicitly before Reminders' spec is written.
- Already-in-flight specs reviewed for impact as a result of this amendment:
  - ⚠ specs/002-auth/spec.md (FR-103 welcome notification) — REVIEW REQUIRED,
    already implemented as an unconditional side-effect; see Amendment Review
    addendum to be added to that spec.
  - ✅ specs/003-tags/spec.md — reviewed, no notification-related requirements,
    no action needed.
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gate reads principles generically; no changes needed)
- Follow-up TODOs: none — this amendment fully resolves the deferred TODO from v1.0.0.
-->

# Task Board Constitution

## Core Principles

### I. Simplicity & Legibility
Code MUST stay small and easy to read in a single sitting. Every file, function, and
data shape exists to be understood quickly by someone reading the repo for the first
time, not to demonstrate scale. When a simpler implementation and a more "correct"
one both satisfy the spec, the simpler one MUST be chosen.

Rationale: This is a teaching artifact walked through live. Anything that requires
the presenter to say "ignore that part, it's just plumbing" has failed this principle.

### II. Illustrative Not Production
This project MUST NOT take on production-grade concerns that aren't part of the
lesson being taught: no hardened auth, no persistent database, no real notification
delivery. In-memory storage and stub integrations are acceptable and preferred
wherever the spec doesn't specifically call for more.

Rationale: The subject of this repo is the spec-driven *process* used by a team, not
the production-readiness of the Task Board app itself. Effort spent hardening the
app is effort not spent on the lesson.

### III. Fair Parity Between Concurrent Features
When multiple feature branches are in flight at once, each MUST receive equivalent
spec-kit rigor: a spec.md with prioritized user stories and acceptance scenarios, a
plan.md with real (if small) technical decisions, and a tasks.md with granular,
checkable tasks. No concurrent feature may be hand-waved relative to the others.

Rationale: The whole point of this demo is showing spec-kit at team scale. If one
branch's artifacts are noticeably thinner than another's, it implies spec-kit rigor
degrades under concurrency — the opposite of the lesson.

### IV. Traceability From Spec to Code
Every functional requirement (`FR-###`), success criterion (`SC-###`), user story
(`US#`), and task (`T###`) MUST have a stable ID assigned the moment it is written.
Code that implements a requirement MUST reference that requirement's ID in a comment
at the point of implementation.

Rationale: Traceability is only checkable if IDs exist from the start — retrofitting
them later (as this principle itself warns against) defeats the purpose of a demo
about traceability.

### V. Notifications Are Opt-In, Never Silent
Any feature that sends a notification to a user — email, push, in-app, or a
logged stand-in for one — MUST make that notification an explicit, checkable
opt-in choice made by the user, not an automatic side-effect of another action.
A signup, a reminder, or any other trigger MUST NOT itself imply consent to be
notified.

Rationale: This principle exists because a background job (reminders) is easy
to build as "just send it," and by the time that pattern is normalized it's
already been used elsewhere (a signup welcome message) without anyone deciding
that on purpose. Naming the rule explicitly, once, is cheaper than untangling
implicit notification behavior across several features later.

## Repository Layout

`main` holds the foundational Core Task Board API only — tasks belonging to boards,
the same CRUD shape as the original task-list demo, extended with a `Board` entity.
This is the shared base every feature branch cuts from and must remain stable once
those branches exist.

Each concurrent feature lives on its own branch, following the pattern
`###-feature-name` (matching spec-kit's own feature numbering), with its own
directory under `specs/`: e.g. `specs/002-auth/`, `specs/003-tags/`,
`specs/004-reminders/`. Feature branches are not required to merge into `main` for
this demo to succeed — the branches themselves, and the artifacts on them, are the
teaching material.

## Team Workflow

Three contributors share this repository, each owning exactly one concurrent
feature branch. All three read and are bound by the same `constitution.md` — there
is one shared constitution, not one per branch. Amendments to the constitution are
made against whichever branch is current at the time and MUST be evaluated for
impact against every other branch's already-written specs, even branches that
started before the amendment landed.

Contributors work branch-per-feature, not commit-per-person-on-main. A merge
conflict between two feature branches touching the same underlying model is an
expected, not exceptional, outcome of this workflow and MUST be resolved explicitly
rather than avoided by design.

## Governance

This constitution supersedes ad hoc decisions made on any individual feature
branch. Amendments MUST be recorded via a Sync Impact Report (HTML comment at the
top of this file) documenting the version change, the principle(s) added, changed,
or removed, and which already-in-flight specs were reviewed for impact as a result.

Versioning follows semantic rules: MAJOR for backward-incompatible principle
removals or redefinitions, MINOR for new principles or materially expanded
sections, PATCH for wording/clarity fixes. All spec-kit artifacts (`spec.md`,
`plan.md`, `tasks.md`) on every branch are expected to comply with the constitution
version current at the time they were last touched; a constitution amendment does
not retroactively invalidate untouched artifacts, but does obligate a documented
review of them.

**Version**: 1.1.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-17
