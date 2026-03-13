import type { Metadata } from 'next';
import '../../styles/globals.css';

export const metadata: Metadata = {
  title: 'Kitchen Display System — RMS',
  description: 'Real-time kitchen display for restaurant management',
};

/**
 * The KDS layout intentionally omits the global TopNav so the kitchen display
 * has a full-screen, distraction-free interface.
 */
export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {children}
    </div>
  );
}
