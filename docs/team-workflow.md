# Team Workflow: Branches, Identity, and Integration Order

This repo has three contributors sharing one `.specify/` installation and one
`constitution.md`. Nothing about spec-kit itself changes when you add people —
there's no "team mode" flag — but three things about *how you use it* have to
be decided deliberately that never come up with a single contributor.

## Branch-per-feature, not commit-per-person

Every feature branch in this repo follows spec-kit's own feature-numbering
convention (`NNN-feature-name`) as its branch name too:

```text
main
├── 002-auth
├── 003-tags
└── 004-reminders
```

This isn't required — the branch name and the `specs/<dir>/` name are
independent, and `speckit-specify`'s own docs say so explicitly (see
`speckit-demo/docs/commands.md`). But making them match means `git branch
--list` and `ls specs/` tell you the same story, which matters a lot once
you're context-switching between three people's work instead of reading your
own.

**Constitutional rule** (see this repo's `constitution.md`, Team Workflow
section): contributors work branch-per-feature. Nobody commits directly to
`main` except to freeze the shared foundation and to land constitution
amendments (see [`constitution-amendments.md`](./constitution-amendments.md)).

## The numbering collision this repo sidesteps — and how a real team wouldn't

Here's a gotcha that doesn't show up until you have concurrent branches:
spec-kit's `/speckit-specify` numbers a new feature directory by **scanning
`specs/` for the next available number, at the moment you run it** (see
`.specify/scripts/bash/create-new-feature.sh` and the sequential-numbering
description in `speckit-demo/docs/cli-init.md`). That's fine for one person
working serially. It is *not* fine for two people branching from the same
commit at the same time:

If Priya and Marcus had each actually run `/speckit-specify` independently,
both starting from `main` right after `001-core-task-board` was the only
directory under `specs/`, **spec-kit would have handed both of them
`002-`** — because each of them only ever sees their own branch's copy of
`specs/` at the moment they invoke the command. Neither would find out until
someone tried to merge.

This repo assigns `002-auth` and `003-tags` by convention, to keep the git
history readable for a live audience. A real team hitting this for real has
three options, none of them exotic:

1. **Coordinate numbers out of band** — a quick Slack message ("I'm taking
   002") before running `/speckit-specify`. Cheap, works fine below ~5
   concurrent branches, entirely a process fix, not a tooling one.
2. **Switch to timestamp-based numbering** — `.specify/init-options.json`'s
   `feature_numbering` field accepts `"timestamp"` instead of `"sequential"`
   (see `speckit-demo/docs/cli-init.md`). Directories become
   `20260715-143022-auth` instead of `002-auth` — uglier to read, but
   collision-proof by construction, since two people's clocks essentially
   never agree to the millisecond.
3. **Accept the rename cost at merge time** — if two branches do collide,
   `git mv specs/002-tags specs/005-tags` (picking whatever number is next on
   `main` at merge time) and updating the `Feature Branch` line in that
   feature's `spec.md` is a small, mechanical fix. Cheap for two people;
   `feature_numbering: sequential` starts to strain past four or five
   concurrent branches, which is the point at which option 2 stops being
   optional.

## Git identity as a narrative device (and what it maps to for a real team)

This repo uses distinct git author identities (`priya@taskboard.dev`,
`marcus@taskboard.dev`, `jordan@taskboard.dev`) per contributor, plus a neutral
`team@taskboard.dev` identity for commits that represent the whole team acting
together (ratifying the constitution, writing `WALKTHROUGH.md`). For a real
team this isn't a device — it's just `git config user.name`/`user.email` (or
your platform's commit-signing identity) being different per machine, which
is also exactly why `constitution.md`'s Team Workflow section calls out that
amendments must be *evaluated* against every in-flight branch rather than
assumed to propagate — git identity tells you who wrote what, never who has
seen what.

## Integration order was a real decision, not an accident

Auth merged first, Tags second (producing the first conflict), Reminders
third (producing the second). That order was chosen deliberately for this
walkthrough — but the general principle behind it applies to any team:
**merge the branch with the smallest, most isolated diff to shared code
first.** Auth's changes to `store.js` were additive and low-risk (a new
`ownerId` parameter); merging it first meant Tags' conflict, when it came, was
against a small and easy-to-read prior change, not two unresolved sets of
changes stacked on each other. See
[`merge-conflicts.md`](./merge-conflicts.md) for the resolution mechanics.

## Who runs which command, and when

| Command | Who ran it in this repo | When |
|---|---|---|
| `/speckit-constitution` (initial) | The whole team, together | Once, before any branch existed |
| `/speckit-specify` / `/speckit-plan` / `/speckit-tasks` | Whoever owns that feature branch | Right after cutting their branch from frozen `main` |
| `/speckit-implement` | Same person | After their own tasks.md exists |
| `/speckit-constitution` (amendment) | Whoever's work surfaces the need — here, Jordan, while scoping Reminders | Mid-project, on `main` directly |
| Reviewing an amendment's impact | Whoever owns each *already in-flight* branch | Immediately after merging the amendment into their branch — see `46faca5` and `d398d9a` |
| Merging a feature branch into `main` | The feature's own owner | Once their branch is implementation-complete |

Nobody in this workflow needs push access to someone else's branch — the only
shared-write surface is `main`, and only for the constitution and the
merge commits themselves.
