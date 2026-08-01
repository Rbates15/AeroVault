import { TrendingUp, DollarSign, Zap } from 'lucide-react';

const SORT_OPTIONS = [
  { key: 'recommended', label: 'Recommended', icon: TrendingUp },
  { key: 'price',       label: 'Cheapest',    icon: DollarSign },
  { key: 'duration',    label: 'Fastest',      icon: Zap },
];

export default function SortBar({ sort, onSort }) {
  return (
    <div
      className="flex items-center gap-1 bg-av-surface border border-av-border rounded-xl p-1"
      role="group"
      aria-label="Sort flights"
    >
      {SORT_OPTIONS.map(({ key, label, icon: Icon }) => {
        const active = sort === key;
        return (
          <button
            key={key}
            onClick={() => onSort(key)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
              active
                ? 'bg-av-accent text-white shadow-btn'
                : 'text-av-muted hover:text-av-text hover:bg-av-surface-alt',
            ].join(' ')}
            aria-pressed={active}
          >
            <Icon size={12} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
