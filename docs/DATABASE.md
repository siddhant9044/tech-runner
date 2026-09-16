# Database

## Player
Stores name, PRN, engineering branch, bcrypt password hash and timestamps. PRN is unique.

## GameSession
One game run. Stores current level, status, level progress, totals and boss state. Session ID is unique.

## LevelScore
One canonical result per level per session. Stores score, coins, distance, time, obstacle hits, remaining lives and boss completion state.

## Leaderboard
One synchronized best-final-result record per player. It is updated only when a newly completed four-level session is better under the same deterministic ordering used by the API.

## Indexes
- Player PRN unique
- GameSession session ID unique
- GameSession player/status
- LevelScore session/level unique
- Leaderboard player unique
- Leaderboard ranking compound index
