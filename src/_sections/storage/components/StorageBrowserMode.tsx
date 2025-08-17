import { Query } from "@tanstack/react-query";
import { RequiredStorageKey } from "../types";
import { GameUIStorageBrowser } from "./GameUIStorageBrowser";

interface StorageBrowserModeProps {
  selectedQuery: Query | undefined;
  onQuerySelect: (query: Query | undefined) => void;
  requiredStorageKeys?: RequiredStorageKey[]; // Configuration for required keys
}

/**
 * Storage browser mode component using Game UI design system
 * Displays storage keys with game-themed visualization
 */
export function StorageBrowserMode({
  requiredStorageKeys = [],
}: StorageBrowserModeProps) {
  // Simply pass through to the new Game UI component
  return <GameUIStorageBrowser requiredStorageKeys={requiredStorageKeys} />;
}
