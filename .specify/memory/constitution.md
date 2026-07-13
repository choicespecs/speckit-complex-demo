<!--
Sync Impact Report
- Version change: [none] → 1.0.0 (initial ratification)
- Modified principles: n/a (initial ratification)
- Added sections: Core Principles (I–IV), Repository Layout, Team Workflow, Governance
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gate references generic principles; no changes needed yet)
  - ✅ .specify/templates/spec-template.md (no constitution-specific sections required)
  - ✅ .specify/templates/tasks-template.md (task ID format already supports FR-/US traceability)
- Follow-up TODOs:
  - A fifth principle governing notification/background-job behavior is deliberately deferred.
    It will be added in a future amendment once the Reminders feature surfaces the need for it —
    do not add it preemptively.
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

**Version**: 1.0.0 | **Ratified**: 2026-07-23 | **Last Amended**: 2026-07-23
