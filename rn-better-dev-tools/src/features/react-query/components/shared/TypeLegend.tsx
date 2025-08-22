import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";

interface TypeLegendProps {
  types: string[];
  activeFilter: string | null;
  onFilterChange: (type: string | null) => void;
}

// Type color mapping using centralized theme colors
export const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    string: gameUIColors.dataTypes.string,
    number: gameUIColors.dataTypes.number,
    bigint: gameUIColors.optional, // Purple for bigint
    boolean: gameUIColors.dataTypes.boolean,
    null: gameUIColors.dataTypes.null,
    undefined: gameUIColors.dataTypes.undefined,
    function: gameUIColors.dataTypes.function,
    symbol: gameUIColors.critical, // Pink for symbols
    date: gameUIColors.critical, // Pink for dates
    error: gameUIColors.error, // Red for errors
    array: gameUIColors.dataTypes.array,
    object: gameUIColors.dataTypes.object,
  };
  return colors[type] || gameUIColors.secondary;
};

/**
 * TypeLegend component with filter functionality
 * Shows type badges that can be clicked to filter data by type
 *
 * Applied principles [[rule3]]:
 * - Decompose by Responsibility: Single purpose type filtering UI
 * - Extract Reusable Logic: Shared between Sentry logs and storage views
 */
export const TypeLegend: React.FC<TypeLegendProps> = ({
  types,
  activeFilter,
  onFilterChange,
}) => {
  if (types.length === 0) return null;

  const handleTypeFilter = (type: string) => {
    // Toggle filter: if already active, clear it; otherwise set it
    onFilterChange(activeFilter === type ? null : type);
  };

  return (
    <View style={styles.typeLegend}>
      {types.map((type) => {
        const color = getTypeColor(type);
        const isActive = activeFilter === type;

        return (
          <TouchableOpacity
            sentry-label="ignore devtools type legend filter"
            key={type}
            style={[
              styles.typeBadge,
              isActive && styles.typeBadgeActive,
              { borderColor: isActive ? color : gameUIColors.primary + "1A" },
            ]}
            onPress={() => handleTypeFilter(type)}
            accessibilityLabel={`Filter by ${type} values`}
          >
            <View style={[styles.typeColor, { backgroundColor: color }]} />
            <Text style={[styles.typeName, isActive && { color: color }]}>
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  typeLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: gameUIColors.primary + "05",
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.primary + "0D",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameUIColors.primary + "08",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeBadgeActive: {
    backgroundColor: gameUIColors.primary + "14",
  },
  typeColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  typeName: {
    color: gameUIColors.secondary,
    fontSize: 11,
    fontWeight: "500",
  },
});
