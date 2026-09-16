import { getScores } from '../services/scoreService.js';
import { completeLevel } from '../services/gameService.js';
export async function getScoresController(req, res) { res.json({ ok: true, scores: await getScores(req.params.sessionId, req.auth.sub) }); }
export async function submitScoreController(req, res) { const result = await completeLevel({ sessionId: req.body.sessionId, playerId: req.auth.sub, level: req.body.level, result: req.body }); if (result.final) req.app.get('io').to('leaderboard').emit('leaderboard:update', { sessionId: result.session.sessionId }); res.json({ ok: true, ...result }); }
