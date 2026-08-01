-- AeroVault Database Schema
-- This file is the single source of truth for the database structure.
-- It is executed automatically on application startup via database.js.
-- Do not manually edit aerovault.db — regenerate via schema + seed.

PRAGMA foreign_keys = ON;

-- ── Flights ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS flights (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  flight_number    TEXT    NOT NULL,
  airline          TEXT    NOT NULL,
  origin           TEXT    NOT NULL,          -- IATA airport code, e.g. "JFK"
  origin_city      TEXT    NOT NULL,          -- e.g. "New York"
  destination      TEXT    NOT NULL,          -- IATA airport code, e.g. "LAX"
  destination_city TEXT    NOT NULL,          -- e.g. "Los Angeles"
  departure_time   TEXT    NOT NULL,          -- ISO 8601, e.g. "2026-08-15T06:30:00"
  arrival_time     TEXT    NOT NULL,          -- ISO 8601
  duration_min     INTEGER NOT NULL,          -- total flight time in minutes
  price            REAL    NOT NULL,          -- base fare in USD
  taxes_fees       REAL    NOT NULL,          -- taxes and fees in USD
  cabin_class      TEXT    NOT NULL DEFAULT 'Economy',  -- "Economy" | "Business"
  aircraft_type    TEXT,                      -- e.g. "Boeing 737-800"
  seats_available  INTEGER NOT NULL,
  distance_km      INTEGER NOT NULL,          -- great-circle distance, used for Trip Impact
  is_nonstop       INTEGER NOT NULL DEFAULT 1 -- 1 = nonstop, 0 = connecting
);

-- ── Bookings ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  flight_id         INTEGER NOT NULL,
  passenger_name    TEXT    NOT NULL,
  passenger_email   TEXT    NOT NULL,
  seat_preference   TEXT    NOT NULL DEFAULT 'No Preference', -- "Window" | "Aisle" | "No Preference"
  confirmation_code TEXT    NOT NULL UNIQUE,
  booked_at         TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (flight_id) REFERENCES flights (id)
);
