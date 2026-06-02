import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerPhase = 'idle' | 'running' | 'paused' | 'done';

/**
 * A countdown that derives remaining time from an absolute end timestamp, so it
 * stays accurate across re-renders and brief backgrounding. Pause stashes the
 * remaining time; resume re-anchors the end timestamp.
 */
export function useCountdown(onComplete?: () => void) {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [remainingMs, setRemainingMs] = useState(0);
  const totalRef = useRef(0);
  const endAtRef = useRef(0);
  const remainingAtPauseRef = useRef(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const rem = Math.max(0, endAtRef.current - Date.now());
      setRemainingMs(rem);
      if (rem <= 0) {
        setPhase('done');
        completeRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [phase]);

  const start = useCallback((durationMs: number) => {
    totalRef.current = durationMs;
    endAtRef.current = Date.now() + durationMs;
    setRemainingMs(durationMs);
    setPhase('running');
  }, []);

  const pause = useCallback(() => {
    remainingAtPauseRef.current = Math.max(0, endAtRef.current - Date.now());
    setRemainingMs(remainingAtPauseRef.current);
    setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    endAtRef.current = Date.now() + remainingAtPauseRef.current;
    setPhase('running');
  }, []);

  const stop = useCallback(() => {
    setPhase('idle');
    setRemainingMs(0);
  }, []);

  const totalMs = totalRef.current;
  const elapsedMs = Math.max(0, totalMs - remainingMs);
  const remainingFraction = totalMs > 0 ? remainingMs / totalMs : 0;

  return { phase, remainingMs, totalMs, elapsedMs, remainingFraction, start, pause, resume, stop };
}
