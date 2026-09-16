const TOKEN_KEY = 'techRunnerToken';
const PLAYER_KEY = 'techRunnerPlayer';
const SESSION_KEY = 'techRunnerSessionId';
export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (value) => localStorage.setItem(TOKEN_KEY, value),
  getPlayer: () => { try { return JSON.parse(localStorage.getItem(PLAYER_KEY) || 'null'); } catch { return null; } },
  setPlayer: (value) => localStorage.setItem(PLAYER_KEY, JSON.stringify(value)),
  getSessionId: () => localStorage.getItem(SESSION_KEY),
  setSessionId: (value) => localStorage.setItem(SESSION_KEY, value),
  clearAuth: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(PLAYER_KEY); localStorage.removeItem(SESSION_KEY); },
};
