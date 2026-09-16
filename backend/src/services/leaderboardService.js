import { Leaderboard } from '../models/Leaderboard.js';

const sort = { totalScore: -1, coins: -1, time: 1, distance: -1, obstaclesHit: 1, completedAt: 1 };

export async function getLeaderboard({ page = 1, limit = 50, branch = '' }) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));
  const filter = branch ? { branch } : {};
  const total = await Leaderboard.countDocuments(filter);
  const rows = await Leaderboard.find(filter).sort(sort).skip((safePage - 1) * safeLimit).limit(safeLimit).lean();
  return { rows: rows.map((row, i) => ({ ...row, rank: (safePage - 1) * safeLimit + i + 1, playerId: row.playerId.toString() })), page: safePage, limit: safeLimit, total, pages: Math.max(1, Math.ceil(total / safeLimit)) };
}

export async function getPlayerRank(playerId) {
  const me = await Leaderboard.findOne({ playerId }).lean();
  if (!me) return null;
  const ahead = await Leaderboard.countDocuments({ $or: [ { totalScore: { $gt: me.totalScore } }, { totalScore: me.totalScore, coins: { $gt: me.coins } }, { totalScore: me.totalScore, coins: me.coins, time: { $lt: me.time } }, { totalScore: me.totalScore, coins: me.coins, time: me.time, distance: { $gt: me.distance } }, { totalScore: me.totalScore, coins: me.coins, time: me.time, distance: me.distance, obstaclesHit: { $lt: me.obstaclesHit } }, { totalScore: me.totalScore, coins: me.coins, time: me.time, distance: me.distance, obstaclesHit: me.obstaclesHit, completedAt: { $lt: me.completedAt } } ] });
  return { ...me, rank: ahead + 1, playerId: me.playerId.toString() };
}
