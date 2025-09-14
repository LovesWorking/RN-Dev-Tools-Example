/**
 * Storage Query Utilities
 * TODO: This is a placeholder - copy the actual implementation from react-query feature
 */

export type StorageType = "mmkv" | "async" | "secure";

export function getStorageTypeLabel(type: StorageType): string {
  switch (type) {
    case "mmkv":
      return "MMKV";
    case "async":
      return "Async";
    case "secure":
      return "Secure";
    default:
      return "Unknown";
  }
}

export function getStorageTypeHexColor(type: StorageType): string {
  switch (type) {
    case "mmkv":
      return "#FF6B6B"; // Red
    case "async":
      return "#4ECDC4"; // Teal
    case "secure":
      return "#45B7D1"; // Blue
    default:
      return "#95A5A6"; // Gray
  }
}

export function getStorageTypeIcon(type: StorageType): string {
  switch (type) {
    case "mmkv":
      return "HardDrive";
    case "async":
      return "Database";
    case "secure":
      return "Shield";
    default:
      return "Archive";
  }
}
