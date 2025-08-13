import { HardDrive } from "lucide-react-native";
import { CyberpunkConsoleSection } from "../../../_components/floating-bubble/console/CyberpunkConsoleSection";
import { useStorageQueryCounts } from "../../react-query/hooks/useStorageQueryCounts";

interface StorageSectionProps {
  onPress: () => void;
}

/**
 * Storage section component for the dev tools console.
 * Shows storage statistics and provides access to storage browser.
 */
export function StorageSection({ onPress }: StorageSectionProps) {
  const { total, mmkv, async, secure } = useStorageQueryCounts();

  const getStorageSubtitle = () => {
    if (total === 0) {
      return "No storage entries";
    }
    
    const parts = [];
    if (mmkv > 0) parts.push(`${mmkv} MMKV`);
    if (async > 0) parts.push(`${async} Async`);
    if (secure > 0) parts.push(`${secure} Secure`);
    
    return parts.join(", ");
  };

  return (
    <CyberpunkConsoleSection
      id="storage"
      title="Storage"
      subtitle={getStorageSubtitle()}
      icon={HardDrive}
      iconColor="#00FF88"
      iconBackgroundColor="rgba(0, 255, 136, 0.1)"
      onPress={onPress}
      index={2}
    />
  );
}