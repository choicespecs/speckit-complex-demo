# Team-Scale Spec-Kit: Reference Docs

`speckit-demo/docs/` already covers spec-kit's *mechanics* — `specify init`,
the full command roster, the template system, the extension catalog, the
constitution's argument shape. Nothing here repeats that; read it there if you
need it. This directory covers exactly the layer above it: **what changes when
spec-kit is used by more than one person, on more than one feature, at the
same time.**

| Doc | Covers |
|---|---|
| [`team-workflow.md`](./team-workflow.md) | How branch-per-feature numbering, git identity, and integration order actually worked across three contributors in this repo |
| [`constitution-amendments.md`](./constitution-amendments.md) | What a mid-project amendment obligates you to do to *already-written* specs — worked from this repo's real `v1.0.0` → `v1.1.0` amendment |
| [`concurrent-features.md`](./concurrent-features.md) | How spec-kit keeps two people's specs from interfering with each other, and where that isolation *doesn't* reach (shared code) |
| [`merge-conflicts.md`](./merge-conflicts.md) | Why concurrent features sharing a data model conflict by default, not by accident — worked from this repo's two real conflicts |
| [`enhancement-commands-at-scale.md`](./enhancement-commands-at-scale.md) | `/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`, `/speckit-taskstoissues` — optional for one person, load-bearing for a team |
| [`git-extension-for-teams.md`](./git-extension-for-teams.md) | The official `git` extension, and exactly which parts of this repo's by-hand branch/numbering work it would have automated |

Every claim in these docs is grounded in commits, branches, and files that
actually exist in this repo — check `git log --oneline --graph --all` and
`specs/` against anything below. Where something describes a capability this
repo *didn't* exercise (an extension, an enhancement command), that's called
out explicitly, the same convention `speckit-demo/docs` uses.
