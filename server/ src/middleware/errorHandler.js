// server/src/middleware/errorHandler.js
// ---------------------------------------------------
// Global error and 404 handlers
// ---------------------------------------------------

// 404 Handler
export function notFound(_req, res, _next) {
  res.status(404).json({ error: 'Not Found' });
}

// Generic Error Handler
export function errorHandler(err, _req, res, _next) {
  console.error('🔥 Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
}
