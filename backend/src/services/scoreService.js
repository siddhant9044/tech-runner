import { LevelScore } from '../models/LevelScore.js';
import { GameSession } from '../models/GameSession.js';
export async function getScores(sessionId, playerId) {
  const session = await GameSession.findOne({ sessionId, playerId });
  if (!session) throw Object.assign(new Error('Game session not found'), { statusCode: 404 });
  return LevelScore.find({ sessionId }).sort({ createdAt: 1 }).lean();
}
