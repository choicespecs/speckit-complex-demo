# Constitution Amendments Mid-Project

`speckit-demo/docs/constitution-guide.md` covers how to *invoke*
`/speckit-constitution` — arguments, sample commands, what "configuring" it
means. This doc covers something that only comes up once a project has been
running for a while with other work already in flight: **what an amendment
obligates you to do that spec-kit itself will never do for you.**

## The mechanism has a hard boundary

`/speckit-constitution`'s own execution flow (see
`.claude/skills/speckit-constitution/SKILL.md`, step 4, "Consistency
propagation checklist") only ever touches four things: the constitution file
itself, and the three *templates* (`plan-template.md`, `spec-template.md`,
`tasks-template.md`). It explicitly does not reach into `specs/002-auth/`,
`specs/003-tags/`, or any other feature directory that already exists. That's
not an oversight — a command that silently rewrote other people's in-progress
specs would be far more dangerous than one that does nothing and makes you
look.

This repo's real amendment, commit `b5e6a91` on `main`, adds Principle V
("Notifications Are Opt-In, Never Silent") and bumps `1.0.0` → `1.1.0`. Diff
it yourself:

```bash
git show b5e6a91 -- .specify/memory/constitution.md
```

Nothing under `specs/002-auth/` or `specs/003-tags/` changes in that commit.
Both of those branches, at that exact moment, are sitting on an amended-later
constitution and don't know it yet.

## The Sync Impact Report is where the obligation gets written down

Every amendment in this repo's constitution is preceded by an HTML comment —
see the top of `.specify/memory/constitution.md` — that names, explicitly,
which already-in-flight specs need review as a *direct consequence* of the
change:

```text
- Already-in-flight specs reviewed for impact as a result of this amendment:
  - ⚠ specs/002-auth/spec.md (FR-103 welcome notification) — REVIEW REQUIRED
  - ✅ specs/003-tags/spec.md — reviewed, no notification-related requirements
```

This is the load-bearing part. `/speckit-constitution`'s own instructions
(the "Consistency propagation checklist" step) never mention scanning
*feature* specs for impact — only templates. The obligation to check
`specs/002-auth/` and `specs/003-tags/` at all came from this project's own
constitution (the Team Workflow section: *"Amendments... MUST be evaluated
for impact against every other branch's already-written specs, even branches
that started before the amendment landed"*) — a rule the team wrote for
itself, not something spec-kit enforces structurally. If your project's
constitution doesn't say this explicitly, nothing will ever remind you to
check.

## What "review" looked like for the branch that needed a change

`specs/002-auth/spec.md`'s original `FR-103` ("System MUST send a welcome
notification when an account is registered") was written and *implemented*
(`717f7cf`) before Principle V existed. The review, once the amendment
landed, happened in three separate, sequenced commits on `002-auth` — worth
looking at as three distinct kinds of work, not one:

1. **`46faca5`** — a plain `git merge main` into `002-auth`, to actually have
   the amended constitution available to check against. This step is easy to
   forget: reviewing "in your head" against a constitution version you
   haven't actually pulled yet is how amendments quietly get ignored.
2. **`c817365`** — the spec-level review. `spec.md` gains an "Amendment
   Review" section that amends `FR-103`'s text in place (not a new requirement
   ID — see the note in that section about why: Principle IV's traceability is
   about the requirement's *identity*, not its first draft). This commit
   changes zero lines of code.
3. **`508b18e`** — the code catching up to the now-amended spec. `notifyOnSignup`
   becomes an explicit opt-in flag in `src/routes/auth.js`, verified against a
   live server before committing.

Splitting these into three commits, rather than one "fix the notification
thing" commit, is what makes `git log` a legible record of *when the team
knew what* — the alternative (one squashed commit) would make it look like
Priya simply built it wrong the first time, when actually the requirement
underneath her changed out from under already-shipped code.

## What "review" looked like for the branch that needed nothing

`specs/003-tags/checklists/requirements.md` gets a one-line addition
(`3c2515e`): *"Reviewed against constitution v1.1.0... No action needed."*
This is the cheap half of the obligation, and it's tempting to skip — nothing
about Tags touches notifications, so why write anything down? Because a
reviewer six weeks later, seeing `002-auth` visibly reviewed and `003-tags`
silent, can't tell the difference between "reviewed, not applicable" and
"nobody checked." The constitution's Fair Parity principle (Principle III)
applies here too, even though it was written about spec *rigor*, not
amendment *response* — the underlying reason is the same: a branch that looks
thinner than its siblings, for whatever reason, erodes trust in all of them.

## Versioning discipline still matters with concurrent branches in play

This amendment is a **MINOR** bump (`1.0.0` → `1.1.0`) per the constitution's
own Governance section: a new principle, not a redefinition of an existing
one, and nothing existing was invalidated (it just needed review). Under
concurrent branches, the version number is doing an extra job beyond
documentation: it's the thing each branch's merge commit (`46faca5`,
`d398d9a`) actually pulls, so "constitution v1.1.0" is checkable —
`git show <branch>:.specify/memory/constitution.md | tail -1` on any branch
tells you exactly which version it has reviewed against, without having to
ask.
