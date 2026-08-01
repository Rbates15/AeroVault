import { Clock, Users, ArrowRight } from 'lucide-react';
import { formatPrice, formatDuration, formatTime } from '../../utils/formatters.js';

// ── Airline initials badge ────────────────────────────────────────────────────
function AirlineBadge({ airline }) {
  // Generate consistent initials from airline name
  const initials = airline
    .split(/\s+/)
    .filter(w => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  return (
    <div className="w-10 h-10 rounded-xl bg-av-accent/10 border border-av-accent/20 flex items-center justify-center shrink-0">
      <span className="text-av-accent text-xs font-bold tracking-tight">{initials}</span>
    </div>
  );
}

// ── Cabin class badge ─────────────────────────────────────────────────────────
function CabinBadge({ cabin }) {
  const isBusiness = cabin === 'Business';
  return (
    <span className={[
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
      isBusiness
        ? 'bg-av-warning/10 text-av-warning border border-av-warning/20'
        : 'bg-av-accent/10 text-av-accent border border-av-accent/20',
    ].join(' ')}>
      {cabin}
    </span>
  );
}

// ── Seats indicator ───────────────────────────────────────────────────────────
function SeatsIndicator({ seats }) {
  const isLow  = seats <= 5;
  const isMed  = seats <= 15;
  const color  = isLow ? 'text-av-danger' : isMed ? 'text-av-warning' : 'text-av-muted';
  const label  = isLow ? `${seats} seat${seats === 1 ? '' : 's'} left` : `${seats} seats`;

  return (
    <span className={`flex items-center gap-1 text-xs ${color}`}>
      <Users size={11} />
      {label}
    </span>
  );
}

// ── FlightCard ────────────────────────────────────────────────────────────────
export default function FlightCard({ flight, onSelect }) {
  const {
    flight_number,
    airline,
    origin,
    origin_city,
    destination,
    destination_city,
    departure_time,
    arrival_time,
    duration_min,
    price,
    taxes_fees,
    cabin_class,
    aircraft_type,
    seats_available,
    is_nonstop,
  } = flight;

  const totalPrice = price + taxes_fees;
  const depTime    = formatTime(departure_time);
  const arrTime    = formatTime(arrival_time);
  const duration   = formatDuration(duration_min);

  return (
    <article
      className="group bg-av-surface border border-av-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-av-accent/30 transition-all duration-200"
      aria-label={`${airline} flight ${flight_number} from ${origin_city} to ${destination_city}`}
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">

          {/* ── Left: Airline ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3 md:w-44 shrink-0">
            <AirlineBadge airline={airline} />
            <div className="min-w-0">
              <p className="text-av-text text-sm font-semibold leading-tight truncate">{airline}</p>
              <p className="text-av-muted text-xs mt-0.5">{flight_number}</p>
              {aircraft_type && (
                <p className="text-av-subtle text-xs mt-0.5 truncate">{aircraft_type}</p>
              )}
            </div>
          </div>

          {/* ── Centre: Route + times ─────────────────────────────────── */}
          <div className="flex-1 flex items-center gap-3 md:gap-6">

            {/* Departure */}
            <div className="text-left">
              <p className="text-av-text text-xl font-bold tabular-nums">{depTime}</p>
              <p className="text-av-text text-sm font-semibold mt-0.5">{origin}</p>
              <p className="text-av-muted text-xs">{origin_city}</p>
            </div>

            {/* Duration bar */}
            <div className="flex-1 flex flex-col items-center gap-1 min-w-0 px-2">
              <span className="text-av-muted text-xs flex items-center gap-1">
                <Clock size={10} />
                {duration}
              </span>
              <div className="w-full flex items-center gap-1">
                <div className="flex-1 h-px bg-av-border" />
                <div className="w-1.5 h-1.5 rounded-full bg-av-accent shrink-0" />
                <ArrowRight size={12} className="text-av-accent shrink-0" />
                <div className="flex-1 h-px bg-av-border" />
              </div>
              <span className={[
                'text-xs font-medium px-2 py-0.5 rounded-full border',
                is_nonstop
                  ? 'text-av-success border-av-success/20 bg-av-success/10'
                  : 'text-av-warning border-av-warning/20 bg-av-warning/10',
              ].join(' ')}>
                {is_nonstop ? 'Nonstop' : 'Connecting'}
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <p className="text-av-text text-xl font-bold tabular-nums">{arrTime}</p>
              <p className="text-av-text text-sm font-semibold mt-0.5">{destination}</p>
              <p className="text-av-muted text-xs">{destination_city}</p>
            </div>
          </div>

          {/* ── Right: Price + action ─────────────────────────────────── */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-36 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-av-border">

            {/* Price block */}
            <div className="text-right">
              <p className="text-av-text text-2xl font-bold leading-none">
                {formatPrice(totalPrice)}
              </p>
              <p className="text-av-muted text-xs mt-1">
                {formatPrice(price)} base · {formatPrice(taxes_fees)} taxes
              </p>
            </div>

            {/* Meta badges */}
            <div className="flex md:flex-col items-end gap-1.5">
              <CabinBadge cabin={cabin_class} />
              <SeatsIndicator seats={seats_available} />
            </div>

            {/* Select button */}
            <button
              onClick={() => onSelect(flight)}
              className="w-full md:w-auto shrink-0 bg-av-accent hover:bg-av-accent-hover active:bg-av-accent-muted text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-btn"
              aria-label={`Select ${airline} ${flight_number} — ${formatPrice(totalPrice)}`}
            >
              Select
            </button>
          </div>

        </div>
      </div>
    </article>
  );
}
