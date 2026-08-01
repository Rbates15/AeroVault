import { CheckCircle, Plane, Clock, User, Mail, Armchair, Printer, Leaf } from 'lucide-react';
import { formatPrice, formatTime, formatDate, formatDuration } from '../../utils/formatters.js';
import { useApp } from '../../context/AppContext.jsx';

// ── Detail row ────────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-av-surface-alt border border-av-border flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={12} className="text-av-muted" />
      </div>
      <div className="min-w-0">
        <p className="text-av-muted text-xs">{label}</p>
        <p className="text-av-text text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── ConfirmationCard ──────────────────────────────────────────────────────────
export default function ConfirmationCard({ onClose }) {
  const { confirmation, clearConfirmation, openMyTrips } = useApp();

  if (!confirmation) return null;

  const {
    confirmation_code,
    passenger_name,
    passenger_email,
    seat_preference,
    booked_at,
    flight,
    trip_impact,
  } = confirmation;

  const total = flight.price + flight.taxes_fees;

  function handleDone() {
    clearConfirmation();
    onClose?.();
  }

  function handleMyTrips() {
    const code = confirmation_code;
    clearConfirmation();
    onClose?.();
    openMyTrips(code);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* ── Success header ─────────────────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-av-success/10 border border-av-success/30">
          <CheckCircle size={28} className="text-av-success" />
        </div>
        <div>
          <h2 className="text-av-text text-xl font-bold">Booking Confirmed</h2>
          <p className="text-av-muted text-sm mt-1">
            Your simulated booking has been recorded.
          </p>
        </div>
        {/* Confirmation code — prominent, monospace */}
        <div className="inline-flex flex-col items-center bg-av-bg border border-av-accent/30 rounded-2xl px-8 py-4">
          <p className="text-av-muted text-xs font-semibold uppercase tracking-widest mb-1">
            Confirmation Code
          </p>
          <p className="font-mono text-av-accent text-3xl font-bold tracking-widest">
            {confirmation_code}
          </p>
          <p className="text-av-subtle text-xs mt-1.5">
            Save this code to retrieve your booking in My Trips
          </p>
        </div>
      </div>

      {/* ── Flight itinerary ───────────────────────────────────────────── */}
      <div className="bg-av-bg border border-av-border rounded-xl p-4">
        <p className="text-av-muted text-xs font-semibold uppercase tracking-wider mb-3">
          Flight Details
        </p>
        <div className="flex items-center gap-4 mb-4">
          {/* Dep */}
          <div className="text-left">
            <p className="text-av-text text-2xl font-bold">{formatTime(flight.departure_time)}</p>
            <p className="text-av-text text-sm font-semibold">{flight.origin}</p>
            <p className="text-av-muted text-xs">{flight.origin_city}</p>
          </div>
          {/* Arrow + duration */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <p className="text-av-muted text-xs flex items-center gap-1">
              <Clock size={10} /> {formatDuration(flight.duration_min)}
            </p>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-av-border" />
              <Plane size={12} className="text-av-accent shrink-0" />
              <div className="flex-1 h-px bg-av-border" />
            </div>
            <p className="text-av-muted text-xs">{flight.is_nonstop ? 'Nonstop' : 'Connecting'}</p>
          </div>
          {/* Arr */}
          <div className="text-right">
            <p className="text-av-text text-2xl font-bold">{formatTime(flight.arrival_time)}</p>
            <p className="text-av-text text-sm font-semibold">{flight.destination}</p>
            <p className="text-av-muted text-xs">{flight.destination_city}</p>
          </div>
        </div>

        {/* Flight meta */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-av-border text-xs">
          <div>
            <p className="text-av-muted">Airline</p>
            <p className="text-av-text font-medium mt-0.5">{flight.airline}</p>
          </div>
          <div>
            <p className="text-av-muted">Flight</p>
            <p className="text-av-text font-medium mt-0.5">{flight.flight_number}</p>
          </div>
          <div>
            <p className="text-av-muted">Date</p>
            <p className="text-av-text font-medium mt-0.5">{formatDate(flight.departure_time)}</p>
          </div>
          <div>
            <p className="text-av-muted">Cabin</p>
            <p className="text-av-text font-medium mt-0.5">{flight.cabin_class}</p>
          </div>
        </div>
      </div>

      {/* ── Passenger details ──────────────────────────────────────────── */}
      <div className="bg-av-bg border border-av-border rounded-xl p-4">
        <p className="text-av-muted text-xs font-semibold uppercase tracking-wider mb-3">
          Passenger
        </p>
        <div className="space-y-3">
          <DetailRow icon={User}     label="Full Name"       value={passenger_name} />
          <DetailRow icon={Mail}     label="Email"           value={passenger_email} />
          <DetailRow icon={Armchair} label="Seat Preference" value={seat_preference} />
        </div>
      </div>

      {/* ── Price paid ────────────────────────────────────────────────── */}
      <div className="bg-av-bg border border-av-border rounded-xl p-4">
        <div className="flex justify-between items-center">
          <p className="text-av-muted text-sm">Total paid</p>
          <p className="text-av-text text-xl font-bold">{formatPrice(total)}</p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-av-subtle text-xs">
            {formatPrice(flight.price)} base · {formatPrice(flight.taxes_fees)} taxes &amp; fees
          </p>
          <p className="text-av-subtle text-xs">
            Booked {formatDate(booked_at)}
          </p>
        </div>
      </div>

      {/* ── Trip impact summary ────────────────────────────────────────── */}
      {trip_impact && (
        <div className="bg-av-bg border border-av-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf size={13} className="text-green-400" />
              <p className="text-av-text text-sm font-semibold">Trip Impact</p>
            </div>
            <span className="text-xs font-semibold text-av-muted">
              {trip_impact.score}/{trip_impact.score_max} · {trip_impact.classification}
            </span>
          </div>
          <p className="text-av-muted text-xs">
            ~{trip_impact.co2_kg.toLocaleString()} kg CO₂ per passenger
          </p>
          <p className="text-av-subtle text-xs mt-1">{trip_impact.disclaimer}</p>
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleMyTrips}
          className="bg-av-surface-alt hover:bg-av-border border border-av-border text-av-text font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors text-center"
        >
          View in My Trips
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-av-surface-alt hover:bg-av-border border border-av-border text-av-text font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          aria-label="Print this confirmation"
        >
          <Printer size={14} aria-hidden="true" />
          Print
        </button>
        <button
          onClick={handleDone}
          className="bg-av-accent hover:bg-av-accent-hover text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-btn"
        >
          Done
        </button>
      </div>
    </div>
  );
}
