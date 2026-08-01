import { Router } from 'express';
import { getDb } from '../db/database.js';
import { calculateTripImpact } from '../utils/tripImpact.js';

const router = Router();

// ── GET /api/flights ──────────────────────────────────────────────────────────
// Returns available flights (seats_available > 0).
//
// Optional query parameters:
//   origin      — IATA code, case-insensitive  e.g. "JFK"
//   destination — IATA code, case-insensitive  e.g. "LAX"
//   date        — departure date, YYYY-MM-DD   e.g. "2026-08-15"
//   sort        — "recommended" | "price" | "duration"  (default: recommended)
//
// Sort logic:
//   recommended — lowest total cost (price + taxes_fees), ties broken by duration
//   price       — base fare ascending
//   duration    — duration_min ascending
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const { origin, destination, date, sort = 'recommended' } = req.query;

    // Build WHERE clauses dynamically — only add conditions for provided params
    const conditions = ['seats_available > 0'];
    const params     = {};

    if (origin) {
      conditions.push('UPPER(origin) = UPPER(@origin)');
      params.origin = origin.trim();
    }

    if (destination) {
      conditions.push('UPPER(destination) = UPPER(@destination)');
      params.destination = destination.trim();
    }

    // Date filter: match the date portion of departure_time (stored as ISO 8601)
    if (date) {
      conditions.push("DATE(departure_time) = @date");
      params.date = date.trim();
    }

    // ORDER BY clause based on sort param
    const ORDER_MAP = {
      recommended: 'ORDER BY (price + taxes_fees) ASC, duration_min ASC',
      price:       'ORDER BY price ASC',
      duration:    'ORDER BY duration_min ASC',
    };
    const orderClause = ORDER_MAP[sort] ?? ORDER_MAP.recommended;

    const sql = `
      SELECT *
      FROM   flights
      WHERE  ${conditions.join(' AND ')}
      ${orderClause}
    `;

    const flights = db.prepare(sql).all(params);

    res.json({
      count: flights.length,
      flights,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/flights/:id ──────────────────────────────────────────────────────
// Returns a single flight by ID plus its pre-calculated Trip Impact data.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: { status: 400, message: 'Flight ID must be a number.' } });
    }

    const flight = db.prepare('SELECT * FROM flights WHERE id = ?').get(id);

    if (!flight) {
      return res.status(404).json({ error: { status: 404, message: `Flight ${id} not found.` } });
    }

    const trip_impact = calculateTripImpact(flight.distance_km, flight.cabin_class);

    res.json({ flight, trip_impact });
  } catch (err) {
    next(err);
  }
});

export default router;
