import { Plane } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer, { TrustBar } from '../components/layout/Footer.jsx';
import SearchPanel from '../components/search/SearchPanel.jsx';
import PopularDestinations from '../components/destinations/PopularDestinations.jsx';
import FlightList from '../components/flights/FlightList.jsx';
import SortBar from '../components/flights/SortBar.jsx';
import BookingModal from '../components/booking/BookingModal.jsx';
import { useApp } from '../context/AppContext.jsx';

// ── Hero section ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0f1d3a 50%, #080d1a 100%)' }}
      aria-label="AeroVault hero"
    >
      {/* Subtle background grid texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-av-accent/10 border border-av-accent/20 rounded-full px-4 py-1.5 mb-6">
            <Plane size={13} className="text-av-accent" />
            <span className="text-av-accent text-xs font-semibold tracking-wide">
              Demo Application — Simulated Flights
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-av-text leading-tight tracking-tight">
            Travel with{' '}
            <span className="text-av-accent">Confidence.</span>
          </h1>

          <p className="mt-4 text-av-muted text-lg max-w-xl mx-auto leading-relaxed">
            Search and book simulated flights. Experience a realistic booking flow
            with Trip Impact estimates and instant confirmation.
          </p>
        </div>

        {/* Search panel */}
        <div id="search-section" className="max-w-4xl mx-auto">
          <SearchPanel />
        </div>
      </div>
    </section>
  );
}

// ── Results section ───────────────────────────────────────────────────────────
function ResultsSection() {
  const { results, sort, setSort, searchFlights, search } = useApp();

  if (!results.hasSearched || results.loading) return null;
  if (results.count === 0) return null;

  async function handleSortChange(newSort) {
    setSort(newSort);
    // Re-fetch with the new sort order
    await searchFlights({
      origin:      search.origin,
      destination: search.destination,
      date:        search.date,
      sort:        newSort,
    });
  }

  return (
    <section
      id="flight-results"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in"
      aria-label="Flight search results"
    >
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-av-text font-bold text-xl">
            {results.count} {results.count === 1 ? 'Flight' : 'Flights'} Found
          </h2>
          {(search.origin || search.destination) && (
            <p className="text-av-muted text-sm mt-0.5">
              {search.origin && <span className="font-medium text-av-text">{search.origin}</span>}
              {search.origin && search.destination && <span> → </span>}
              {search.destination && <span className="font-medium text-av-text">{search.destination}</span>}
              {search.date && (
                <span> · {new Date(search.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                })}</span>
              )}
            </p>
          )}
        </div>

        {/* Sort controls */}
        <SortBar sort={sort} onSort={handleSortChange} />
      </div>

      {/* Flight cards */}
      <FlightList flights={results.flights} />
    </section>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { selectedFlight, deselectFlight, confirmation } = useApp();

  // Modal is open when a flight is selected OR when confirmation is showing
  const modalOpen = !!selectedFlight || !!confirmation;

  function handleModalClose() {
    deselectFlight();
  }

  return (
    <div className="min-h-screen bg-av-bg text-av-text flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero + search */}
        <Hero />

        {/* Trust bar — below hero, above destinations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TrustBar />
        </div>

        {/* Popular destinations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <PopularDestinations />
        </div>

        {/* Flight results — only visible after a search */}
        <ResultsSection />
      </main>

      <Footer />

      {/* Booking modal — rendered at root level to overlay everything */}
      {modalOpen && <BookingModal onClose={handleModalClose} />}
    </div>
  );
}
