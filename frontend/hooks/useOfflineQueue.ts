'use client';

import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';

export interface QueuedAction {
  id: string;
  type: 'create_order' | 'add_item' | 'payment';
  payload: unknown;
  timestamp: number;
}

/**
 * Simple offline queue using localStorage.
 * When back online, replays queued actions.
 */
export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState<QueuedAction[]>([]);

  // Load queue from storage on mount
  useEffect(() => {
    const stored = getItem<QueuedAction[]>(STORAGE_KEYS.offlineQueue) ?? [];
    setQueue(stored);
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
  }, []);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const enqueue = useCallback((action: Omit<QueuedAction, 'id' | 'timestamp'>) => {
    const newAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
    };
    setQueue((prev) => {
      const updated = [...prev, newAction];
      setItem(STORAGE_KEYS.offlineQueue, updated);
      return updated;
    });
  }, []);

  const dequeue = useCallback((id: string) => {
    setQueue((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      setItem(STORAGE_KEYS.offlineQueue, updated);
      return updated;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setItem(STORAGE_KEYS.offlineQueue, []);
  }, []);

  /**
   * Replay all queued actions with a provided executor function.
   * The executor should return a promise.
   */
  const replayQueue = useCallback(
    async (executor: (action: QueuedAction) => Promise<void>) => {
      for (const action of queue) {
        try {
          await executor(action);
          dequeue(action.id);
        } catch {
          // Stop replaying on error — will retry next time
          break;
        }
      }
    },
    [queue, dequeue],
  );

  return { isOnline, queue, enqueue, dequeue, clearQueue, replayQueue };
}
