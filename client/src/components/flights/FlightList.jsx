import { Plane } from 'lucide-react';
import FlightCard from './FlightCard.jsx';
import { useApp } from '../../context/AppContext.jsx';

// ── Loading skeleton ──────────────────────────────────────────────────────────
function FlightSkeleton() {
  return (
    <div className="bg-av-surface border border-av-border rounded-2xl p-5 md:p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-3 md:w-44">
          <div className="w-10 h-10 rounded-xl bg-av-border" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-av-border rounded" />
            <div className="h-2.5 w-16 bg-av-border rounded" />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-6">
          <div className="space-y-2">
            <div className="h-5 w-16 bg-av-border rounded" />
            <div className="h-3 w-10 bg-av-border rounded" />
          </div>
          <div className="flex-1 h-px bg-av-border" />
          <div className="space-y-2">
            <div className="h-5 w-16 bg-av-border rounded" />
            <div className="h-3 w-10 bg-av-border rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 md:w-36">
          <div className="h-7 w-24 bg-av-border rounded" />
          <div className="h-8 w-full bg-av-border rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-av-surface border border-av-border flex items-center justify-center mb-4">
        <Plane size={24} className="text-av-muted" />
      </div>
      <p className="text-av-text font-semibold text-lg">No flights found</p>
      <p className="text-av-muted text-sm mt-1 max-w-xs">
        Try adjusting your search — different dates or routes may have availability.
      </p>
    </div>
  );
}

// ── FlightList ────────────────────────────────────────────────────────────────
export default function FlightList({ flights }) {
  const { results, selectFlight } = useApp();

  // Show skeletons while loading
  if (results.loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading flights">
        {[1, 2, 3].map((n) => <FlightSkeleton key={n} />)}
      </div>
    );
  }

  // Empty state
  if (!flights || flights.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4" role="list" aria-label={`${flights.length} flights`}>
      {flights.map((flight) => (
        <div key={flight.id} role="listitem">
          <FlightCard
            flight={flight}
            onSelect={selectFlight}
          />
        </div>
      ))}
    </div>
  );
}
