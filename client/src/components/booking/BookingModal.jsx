import { useState, useEffect, useCallback } from 'react';
import { X, Plane, Clock, ArrowRight, User, Mail, Armchair, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import PriceBreakdown from './PriceBreakdown.jsx';
import TripImpact from './TripImpact.jsx';
import ConfirmationCard from '../confirmation/ConfirmationCard.jsx';
import { formatTime, formatDate, formatDuration, formatPrice } from '../../utils/formatters.js';

const MODAL_TITLE_ID = 'booking-modal-title';

// ── Form field ────────────────────────────────────────────────────────────────
function Field({ id, label, icon: Icon, type = 'text', value, onChange, placeholder, error, required, autoFocus }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-av-muted text-xs font-semibold uppercase tracking-wider mb-1.5"
      >
        <span className="flex items-center gap-1.5">
          <Icon size={11} className="text-av-accent" aria-hidden="true" />
          {label}
          {required && <span className="text-av-danger ml-0.5" aria-hidden="true">*</span>}
        </span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={[
          'w-full bg-av-bg border rounded-xl px-4 py-2.5 text-av-text placeholder-av-muted text-sm',
          'focus:outline-none focus:ring-1 transition-colors',
          error
            ? 'border-av-danger focus:border-av-danger focus:ring-av-danger'
            : 'border-av-border focus:border-av-accent focus:ring-av-accent',
        ].join(' ')}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={required}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-av-danger text-xs flex items-center gap-1">
          <AlertCircle size={11} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

// ── Select field ──────────────────────────────────────────────────────────────
function SelectField({ id, label, icon: Icon, value, onChange, options }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-av-muted text-xs font-semibold uppercase tracking-wider mb-1.5"
      >
        <span className="flex items-center gap-1.5">
          <Icon size={11} className="text-av-accent" aria-hidden="true" />
          {label}
        </span>
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-av-bg border border-av-border rounded-xl px-4 py-2.5 text-av-text text-sm focus:outline-none focus:border-av-accent focus:ring-1 focus:ring-av-accent transition-colors appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Flight summary panel ──────────────────────────────────────────────────────
function FlightSummary({ flight }) {
  return (
    <div className="bg-av-bg border border-av-border rounded-xl p-4 space-y-4">
      <p className="text-av-muted text-xs font-semibold uppercase tracking-wider">
        Selected Flight
      </p>

      <div>
        <p className="text-av-text font-bold text-base">{flight.airline}</p>
        <p className="text-av-muted text-xs mt-0.5">{flight.flight_number}</p>
        {flight.aircraft_type && (
          <p className="text-av-subtle text-xs mt-0.5">{flight.aircraft_type}</p>
        )}
      </div>

      {/* Route strip */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-av-text text-xl font-bold tabular-nums">{formatTime(flight.departure_time)}</p>
          <p className="text-av-text text-sm font-semibold">{flight.origin}</p>
          <p className="text-av-muted text-xs">{flight.origin_city}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
          <span className="text-av-muted text-xs flex items-center gap-1">
            <Clock size={9} aria-hidden="true" />
            {formatDuration(flight.duration_min)}
          </span>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-av-border" />
            <ArrowRight size={11} className="text-av-accent shrink-0" aria-hidden="true" />
          </div>
          <span className={[
            'text-xs px-2 py-0.5 rounded-full border',
            flight.is_nonstop
              ? 'text-green-400 border-green-500/20 bg-green-500/10'
              : 'text-amber-400 border-amber-500/20 bg-amber-500/10',
          ].join(' ')}>
            {flight.is_nonstop ? 'Nonstop' : 'Connecting'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-av-text text-xl font-bold tabular-nums">{formatTime(flight.arrival_time)}</p>
          <p className="text-av-text text-sm font-semibold">{flight.destination}</p>
          <p className="text-av-muted text-xs">{flight.destination_city}</p>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-av-border text-xs">
        <div>
          <p className="text-av-muted">Date</p>
          <p className="text-av-text font-medium mt-0.5">{formatDate(flight.departure_time)}</p>
        </div>
        <div>
          <p className="text-av-muted">Cabin</p>
          <p className="text-av-text font-medium mt-0.5">{flight.cabin_class}</p>
        </div>
        <div>
          <p className="text-av-muted">Seats left</p>
          <p className={[
            'font-medium mt-0.5',
            flight.seats_available <= 5  ? 'text-av-danger' :
            flight.seats_available <= 15 ? 'text-av-warning' : 'text-av-text',
          ].join(' ')}>
            {flight.seats_available}
          </p>
        </div>
        <div>
          <p className="text-av-muted">Total</p>
          <p className="text-av-text font-bold mt-0.5">
            {formatPrice(flight.price + flight.taxes_fees)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── BookingModal ──────────────────────────────────────────────────────────────
export default function BookingModal({ onClose }) {
  const { selectedFlight, deselectFlight, setConfirmation, confirmation } = useApp();

  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [seatPref,   setSeatPref]   = useState('No Preference');
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [tripImpact, setTripImpact] = useState(null);

  // Capture the flight into local state on mount so it remains available
  // after SET_CONFIRMATION clears selectedFlight in the context.
  const [flight] = useState(selectedFlight);
  const isConfirmed = !!confirmation;
  // Measure scrollbar width then lock scroll
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, []);

  // Fetch trip impact from GET /api/flights/:id
  useEffect(() => {
    if (!flight) return;
    fetch(`/api/flights/${flight.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.trip_impact) setTripImpact(d.trip_impact); })
      .catch(() => {});
  }, [flight?.id]);

  // Stable close handler
  const handleClose = useCallback(() => {
    if (!isConfirmed) deselectFlight();
    onClose?.();
  }, [isConfirmed, deselectFlight, onClose]);

  // Escape key — only when not confirmed
  useEffect(() => {
    if (isConfirmed) return;
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isConfirmed, handleClose]);

  // ── Validation ──────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!name.trim() || name.trim().length < 2)
      errs.name = 'Please enter your full name (at least 2 characters).';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = 'Please enter a valid email address.';
    return errs;
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const res  = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          flight_id:       flight.id,
          passenger_name:  name.trim(),
          passenger_email: email.trim().toLowerCase(),
          seat_preference: seatPref,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.error?.message || 'Booking failed. Please try again.'); return; }
      // Store confirmation — this transitions Home to confirmationOpen state.
      // Do NOT call onClose here; Home.jsx keeps the modal mounted via confirmationOpen.
      setConfirmation(data);
    } catch {
      setApiError('A network error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!flight && !isConfirmed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 sm:pt-10 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget && !isConfirmed) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
    >
      <div className="bg-av-surface border border-av-border rounded-2xl shadow-modal w-full max-w-4xl mb-8 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-av-border">
          <div className="flex items-center gap-2">
            <Plane size={18} className="text-av-accent" aria-hidden="true" />
            <h2 id={MODAL_TITLE_ID} className="text-av-text font-bold text-lg">
              {isConfirmed ? 'Booking Confirmed' : 'Complete Your Booking'}
            </h2>
          </div>
          {!isConfirmed && (
            <button
              onClick={handleClose}
              className="text-av-muted hover:text-av-text transition-colors p-1.5 rounded-lg hover:bg-av-surface-alt"
              aria-label="Close booking form"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {isConfirmed ? (
            <ConfirmationCard onClose={onClose} />
          ) : (
            /*
             * Mobile: single column, form first (user action above the fold).
             * Desktop (lg): two columns — flight summary left, form right.
             * We reverse the DOM order from the desktop layout on mobile by
             * using order- utilities so form stays at top on small screens.
             */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Right column on desktop / Second on mobile: passenger form */}
              <div className="order-1 lg:order-2 space-y-4">
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="bg-av-bg border border-av-border rounded-xl p-4 space-y-4">
                    <p className="text-av-muted text-xs font-semibold uppercase tracking-wider">
                      Passenger Information
                    </p>
                    <Field
                      id="pax-name"
                      label="Full Name"
                      icon={User}
                      value={name}
                      onChange={setName}
                      placeholder="Jane Doe"
                      error={errors.name}
                      required
                      autoFocus
                    />
                    <Field
                      id="pax-email"
                      label="Email Address"
                      icon={Mail}
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="jane@example.com"
                      error={errors.email}
                      required
                    />
                    <SelectField
                      id="pax-seat"
                      label="Seat Preference"
                      icon={Armchair}
                      value={seatPref}
                      onChange={setSeatPref}
                      options={[
                        { value: 'No Preference', label: 'No Preference' },
                        { value: 'Window',        label: 'Window' },
                        { value: 'Aisle',         label: 'Aisle' },
                      ]}
                    />
                  </div>

                  <PriceBreakdown price={flight.price} taxesFees={flight.taxes_fees} />

                  {apiError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 bg-av-danger/10 border border-av-danger/30 rounded-xl p-3"
                    >
                      <AlertCircle size={15} className="text-av-danger shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-av-danger text-sm">{apiError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-av-accent hover:bg-av-accent-hover active:bg-av-accent-muted disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3.5 rounded-xl text-base transition-colors shadow-btn"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Confirming…
                      </>
                    ) : (
                      <>
                        <Plane size={16} aria-hidden="true" />
                        Confirm Booking · {formatPrice(flight.price + flight.taxes_fees)}
                      </>
                    )}
                  </button>

                  <p className="text-av-subtle text-xs text-center">
                    This is a demonstration booking. No real payment is processed.
                  </p>
                </form>
              </div>

              {/* Left column on desktop / Third on mobile: flight summary + trip impact */}
              <div className="order-2 lg:order-1 space-y-4">
                <FlightSummary flight={flight} />
                <TripImpact tripImpact={tripImpact} />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
