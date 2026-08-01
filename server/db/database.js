import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve paths relative to this file, not process.cwd()
// This ensures the DB and schema are found regardless of where
// the process is launched from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database lives at the project root: AeroVault/aerovault.db
const DB_PATH = path.join(__dirname, '..', '..', 'aerovault.db');

// Schema SQL lives alongside this file
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

/**
 * Returns the initialized database instance.
 * Creates and configures the database on first call.
 * Subsequent calls return the same instance (singleton).
 */
export function getDb() {
  if (db) return db;

  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');

  // Enforce foreign key constraints (SQLite disables them by default)
  db.pragma('foreign_keys = ON');

  // Initialize schema — CREATE TABLE IF NOT EXISTS is idempotent
  const schema = readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);

  console.log(`[db] Connected to ${DB_PATH}`);
  console.log(`[db] Foreign keys: ${db.pragma('foreign_keys', { simple: true })}`);

  return db;
}
