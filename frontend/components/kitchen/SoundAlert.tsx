'use client';

import { memo, useEffect, useRef } from 'react';

type AlertType = 'new_order' | 'overdue' | 'rush';

interface SoundAlertProps {
  enabled: boolean;
  /** Trigger a sound by incrementing this counter. */
  trigger: number;
  type: AlertType;
}

/** Frequencies and pattern for each alert type. */
const ALERT_CONFIG: Record<AlertType, { freqs: number[]; duration: number }> = {
  new_order: { freqs: [880, 1100], duration: 0.15 },
  overdue:   { freqs: [440, 330, 440], duration: 0.2 },
  rush:      { freqs: [1200, 1400, 1200, 1400], duration: 0.1 },
};

function playBeepSequence(
  ctx: AudioContext,
  freqs: number[],
  duration: number,
): void {
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = freq;

    const start = ctx.currentTime + i * (duration + 0.05);
    osc.start(start);
    osc.stop(start + duration);

    gain.gain.setValueAtTime(0.4, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  });
}

/**
 * Invisible component that plays Web Audio API beep sequences.
 * Mount once per alert type. Increment `trigger` to play a sound.
 */
export const SoundAlert = memo(function SoundAlert({
  enabled,
  trigger,
  type,
}: SoundAlertProps) {
  const prevTrigger = useRef(trigger);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) {
      prevTrigger.current = trigger;
      return;
    }
    if (trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;

    try {
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      const { freqs, duration } = ALERT_CONFIG[type];
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => playBeepSequence(ctx, freqs, duration));
      } else {
        playBeepSequence(ctx, freqs, duration);
      }
    } catch {
      // AudioContext not available (SSR or restricted env) — silently skip.
    }
  }, [enabled, trigger, type]);

  return null;
});
