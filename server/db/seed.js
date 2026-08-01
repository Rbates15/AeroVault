/**
 * AeroVault — Database Seed Script
 *
 * DEMO DATA NOTICE:
 * All flight data in this file is simulated for demonstration purposes.
 * AeroVault does not connect to real airline inventory, live scheduling
 * systems, or actual reservation platforms. Prices, times, and availability
 * are fictional and for educational use only.
 *
 * Run: npm run seed
 * Strategy: clears the flights table and re-inserts all seed rows.
 * Running this script multiple times is safe — it always results in
 * exactly the seeded flights with no duplicates.
 */

import { getDb } from './database.js';

// ── Seed data ─────────────────────────────────────────────────────────────────
// Dates use a near-future fixed window so the app always shows upcoming flights.
// departure_time and arrival_time are ISO 8601 local times (no Z suffix) so
// the UI can display them as-is without timezone conversion surprises.

const flights = [
  // ── Domestic: New York ↔ Los Angeles ────────────────────────────────────────
  {
    flight_number:    'AA 247',
    airline:          'American Airlines',
    origin:           'JFK',
    origin_city:      'New York',
    destination:      'LAX',
    destination_city: 'Los Angeles',
    departure_time:   '2026-08-15T07:00:00',
    arrival_time:     '2026-08-15T10:24:00',
    duration_min:     324,
    price:            189.00,
    taxes_fees:       42.18,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737-800',
    seats_available:  42,
    distance_km:      3983,
    is_nonstop:       1,
  },
  {
    flight_number:    'DL 412',
    airline:          'Delta Air Lines',
    origin:           'LAX',
    origin_city:      'Los Angeles',
    destination:      'JFK',
    destination_city: 'New York',
    departure_time:   '2026-08-16T08:15:00',
    arrival_time:     '2026-08-16T16:44:00',
    duration_min:     329,
    price:            214.00,
    taxes_fees:       47.50,
    cabin_class:      'Economy',
    aircraft_type:    'Airbus A321',
    seats_available:  28,
    distance_km:      3983,
    is_nonstop:       1,
  },
  {
    flight_number:    'UA 1189',
    airline:          'United Airlines',
    origin:           'JFK',
    origin_city:      'New York',
    destination:      'LAX',
    destination_city: 'Los Angeles',
    departure_time:   '2026-08-17T14:30:00',
    arrival_time:     '2026-08-17T18:05:00',
    duration_min:     335,
    price:            259.00,
    taxes_fees:       54.20,
    cabin_class:      'Business',
    aircraft_type:    'Boeing 757-200',
    seats_available:  8,
    distance_km:      3983,
    is_nonstop:       1,
  },

  // ── Domestic: Chicago ↔ Miami ────────────────────────────────────────────────
  {
    flight_number:    'AA 1834',
    airline:          'American Airlines',
    origin:           'ORD',
    origin_city:      'Chicago',
    destination:      'MIA',
    destination_city: 'Miami',
    departure_time:   '2026-08-15T06:45:00',
    arrival_time:     '2026-08-15T10:52:00',
    duration_min:     247,
    price:            148.00,
    taxes_fees:       33.10,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737 MAX 8',
    seats_available:  55,
    distance_km:      2152,
    is_nonstop:       1,
  },
  {
    flight_number:    'UA 889',
    airline:          'United Airlines',
    origin:           'MIA',
    origin_city:      'Miami',
    destination:      'ORD',
    destination_city: 'Chicago',
    departure_time:   '2026-08-18T09:20:00',
    arrival_time:     '2026-08-18T11:55:00',
    duration_min:     215,
    price:            162.00,
    taxes_fees:       36.40,
    cabin_class:      'Economy',
    aircraft_type:    'Airbus A319',
    seats_available:  31,
    distance_km:      2152,
    is_nonstop:       1,
  },

  // ── Domestic: New York ↔ Chicago ─────────────────────────────────────────────
  {
    flight_number:    'DL 2051',
    airline:          'Delta Air Lines',
    origin:           'JFK',
    origin_city:      'New York',
    destination:      'ORD',
    destination_city: 'Chicago',
    departure_time:   '2026-08-16T11:00:00',
    arrival_time:     '2026-08-16T12:48:00',
    duration_min:     108,
    price:            119.00,
    taxes_fees:       27.60,
    cabin_class:      'Economy',
    aircraft_type:    'Airbus A220-100',
    seats_available:  47,
    distance_km:      1190,
    is_nonstop:       1,
  },

  // ── Domestic: Los Angeles ↔ Miami ────────────────────────────────────────────
  {
    flight_number:    'AA 2763',
    airline:          'American Airlines',
    origin:           'LAX',
    origin_city:      'Los Angeles',
    destination:      'MIA',
    destination_city: 'Miami',
    departure_time:   '2026-08-19T06:00:00',
    arrival_time:     '2026-08-19T14:12:00',
    duration_min:     312,
    price:            198.00,
    taxes_fees:       44.50,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737-800',
    seats_available:  22,
    distance_km:      3756,
    is_nonstop:       1,
  },

  // ── Domestic: New York ↔ San Francisco ──────────────────────────────────────
  {
    flight_number:    'UA 322',
    airline:          'United Airlines',
    origin:           'JFK',
    origin_city:      'New York',
    destination:      'SFO',
    destination_city: 'San Francisco',
    departure_time:   '2026-08-20T07:45:00',
    arrival_time:     '2026-08-20T11:20:00',
    duration_min:     335,
    price:            224.00,
    taxes_fees:       49.80,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737 MAX 9',
    seats_available:  38,
    distance_km:      4139,
    is_nonstop:       1,
  },

  // ── Domestic: Chicago ↔ Los Angeles ─────────────────────────────────────────
  {
    flight_number:    'UA 567',
    airline:          'United Airlines',
    origin:           'ORD',
    origin_city:      'Chicago',
    destination:      'LAX',
    destination_city: 'Los Angeles',
    departure_time:   '2026-08-17T08:30:00',
    arrival_time:     '2026-08-17T11:05:00',
    duration_min:     275,
    price:            172.00,
    taxes_fees:       38.80,
    cabin_class:      'Economy',
    aircraft_type:    'Airbus A320',
    seats_available:  19,
    distance_km:      2805,
    is_nonstop:       1,
  },

  // ── Domestic: San Francisco ↔ Chicago ───────────────────────────────────────
  {
    flight_number:    'AA 3401',
    airline:          'American Airlines',
    origin:           'SFO',
    origin_city:      'San Francisco',
    destination:      'ORD',
    destination_city: 'Chicago',
    departure_time:   '2026-08-21T13:15:00',
    arrival_time:     '2026-08-21T19:10:00',
    duration_min:     295,
    price:            159.00,
    taxes_fees:       35.60,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737-800',
    seats_available:  61,
    distance_km:      2964,
    is_nonstop:       1,
  },

  // ── Domestic: Boston ↔ Miami ─────────────────────────────────────────────────
  {
    flight_number:    'JB 714',
    airline:          'JetBlue Airways',
    origin:           'BOS',
    origin_city:      'Boston',
    destination:      'MIA',
    destination_city: 'Miami',
    departure_time:   '2026-08-22T10:05:00',
    arrival_time:     '2026-08-22T13:45:00',
    duration_min:     220,
    price:            139.00,
    taxes_fees:       31.20,
    cabin_class:      'Economy',
    aircraft_type:    'Airbus A320',
    seats_available:  44,
    distance_km:      2207,
    is_nonstop:       1,
  },

  // ── Domestic: Seattle ↔ New York ────────────────────────────────────────────
  {
    flight_number:    'AS 702',
    airline:          'Alaska Airlines',
    origin:           'SEA',
    origin_city:      'Seattle',
    destination:      'JFK',
    destination_city: 'New York',
    departure_time:   '2026-08-18T07:30:00',
    arrival_time:     '2026-08-18T15:48:00',
    duration_min:     318,
    price:            209.00,
    taxes_fees:       46.60,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737-900ER',
    seats_available:  17,
    distance_km:      3867,
    is_nonstop:       1,
  },

  // ── Domestic: Dallas ↔ New York ─────────────────────────────────────────────
  {
    flight_number:    'AA 192',
    airline:          'American Airlines',
    origin:           'DFW',
    origin_city:      'Dallas',
    destination:      'JFK',
    destination_city: 'New York',
    departure_time:   '2026-08-19T09:55:00',
    arrival_time:     '2026-08-19T14:06:00',
    duration_min:     251,
    price:            154.00,
    taxes_fees:       34.50,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 737 MAX 8',
    seats_available:  33,
    distance_km:      2551,
    is_nonstop:       1,
  },

  // ── International: New York → London ────────────────────────────────────────
  {
    flight_number:    'BA 178',
    airline:          'British Airways',
    origin:           'JFK',
    origin_city:      'New York',
    destination:      'LHR',
    destination_city: 'London',
    departure_time:   '2026-08-20T22:15:00',
    arrival_time:     '2026-08-21T10:05:00',
    duration_min:     410,
    price:            548.00,
    taxes_fees:       121.60,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 777-200ER',
    seats_available:  26,
    distance_km:      5570,
    is_nonstop:       1,
  },

  // ── International: Los Angeles → Tokyo ──────────────────────────────────────
  {
    flight_number:    'JL 62',
    airline:          'Japan Airlines',
    origin:           'LAX',
    origin_city:      'Los Angeles',
    destination:      'NRT',
    destination_city: 'Tokyo',
    departure_time:   '2026-08-23T13:45:00',
    arrival_time:     '2026-08-24T17:55:00',
    duration_min:     615,
    price:            724.00,
    taxes_fees:       158.40,
    cabin_class:      'Economy',
    aircraft_type:    'Boeing 787-9',
    seats_available:  14,
    distance_km:      8815,
    is_nonstop:       1,
  },
];

// ── Seed execution ────────────────────────────────────────────────────────────

function seed() {
  const db = getDb();

  // Idempotent: clear existing flights and re-insert.
  // WARNING: this also removes any existing bookings that reference flights,
  // since bookings reference flight IDs. Re-seeding is a dev/reset operation.
  db.prepare('DELETE FROM bookings').run();
  db.prepare('DELETE FROM flights').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('flights', 'bookings')").run();

  const insert = db.prepare(`
    INSERT INTO flights (
      flight_number, airline,
      origin, origin_city,
      destination, destination_city,
      departure_time, arrival_time,
      duration_min, price, taxes_fees,
      cabin_class, aircraft_type,
      seats_available, distance_km, is_nonstop
    ) VALUES (
      @flight_number, @airline,
      @origin, @origin_city,
      @destination, @destination_city,
      @departure_time, @arrival_time,
      @duration_min, @price, @taxes_fees,
      @cabin_class, @aircraft_type,
      @seats_available, @distance_km, @is_nonstop
    )
  `);

  // Run all inserts in a single transaction for atomicity and performance
  const insertAll = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertAll(flights);

  const count = db.prepare('SELECT COUNT(*) AS count FROM flights').get();
  console.log(`[seed] ✓ Inserted ${count.count} flights into aerovault.db`);
  console.log('[seed] Demo data only — not real airline inventory.');
}

seed();
