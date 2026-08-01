import { ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

export default function PriceBreakdown({ price, taxesFees }) {
  const total = price + taxesFees;

  return (
    <div className="bg-av-bg border border-av-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <p className="text-av-text text-sm font-semibold">Price Breakdown</p>

      {/* Line items */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-av-muted text-sm">Base fare</span>
          <span className="text-av-text text-sm">{formatPrice(price)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-av-muted text-sm">Taxes &amp; fees</span>
          <span className="text-av-text text-sm">{formatPrice(taxesFees)}</span>
        </div>
        <div className="h-px bg-av-border" />
        <div className="flex justify-between items-center">
          <span className="text-av-text text-sm font-bold">Total</span>
          <span className="text-av-text text-lg font-bold">{formatPrice(total)}</span>
        </div>
      </div>

      {/* No hidden fees trust message */}
      <div className="flex items-center gap-2 pt-1 border-t border-av-border">
        <ShieldCheck size={13} className="text-av-success shrink-0" />
        <p className="text-av-success text-xs font-medium">
          No hidden fees — the price above is what you pay.
        </p>
      </div>
    </div>
  );
}
