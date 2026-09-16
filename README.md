# TECH RUNNER – MULTIDOMAIN

A full-stack four-world browser runner built with React, Vite, Phaser 3, Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs and Socket.IO.

## Worlds
1. Cloud Computing
2. Web Development
3. AI / Machine Learning
4. Cybersecurity + final boss

The Cyber reference gameplay is the foundation: continuous side-scrolling movement, jump/avoid/collect/survive mechanics, lives, distance, score, checkpoints, HUD, mobile controls and the final boss interaction. The first three worlds reuse the same runner architecture and differ through domain configurations, backgrounds, obstacle definitions and difficulty.

## Architecture
- `frontend/` React application and Phaser game client.
- `backend/` REST API, JWT authentication, game session validation, canonical scoring and MongoDB persistence.
- `docs/` API, game-flow and database documentation.

Leaderboard ranking is calculated server-side from completed final results. The browser cannot assign its own rank. MongoDB is the source of persisted leaderboard data; localStorage is only used for the authentication token, player session identifier and small client preferences such as mute state.

## Requirements
- Node.js 20+
- MongoDB Atlas cluster
- A modern browser with Web Audio and Canvas/WebGL support

## Setup
1. Copy `.env.example` to `backend/.env` and set `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`.
2. Create `frontend/.env` from the example below if the backend is not at the default URL.
3. From the project root run `npm install`.
4. Run `npm run install:all`.
5. Start backend: `npm run dev --prefix backend`.
6. Start frontend: `npm run dev --prefix frontend`.
7. Open `http://localhost:5173`.

### Frontend environment
`frontend/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Authentication
Registration requires player name, PRN, branch and a six-character-or-longer password. Passwords are bcrypt-hashed. Login returns a short-lived JWT. Protected game, score and player-rank routes require the bearer token.

## Game progression
Cloud -> Web Development -> AI/ML -> Cybersecurity -> Boss -> Final Results -> Leaderboard.

The backend checks the requested level against the session's current level. Direct navigation to a locked level returns a conflict and the frontend returns the player to Level Select.

Lives carry from Cloud to Web Development to AI/ML. Cyber resets the player's lives to four before its boss section.

## Scoring
The authoritative level score is recalculated by the backend:
`distance * 1.5 + coins * 25 + livesRemaining * 50 - obstaclesHit * 35 + 1000 boss bonus`.

Distance is capped at 1200 units per level. The final total is the sum of all four canonical level scores. Leaderboard sorting is:
1. total score descending
2. coins descending
3. total time ascending
4. total distance descending
5. obstacles hit ascending
6. completion time ascending

## Controls
Desktop:
- A / Left Arrow: move left
- D / Right Arrow: move right
- W / Up Arrow / Space: jump
- S / Down Arrow: crouch
- F: Cyber attack
- Esc: pause

Mobile landscape:
- Left, right, jump, crouch and attack touch controls are built into the Phaser HUD.
- Portrait mode displays a rotate-device screen.

## Backend API
See `docs/API.md` for the full REST contract.

## MongoDB Atlas
Create a cluster, database user and network access rule. Put the SRV connection string in `MONGODB_URI`. Mongoose creates the application indexes automatically when the server starts.

## Performance / 100-player design
Gameplay physics stay client-side. The backend receives level starts, level completion, game-over and final-result events instead of per-frame coordinates. MongoDB stores meaningful session and result documents. Leaderboard reads are indexed and paginated. Socket.IO is used only to broadcast that a new final leaderboard result exists, after which clients refresh their current page.

## Build
- `npm run check` validates backend JavaScript and creates a production frontend build.
- `npm run build` builds the frontend.

The release archive intentionally excludes `node_modules`, `.git`, build caches and temporary files.

## Deployment
Deploy the backend to a Node-compatible service and set its environment variables. Deploy the Vite `frontend/dist` output to a static host. Set `VITE_API_URL`, `VITE_SOCKET_URL`, backend `CLIENT_URL`, and MongoDB network access for the deployed hosts.
