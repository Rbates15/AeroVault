/**
 * Centralized Express error handler.
 * Must be registered as the last middleware (app.use(errorHandler)).
 */
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log in development; suppress stack trace in production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${status}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
}
