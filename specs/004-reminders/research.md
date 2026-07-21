# Phase 0 Research: Due Dates & Reminders

## Decision: `remindersOptIn` is a hard filter inside the check function itself

**Rationale**: FR-303 (constitution Principle V) needs to be structurally
impossible to bypass, not just a documented convention. Putting the filter
inside `checkReminders()` itself — rather than trusting every caller to filter
correctly — means there is exactly one code path that can ever surface a
reminder, and it always checks the opt-in flag.

**Alternatives considered**: Returning all due tasks and letting the caller
filter by `remindersOptIn`. Rejected — this is precisely the "silent by
default unless someone remembers to filter" shape the amendment exists to
prevent. Compare to `002-auth`'s original FR-103, which had exactly this
problem.

## Decision: No scheduler, no background timer — a pull-based check function

**Rationale**: A real reminders system would run on a schedule; this demo
doesn't need one, since "reminder" here means "appears when checked," not
"gets pushed to you." A timer/cron dependency would violate Simplicity and
Illustrative Not Production for no teaching benefit.

**Alternatives considered**: `node-cron` or a `setInterval` loop. Rejected —
adds a dependency and a running background process for a feature whose whole
point in this repo is the *governance* lesson, not the scheduling mechanism.
