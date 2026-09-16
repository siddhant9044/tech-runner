import { verifyToken } from '../services/authService.js';
export function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) throw Object.assign(new Error('Authentication required'), { statusCode: 401 });
    req.auth = verifyToken(token);
    next();
  } catch (error) { next(Object.assign(new Error('Invalid or expired authentication token'), { statusCode: 401, cause: error })); }
}
