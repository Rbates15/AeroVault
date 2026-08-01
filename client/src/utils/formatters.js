/**
 * AeroVault formatters
 *
 * NOTE on date parsing:
 * SQLite stores times as "2026-08-15T07:00:00" (no timezone suffix).
 * Passing these directly to `new Date()` is ambiguous — some engines
 * treat them as UTC, others as local time, producing wrong displayed times.
 * We parse them explicitly as local time by replacing the T separator and
 * constructing via numeric parts, which is unambiguous on all engines.
 */

/**
 * Parse an ISO-8601-ish string from SQLite as **local** wall-clock time.
 * Handles both "2026-08-15T07:00:00" and "2026-08-15 07:00:00" forms.
 */
function parseLocalDate(isoString) {
  // Normalise space separator → T, strip any trailing timezone info
  const s = String(isoString).replace(' ', 'T').replace(/Z$/, '');
  const [datePart, timePart = '00:00:00'] = s.split('T');
  const [year, month, day]       = datePart.split('-').map(Number);
  const [hour, minute, second]   = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatTime(isoString) {
  return parseLocalDate(isoString).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(isoString) {
  return parseLocalDate(isoString).toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
  });
}

export function formatDateTime(isoString) {
  const d = parseLocalDate(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}
