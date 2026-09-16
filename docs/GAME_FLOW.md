# Game Flow

1. `/login` registers or authenticates a player.
2. `/levels` creates or reads the player's server-side game session.
3. Cloud unlocks first.
4. Cloud completion is distance-based and stores canonical level metrics.
5. Web Development unlocks only after Cloud is completed.
6. AI/ML unlocks only after Web Development is completed.
7. Cyber unlocks only after AI/ML is completed and resets lives to four.
8. Cyber runs through the same runner architecture, then starts the Cyber Threat boss arena.
9. Player attacks the boss using F or the mobile attack control.
10. Boss health reaches zero -> final completion is stored server-side.
11. `/results` reads final totals from the server.
12. `/leaderboard` reads the server-calculated leaderboard from MongoDB.
