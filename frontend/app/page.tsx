import Link from 'next/link';
import { ROUTES } from '@/config/routes';

const modules = [
  { label: '🖥 POS', href: ROUTES.pos, description: 'Point of sale terminal' },
  { label: '🪑 Tables', href: ROUTES.tables, description: 'Restaurant floor layout' },
  { label: '📋 Orders', href: ROUTES.orders, description: 'Live order tracking' },
  { label: '🍽 Menu', href: ROUTES.menu, description: 'Menu management' },
  { label: '📅 Reservations', href: ROUTES.reservations, description: 'Booking & reservations' },
  { label: '📦 Inventory', href: ROUTES.inventory, description: 'Stock & expiry tracking' },
  { label: '🧑‍🍳 Prep', href: ROUTES.prep, description: 'Kitchen prep tracking' },
  { label: '📊 Reports', href: ROUTES.reports, description: 'Sales & analytics' },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">🍽 Restaurant Management</h1>
        <p className="text-muted-foreground text-lg">Open-source POS & operations platform</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="flex flex-col items-center justify-center p-6 rounded-xl border bg-card hover:bg-accent hover:border-primary transition-all text-center gap-2 min-h-[120px] active:scale-95"
          >
            <span className="text-3xl">{mod.label.split(' ')[0]}</span>
            <span className="font-semibold text-sm">{mod.label.split(' ').slice(1).join(' ')}</span>
            <span className="text-xs text-muted-foreground">{mod.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
