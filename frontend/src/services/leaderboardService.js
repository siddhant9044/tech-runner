import { api } from './api';
export async function fetchLeaderboard({ page = 1, limit = 10, branch = '' } = {}) { const qs = new URLSearchParams({ page, limit }); if (branch) qs.set('branch', branch); return api(`/leaderboard?${qs}`); }
export async function fetchPlayerRank(playerId) { const data = await api(`/leaderboard/player/${encodeURIComponent(playerId)}`); return data.player; }
