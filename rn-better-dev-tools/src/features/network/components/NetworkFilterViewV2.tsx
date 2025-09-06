import {
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  FileJson,
  FileText,
  Image,
  Film,
  Music,
  Filter,
} from "rn-better-dev-tools/icons";
import type { NetworkEvent } from "../types";
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";
import {
  DynamicFilterView,
  type DynamicFilterConfig,
  type FilterOption,
  type FilterSection,
} from "@/rn-better-dev-tools/src/shared/ui/components/DynamicFilterView";
import { useMemo } from "react";

interface NetworkFilter {
  status?: "all" | "success" | "error" | "pending";
  method?: string[];
  contentType?: string[];
  searchText?: string;
}

interface NetworkFilterViewV2Props {
  events: NetworkEvent[];
  filter: NetworkFilter;
  onFilterChange: (filter: NetworkFilter) => void;
  ignoredPatterns?: Set<string>;
  onTogglePattern?: (pattern: string) => void;
  onAddPattern?: (pattern: string) => void;
}

function getContentType(event: NetworkEvent): { type: string; color: string } {
  const headers = event.responseHeaders || event.requestHeaders;
  const contentType =
    headers?.["content-type"] || headers?.["Content-Type"] || "";

  if (contentType.includes("json"))
    return { type: "JSON", color: macOSColors.semantic.info };
  if (contentType.includes("xml"))
    return { type: "XML", color: macOSColors.semantic.success };
  if (contentType.includes("html"))
    return { type: "HTML", color: macOSColors.semantic.warning };
  if (contentType.includes("text"))
    return { type: "TEXT", color: macOSColors.semantic.success };
  if (contentType.includes("image"))
    return { type: "IMAGE", color: macOSColors.semantic.error };
  if (contentType.includes("video"))
    return { type: "VIDEO", color: macOSColors.semantic.error };
  if (contentType.includes("audio"))
    return { type: "AUDIO", color: macOSColors.semantic.debug };
  if (contentType.includes("form"))
    return { type: "FORM", color: macOSColors.semantic.info };
  return { type: "OTHER", color: macOSColors.text.muted };
}

export function NetworkFilterViewV2({
  events,
  filter,
  onFilterChange,
  ignoredPatterns = new Set(),
  onTogglePattern = () => {},
  onAddPattern = () => {},
}: NetworkFilterViewV2Props) {

  // Calculate counts
  const statusCounts = {
    all: events.length,
    success: events.filter((e) => e.status && e.status >= 200 && e.status < 300)
      .length,
    error: events.filter((e) => e.error || (e.status && e.status >= 400))
      .length,
    pending: events.filter((e) => !e.status && !e.error).length,
  };

  const methodCounts = events.reduce((acc, event) => {
    acc[event.method] = (acc[event.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contentTypeCounts = events.reduce((acc, event) => {
    const { type } = getContentType(event);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extract URL patterns from events (domains and paths)
  const availablePatterns = useMemo(() => {
    const patterns = new Set<string>();
    
    events.forEach((e) => {
      try {
        const url = new URL(e.url);
        // Add domain
        if (url.hostname) {
          patterns.add(url.hostname);
        }
        // Add pathname (if not just "/")
        if (url.pathname && url.pathname !== "/") {
          patterns.add(url.pathname);
        }
      } catch {
        // If URL parsing fails, try to extract path
        const match = e.url.match(/\/[^?#]*/);
        if (match && match[0] !== "/") {
          patterns.add(match[0]);
        }
      }
    });
    
    return Array.from(patterns).sort();
  }, [events]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "pending":
        return Clock;
      default:
        return Globe;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "JSON":
        return FileJson;
      case "HTML":
      case "XML":
      case "TEXT":
        return FileText;
      case "IMAGE":
        return Image;
      case "VIDEO":
        return Film;
      case "AUDIO":
        return Music;
      default:
        return Globe;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return macOSColors.semantic.success;
      case "POST":
        return macOSColors.semantic.info;
      case "PUT":
        return macOSColors.semantic.warning;
      case "DELETE":
        return macOSColors.semantic.error;
      case "PATCH":
        return macOSColors.semantic.success;
      default:
        return macOSColors.text.muted;
    }
  };

  const getContentTypeColor = (type: string) => {
    const testEvent = events.find((e) => getContentType(e).type === type);
    return testEvent ? getContentType(testEvent).color : macOSColors.text.muted;
  };

  const handleStatusFilter = (
    status: "all" | "success" | "error" | "pending"
  ) => {
    if (status === "all") {
      onFilterChange({ ...filter, status: undefined });
    } else {
      onFilterChange({ ...filter, status });
    }
  };

  const handleMethodFilter = (method: string) => {
    const currentMethods = filter.method || [];
    if (currentMethods.includes(method)) {
      const newMethods = currentMethods.filter((m) => m !== method);
      onFilterChange({
        ...filter,
        method: newMethods.length > 0 ? newMethods : undefined,
      });
    } else {
      onFilterChange({ ...filter, method: [method] });
    }
  };

  const handleContentTypeFilter = (type: string) => {
    const currentTypes = filter.contentType || [];
    if (currentTypes.includes(type)) {
      const newTypes = currentTypes.filter((t) => t !== type);
      onFilterChange({
        ...filter,
        contentType: newTypes.length > 0 ? newTypes : undefined,
      });
    } else {
      onFilterChange({ ...filter, contentType: [type] });
    }
  };

  // Build status filter options
  const statusOptions: FilterOption[] = (
    ["all", "success", "error", "pending"] as const
  ).map((status) => ({
    id: `status-${status}`,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    count: statusCounts[status],
    icon: getStatusIcon(status),
    color:
      status === "success"
        ? macOSColors.semantic.success
        : status === "error"
        ? macOSColors.semantic.error
        : status === "pending"
        ? macOSColors.semantic.warning
        : macOSColors.semantic.info,
    backgroundColor:
      status === "success"
        ? macOSColors.semantic.successBackground
        : status === "error"
        ? macOSColors.semantic.errorBackground
        : status === "pending"
        ? macOSColors.semantic.warningBackground
        : macOSColors.semantic.infoBackground,
    borderColor:
      status === "success"
        ? macOSColors.semantic.success + "33"
        : status === "error"
        ? macOSColors.semantic.error + "33"
        : status === "pending"
        ? macOSColors.semantic.warning + "33"
        : macOSColors.semantic.info + "33",
    isActive: filter.status === status || (!filter.status && status === "all"),
    value: status,
  }));

  // Build method filter options
  const methodOptions: FilterOption[] = Object.entries(methodCounts).map(
    ([method, count]) => ({
      id: `method-${method}`,
      label: method,
      count,
      color: getMethodColor(method),
      isActive: filter.method?.includes(method),
      value: method,
    })
  );

  // Build content type filter options
  const contentTypeOptions: FilterOption[] = Object.entries(
    contentTypeCounts
  ).map(([type, count]) => ({
    id: `contentType-${type}`,
    label: type,
    count,
    icon: getContentTypeIcon(type),
    color: getContentTypeColor(type),
    isActive: filter.contentType?.includes(type),
    value: type,
  }));

  const sections: FilterSection[] = [
    {
      id: "status",
      title: "STATUS",
      type: "status",
      data: statusOptions,
    },
    ...(Object.keys(methodCounts).length > 0
      ? [
          {
            id: "method",
            title: "METHOD",
            type: "method" as const,
            data: methodOptions,
          },
        ]
      : []),
    ...(Object.keys(contentTypeCounts).length > 0
      ? [
          {
            id: "contentType",
            title: "CONTENT TYPE",
            type: "contentType" as const,
            data: contentTypeOptions,
          },
        ]
      : []),
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    if (filterId.startsWith("status-")) {
      handleStatusFilter(value);
    } else if (filterId.startsWith("method-")) {
      handleMethodFilter(value);
    } else if (filterId.startsWith("contentType-")) {
      handleContentTypeFilter(value);
    }
  };

  // Build the filter configuration
  const filterConfig: DynamicFilterConfig = {
    // Pattern filters section
    addFilterSection: {
      enabled: true,
      placeholder: "Enter pattern (e.g., api.example.com or /api/v2)",
      title: "ACTIVE PATTERNS",
      icon: Filter,
    },
    availableItemsSection: {
      enabled: true,
      title: "PATTERNS FROM REQUESTS",
      emptyMessage: "No patterns available. Patterns from network requests will appear here.",
      items: availablePatterns,
    },
    // Status, Method, Content Type filters
    sections,
    onFilterChange: handleFilterChange,
    // Pattern filter callbacks
    onPatternToggle: onTogglePattern,
    onPatternAdd: onAddPattern,
    activePatterns: ignoredPatterns,
  };

  return <DynamicFilterView {...filterConfig} />;
}