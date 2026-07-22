# The "Optional" Commands Stop Being Optional at Team Scale

`speckit-demo/docs/commands.md` lists five enhancement commands this repo's
single-feature sibling never needed:
`/speckit-clarify`, `/speckit-checklist`, `/speckit-analyze`, `/speckit-converge`,
`/speckit-taskstoissues`. **This repo doesn't run any of them either** — same
as `speckit-demo`, everything here was built with just the five core
commands. This doc is deliberately honest about that; nothing below claims a
command ran when it didn't. What's different is *why* each one stops being
skippable once a project looks like this one — three people, concurrent
branches, a constitution that changes mid-flight — grounded in what each
command's actual `SKILL.md` does (all five are installed in this repo's
`.claude/skills/`, so you can read the real instructions, not a summary of
them).

## `/speckit-analyze` — cross-artifact consistency, read-only

Its own `SKILL.md` (`.claude/skills/speckit-analyze/SKILL.md`) is explicit
that it's **STRICTLY READ-ONLY** and treats any conflict with a constitution
`MUST` principle as automatically CRITICAL. For one person on one feature,
this is a nice-to-have — you already hold the whole spec/plan/tasks picture
in your head, so a tool cross-checking it against itself catches typos more
than real gaps.

For a team, the thing it can check that a person plausibly can't is exactly
what [`concurrent-features.md`](./concurrent-features.md) flags as *not*
mechanically enforced today: whether a feature's `tasks.md` actually has
coverage for every `FR-` in its own `spec.md` (its "Coverage Gaps" detection
pass, step 4E). Run per-branch, right before that branch's
`/speckit-implement`, it's the closest thing to an automated Fair Parity
check available — not because it compares branches to each other (it
doesn't; it only ever looks at one feature's own `FEATURE_DIR`), but because
running it identically on all three branches before merging is itself a
parity practice a team can adopt, even though spec-kit won't remind you to.

## `/speckit-clarify` — resolving ambiguity before it's load-bearing for someone else

On one feature, an unresolved `[NEEDS CLARIFICATION]` marker is a note to
yourself. Once a feature's spec is something *another* branch's plan might
reasonably assume something about — e.g., if Reminders' `plan.md` had needed
to reference how Auth's tokens work — an ambiguity left unresolved in one
branch's spec becomes a guess baked into someone else's design. This repo
sidesteps the problem by construction ([`concurrent-features.md`](./concurrent-features.md)
covers how little `002-auth` and `003-tags` actually depend on each other),
but that was a scoping choice, not a guarantee. A team whose concurrent
features *do* need to assume things about each other's not-yet-merged work
should treat `/speckit-clarify` as a gate before any other branch is allowed
to write a dependent assumption into its own `plan.md`.

## `/speckit-checklist` — "unit tests for English," per requirement domain

Its `SKILL.md` is unusually blunt about what it is *not*: not "verify the
button works," but "is 'prominent display' quantified with specific
sizing/positioning" — a check on the *spec's* writing quality, not the code.
The reason this matters more with three people: a single author's blind spots
are consistent (you'll under-specify the same kinds of things every time,
which at least makes them predictable to a reviewer who knows you). Three
authors' blind spots are three different sets of gaps, occurring in parallel,
each looking locally reasonable — Principle III (Fair Parity) says every
concurrent spec should get equal rigor, but rigor isn't just section count
(see [`concurrent-features.md`](./concurrent-features.md)'s side-by-side
comparison) — a domain-specific checklist, generated per feature before
`/speckit-plan`, is a cheap way to check *quality*, not just presence.

## `/speckit-converge` — closing the gap after code drifts from plan

`converge`'s `SKILL.md` is explicit that it's **append-only** — it never
rewrites `spec.md`/`plan.md`/existing tasks, only appends a new `## Phase N:
Convergence` section for gaps it finds between what the artifacts call for
and what the code actually does. On one feature, this mostly matters after a
long gap between planning and finishing implementation. On a team, it matters
for a sharper reason: **this repo's own constitution-amendment ripple (see
[`constitution-amendments.md`](./constitution-amendments.md)) was resolved by
hand** — Priya reviewed `002-auth`'s spec against the new principle and wrote
`T110` into `tasks.md` herself. `/speckit-converge` is the mechanized version
of exactly that motion: point it at a branch whose spec just changed
underneath already-shipped code (an amendment, a clarified requirement, a
scope change from a stakeholder), and it produces the review-and-append step
as a repeatable command instead of a manual diff-reading exercise. It
wouldn't have changed *what* Priya's review found — it would have made the
same review runnable identically by Marcus, on his own branch, for his own
amendment-response if he'd had one.

## `/speckit-taskstoissues` — the one that only makes sense with more than one person

This is the clearest case: `taskstoissues`'s `SKILL.md` converts `tasks.md`'s
checklist items into GitHub issues, one per task, titled `T001: <description>`,
with deduplication against existing issues so re-running it after `tasks.md`
regenerates doesn't create duplicates. For a solo contributor working through
their own `tasks.md` top to bottom, an issue per task is pure overhead — you
already know what's next, it's the next unchecked box. The moment a *team*
needs to divide a feature's tasks across more than one person, or track
[P]-marked parallel tasks against who's actually picking each one up, `T001`
through `T109` as 9 trackable, assignable GitHub issues (Auth's real task
count) is a materially different, and more useful, artifact than the same 9
lines sitting in a markdown checklist only one person is reading. Note its
own safety rail: it refuses to run against any remote that isn't the
project's actual GitHub remote — worth knowing before pointing it at a fork
or a personal mirror by mistake.

## The pattern across all five

None of these commands do anything conceptually new once you understand the
core five (`constitution` → `specify` → `plan` → `tasks` → `implement`) —
each one is a variation on "check consistency," "resolve ambiguity earlier,"
or "make the work legible to someone who isn't you." That's exactly why they
read as skippable for a single contributor and start reading as necessary
the moment "someone who isn't you" is a literal, daily fact of the project.
