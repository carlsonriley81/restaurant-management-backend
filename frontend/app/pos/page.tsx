'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItemButton } from '@/components/pos/MenuItemButton';
import { OrderCart } from '@/components/pos/OrderCart';
import { PaymentModal } from '@/components/pos/PaymentModal';
import { useMenuStore } from '@/stores/menuStore';
import { useOrderStore } from '@/stores/orderStore';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { cn } from '@/utils/cn';

const ALL_CATEGORY = 'All';

export default function PosPage() {
  const router = useRouter();
  const { items, categories, fetchItems, fetchCategories } = useMenuStore();
  const { addToCart, cart } = useOrderStore();
  const { isOnline, enqueue } = useOfflineQueue();

  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  const allCategories = useMemo(() => {
    const names = categories.map((c) => c.name);
    return [ALL_CATEGORY, ...names];
  }, [categories]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) return items;
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const handleAddToCart = useCallback(
    (item: (typeof items)[number]) => {
      if (!isOnline) {
        enqueue({ type: 'add_item', payload: item });
      }
      addToCart({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1 });
    },
    [addToCart, enqueue, isOnline],
  );

  const handleSendToKitchen = useCallback(async () => {
    if (cart.length === 0) return;
    try {
      const { useOrderStore: store } = await import('@/stores/orderStore');
      await store.getState().createOrder();
      router.push('/orders');
    } catch {
      // handled inside store
    }
  }, [cart.length, router]);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left: Category List */}
      <aside className="w-36 shrink-0 border-r overflow-y-auto bg-muted/30">
        <div className="p-2 space-y-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>

      {/* Center: Menu Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isOnline && (
          <div className="mb-3 rounded-lg bg-yellow-100 text-yellow-800 px-4 py-2 text-sm font-medium">
            ⚠️ Offline mode — actions will be queued
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredItems.map((item) => (
            <MenuItemButton key={item.id} item={item} onPress={handleAddToCart} />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No items in this category.
          </div>
        )}
      </div>

      {/* Right: Order Cart */}
      <aside className="w-80 shrink-0 border-l flex flex-col bg-background">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Order Cart</h2>
          <p className="text-xs text-muted-foreground">{cart.length} item type(s)</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <OrderCart
            onSendToKitchen={handleSendToKitchen}
            onTakePayment={() => setIsPaymentOpen(true)}
            onApplyDiscount={() => {/* TODO: discount modal */}}
          />
        </div>
      </aside>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => {
          setIsPaymentOpen(false);
          router.push('/orders');
        }}
      />
    </div>
  );
}
