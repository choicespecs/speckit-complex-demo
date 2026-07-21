# API Contract: Due Dates & Reminders

## `POST /boards/:boardId/tasks` (extended)
**FR-301, FR-302**. Request may now include `"dueDate": "2026-08-01T00:00:00.000Z"`.
If omitted, `dueDate` defaults to `null` — unchanged otherwise.

## `POST /tasks/:id/reminders-opt-in`
**FR-304**. Response `200`: the updated task, with `remindersOptIn: true`
(idempotent). Response `404` if task doesn't exist.

## `GET /reminders?withinHours=<n>`
**FR-303, FR-305**. Returns only tasks where `remindersOptIn === true` AND
`dueDate` falls within `withinHours` hours from now. A task that is due soon
but never opted in is never included — this is not configurable per-request.
Response `200`: array of matching tasks.
