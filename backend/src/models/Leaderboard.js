import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, unique: true, index: true },
  player: { type: String, required: true },
  branch: { type: String, required: true },
  cloud: { type: Number, default: 0 },
  webDev: { type: Number, default: 0 },
  aiml: { type: Number, default: 0 },
  cyber: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  obstaclesHit: { type: Number, default: 0 },
  bossDefeated: { type: Boolean, default: false },
  sessionId: { type: String, required: true },
  completedAt: { type: Date, required: true },
}, { timestamps: true });

leaderboardSchema.index({ totalScore: -1, coins: -1, time: 1, distance: -1, obstaclesHit: 1 });
export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
