import { Player } from '../models/Player.js';
import { login, register, publicPlayer } from '../services/authService.js';
export async function registerController(req, res) { const result = await register(req.body || {}); res.status(201).json({ ok: true, ...result }); }
export async function loginController(req, res) { const result = await login(req.body || {}); res.json({ ok: true, ...result }); }
export async function meController(req, res) { const player = await Player.findById(req.auth.sub); if (!player) return res.status(404).json({ ok: false, error: 'Player not found' }); return res.json({ ok: true, player: publicPlayer(player) }); }
