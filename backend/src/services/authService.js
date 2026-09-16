import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Player } from '../models/Player.js';
import { env } from '../config/env.js';
import { BRANCHES, assertBranch, cleanText } from '../utils/validation.js';

function tokenFor(player) {
  return jwt.sign({ sub: player._id.toString(), prn: player.prn }, env.jwtSecret, { expiresIn: '12h' });
}

export async function register({ name, prn, branch, password }) {
  const cleanName = cleanText(name, 80);
  const cleanPrn = cleanText(prn, 60).toUpperCase();
  const cleanBranch = cleanText(branch, 120);
  if (!cleanName || !cleanPrn || !cleanBranch) throw Object.assign(new Error('Name, PRN and branch are required'), { statusCode: 400 });
  assertBranch(cleanBranch);
  if (String(password || '').length < 6) throw Object.assign(new Error('Password must contain at least 6 characters'), { statusCode: 400 });
  const existing = await Player.findOne({ prn: cleanPrn });
  if (existing) throw Object.assign(new Error('A player with this PRN already exists'), { statusCode: 409 });
  const passwordHash = await bcrypt.hash(String(password), 12);
  const player = await Player.create({ name: cleanName, prn: cleanPrn, branch: cleanBranch, passwordHash });
  return { player: publicPlayer(player), token: tokenFor(player) };
}

export async function login({ name, prn, branch, password }) {
  const cleanPrn = cleanText(prn, 60).toUpperCase();
  const player = await Player.findOne({ prn: cleanPrn });
  if (!player) throw Object.assign(new Error('Player account not found. Register first.'), { statusCode: 401 });
  const valid = await bcrypt.compare(String(password || ''), player.passwordHash);
  if (!valid) throw Object.assign(new Error('Invalid password'), { statusCode: 401 });
  if (name && cleanText(name, 80) !== player.name) throw Object.assign(new Error('Player name does not match this PRN'), { statusCode: 401 });
  if (branch && cleanText(branch, 120) !== player.branch) throw Object.assign(new Error('Branch does not match this PRN'), { statusCode: 401 });
  return { player: publicPlayer(player), token: tokenFor(player) };
}

export function publicPlayer(player) {
  return { playerId: player._id.toString(), name: player.name, prn: player.prn, branch: player.branch };
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
