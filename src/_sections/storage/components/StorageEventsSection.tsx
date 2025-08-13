import { Database } from "lucide-react-native";
import { CyberpunkConsoleSection } from "../../../_components/floating-bubble/console/CyberpunkConsoleSection";

interface StorageEventsSectionProps {
  onPress: () => void;
  eventCount?: number;
}

export function StorageEventsSection({ onPress, eventCount = 0 }: StorageEventsSectionProps) {
  const subtitle = eventCount > 0 
    ? `${eventCount} events captured` 
    : 'Monitor AsyncStorage operations';

  return (
    <CyberpunkConsoleSection
      id="storage-events"
      title="Storage Events"
      subtitle={subtitle}
      icon={Database}
      iconColor="#00E5FF"
      iconBackgroundColor="rgba(0, 229, 255, 0.1)"
      onPress={onPress}
      index={3}
    />
  );
}