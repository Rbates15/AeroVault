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
// Photo by Suhyeon Choi on Unsplash (free to use, no attribution required)
// https://unsplash.com/photos/people-sitting-inside-airplane-NIZeg731LxM
const HERO_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80';

function Hero() {
  return (
    <section
      className="relative py-16 md:py-28 overflow-hidden"
      aria-label="AeroVault hero"
    >
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        aria-hidden="true"
      />

      {/* Dark blue overlay so text stays fully readable */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,29,61,0.82) 0%, rgba(15,36,68,0.88) 60%, rgba(15,36,68,0.97) 100%)' }}
        aria-hidden="true"
      />

      {/* Content sits above both layers */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-av-accent/10 border border-av-accent/20 rounded-full px-4 py-1.5 mb-6">
            <Plane size={13} className="text-av-accent" />
            <span className="text-av-accent text-xs font-semibold tracking-wide">
              Demo Application — Simulated Flights
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Travel with{' '}
            <span className="text-av-accent">Confidence.</span>
          </h1>

          <p className="mt-4 text-av-muted text-lg max-w-xl mx-auto leading-relaxed">
            Search and book simulated flights. Experience a realistic booking flow
            with Trip Impact estimates and instant confirmation.
          </p>
        </div>

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
        <SortBar sort={sort} onSort={handleSortChange} />
      </div>

      <FlightList flights={results.flights} />
    </section>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { selectedFlight, deselectFlight, confirmation, clearConfirmation } = useApp();

  // Modal is open when a flight is selected (booking flow)
  // OR when a confirmation exists (confirmation card).
  // These are mutually exclusive states in the reducer — keep them independent here.
  const bookingOpen      = !!selectedFlight;
  const confirmationOpen = !!confirmation;
  const modalOpen        = bookingOpen || confirmationOpen;

  function handleModalClose() {
    // Only clear what is currently active.
    // Never call both — they are mutually exclusive.
    if (confirmationOpen) {
      clearConfirmation();
    } else {
      deselectFlight();
    }
  }

  return (
    <div className="min-h-screen bg-av-bg text-av-text flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Hero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TrustBar />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <PopularDestinations />
        </div>

        <ResultsSection />
      </main>

      <Footer />

      {modalOpen && <BookingModal onClose={handleModalClose} />}
    </div>
  );
}
