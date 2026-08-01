import { useState, useRef, useEffect, useCallback } from 'react';
import { Plane, Briefcase, User, LogOut, ChevronDown, X, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { formatDate, formatTime, formatDuration } from '../../utils/formatters.js';
import logoSvg from '../../assets/logo.svg';

// ── My Trips modal ─────────────────────────────────────────────────────────────
function MyTripsModal({ onClose }) {
  const { myTrips, lookupBooking, closeMyTrips } = useApp();
  const [code, setCode] = useState(myTrips.prefillCode || '');
  const inputRef = useRef(null);
  const modalId  = 'my-trips-modal-heading';

  const handleClose = useCallback(() => {
    closeMyTrips();
    onClose?.();
  }, [closeMyTrips, onClose]);

  // autoFocus the input when the modal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-lookup if opened with a prefilled code
  useEffect(() => {
    if (myTrips.prefillCode) {
      lookupBooking(myTrips.prefillCode);
    }
  }, []);

  // Stable Escape handler
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose]);

  async function handleLookup(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    await lookupBooking(trimmed);
  }

  function handleClear() {
    setCode('');
    inputRef.current?.focus();
  }

  const booking = myTrips.booking;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="bg-av-surface border border-av-border rounded-2xl shadow-modal w-full max-w-md animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-av-border">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-av-accent" />
            <h2 id={modalId} className="text-av-text font-semibold text-lg">My Trips</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-av-muted hover:text-av-text transition-colors p-1.5 rounded-lg hover:bg-av-surface-alt"
            aria-label="Close My Trips"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-av-muted text-sm">
            Enter your confirmation code to retrieve a booking.
          </p>

          {/* Lookup form */}
          <form onSubmit={handleLookup}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="AV-XXXXXX"
                  maxLength={10}
                  className="w-full bg-av-bg border border-av-border rounded-xl px-4 py-2.5 pr-9 text-av-text placeholder-av-muted text-sm focus:outline-none focus:border-av-accent focus:ring-1 focus:ring-av-accent transition-colors font-mono"
                  aria-label="Confirmation code"
                  autoCapitalize="characters"
                  spellCheck={false}
                />
                {/* Clear button inside input */}
                {code && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-av-muted hover:text-av-text transition-colors"
                    aria-label="Clear confirmation code"
                    tabIndex={-1}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={myTrips.loading || !code.trim()}
                className="bg-av-accent hover:bg-av-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-btn shrink-0"
              >
                {myTrips.loading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching…
                  </span>
                ) : 'Find'}
              </button>
            </div>
          </form>

          {/* Error state */}
          {myTrips.error && (
            <div className="flex items-start gap-2 bg-av-danger/10 border border-av-danger/30 rounded-xl p-3">
              <X size={13} className="text-av-danger shrink-0 mt-0.5" />
              <p className="text-av-danger text-sm">{myTrips.error}</p>
            </div>
          )}

          {/* Result card */}
          {booking && (
            <div className="bg-av-bg border border-av-border rounded-xl p-4 space-y-3 animate-slide-up">
              {/* Status row */}
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-av-success" />
                <span className="text-av-success text-sm font-semibold">Booking Found</span>
              </div>

              {/* Confirmation code */}
              <p className="font-mono text-av-accent font-bold text-xl tracking-widest">
                {booking.confirmation_code}
              </p>

              {/* Passenger */}
              <div>
                <p className="text-av-text text-sm font-semibold">{booking.passenger_name}</p>
                <p className="text-av-muted text-xs mt-0.5">{booking.passenger_email}</p>
              </div>

              {/* Flight summary */}
              <div className="border-t border-av-border pt-3 space-y-1">
                <p className="text-av-text text-sm font-semibold">
                  {booking.flight.airline}
                  <span className="text-av-muted font-normal"> · {booking.flight.flight_number}</span>
                </p>
                <div className="flex items-center gap-2 text-av-muted text-xs">
                  <span className="font-medium text-av-text">{booking.flight.origin}</span>
                  <span>→</span>
                  <span className="font-medium text-av-text">{booking.flight.destination}</span>
                  <span>·</span>
                  <span>{booking.flight.origin_city} to {booking.flight.destination_city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-av-muted text-xs">
                  <Clock size={10} />
                  <span>{formatDate(booking.flight.departure_time)}</span>
                  <span>·</span>
                  <span>{formatTime(booking.flight.departure_time)}</span>
                  <span>→</span>
                  <span>{formatTime(booking.flight.arrival_time)}</span>
                  <span>·</span>
                  <span>{formatDuration(booking.flight.duration_min)}</span>
                </div>
                <p className="text-av-subtle text-xs">
                  Booked {formatDate(booking.booked_at)}
                </p>
              </div>

              {/* Seat + cabin */}
              <div className="flex gap-4 text-xs pt-1">
                <div>
                  <span className="text-av-muted">Seat </span>
                  <span className="text-av-text font-medium">{booking.seat_preference}</span>
                </div>
                <div>
                  <span className="text-av-muted">Cabin </span>
                  <span className="text-av-text font-medium">{booking.flight.cabin_class}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── User dropdown ──────────────────────────────────────────────────────────────
function UserDropdown({ onMyTrips }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const items = [
    { label: 'My Trips', icon: Briefcase, action: () => { setOpen(false); onMyTrips(); } },
    { label: 'Profile',  icon: User,      action: () => setOpen(false) },
    { label: 'Sign Out', icon: LogOut,    action: () => setOpen(false) },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-av-surface-alt hover:bg-av-border border border-av-border rounded-xl px-3 py-2 text-av-text text-sm transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <div className="w-7 h-7 rounded-full bg-av-accent/20 border border-av-accent/30 flex items-center justify-center">
          <User size={14} className="text-av-accent" />
        </div>
        <span className="hidden sm:block font-medium">Account</span>
        <ChevronDown
          size={14}
          className={`text-av-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-av-surface border border-av-border rounded-xl shadow-modal py-1 z-40 animate-fade-in"
          role="menu"
          aria-label="Account options"
        >
          {items.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-av-text hover:bg-av-surface-alt transition-colors text-left"
            >
              <Icon size={14} className="text-av-muted" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { openMyTrips, myTrips } = useApp();
  const [myTripsVisible, setMyTripsVisible] = useState(false);

  function handleOpenMyTrips() {
    // Measure scrollbar width before locking scroll so CSS variable is set
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    openMyTrips();
    setMyTripsVisible(true);
  }

  function handleCloseMyTrips() {
    setMyTripsVisible(false);
  }

  return (
    <>
      <nav
        className="sticky top-0 z-30 bg-av-surface/95 backdrop-blur-sm border-b border-av-border"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="/" className="flex items-center shrink-0" aria-label="AeroVault — go to homepage">
              <img src={logoSvg} alt="AeroVault" className="h-7 w-auto" />
            </a>

            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleOpenMyTrips}
                className="flex items-center gap-2 text-av-muted hover:text-av-text text-sm font-medium transition-colors px-3 py-2 rounded-xl hover:bg-av-surface-alt"
                aria-label="Open My Trips"
              >
                <Plane size={15} className="text-av-accent" aria-hidden="true" />
                <span className="hidden sm:block">My Trips</span>
              </button>

              <UserDropdown onMyTrips={handleOpenMyTrips} />
            </div>
          </div>
        </div>
      </nav>

      {myTrips.open && myTripsVisible && (
        <MyTripsModal onClose={handleCloseMyTrips} />
      )}
    </>
  );
}
