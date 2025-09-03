import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import type { ReactNode } from "react";
import { X, Plus } from "rn-better-dev-tools/icons";

// Container for filter section
interface FilterSectionProps {
  children: ReactNode;
  style?: any;
}

export function FilterSection({ children, style }: FilterSectionProps) {
  return <View style={[styles.filterSection, style]}>{children}</View>;
}

// Individual filter badge
interface FilterBadgeProps {
  filter: string;
  onRemove?: () => void;
  active?: boolean;
  color?: string;
}

export function FilterBadge({
  filter,
  onRemove,
  active = true,
  color = "#E5E7EB",
}: FilterBadgeProps) {
  const backgroundColor = active ? `${color}15` : "transparent";
  const borderColor = active ? `${color}40` : `${color}20`;
  const textColor = active ? color : `${color}80`;

  return (
    <TouchableOpacity
      style={[styles.badge, { backgroundColor, borderColor }]}
      onPress={onRemove}
      disabled={!onRemove}
    >
      <Text style={[styles.badgeText, { color: textColor }]} numberOfLines={1}>
        {filter}
      </Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <X size={12} color={textColor} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// Add filter input component
interface AddFilterInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  placeholder?: string;
  color?: string;
}

export function AddFilterInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Add filter...",
  color = "#E5E7EB",
}: AddFilterInputProps) {
  return (
    <View style={[styles.inputContainer, { borderColor: `${color}40` }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={`${color}40`}
        style={[styles.input, { color }]}
        autoFocus
        returnKeyType="done"
      />
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <X size={16} color={`${color}60`} />
      </TouchableOpacity>
    </View>
  );
}

// Add filter button
interface AddFilterButtonProps {
  onPress: () => void;
  color?: string;
}

export function AddFilterButton({
  onPress,
  color = "#E5E7EB",
}: AddFilterButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.addButton, { borderColor: `${color}40` }]}
      onPress={onPress}
    >
      <Plus size={14} color={color} />
      <Text style={[styles.addButtonText, { color }]}>Add Filter</Text>
    </TouchableOpacity>
  );
}

// Filter list component
interface FilterListProps {
  filters: Set<string> | string[];
  onRemoveFilter?: (filter: string) => void;
  activeFilters?: Set<string>;
  color?: string;
}

export function FilterList({
  filters,
  onRemoveFilter,
  activeFilters,
  color = "#E5E7EB",
}: FilterListProps) {
  const filterArray = Array.from(filters);

  return (
    <View style={styles.filterList}>
      {filterArray.map((filter) => (
        <FilterBadge
          key={filter}
          filter={filter}
          onRemove={onRemoveFilter ? () => onRemoveFilter(filter) : undefined}
          active={!activeFilters || activeFilters.has(filter)}
          color={color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    padding: 16,
    backgroundColor: "#0F0F0F",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: 200,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 4,
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 150,
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  cancelButton: {
    marginLeft: 8,
    padding: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    marginRight: 8,
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
  },
  filterList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
