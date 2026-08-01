import { Router } from 'express';
import { nanoid } from 'nanoid';
import { getDb } from '../db/database.js';
import { calculateTripImpact } from '../utils/tripImpact.js';

const router = Router();

// ── POST /api/bookings ────────────────────────────────────────────────────────
// Creates a new booking for a flight.
//
// Request body:
//   flight_id        {number}  required
//   passenger_name   {string}  required
//   passenger_email  {string}  required
//   seat_preference  {string}  optional — "Window" | "Aisle" | "No Preference"
//
// Response:
//   Full confirmation payload including flight details and Trip Impact.
//
// Guards:
//   - Flight must exist
//   - seats_available must be > 0 (checked inside transaction)
//   - Entire operation runs in a single SQLite transaction; rolls back on any failure
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', (req, res, next) => {
  try {
    const db = getDb();
    const { flight_id, passenger_name, passenger_email, seat_preference = 'No Preference' } = req.body;

    // ── Input validation ────────────────────────────────────────────────────
    const errors = [];

    if (!flight_id || isNaN(parseInt(flight_id, 10))) {
      errors.push('flight_id is required and must be a number.');
    }
    if (!passenger_name || String(passenger_name).trim().length < 2) {
      errors.push('passenger_name is required (minimum 2 characters).');
    }
    if (!passenger_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(passenger_email).trim())) {
      errors.push('passenger_email must be a valid email address.');
    }
    const validSeatPrefs = ['Window', 'Aisle', 'No Preference'];
    if (seat_preference && !validSeatPrefs.includes(seat_preference)) {
      errors.push(`seat_preference must be one of: ${validSeatPrefs.join(', ')}.`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: { status: 400, message: errors.join(' ') } });
    }

    const flightId = parseInt(flight_id, 10);
    const name     = String(passenger_name).trim();
    const email    = String(passenger_email).trim().toLowerCase();
    const seatPref = seat_preference || 'No Preference';

    // ── Atomic booking transaction ──────────────────────────────────────────
    // Checks seat availability and inserts the booking in a single transaction.
    // If the flight is full between the availability check and the insert,
    // the transaction rolls back and a 409 is returned.
    const bookFlight = db.transaction(() => {
      // Lock the row and verify the flight exists with seats available
      const flight = db.prepare(
        'SELECT * FROM flights WHERE id = ? AND seats_available > 0'
      ).get(flightId);

      if (!flight) {
        // Distinguish between "not found" and "no seats"
        const exists = db.prepare('SELECT id FROM flights WHERE id = ?').get(flightId);
        if (!exists) {
          const err = new Error(`Flight ${flightId} not found.`);
          err.status = 404;
          throw err;
        }
        const err = new Error('This flight is fully booked. No seats are available.');
        err.status = 409;
        throw err;
      }

      // Generate a short, readable confirmation code: AV-XXXXXX
      const confirmation_code = `AV-${nanoid(6).toUpperCase()}`;

      // Insert the booking
      db.prepare(`
        INSERT INTO bookings (flight_id, passenger_name, passenger_email, seat_preference, confirmation_code)
        VALUES (@flight_id, @passenger_name, @passenger_email, @seat_preference, @confirmation_code)
      `).run({
        flight_id:         flightId,
        passenger_name:    name,
        passenger_email:   email,
        seat_preference:   seatPref,
        confirmation_code,
      });

      // Decrement seats_available
      db.prepare(
        'UPDATE flights SET seats_available = seats_available - 1 WHERE id = ?'
      ).run(flightId);

      // Fetch the newly created booking
      const booking = db.prepare(
        'SELECT * FROM bookings WHERE confirmation_code = ?'
      ).get(confirmation_code);

      // Re-fetch flight so the response reflects the post-decrement seat count
      const updatedFlight = db.prepare('SELECT * FROM flights WHERE id = ?').get(flightId);

      return { flight: updatedFlight, booking };
    });

    const { flight, booking } = bookFlight();

    // Calculate Trip Impact for the confirmation payload
    const trip_impact = calculateTripImpact(flight.distance_km, flight.cabin_class);

    return res.status(201).json({
      confirmation_code:  booking.confirmation_code,
      booked_at:          booking.booked_at,
      passenger_name:     booking.passenger_name,
      passenger_email:    booking.passenger_email,
      seat_preference:    booking.seat_preference,
      flight,
      trip_impact,
    });
  } catch (err) {
    // Pass status-bearing errors (404, 409) through to the error handler
    next(err);
  }
});

// ── GET /api/bookings/:code ───────────────────────────────────────────────────
// Retrieves an existing booking by confirmation code.
// Used by the "My Trips" lookup flow.
//
// URL param:
//   code — confirmation code, e.g. "AV-K8X2MN"
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:code', (req, res, next) => {
  try {
    const db   = getDb();
    const code = String(req.params.code).trim().toUpperCase();

    if (!code) {
      return res.status(400).json({ error: { status: 400, message: 'Confirmation code is required.' } });
    }

    // Join booking with its flight in one query
    const row = db.prepare(`
      SELECT
        b.id                AS booking_id,
        b.confirmation_code,
        b.passenger_name,
        b.passenger_email,
        b.seat_preference,
        b.booked_at,
        f.id                AS flight_id,
        f.flight_number,
        f.airline,
        f.origin,
        f.origin_city,
        f.destination,
        f.destination_city,
        f.departure_time,
        f.arrival_time,
        f.duration_min,
        f.price,
        f.taxes_fees,
        f.cabin_class,
        f.aircraft_type,
        f.seats_available,
        f.distance_km,
        f.is_nonstop
      FROM   bookings b
      JOIN   flights  f ON f.id = b.flight_id
      WHERE  UPPER(b.confirmation_code) = ?
    `).get(code);

    if (!row) {
      return res.status(404).json({
        error: { status: 404, message: `No booking found for confirmation code "${code}".` },
      });
    }

    // Reshape the flat join row into a clean nested response
    const flight = {
      id:               row.flight_id,
      flight_number:    row.flight_number,
      airline:          row.airline,
      origin:           row.origin,
      origin_city:      row.origin_city,
      destination:      row.destination,
      destination_city: row.destination_city,
      departure_time:   row.departure_time,
      arrival_time:     row.arrival_time,
      duration_min:     row.duration_min,
      price:            row.price,
      taxes_fees:       row.taxes_fees,
      cabin_class:      row.cabin_class,
      aircraft_type:    row.aircraft_type,
      seats_available:  row.seats_available,
      distance_km:      row.distance_km,
      is_nonstop:       row.is_nonstop,
    };

    const trip_impact = calculateTripImpact(flight.distance_km, flight.cabin_class);

    return res.json({
      booking_id:        row.booking_id,
      confirmation_code: row.confirmation_code,
      passenger_name:    row.passenger_name,
      passenger_email:   row.passenger_email,
      seat_preference:   row.seat_preference,
      booked_at:         row.booked_at,
      flight,
      trip_impact,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
