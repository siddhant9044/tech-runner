import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  prn: { type: String, required: true, trim: true, unique: true, maxlength: 60 },
  branch: { type: String, required: true, trim: true, maxlength: 120 },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

playerSchema.index({ name: 1 });
export const Player = mongoose.model('Player', playerSchema);
