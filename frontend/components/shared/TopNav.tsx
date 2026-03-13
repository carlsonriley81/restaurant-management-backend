'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

const navItems = [
  { label: 'POS', href: ROUTES.pos },
  { label: 'Tables', href: ROUTES.tables },
  { label: 'Orders', href: ROUTES.orders },
  { label: 'Menu', href: ROUTES.menu },
  { label: 'Reservations', href: ROUTES.reservations },
  { label: 'Inventory', href: ROUTES.inventory },
  { label: 'Prep', href: ROUTES.prep },
  { label: 'Reports', href: ROUTES.reports },
  { label: 'Kitchen', href: '/kitchen' },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // The KDS layout provides its own full-screen chrome.
  if (pathname?.startsWith('/kitchen')) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <Link href="/" className="font-bold text-lg text-primary shrink-0">
          🍽 RMS
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.firstName} ({user.role})
            </span>
          )}
          <button
            onClick={() => logout()}
            className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
