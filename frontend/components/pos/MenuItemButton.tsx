import React, { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/money';
import type { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

export const MenuItemButton = memo(function MenuItemButton({ item, onPress }: MenuItemButtonProps) {
  return (
    <button
      onClick={() => onPress(item)}
      className={cn(
        'pos-button w-full flex flex-col items-start p-4 bg-card border border-border hover:bg-accent hover:border-primary',
        !item.active && 'opacity-40 cursor-not-allowed',
      )}
      disabled={!item.active}
      aria-label={`Add ${item.name} to cart`}
    >
      <span className="font-bold text-base leading-tight">{item.name}</span>
      {item.description && (
        <span className="text-xs text-muted-foreground mt-1 line-clamp-2 text-left">{item.description}</span>
      )}
      <span className="mt-2 text-lg font-semibold text-primary">{formatMoney(item.price)}</span>
      {item.limitedTime && (
        <span className="mt-1 text-xs bg-orange-100 text-orange-700 rounded px-1.5 py-0.5">Limited</span>
      )}
    </button>
  );
});
