# Spec-Kit at Team Scale

`speckit-demo` (its sibling repo) answers "what does spec-driven development
buy you on one feature, built by one person?" This repo answers the question
that comes right after: **what happens when it's not just one person, and not
just one feature?**

Three fictional contributors — **Priya Patel**, **Marcus Chen**, and **Jordan
Reyes** — build a small Task Board app on top of [GitHub
spec-kit](https://github.com/github/spec-kit), each owning one concurrent
feature branch. Every commit in this repo's history is real: actually produced
by running spec-kit's `/speckit-*` commands (or, where noted, by hand-following
the exact playbook those commands execute), not a hand-simulated diff. See
`git log --oneline --graph --all`.

## What this demonstrates that a single-feature demo can't

| Question | Where it's answered |
|---|---|
| What happens when two people extend the same shared model concurrently? | [`docs/concurrent-features.md`](./docs/concurrent-features.md) |
| What happens when project governance (the constitution) changes after some specs already exist? | [`docs/constitution-amendments.md`](./docs/constitution-amendments.md) |
| What does a spec-kit merge conflict actually look like, and how do you resolve one? | [`docs/merge-conflicts.md`](./docs/merge-conflicts.md) |
| How do a team's contributors actually coordinate branch numbering, identity, and integration order? | [`docs/team-workflow.md`](./docs/team-workflow.md) |
| Do the "optional" spec-kit commands (`/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`, `/speckit-taskstoissues`) matter more once there's a team? | [`docs/enhancement-commands-at-scale.md`](./docs/enhancement-commands-at-scale.md) |
| Could the branch/numbering work here have been automated instead of done by hand? | [`docs/git-extension-for-teams.md`](./docs/git-extension-for-teams.md) |

Full index, with what each doc covers and why, in [`docs/README.md`](./docs/README.md).

## The repo, structurally

```text
main                  — frozen Core Task Board API + shared constitution
├── 002-auth          — Priya: user accounts, task ownership
├── 003-tags          — Marcus: tags, filtering
└── 004-reminders     — Jordan: due dates, opt-in reminders (written after
                         the constitution amendment below)
```

Four things happen across this history that a single-feature demo has no
reason to show:

1. **Two branches built concurrently** from the same frozen base (`002-auth`,
   `003-tags` — same day, same starting commit, no coordination between them).
2. **A constitution amendment mid-project** (`v1.0.0` → `v1.1.0`, adding
   "Notifications Are Opt-In, Never Silent") that ripples back into an
   already-shipped spec *and* its already-shipped code on `002-auth`.
3. **Two real merge conflicts**, both in `src/store.js`, because three people
   each independently extended the same `Task` shape from the same base —
   resolved live, not glossed over.
4. **A feature written after the amendment** (`004-reminders`) that gets to be
   correct from its first draft, because the principle existed before its
   spec did.

## Running it

```bash
npm install
npm start   # listens on :3000 — main's fully-merged state has all three features
```

## Presenting it

[`WALKTHROUGH.md`](./WALKTHROUGH.md) is a live-presentation script — five
beats, each pointing at specific commits and files, meant to be read from
while driving a terminal and editor in front of an audience. It is not a
tutorial for the audience to follow along with on their own machines.

## Relationship to `speckit-demo`

Read that repo's `README.md` and `PROCESS.md` first if you haven't — this repo
assumes you already know what `/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement` produces for *one* feature, and spends
its own documentation entirely on what changes once there's a team.
`speckit-demo/docs/` is the mechanics reference (CLI flags, the full command
roster, the template system, the extension catalog) — this repo's `docs/`
never repeats that material, only what's specific to multiple contributors and
concurrent features.
