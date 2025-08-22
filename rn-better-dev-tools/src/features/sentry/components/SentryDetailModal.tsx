import { View, StyleSheet } from "react-native";
import { ConsoleTransportEntry } from "@/rn-better-dev-tools/src/shared/logger/types";
import { SentryEventDetailView } from "./SentryEventDetailView";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface SentryDetailModalProps {
  visible: boolean;
  entry: ConsoleTransportEntry | null;
  onBack: () => void;
}

/**
 * Stable modal wrapper for Sentry event detail view.
 * Returns null when not visible to maintain stable component tree.
 */
export function SentryDetailModal({ visible, entry, onBack }: SentryDetailModalProps) {
  if (!visible || !entry) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SentryEventDetailView entry={entry} _onBack={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: gameUIColors.background,
  },
});