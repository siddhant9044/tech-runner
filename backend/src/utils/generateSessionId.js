import { randomUUID } from 'node:crypto';
export function generateSessionId() { return randomUUID(); }
