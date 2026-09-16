import { getLeaderboard, getPlayerRank } from '../services/leaderboardService.js';
export async function leaderboardController(req, res) { res.json({ ok: true, ...(await getLeaderboard(req.query)) }); }
export async function playerRankController(req, res) { const result = await getPlayerRank(req.params.playerId); if (!result) return res.status(404).json({ ok: false, error: 'Player has no completed game result yet' }); res.json({ ok: true, player: result }); }
