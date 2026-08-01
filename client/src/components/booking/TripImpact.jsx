import { Leaf, Info } from 'lucide-react';

// ── Color config per classification ──────────────────────────────────────────
const IMPACT_CONFIG = {
  'Low':           { bar: '#22c55e', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  'Low–Moderate':  { bar: '#84cc16', badge: 'bg-lime-500/10 text-lime-400 border-lime-500/20' },
  'Moderate':      { bar: '#f59e0b', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  'High':          { bar: '#f97316', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  'Very High':     { bar: '#ef4444', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

function getConfig(classification) {
  return IMPACT_CONFIG[classification] ?? IMPACT_CONFIG['Moderate'];
}

// ── Score scale bar ───────────────────────────────────────────────────────────
function ScoreBar({ score, scoreMax, barColor }) {
  const pct = Math.round((score / scoreMax) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-av-muted text-xs">Low impact</span>
        <span className="text-av-muted text-xs">Very High</span>
      </div>
      {/* Track */}
      <div className="relative h-2 bg-av-bg rounded-full overflow-hidden border border-av-border">
        {/* Gradient fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width:      `${pct}%`,
            background: `linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)`,
            clipPath:   `inset(0 ${100 - pct}% 0 0)`,
          }}
        />
        {/* Marker dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-av-bg shadow"
          style={{
            left:            `calc(${pct}% - 6px)`,
            backgroundColor: barColor,
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-av-muted">1</span>
        <span className="text-xs font-bold" style={{ color: barColor }}>
          {score} / {scoreMax}
        </span>
        <span className="text-xs text-av-muted">{scoreMax}</span>
      </div>
    </div>
  );
}

// ── TripImpact ────────────────────────────────────────────────────────────────
// Accepts a pre-calculated `tripImpact` object from the API (GET /api/flights/:id)
// or the POST /api/bookings response. Falls back gracefully if not yet loaded.
export default function TripImpact({ tripImpact }) {
  if (!tripImpact) return null;

  const {
    co2_kg,
    score,
    score_max,
    classification,
    explanation,
    disclaimer,
  } = tripImpact;

  const config = getConfig(classification);

  return (
    <div className="bg-av-bg border border-av-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Leaf size={13} className="text-green-400" />
          </div>
          <span className="text-av-text text-sm font-semibold">Trip Impact</span>
        </div>
        {/* Classification badge */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.badge}`}>
          {classification}
        </span>
      </div>

      {/* CO2 figure */}
      <div className="flex items-baseline gap-2">
        <span className="text-av-text text-2xl font-bold">~{co2_kg.toLocaleString()}</span>
        <span className="text-av-muted text-sm">kg CO₂ per passenger</span>
      </div>

      {/* Score bar */}
      <ScoreBar score={score} scoreMax={score_max} barColor={config.bar} />

      {/* Explanation */}
      <p className="text-av-muted text-xs leading-relaxed">{explanation}</p>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 pt-1 border-t border-av-border">
        <Info size={11} className="text-av-subtle mt-0.5 shrink-0" />
        <p className="text-av-subtle text-xs leading-relaxed">{disclaimer}</p>
      </div>
    </div>
  );
}
