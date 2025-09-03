import { useState, useCallback } from "react";

export interface FilterManagerState {
  filters: Set<string>;
  showAddInput: boolean;
  newFilter: string;
}

export interface FilterManagerActions {
  setNewFilter: (value: string) => void;
  setShowAddInput: (value: boolean) => void;
  addFilter: (filter: string) => void;
  removeFilter: (filter: string) => void;
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  hasFilter: (filter: string) => boolean;
}

export type UseFilterManagerReturn = FilterManagerState & FilterManagerActions;

/**
 * Hook for managing filter state and operations
 * @param initialFilters - Initial set of filters
 * @returns State and actions for filter management
 */
export function useFilterManager(
  initialFilters: Set<string> = new Set(),
): UseFilterManagerReturn {
  const [filters, setFilters] = useState<Set<string>>(initialFilters);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newFilter, setNewFilter] = useState("");

  const addFilter = useCallback((filter: string) => {
    const trimmedFilter = filter.trim();
    if (trimmedFilter) {
      setFilters((prev) => new Set([...prev, trimmedFilter]));
      setNewFilter("");
      setShowAddInput(false);
    }
  }, []);

  const removeFilter = useCallback((filter: string) => {
    setFilters((prev) => {
      const next = new Set(prev);
      next.delete(filter);
      return next;
    });
  }, []);

  const toggleFilter = useCallback((filter: string) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(new Set());
    setNewFilter("");
    setShowAddInput(false);
  }, []);

  const hasFilter = useCallback(
    (filter: string) => {
      return filters.has(filter);
    },
    [filters],
  );

  return {
    // State
    filters,
    showAddInput,
    newFilter,
    // Actions
    setNewFilter,
    setShowAddInput,
    addFilter,
    removeFilter,
    toggleFilter,
    clearFilters,
    hasFilter,
  };
}
