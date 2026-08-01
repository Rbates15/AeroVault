import { MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

// ── Destination data ──────────────────────────────────────────────────────────
// All four destinations exist in the seeded database as both origins and destinations.
// Background gradients use inline styles to avoid Tailwind purge issues with dynamic values.
const DESTINATIONS = [
  {
    code:       'JFK',
    city:       'New York',
    country:    'United States',
    tagline:    'The city that never sleeps.',
    gradient:   'linear-gradient(135deg, #0f1d3a 0%, #162033 100%)',
    accentHex:  '#3b82f6',
    emoji:      '🗽',
  },
  {
    code:       'LAX',
    city:       'Los Angeles',
    country:    'United States',
    tagline:    'Sun, culture, and endless horizons.',
    gradient:   'linear-gradient(135deg, #1a1205 0%, #2a1e08 100%)',
    accentHex:  '#f59e0b',
    emoji:      '🌴',
  },
  {
    code:       'MIA',
    city:       'Miami',
    country:    'United States',
    tagline:    'Where the ocean meets the skyline.',
    gradient:   'linear-gradient(135deg, #0d1a1a 0%, #0f2020 100%)',
    accentHex:  '#10b981',
    emoji:      '🌊',
  },
  {
    code:       'ORD',
    city:       'Chicago',
    country:    'United States',
    tagline:    'Architecture, culture, and deep-dish.',
    gradient:   'linear-gradient(135deg, #1a0d1a 0%, #220f22 100%)',
    accentHex:  '#a78bfa',
    emoji:      '🏙️',
  },
];

// ── DestinationCard ───────────────────────────────────────────────────────────
function DestinationCard({ dest, onClick }) {
  return (
    <button
      onClick={() => onClick(dest)}
      className="group relative w-full text-left rounded-2xl border border-av-border overflow-hidden transition-all duration-200 hover:border-av-accent/50 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-av-accent"
      style={{ background: dest.gradient }}
      aria-label={`Search flights to ${dest.city}`}
    >
      {/* Content */}
      <div className="p-5">
        {/* Emoji + city */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl leading-none" role="img" aria-hidden="true">
            {dest.emoji}
          </span>
          {/* Arrow — appears on hover */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: `${dest.accentHex}22`, border: `1px solid ${dest.accentHex}44` }}
          >
            <ArrowRight size={13} style={{ color: dest.accentHex }} />
          </div>
        </div>

        {/* City name */}
        <p className="text-av-text font-bold text-lg leading-tight">{dest.city}</p>

        {/* Country + IATA code */}
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={11} className="text-av-muted shrink-0" />
          <span className="text-av-muted text-xs">{dest.country}</span>
          <span className="text-av-subtle text-xs">·</span>
          <span
            className="text-xs font-semibold font-mono"
            style={{ color: dest.accentHex }}
          >
            {dest.code}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-av-muted text-xs mt-2 leading-snug line-clamp-2">
          {dest.tagline}
        </p>
      </div>

      {/* Bottom accent line — visible on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ backgroundColor: dest.accentHex }}
      />
    </button>
  );
}

// ── PopularDestinations ───────────────────────────────────────────────────────
export default function PopularDestinations() {
  const { setSearch, searchFlights, sort } = useApp();

  function handleSelect(dest) {
    setSearch({ origin: '', destination: dest.code, date: '' });

    searchFlights({ destination: dest.code, sort }).then(() => {
      // Scroll to results after they render, not to the search panel
      setTimeout(() => {
        document.getElementById('flight-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  return (
    <section aria-labelledby="popular-destinations-heading">
      <div className="flex items-center justify-between mb-5">
        <h2
          id="popular-destinations-heading"
          className="text-av-text font-bold text-xl"
        >
          Popular Destinations
        </h2>
        <p className="text-av-muted text-xs">Select to search flights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DESTINATIONS.map((dest) => (
          <DestinationCard key={dest.code} dest={dest} onClick={handleSelect} />
        ))}
      </div>
    </section>
  );
}
