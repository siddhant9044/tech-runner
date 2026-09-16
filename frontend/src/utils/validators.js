export function required(value, label) { if (!String(value || '').trim()) throw new Error(`${label} is required`); }
export function password(value) { if (String(value || '').length < 6) throw new Error('Password must contain at least 6 characters'); }
