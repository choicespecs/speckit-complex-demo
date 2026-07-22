# Merge Conflicts in Shared Spec-Kit Code

This repo has two real merge conflicts in its history — `a204e5e` (Tags into
`main`) and `c789e48` (Reminders into `main`) — both in the same two files,
`src/store.js` and `src/routes/tasks.js`. This doc is about why that happened,
why it's the expected outcome rather than a mistake, and how each was
resolved.

## Why these specific conflicts were inevitable

Three feature branches, three `data-model.md` files, all extending the same
entity:

| Branch | Field added to `Task` | Where |
|---|---|---|
| `002-auth` | `ownerId` | `specs/002-auth/data-model.md` |
| `003-tags` | `tags` | `specs/003-tags/data-model.md` |
| `004-reminders` | `dueDate`, `remindersOptIn` | `specs/004-reminders/data-model.md` |

Every one of those fields gets added inside the same function,
`createTask()` in `src/store.js` — same parameter list, same object literal.
All three branches started from the identical version of that function
(`6e85f74`, before anyone branched). Git's three-way merge compares each
branch's version against their *common ancestor*, and when two branches both
changed the same lines relative to that ancestor, it can't guess which
version is "right" — that's a conflict, not a bug in git or in this repo's
design.

**The general rule**: if two concurrent features' `data-model.md` files both
add a field to the same entity, expect a conflict in whatever function
constructs that entity. This is checkable *before* anyone writes code, just by
reading both `data-model.md` files — see
[`concurrent-features.md`](./concurrent-features.md)'s litmus test.

## What actually conflicted, concretely

```bash
git show a204e5e^2 -- src/store.js   # Tags' side, before resolution
git show a204e5e^1 -- src/store.js   # main's side (Auth already merged), before resolution
```

The conflict markers looked like this (from the real merge):

```js
<<<<<<< HEAD
// FR-106, FR-107: ownerId is optional
function createTask(boardId, description, ownerId = null) {
=======
// FR-201, FR-202: tags defaults to [] when not specified
function createTask(boardId, description, tags = []) {
>>>>>>> 003-tags
```

Both sides are correct. Both need to exist. The resolution isn't "pick one" —
it's synthesizing a third version neither branch ever wrote:

```js
// FR-106, FR-107: ownerId is optional — anonymous creation must keep working
// FR-201, FR-202: tags defaults to [] when not specified
function createTask(boardId, description, ownerId = null, tags = []) {
```

Diff the resolved commit (`a204e5e`) against either parent to see this exact
shape — neither parent's `createTask` signature survives unchanged; the
merge commit contains code that never existed on any single branch until
that moment.

## The resolution process, in order

1. **Read both sides before touching anything.** `git status` after a failed
   merge lists every conflicted file; open each and read *both* halves of
   every `<<<<<<<`/`=======`/`>>>>>>>` block before editing — the temptation
   under time pressure is to take whichever half is "on top" and patch the
   other one in as an afterthought, which is how a merge quietly drops a
   requirement.
2. **Resolve by intent, not by diff shape.** The right fix here isn't a
   textual merge of two diffs — it's asking "what does `createTask` need to
   do now that both features exist?" and writing that function fresh,
   informed by both `spec.md`s.
3. **Every call site has to follow.** Resolving `store.js` alone isn't enough
   — `src/routes/tasks.js`'s `POST /boards/:boardId/tasks` handler calls
   `createTask()` positionally, so its conflict (also real, also in this
   merge) has to be resolved consistently with the new signature, in the same
   commit.
4. **Verify against a live server before committing the resolution.** Every
   resolution commit in this repo (`a204e5e`, `c789e48`) was checked by
   actually starting `src/server.js` and exercising both features' endpoints
   together — a conflict that merges cleanly at the text level can still be
   *wrong* (e.g., silently swapping which parameter is which) in a way only
   running the code catches.
5. **Commit the resolution as its own thing.** `git commit` (no `--amend`,
   no squash) after a conflicted merge produces a real merge commit with two
   parents — that's what makes `git log --oneline --graph` show the
   conflict's shape at all. Squashing it away later would erase the exact
   evidence a team retrospective would want.

## Why the second conflict (Reminders) isn't redundant with the first

It would be easy to assume that once Auth-vs-Tags is resolved, `main` is
"caught up" and the next merge is clean. It isn't, and the reason matters:
Reminders' branch point predates *both* the Auth and Tags merges — it forked
from the same `6e85f74` they did, not from the post-conflict-resolution
`main`. Three-way merge doesn't compare "Reminders vs. current main" in the
abstract; it compares Reminders' changes against *its own* common ancestor
with whatever `main` looks like now. Since that ancestor is the pre-Auth,
pre-Tags `createTask`, Reminders' `dueDate`/`remindersOptIn` addition
conflicts with the *already-merged* `ownerId`/`tags` version exactly the same
way Tags conflicted with Auth. Each additional concurrent branch touching a
shared model compounds the integration cost — it doesn't average out.

## When this is a sign to redesign, not just a cost to pay

Two conflicts across three features touching one entity is a manageable,
even healthy, amount of friction for a demo about exactly this problem. If
your real project is routinely seeing four, five, six concurrent features all
colliding on the same function every integration cycle, that's usually a
signal the shared entity needs to be decomposed (e.g., extracting an
extension-point pattern, or splitting the entity) rather than a signal to
merge more carefully. Conflict frequency scaling faster than team size is a
data model problem, not a git problem.
