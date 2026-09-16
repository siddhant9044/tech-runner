import mongoose from 'mongoose';

const levelProgressSchema = new mongoose.Schema({
  level: String,
  startedAt: Date,
  completedAt: Date,
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  obstaclesHit: { type: Number, default: 0 },
  livesRemaining: { type: Number, default: 4 },
}, { _id: false });

const gameSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  currentLevel: { type: String, default: 'cloud' },
  status: { type: String, enum: ['ACTIVE', 'READY', 'GAME_OVER', 'COMPLETED'], default: 'READY' },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  levels: { type: [levelProgressSchema], default: [] },
  totalScore: { type: Number, default: 0 },
  totalCoins: { type: Number, default: 0 },
  totalDistance: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  totalObstaclesHit: { type: Number, default: 0 },
  bossDefeated: { type: Boolean, default: false },
}, { timestamps: true });

gameSessionSchema.index({ playerId: 1, status: 1 });
export const GameSession = mongoose.model('GameSession', gameSessionSchema);
