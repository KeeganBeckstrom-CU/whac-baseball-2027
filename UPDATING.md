# How the scheduled update works

This site is static. Every number it shows comes from a JSON file in `data/`.
`data/_datasets.json` lists every dataset with a short description of where it comes from.
A scheduled job runs Monday mornings and Wednesday evenings (Eastern) and follows the steps below.

## Rules

- Facts only. No predictions, no advice on how to play or coach against anyone.
- Record games as played; ignore forfeit labels (Rochester Christian's forfeits came from an ineligible player).
- Change a file only when a public source shows something new. Never guess.
- Keep each file's existing shape: same fields, same types, same row order unless a row is added.
- Lourdes and Siena Heights closed after 2025-26. Nothing to check for them.

## Teams and file prefixes

| Team | Prefix | Team | Prefix |
|---|---|---|---|
| Madonna | (none) | Northwestern Ohio | `un_` |
| Cleary | `c_` | Michigan-Dearborn | `md_` |
| Aquinas | `a_` | Lawrence Tech | `lt_` |
| Cornerstone | `cu_` | Defiance | `df_` |
| Indiana Tech | `it_` | Rochester Christian | `rc_` |

## What to check each run

For each of the 10 teams, open the team's official athletics pages (URLs are in that team's
`<prefix>watch.json` rows and in `data/w_watch.json`):

1. **2027 roster page** posted or changed?
2. **2027 schedule** posted, or new games added?
3. **Coaching staff page** changed?
4. **Commits**: new listings on Prep Baseball Report or Perfect Game for the team?
5. **News releases** since the last check about signings, transfers, staff hires or departures.

## What to update when something changed

- `data/<prefix>watch.json`: that team's tracker rows (`status`, `detail`, `checked` as "Mon D, YYYY", `url`).
- `data/w_watch.json`: the same facts for the WHAC page (`roster`, `schedule`, `staff`, `commits` and their `_detail`, `_checked`, `_url`).
- `data/<prefix>schedule_2027.json`: posted 2027 games (`date`, `opponent`, `site`, `id`), matching the existing rows' shape.
- `data/<prefix>recruits.json`: new names. For a team with a posted 2027 roster, players on it who were not on its 2026 roster (`name`, `grad` = class, `pos`, `school`, `prev`, `hs`, `came`, `hometown`, `source`). Otherwise listed commits (`name`, `grad`, `pos`, `school`, `state`, `source`, `status`).
- When a 2027 roster is newly posted, also update each returning player's `status` in `<prefix>hitters.json`, `<prefix>pitchers.json` and `<prefix>roster.json` to `On the 2027 roster` / `Not on the 2027 roster`, and the team's row in `w_teams.json` (`basis`), plus `w_ret_hit.json`, `w_ret_pit.json`, `w_honors.json`, `w_players.json` statuses for that team.
- `data/w_teams.json`: `staff`, `sched27`, `coach` when they change.

Every run, even when nothing changed:

- Set `data/site_status.json` row `asof` to today's date (YYYY-MM-DD, Eastern).
- Every changed fact gets one row added to `data/site_changes.json`:
  `{"date": "YYYY-MM-DD", "team": "<team name or All>", "text": "<one plain sentence>", "url": "<source>"}`.
- Validate: every file in `data/` still parses as JSON.
- Commit with a message that lists what changed (or "No changes found") and push to `main`.
