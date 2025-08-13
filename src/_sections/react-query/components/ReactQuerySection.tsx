import { View } from "react-native";
import { CyberpunkConsoleSection } from "../../../_components/floating-bubble/console/CyberpunkConsoleSection";
import { TanstackLogo } from "./query-browser/svgs";

interface ReactQuerySectionProps {
  onPress: () => void;
  getRnBetterDevToolsSubtitle: () => string;
}

// Component definition moved outside render to prevent recreation on every render
const TanstackIcon = () => (
  <View style={{ width: 24, height: 24 }}>
    <TanstackLogo />
  </View>
);

/**
 * React Query section component following composition principles.
 * Encapsulates React Query specific business logic and UI.
 */
export function ReactQuerySection({
  onPress,
  getRnBetterDevToolsSubtitle,
}: ReactQuerySectionProps) {
  return (
    <CyberpunkConsoleSection
      id="rn-better-dev-tools"
      title="React Query"
      subtitle={getRnBetterDevToolsSubtitle()}
      icon={TanstackIcon as any}
      iconColor="#FF006E"
      iconBackgroundColor="rgba(255, 0, 110, 0.1)"
      onPress={onPress}
      index={1}
    />
  );
}
