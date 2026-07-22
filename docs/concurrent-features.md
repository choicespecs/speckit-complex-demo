# Concurrent Features: Isolation, and Where It Ends

Two people, `002-auth` and `003-tags`, started from the exact same commit
(`6e85f74`) on the same day and never coordinated. This doc is about what
spec-kit's structure gives you for free in that situation, and — just as
important — exactly where that isolation stops.

## What's isolated by construction: the planning artifacts

Every feature gets its own directory: `specs/002-auth/`, `specs/003-tags/`.
`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`,
`quickstart.md`, `tasks.md` — none of these files are shared between
features. Compare:

```bash
diff <(grep '^###' specs/002-auth/spec.md) <(grep '^###' specs/003-tags/spec.md)
```

Different headings, different requirement ID prefixes (`FR-1##` vs `FR-2##`),
different success-criteria numbering (`SC-1##` vs `SC-2##`) — by convention,
not by any enforcement mechanism. Nothing stops two people from picking the
same ID prefix; it's a team convention documented in this repo's constitution
(Principle IV) and nowhere else. Because the *files* are structurally
separate, though, there's no way for Priya's edits to `spec.md` and Marcus's
edits to *his* `spec.md` to conflict at the git level even if they had picked
colliding IDs — that part really is free.

## What Fair Parity (Principle III) checks that structure alone doesn't

Structural isolation means two specs *can't* technically collide. It says
nothing about whether they're *equally rigorous*. Put `specs/002-auth/spec.md`
and `specs/003-tags/spec.md` next to each other:

| | `002-auth` | `003-tags` |
|---|---|---|
| User stories | 3, prioritized P1–P3 | 3, prioritized P1–P3 |
| Functional requirements | 7 (`FR-101`–`FR-107`) | 4 (`FR-201`–`FR-204`) |
| Checklist passed first draft? | Yes | Yes |
| `research.md` decisions documented | 3 | 2 |

Auth has more requirements because it's a genuinely bigger feature (accounts +
tokens + ownership vs. a string array + a filter) — not because Marcus did
less work. The check Fair Parity is actually protecting against is a
*process* gap, not a line-count one: did both specs get a real Independent
Test per story? Did both get a `research.md` with actual alternatives
considered, or did one just skip Phase 0 because "it's simple"? Read both
`research.md` files side by side — both have a real "Alternatives considered"
per decision, which is the thing that's cheap to skip under time pressure and
expensive to reconstruct later.

**In a real team, this is a code-review-time question, not a tooling gate**:
spec-kit has no command that compares two feature directories' rigor for you.
If this matters to your team, it belongs in a PR template checklist for
`specs/**/spec.md`, not somewhere you can assume `/speckit-specify` enforces
it automatically.

## Where isolation ends: anything both features are extending

`specs/` isolation has nothing to say about `src/`. Both Auth and Tags extend
the same `Task` shape in the same `src/store.js`, because that's where
`001-core-task-board`'s `research.md` deliberately put all task state (see
that doc's "State isolated in store.js" decision). This was a *good* call —
see [`merge-conflicts.md`](./merge-conflicts.md) for why a collision in one
well-known file beats collisions scattered across many — but it means the
thing spec-kit isolates (planning documents) and the thing that actually
conflicts (shared application code) are two different surfaces. Don't mistake
"our specs never conflict" for "our features never conflict" — check
`git log --oneline --graph 002-auth 003-tags main` and you'll see both specs
merge in clean; it's `src/store.js` and `src/routes/tasks.js` that don't.

## A litmus test for scoping a new concurrent feature

Before a third or fourth feature branches off a shared base, ask: **does its
`data-model.md` add a field to an entity another in-flight branch also
touches?** If yes (as all three features here do, to `Task`), expect a merge
conflict as a normal outcome, not a surprise — plan your integration order
around it (see `team-workflow.md`'s "Integration order" section) rather than
being caught off guard when `git merge` stops cleanly.
