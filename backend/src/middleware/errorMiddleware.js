export function notFound(_req, res) { res.status(404).json({ ok: false, error: 'Route not found' }); }
export function errorHandler(error, _req, res, _next) {
  console.error('[API ERROR]', error);
  const status = Number(error.statusCode || (error.name === 'ValidationError' ? 400 : 500));
  res.status(status).json({ ok: false, error: status >= 500 ? 'Internal server error' : error.message });
}
