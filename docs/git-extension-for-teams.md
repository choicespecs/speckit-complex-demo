# What the `git` Extension Would Have Automated Here

`speckit-demo/docs/extensions.md` documents spec-kit's official `git`
extension (`specify extension add git`) in detail — what it installs, which
lifecycle hooks it registers, and why `speckit-demo` itself doesn't use it.
That doc's closing line calls this out directly: *"If this repo ever needed
reproducible feature branches per spec (useful once there's more than one
feature directory under `specs/`), `git` is the extension to reach for
first."* This repo is exactly that situation — three feature directories,
three branches — so it's worth working through, concretely, what would have
changed. **This repo does not have the extension installed** (check
`.specify/extensions.yml` — it doesn't exist here either); everything below
reasons from `speckit-demo/docs/extensions.md`'s verified description of what
installing it produces, mapped onto this repo's actual history.

## What was done by hand in this repo

Every branch in this repo's history — `002-auth`, `003-tags`,
`004-reminders` — was created with a plain `git checkout -b <name> <base>`,
and every spec-kit doc commit was staged and committed manually with
scripted `GIT_AUTHOR_*`/`GIT_COMMITTER_*` environment variables (see
[`team-workflow.md`](./team-workflow.md) for why identity was handled this
way here specifically). Nothing about that is wrong — it's just manual, and
manual steps are exactly what an extension's hooks exist to remove.

## The three hooks that map directly onto this repo's work

Per `speckit-demo/docs/extensions.md`'s dump of the `git` extension's
`.specify/extensions.yml`, three of its hooks are relevant here:

| Hook | When it fires | What it would have done in this repo |
|---|---|---|
| `before_constitution` (`speckit.git.initialize`, non-optional) | Before the constitution exists | Initialized the git repo automatically — this repo's first real commit (`7a69380`) instead would have been produced as a side effect of running `/speckit-constitution`, not a separate step |
| `before_specify` (`speckit.git.feature`, non-optional) | Before `spec.md` is written | Created `002-auth`, `003-tags`, and `004-reminders` automatically, using the extension's own numbering (`branch_numbering: sequential` by default per its `config-template.yml`) — instead of the manual `git checkout -b 002-auth 6e85f74` this repo actually ran |
| `after_specify` / `after_plan` / `after_tasks` / `after_implement` (`speckit.git.commit`, optional, prompts each time) | After each core command | Would have offered to auto-commit each doc/code artifact right after it was generated, instead of this repo's manual `git add` + scripted commit per artifact |

## Where it would help, and where it wouldn't

**Would help**: the numbering-collision risk documented in
[`team-workflow.md`](./team-workflow.md) is exactly the kind of thing
`speckit.git.feature` exists to make consistent — it's the single, shared
implementation of "what's the next number," run at invocation time by
whoever's branching, rather than three people each mentally tracking
`specs/`'s contents themselves. It wouldn't eliminate the collision risk
between two people branching at literally the same instant (the extension
still scans `specs/` synchronously, same as core spec-kit's own numbering
logic), but it would remove the more common failure mode: someone forgetting
to check `specs/` at all before picking a number by hand.

**Wouldn't help**: nothing about the `git` extension's hooks touches
*merging*. `speckit.git.commit` only ever commits within a single command's
output — it has no opinion on integration order, conflict resolution, or the
constitution-amendment review obligation this repo's Team Workflow section
requires. Everything in [`merge-conflicts.md`](./merge-conflicts.md) and
[`constitution-amendments.md`](./constitution-amendments.md) would have
needed to happen exactly the same way, by hand, extension or not — those are
process decisions this project's constitution makes, not something any
spec-kit extension automates today.

## Why this repo still doesn't install it

Same reasoning `speckit-demo/docs/extensions.md` gives for its own repo,
carried forward: this project's constitution (Principle I, Simplicity &
Legibility; Principle II, Illustrative Not Production) treats every piece of
tooling a reader has to understand as a cost, and the entire point of this
repo is to make the team-scale *process* — branching, amendments, conflicts —
visible and walkable, not to demonstrate spec-kit's extension ecosystem. A
real team adopting this workflow past the three-to-five-contributor point
this repo models should genuinely consider `specify extension add git` —
the tradeoff is one more thing to explain in exchange for removing exactly
the manual branch-creation and numbering-tracking steps this repo did by hand
throughout its own history.
