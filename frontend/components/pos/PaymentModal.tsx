'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/utils/money';
import { useOrderStore } from '@/stores/orderStore';
import type { PaymentMethod } from '@/types/orders';

const PAYMENT_METHODS: { method: PaymentMethod; label: string; icon: string }[] = [
  { method: 'cash', label: 'Cash', icon: '💵' },
  { method: 'credit', label: 'Credit', icon: '💳' },
  { method: 'debit', label: 'Debit', icon: '🏦' },
  { method: 'mobile_pay', label: 'Mobile Pay', icon: '📱' },
  { method: 'gift_card', label: 'Gift Card', icon: '🎁' },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cartTotal, createOrder } = useOrderStore();

  if (!isOpen) return null;

  const total = cartTotal();

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      await createOrder(selectedMethod);
      onSuccess();
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
        <h2 className="text-2xl font-bold mb-1">Take Payment</h2>
        <p className="text-muted-foreground mb-6 text-sm">Total due: <span className="font-bold text-foreground text-lg">{formatMoney(total)}</span></p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {PAYMENT_METHODS.map(({ method, label, icon }) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                selectedMethod === method
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <span className="text-3xl mb-2">{icon}</span>
              <span className="font-semibold text-sm">{label}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm mb-4 text-center">{error}</p>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
          >
            {isProcessing ? 'Processing…' : `Charge ${formatMoney(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
