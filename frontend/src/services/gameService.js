import { api } from './api';
import { storage } from '../utils/storage';
export async function createGameSession() { const data = await api('/game/session', { method: 'POST' }); storage.setSessionId(data.session.sessionId); return data.session; }
export async function getGameSession(sessionId = storage.getSessionId()) { const data = await api(`/game/session/${encodeURIComponent(sessionId)}`); return data.session; }
export async function startLevel(level, sessionId = storage.getSessionId()) { const data = await api('/game/level/start', { method: 'POST', body: JSON.stringify({ level, sessionId }) }); return data.run; }
export async function completeLevel(level, result, sessionId = storage.getSessionId()) { const data = await api('/game/level/complete', { method: 'POST', body: JSON.stringify({ level, sessionId, ...result }) }); return data; }
export async function gameOver(level, result, sessionId = storage.getSessionId()) { return api('/game/game-over', { method: 'POST', body: JSON.stringify({ level, sessionId, ...result }) }); }
export async function finalizeGame(sessionId = storage.getSessionId()) { const data = await api('/game/finalize', { method: 'POST', body: JSON.stringify({ sessionId }) }); return data.session; }
export async function getScores(sessionId = storage.getSessionId()) { const data = await api(`/scores/${encodeURIComponent(sessionId)}`); return data.scores; }
