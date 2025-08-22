import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "@/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets";
import { CyberpunkGlitchBackground } from "@/rn-better-dev-tools/src/components/bubble/CyberpunkGlitchBackground";

interface ConsoleSectionListProps {
  children: React.ReactNode;
}

/**
 * Container component for console sections following composition principles.
 * Handles layout and scrolling while delegating section rendering to children.
 */
export function ConsoleSectionList({ children }: ConsoleSectionListProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <ScrollView
        sentry-label="ignore devtools console section list scroll"
        style={styles.sectionListContainer}
        contentContainerStyle={styles.sectionListContent}
      >
        <CyberpunkGlitchBackground />
        {children}
      </ScrollView>
      {/* Safe area for section list */}
      <View style={[styles.sectionListSafeArea, { height: insets.bottom }]} />
    </>
  );
}

const styles = StyleSheet.create({
  sectionListContainer: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },

  sectionListContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexGrow: 1,
  },

  sectionListSafeArea: {
    backgroundColor: "black",
  },
});
