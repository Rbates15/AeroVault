import { Shield, DollarSign, Lock, Headphones } from 'lucide-react';
import logoSvg from '../../assets/logo.svg';

// ── Trust indicators ──────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  {
    icon:  Shield,
    label: 'Secure Booking',
    desc:  'All bookings handled with encrypted confirmation codes.',
  },
  {
    icon:  DollarSign,
    label: 'Transparent Pricing',
    desc:  'The price you see is the price you pay. No surprises.',
  },
  {
    icon:  Lock,
    label: 'Price Protection',
    desc:  'Your fare is locked at the time of booking.',
  },
  {
    icon:  Headphones,
    label: '24/7 Support',
    desc:  'Travel assistance available around the clock.',
  },
];

// ── Trust Bar (also used standalone in Home hero) ─────────────────────────────
export function TrustBar({ className = '' }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          className="flex items-start gap-3 bg-av-surface border border-av-border rounded-xl p-4"
        >
          <div className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-av-accent/10 border border-av-accent/20 flex items-center justify-center">
            <Icon size={15} className="text-av-accent" />
          </div>
          <div>
            <p className="text-av-text text-sm font-semibold leading-tight">{label}</p>
            <p className="text-av-muted text-xs mt-0.5 leading-snug">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-av-surface border-t border-av-border mt-auto">
      {/* Trust bar row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TrustBar />
      </div>

      {/* Divider */}
      <div className="border-t border-av-border" />

      {/* Bottom row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <img src={logoSvg} alt="AeroVault" className="h-6 w-auto opacity-80" />
            <p className="text-av-muted text-xs">Travel with confidence.</p>
          </div>

          {/* Copyright */}
          <p className="text-av-muted text-xs text-center md:text-right">
            © {year} AeroVault
          </p>
        </div>

        <div className="mt-5 pt-5 border-t border-av-border">
          <p className="text-av-muted text-xs leading-relaxed text-center max-w-2xl mx-auto">
            <span className="font-semibold">Demo Application — </span>
            AeroVault is built for educational purposes and does not connect to real airline
            inventory, process real payments, or provide actual customer support.
            All flights, prices, schedules, and availability are simulated.
          </p>
        </div>
      </div>
    </footer>
  );
}
