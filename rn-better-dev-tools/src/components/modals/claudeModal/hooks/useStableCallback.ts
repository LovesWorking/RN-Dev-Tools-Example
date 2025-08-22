import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type Callback<T extends unknown[], R> = (...args: T) => R;

/**
 * Provides a stable callback reference that never changes.
 * The callback implementation can change, but the reference remains stable.
 * This prevents unnecessary re-renders in child components and PanResponders.
 *
 * Based on the pattern from @gorhom/bottom-sheet
 */
export function useStableCallback<T extends unknown[], R>(
  callback: Callback<T, R>
): Callback<T, R | undefined> {
  const callbackRef = useRef<Callback<T, R> | undefined>(undefined);

  // Update the ref immediately on each render
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      callbackRef.current = undefined;
    };
  }, []);

  // Return a stable callback that calls the current implementation
  return useCallback<Callback<T, R | undefined>>((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}
