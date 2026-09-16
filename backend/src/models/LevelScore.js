import mongoose from 'mongoose';

const levelScoreSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  level: { type: String, enum: ['cloud', 'webdev', 'aiml', 'cyber'], required: true },
  score: { type: Number, min: 0, required: true },
  coins: { type: Number, min: 0, required: true },
  distance: { type: Number, min: 0, required: true },
  time: { type: Number, min: 0, required: true },
  obstaclesHit: { type: Number, min: 0, required: true },
  livesRemaining: { type: Number, min: 0, max: 4, required: true },
  completed: { type: Boolean, default: false },
  bossDefeated: { type: Boolean, default: false },
}, { timestamps: true });

levelScoreSchema.index({ sessionId: 1, level: 1 }, { unique: true });
export const LevelScore = mongoose.model('LevelScore', levelScoreSchema);
