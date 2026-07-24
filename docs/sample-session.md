# Sample Session: Commands, Args, and Output Across Four Concurrent Threads of Work

The other docs in this directory each answer one focused question. This one
answers a more literal one: **if you sat behind all four contributors at
once, what would each terminal actually show?** Three people running the full
`/speckit-*` pipeline on three different Jira stories, and a fourth doing
something the other docs don't cover at all — a bug fix that never touches
`.specify/` — landing in the same short window.

Every command and commit below is real. The three feature branches
(`002-auth`, `003-tags`, `004-reminders`) are the same ones covered in
[`concurrent-features.md`](./concurrent-features.md),
[`constitution-amendments.md`](./constitution-amendments.md), and
[`merge-conflicts.md`](./merge-conflicts.md) — this doc doesn't re-argue those,
only shows the terminal-level view. `bugfix/233-tag-filter-case` is new: a
real branch, a real fix (`cac741a`), a real merge (`1cef40d`), added
specifically to show what *doesn't* need spec-kit ceremony, and why.

## Orientation

| Who | Ticket | Branch | Kind of work | When |
|---|---|---|---|---|
| Priya | `STORY-118` | `002-auth` | New feature (spec-kit ceremony) | 2026-07-15 |
| Marcus | `STORY-142` | `003-tags` | New feature (spec-kit ceremony), concurrent w/ Priya | 2026-07-15/16 |
| **Alex** | `BUG-233` | `bugfix/233-tag-filter-case` | Bug fix (**no** spec-kit ceremony) | 2026-07-17, concurrent w/ Jordan |
| Jordan | `STORY-160` | `004-reminders` | New feature, written *after* a constitution amendment | 2026-07-17 |

All four start from the same frozen `main`. None of them coordinate mid-branch
— see [`team-workflow.md`](./team-workflow.md) for why that's survivable here
(branch-per-feature, shared constitution) and where it isn't (see below).

---

## Terminal 1 — Priya, `STORY-118`

```bash
$ git checkout -b 002-auth main

$ /speckit-specify Add user accounts on top of the Core Task Board: register, \
  log in, and attribute tasks a logged-in user creates to that user. Must not \
  break the existing anonymous task API.

→ Short name: user-auth
→ Created specs/002-auth/spec.md
→ Spec Quality Checklist: specs/002-auth/checklists/requirements.md
  ✅ 12/12 items pass — no [NEEDS CLARIFICATION] markers
→ SUCCESS (spec ready for planning)

$ /speckit-plan Keep it in-memory, no real password hashing — illustrative not production

→ Constitution Check: PASS (Principles I-IV)
→ Wrote specs/002-auth/plan.md, research.md, data-model.md, quickstart.md
→ contracts/ (2 endpoints: POST /register, POST /login)

$ /speckit-tasks

→ Generated specs/002-auth/tasks.md — 9 tasks, 6 phases (T101-T109)

$ /speckit-implement

→ 717f7cf feat: implement Auth & User Accounts (T101-T109)
```

## Terminal 2 — Marcus, `STORY-142` (same afternoon, different laptop)

```bash
$ git checkout -b 003-tags main    # same base commit Priya branched from, unaware of her work

$ /speckit-specify Let tasks carry one or more tags (e.g. 'urgent', 'blocked') \
  so users can filter a board's tasks by tag. Must not break existing task \
  creation without tags.

→ Short name: tags-categories
→ Created specs/003-tags/spec.md
→ Spec Quality Checklist: ✅ 12/12 pass

$ /speckit-plan
$ /speckit-tasks

→ Generated specs/003-tags/tasks.md — 9 tasks, 6 phases (T201-T209)

$ /speckit-implement

→ 359da30 feat: implement Tags & Categories (T201-T209)
```

Priya's `T10x` and Marcus's `T20x` never collide as *IDs* — Principle III
(Fair Parity) discipline, not a tooling guarantee. But both are about to add a
field to `createTask` in the same `src/store.js`. Neither knows it yet — see
[`merge-conflicts.md`](./merge-conflicts.md) for what that produces at merge
time.

---

## Terminal 3 — Alex, `BUG-233` (no spec-kit ceremony)

Not everything happening concurrently is a Jira *story*. A bug fix doesn't
get a `spec.md` — the constitution's Principle I (Simplicity & Legibility)
and the Repository Layout section only put branch-per-feature ceremony on
work that lives under `specs/`. A one-line regression fix just gets a branch.

```bash
$ git checkout -b bugfix/233-tag-filter-case main

$ grep -n "tags.includes" src/store.js
67:    (t) => t.boardId === boardId && (!tag || t.tags.includes(tag))

# no /speckit-specify, no /speckit-plan — this never touches .specify/
$ vim src/store.js   # case-insensitive compare in listTasksForBoard

$ npm start &
$ curl -s -X POST localhost:3000/boards -d '{"name":"Sprint 12"}' -H 'Content-Type: application/json'
$ curl -s -X POST localhost:3000/boards/1/tasks -H 'Content-Type: application/json' \
    -d '{"description":"Fix the outage","tags":["Urgent"]}'
$ curl -s "localhost:3000/boards/1/tasks?tag=urgent"
# → 200, task 1 now matches (previously: [])
$ curl -s "localhost:3000/boards/1/tasks?tag=URGENT"
# → 200, task 1 matches this too

$ git commit -am "fix: tag filter matching is case-insensitive (BUG-233)"
# cac741a
```

This branch is cheap: it targets `main` directly, skips the whole
`.specify/` pipeline, and — because it touches `listTasksForBoard`'s filter
predicate rather than `createTask`'s shape — doesn't collide with either
Priya's or Marcus's in-flight branches. The merge commit says so explicitly:

```bash
$ git checkout main
$ git merge --no-ff bugfix/233-tag-filter-case
# 1cef40d — clean merge, src/store.js only, no conflict
```

**The lesson this branch exists to make concrete:** scope, not "is it
concurrent," decides whether spec-kit ceremony is worth it. Compare
`cac741a`'s diff (5 lines, one function) to any of `T101`-`T109` — nobody
would want a `spec.md` for this, and nothing about three other branches being
in flight changes that.

---

## Terminal 4 — Jordan, `STORY-160` (constitution amendment first, then the feature)

```bash
$ git checkout main

$ /speckit-constitution Add a principle: any feature that sends a notification \
  must make it an explicit opt-in, never an automatic side effect.

→ Sync Impact Report: v1.0.0 → v1.1.0
→ Added: V. Notifications Are Opt-In, Never Silent
→ Already-in-flight specs reviewed for impact:
  ⚠ specs/002-auth/spec.md (FR-103 welcome notification) — REVIEW REQUIRED
  ✅ specs/003-tags/spec.md — no notification requirements, no action
→ b5e6a91 docs: amend constitution to v1.1.0

$ git checkout -b 004-reminders main   # main now includes the amendment

$ /speckit-specify Let tasks have an optional due date, and let users opt in \
  to reminder notifications before that date arrives.

→ Created specs/004-reminders/spec.md
→ FR-303 written against v1.1.0 from the first draft — opt-in load-bearing,
  not retrofitted

$ /speckit-plan
$ /speckit-tasks
$ /speckit-implement

→ a227af0 feat: implement Due Dates & Reminders (T301-T309)
```

Meanwhile, on `002-auth`, Priya has to react to the amendment that landed on
`main` *after* she'd already implemented:

```bash
$ git checkout 002-auth
$ git merge main          # 46faca5 — pulls the v1.1.0 amendment in

$ /speckit-analyze        # optional command, read-only cross-check
→ CRITICAL: FR-103 (welcome notification) conflicts with Principle V
  (unconditional side-effect, no opt-in)

# manual review, not automated — Priya adds T110 to tasks.md herself
$ /speckit-implement      # picks up the new task
→ 508b18e fix: make welcome notification opt-in (T110)
```

---

## What lands, in what order

```bash
$ git log --oneline --graph --all
```

- `bugfix/233-tag-filter-case` → `main` (`1cef40d`): **clean merge**, no
  conflict — different function than the feature branches touch.
- `002-auth` → `main` (`00d39c0`): clean merge — first feature branch in,
  nothing to collide with yet.
- `003-tags` → `main` (`a204e5e`): **conflicts in `src/store.js`** —
  `createTask`'s signature and the task object literal, because Auth and Tags
  both added a field to the same shared shape independently.
- `004-reminders` → `main` (`c789e48`): **conflicts again, same lines** —
  Jordan's branch also started from the pre-Auth, pre-Tags version of
  `createTask`. Final signature carries all contributions: `ownerId`, `tags`,
  `dueDate`, `remindersOptIn`.

The bug fix is the control case: it proves concurrency itself isn't what
causes conflicts — touching the same shared model is. Two feature branches
independently extending `Task` will collide in `store.js` regardless of how
carefully each one is planned; a bug fix scoped to `listTasksForBoard`'s
filter predicate won't, no matter how many other branches are in flight at
the same time. See [`merge-conflicts.md`](./merge-conflicts.md) for the
resolution mechanics on the two conflicts that *did* happen.
