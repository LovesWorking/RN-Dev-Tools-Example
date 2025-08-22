import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Metadata } from "@/rn-better-dev-tools/src/shared/logger/types";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface LogEntrySentryBadgeProps {
  metadata: Metadata;
}

// Memoized leaf component for badge rendering performance [[memory:4875251]]
export const LogEntrySentryBadge = React.memo<LogEntrySentryBadgeProps>(
  ({ metadata }) => {
    // Only show the sentry event type, not the redundant source
    // This fixes the "Span • span" issue by showing only "Span"
    if (!metadata.sentryEventType) {
      return null;
    }

    return (
      <View style={styles.sentryBadge} sentry-label="ignore devtools sentry badge">
        <Text style={styles.sentryBadgeText} sentry-label="ignore devtools sentry badge text">
          {String(metadata.sentryEventType)}
        </Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  sentryBadge: {
    backgroundColor: gameUIColors.optional + "26",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  sentryBadgeText: {
    color: gameUIColors.optional,
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
