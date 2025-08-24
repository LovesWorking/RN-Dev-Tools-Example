import { useEffect, useState, useRef } from "react";

/**
 * Generic interval hook for periodic updates
 * @param callback - Function to call on each interval
 * @param delay - Delay in milliseconds (null to disable)
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const interval = setInterval(tick, delay);

    return () => clearInterval(interval);
  }, [delay]);
}

/**
 * Hook that forces a re-render at specified intervals
 * @param intervalMs - Interval in milliseconds
 * @param enabled - Whether the ticker is enabled
 * @returns Current tick count
 */
export function useTicker(intervalMs: number = 1000, enabled: boolean = true) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, enabled]);

  return tick;
}

/**
 * Hook that forces a re-render every second
 * Commonly used for updating relative timestamps
 */
export function useTickEverySecond(enabled: boolean = true) {
  useTicker(1000, enabled);
}

/**
 * Hook that forces a re-render every minute
 * Useful for less frequent timestamp updates
 */
export function useTickEveryMinute(enabled: boolean = true) {
  useTicker(60000, enabled);
}
