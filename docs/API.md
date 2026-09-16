# API

Base URL: `/api`

## Auth
- `POST /auth/register` `{name, prn, branch, password}`
- `POST /auth/login` `{name, prn, branch, password}`
- `GET /auth/me` bearer JWT

## Game
All routes require bearer JWT.
- `POST /game/session`
- `GET /game/session/:sessionId`
- `POST /game/level/start` `{sessionId, level}`
- `POST /game/level/complete` `{sessionId, level, distance, coins, time, obstaclesHit, livesRemaining, completed, bossDefeated}`
- `POST /game/game-over` `{sessionId, level, ...metrics}`
- `POST /game/finalize` `{sessionId}`

## Scores
- `POST /scores/level` same completion payload as the game completion endpoint
- `GET /scores/:sessionId`

## Leaderboard
- `GET /leaderboard?page=1&limit=10&branch=`
- `GET /leaderboard/player/:playerId` bearer JWT

The leaderboard endpoint sorts in MongoDB/server memory according to the official ordering and assigns rank after pagination. A player cannot submit or choose a rank.
