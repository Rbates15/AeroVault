import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import flightRoutes from './routes/flights.js';
import bookingRoutes from './routes/bookings.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDb } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// ── Security & parsing middleware ────────────────────────────────────────────
app.use(helmet());
app.use(express.json());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://aerovault.onrender.com'
  ]
}));

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'AeroVault', timestamp: new Date().toISOString() });
});

// ── Serve Vite build in production ───────────────────────────────────────────
if (!isDev) {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  // Catch-all: serve index.html for any non-API route (SPA routing)
  app.get(/^(?!\/api).*$/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Centralized error handler (must be last) ─────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  // Initialize DB connection and schema on startup
  getDb();
  console.log(`AeroVault server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
