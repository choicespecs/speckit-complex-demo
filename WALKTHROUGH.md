# Walkthrough: Spec-Kit at Team Scale

This repo is a presentation aid, not a self-serve tutorial — it's meant to be
driven live, in a terminal and editor, in front of an audience. It picks up
where `speckit-demo` left off: that repo showed spec-kit on one feature, one
person, one straight line from spec to code. This one answers the next
question a team always asks: *"okay, but what happens when it's not just
me?"*

The fictional team is three people — **Priya Patel**, **Marcus Chen**, and
**Jordan Reyes** — building a Task Board app on top of the same spec-kit
workflow. Every commit in this repo's history was actually made by running the
real `/speckit-*` commands (or, where noted, by hand-following the exact
playbook those commands execute) — nothing here is a hand-simulated diff.

Run `git log --oneline --graph --all` before you start talking — the shape of
the graph is most of the pitch before you've said a word.

## Setup before presenting

```bash
git log --oneline --graph --all   # the shape tells the story
npm install
```

Suggested: have three terminal tabs ready, one per branch (`git checkout
002-auth`, `003-tags`, `004-reminders`), so you can hop between them without
narrating `git checkout` every time.

---

## Beat 1 — One team, one constitution, one frozen foundation

**Show**: `7a69380`..`6e85f74` on `main` (`git log --oneline main` from the
bottom, or `git show 7a69380 -- .specify/memory/constitution.md`)

**Say**: Before anyone branches off to build their own feature, the team ran
`/speckit-constitution` once, together, and ratified a shared constitution.
Open `.specify/memory/constitution.md` and point at Principle III, "Fair
Parity Between Concurrent Features" — that's the rule that exists *specifically
because* three people are about to work at once. Then `specs/001-core-task-board/`
— spec, plan, tasks, implementation — is the shared foundation every branch
will cut from. Point at `plan.md`'s decision to isolate state in `store.js`:
that single design call is why the merge conflicts later are legible instead
of chaos.

**Land it**: "Everything downstream of this point was built by three different
people who never talked to each other mid-feature — and it still holds
together, because the constitution and the frozen core did the coordinating
for them."

---

## Beat 2 — Two people, two branches, same afternoon

**Show**: `git log --oneline --graph 002-auth 003-tags` — note the timestamps:
Priya's and Marcus's commits interleave on 2026-07-15/16, both starting from
the same `6e85f74`.

**Say**: Priya is building Auth (`specs/002-auth/`), Marcus is building Tags
(`specs/003-tags/`) — same day, same base commit, no coordination. Show both
`spec.md` files side by side and point out they have *equal rigor* — same
number of sections, same ID conventions (`FR-1##` vs `FR-2##`) — because the
constitution's Fair Parity principle isn't a suggestion, it's checkable by
just looking.

Open `src/store.js` on each branch (`git show 002-auth:src/store.js` vs `git
show 003-tags:src/store.js`) and point at `createTask` in both — same function,
same base version, two different people independently adding a parameter to
it. **This is the setup for Beat 4.**

**Land it**: "Neither of them did anything wrong. They just both touched the
one place in the codebase that was always going to be shared."

---

## Beat 3 — A constitution amendment, live, mid-project

**Show**: `git show b5e6a91` (the amendment commit, on `main`)

**Say**: While scoping Reminders, Jordan realizes the natural implementation
is a background job that pushes notifications — and stops to ask "wait, does
our constitution say anything about that?" It didn't. So instead of just
building it, he ran `/speckit-constitution` again and added Principle V,
**before** writing a single line of the Reminders spec. Read the Sync Impact
Report at the top of the file out loud — it explicitly names which
already-in-flight spec needs review as a result.

**Show**: `git show c817365` and `git show 508b18e` on `002-auth`

**Say**: Here's the part that makes it real instead of decorative: Priya's
Auth spec already shipped a welcome notification (`FR-103`) — implemented
*before* this principle existed. The amendment doesn't rewrite her spec by
itself; `git show 46faca5` is her merging the amendment into her branch, and
`c817365` is her actually sitting down and reviewing her own already-written
spec against it. Then `508b18e` is the code catching up: the notification
becomes opt-in, verified live (show the two curl calls in that commit message
— one without `notifyOnSignup`, one with).

Optionally: `git show 3c2515e` on `003-tags` — Marcus's parity note. He has
nothing to change, but the constitution's Team Workflow section says *every*
in-flight branch gets reviewed, not just the ones that need code changes — so
there's a commit that says "N/A" on purpose.

**Land it**: "A constitution amendment doesn't ripple automatically —
spec-kit gives you no mechanism for that. What it gives you is a paper trail
honest enough that someone *has* to notice, and a place to write down that
they did."

---

## Beat 4 — The merge conflict, twice

**Show**: `git show a204e5e` (the Tags merge) and `git show c789e48` (the
Reminders merge)

**Say**: Auth merges into `main` clean (`00d39c0`) — nothing collided yet.
Then Tags merges and `src/store.js` conflicts exactly where Beat 2 predicted:
`createTask`'s signature and the task object literal, because Auth and Tags
both added a field there independently. Show the resolved diff — both
`ownerId` and `tags` are kept, not one overwriting the other.

Then — and this part wasn't originally planned this way, worth saying out
loud if asked — Reminders' merge conflicts *again*, on the same lines, because
Jordan's branch also started from the pre-Auth, pre-Tags version of
`createTask`. Two concurrent features touching a shared model doesn't just
produce one conflict; a third one compounds it. `git show c789e48` — the
final `createTask` signature carries all four contributions: `ownerId`,
`tags`, `dueDate`, `remindersOptIn`.

**Live demo** (optional, high-impact): run the full multi-feature curl
sequence from the terminal — create a board, register, log in, create one
task with an owner, a tag, and a due date all at once, opt it into reminders,
check the reminders endpoint. All three people's independent work, composing
correctly, in one request chain.

**Land it**: "This is what 'the branches are the teaching material' means in
the constitution's Repository Layout section — the conflict isn't a bug in
the demo, it's the demo."

---

## Beat 5 — Reminders shows what the amendment was for

**Show**: `specs/004-reminders/spec.md` and `specs/004-reminders/plan.md`'s
Constitution Check table

**Say**: Unlike Auth, Reminders was written **after** Principle V existed —
so its opt-in requirement (`FR-303`) isn't a retrofit, it's load-bearing from
the first draft. Point at `research.md`'s decision to put the opt-in check
*inside* `checkReminders()` itself rather than trusting callers to filter —
that's Principle V translated into an actual design decision, not just a
sentence in a spec nobody enforces.

**Land it**: "This is the payoff of amending the constitution mid-project
instead of after the fact: the very next feature gets to be built *correctly*
the first time, instead of needing its own retrofit later."

---

## Closing

Point back at the full graph one more time:

```bash
git log --oneline --graph --all
```

**Say**: "One constitution. Three people. Two concurrent branches that never
talked to each other. A rule that got added mid-flight and had to be chased
down in code that already shipped. Two real merge conflicts. None of that is
spec-kit failing — that's what team-scale software development actually looks
like. What spec-kit gave this team wasn't the absence of conflict or change —
it was a paper trail specific enough that all of it stayed legible instead of
becoming folklore."
