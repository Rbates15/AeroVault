import { useRef } from 'react';
import { MapPin, Calendar, Search, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

// ── Airport reference list for datalist autocomplete ─────────────────────────
// Covers every IATA code present in the seed data
const AIRPORTS = [
  { code: 'JFK', city: 'New York',      name: 'John F. Kennedy International' },
  { code: 'LAX', city: 'Los Angeles',   name: 'Los Angeles International' },
  { code: 'ORD', city: 'Chicago',       name: "O'Hare International" },
  { code: 'MIA', city: 'Miami',         name: 'Miami International' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International' },
  { code: 'BOS', city: 'Boston',        name: 'Logan International' },
  { code: 'SEA', city: 'Seattle',       name: 'Seattle–Tacoma International' },
  { code: 'DFW', city: 'Dallas',        name: 'Dallas/Fort Worth International' },
  { code: 'LHR', city: 'London',        name: 'Heathrow Airport' },
  { code: 'NRT', city: 'Tokyo',         name: 'Narita International' },
];

// ── Field component ───────────────────────────────────────────────────────────
function Field({ id, label, icon: Icon, value, onChange, placeholder, type = 'text', list, min }) {
  return (
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="block text-av-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
        <span className="flex items-center gap-1.5">
          <Icon size={12} className="text-av-accent" />
          {label}
        </span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        min={min}
        autoComplete="off"
        className="w-full bg-av-bg border border-av-border rounded-xl px-4 py-3 text-av-text placeholder-av-muted text-sm focus:outline-none focus:border-av-accent focus:ring-1 focus:ring-av-accent transition-colors"
      />
    </div>
  );
}

// ── SearchPanel ───────────────────────────────────────────────────────────────
export default function SearchPanel() {
  const {
    search,
    setSearchField,
    setSearch,
    results,
    sort,
    searchFlights,
  } = useApp();

  const formRef = useRef(null);

  // Minimum date = today (prevent past-date searches)
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();
    await searchFlights({
      origin:      search.origin.trim().toUpperCase(),
      destination: search.destination.trim().toUpperCase(),
      date:        search.date,
      sort,
    });

    // Scroll results into view after a short paint delay
    setTimeout(() => {
      document.getElementById('flight-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  return (
    <div className="bg-av-surface border border-av-border rounded-2xl shadow-card p-6 md:p-8">
      {/* Panel heading */}
      <p className="text-av-muted text-xs font-semibold uppercase tracking-wider mb-5">
        Search Flights
      </p>

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        {/* Input row */}
        <div className="flex flex-col md:flex-row gap-3 items-end">

          {/* Origin */}
          <Field
            id="origin"
            label="From"
            icon={MapPin}
            value={search.origin}
            onChange={(v) => setSearchField('origin', v)}
            placeholder="JFK"
            list="airport-list-origin"
          />

          {/* Arrow separator — desktop only */}
          <div className="hidden md:flex items-center justify-center pb-1 shrink-0">
            <div className="w-8 h-8 rounded-full bg-av-bg border border-av-border flex items-center justify-center">
              <ArrowRight size={14} className="text-av-muted" />
            </div>
          </div>

          {/* Destination */}
          <Field
            id="destination"
            label="To"
            icon={MapPin}
            value={search.destination}
            onChange={(v) => setSearchField('destination', v)}
            placeholder="LAX"
            list="airport-list-dest"
          />

          {/* Date */}
          <Field
            id="date"
            label="Date"
            icon={Calendar}
            type="date"
            value={search.date}
            onChange={(v) => setSearchField('date', v)}
            placeholder=""
            min={today}
          />

          {/* Search button */}
          <div className="shrink-0 w-full md:w-auto pb-0">
            <button
              type="submit"
              disabled={results.loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-av-accent hover:bg-av-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-btn"
            >
              {results.loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search size={15} />
                  Search Flights
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error state */}
        {results.error && (
          <p className="mt-3 text-av-danger text-sm">{results.error}</p>
        )}

        {/* No results message */}
        {results.hasSearched && !results.loading && !results.error && results.count === 0 && (
          <p className="mt-3 text-av-muted text-sm">
            No flights found for that search. Try adjusting your route or date.
          </p>
        )}
      </form>

      {/* Datalist for airport autocomplete — origin */}
      <datalist id="airport-list-origin">
        {AIRPORTS.map(({ code, city, name }) => (
          <option key={code} value={code}>{city} — {name}</option>
        ))}
      </datalist>

      {/* Datalist for airport autocomplete — destination */}
      <datalist id="airport-list-dest">
        {AIRPORTS.map(({ code, city, name }) => (
          <option key={code} value={code}>{city} — {name}</option>
        ))}
      </datalist>
    </div>
  );
}

// ── Exported helper so PopularDestinations can pre-fill the form ──────────────
// Accepts a destination object { code, city } and calls setSearch
export { AIRPORTS };
