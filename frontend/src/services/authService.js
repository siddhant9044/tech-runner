import { api } from './api';
import { storage } from '../utils/storage';
export async function register(payload) { const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) }); storage.setToken(data.token); storage.setPlayer(data.player); return data.player; }
export async function login(payload) { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) }); storage.setToken(data.token); storage.setPlayer(data.player); return data.player; }
export async function me() { const data = await api('/auth/me'); storage.setPlayer(data.player); return data.player; }
