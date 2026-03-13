'use client';

import React from 'react';
import { formatMoney } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '@/stores/orderStore';
import { env } from '@/config/env';

interface OrderCartProps {
  onSendToKitchen: () => void;
  onTakePayment: () => void;
  onApplyDiscount: () => void;
}

export function OrderCart({ onSendToKitchen, onTakePayment, onApplyDiscount }: OrderCartProps) {
  const { cart, removeFromCart, updateCartItemQuantity, cartSubtotal, cartTax, cartTotal, appliedDiscountAmount, clearDiscount } =
    useOrderStore();

  const subtotal = cartSubtotal();
  const tax = cartTax();
  const total = cartTotal();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-8">
        <span className="text-5xl mb-4">🛒</span>
        <p className="text-lg font-medium">Cart is empty</p>
        <p className="text-sm mt-1">Tap a menu item to add it</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map((item) => (
          <div key={item.menuItemId} className="flex items-center gap-3 bg-muted rounded-lg p-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{formatMoney(item.price)} each</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCartItemQuantity(item.menuItemId, item.quantity - 1)}
                className="w-8 h-8 rounded bg-background border flex items-center justify-center text-lg font-bold hover:bg-accent"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateCartItemQuantity(item.menuItemId, item.quantity + 1)}
                className="w-8 h-8 rounded bg-background border flex items-center justify-center text-lg font-bold hover:bg-accent"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="font-semibold text-sm w-16 text-right">{formatMoney(item.price * item.quantity)}</p>
            <button
              onClick={() => removeFromCart(item.menuItemId)}
              className="text-destructive hover:text-destructive/70 text-sm px-1"
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="border-t p-4 space-y-2 bg-background">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        {appliedDiscountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <div className="flex items-center gap-2">
              <span className="text-green-600">−{formatMoney(appliedDiscountAmount)}</span>
              <button onClick={clearDiscount} className="text-xs text-muted-foreground hover:text-destructive">✕</button>
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax ({(env.taxRate * 100).toFixed(0)}%)</span>
          <span>{formatMoney(tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onApplyDiscount}>
            Discount
          </Button>
          <Button variant="secondary" size="sm" onClick={onSendToKitchen}>
            Kitchen
          </Button>
          <Button size="sm" onClick={onTakePayment}>
            Pay
          </Button>
        </div>
      </div>
    </div>
  );
}
