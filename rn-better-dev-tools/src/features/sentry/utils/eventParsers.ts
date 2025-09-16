/**
 * Event parsers for extracting key information from different Sentry event types
 */

import type { ConsoleTransportEntry } from "@/rn-better-dev-tools/src/shared/logger/types";
import type { SentryEvent } from "../types";
import { formatDuration, parseUrl } from "./formatting";

/**
 * Extract formatted message based on event type
 */
export function formatEventMessage(entry: ConsoleTransportEntry): string {
  const { metadata, message } = entry;

  // HTTP Events
  if (
    metadata.category === "xhr" ||
    metadata.category === "fetch" ||
    metadata.category === "http"
  ) {
    const data = (metadata.data || {}) as Record<string, unknown>;
    const method = metadata.method || data.method || "GET";
    const url = metadata.url || data.url || "";
    const status = metadata.status_code || data.status_code || metadata.status;
    const duration = metadata.duration || data.duration;

    if (url && typeof url === 'string') {
      const urlParts = parseUrl(url);
      const path = urlParts?.pathname || url;
      const statusPart = status ? ` • ${status}` : "";
      const durationPart = typeof duration === 'number' ? ` • ${formatDuration(duration)}` : "";
      return `${method} ${path}${statusPart}${durationPart}`;
    }
  }

  // Touch Events
  const touchData = metadata.data as Record<string, unknown> | undefined;
  if (metadata.category === "touch" && touchData?.path) {
    const pathArray = Array.isArray(touchData.path) ? touchData.path : [];
    const firstPathItem = pathArray[0] as Record<string, unknown> | undefined;
    const component = firstPathItem ? 
      (typeof firstPathItem.label === 'string' ? firstPathItem.label : 
       typeof firstPathItem.name === 'string' ? firstPathItem.name : "Component") 
      : "Component";
    const route = touchData.route || metadata.route;
    return `tap ${component}${route ? ` • ${route}` : ""}`;
  }

  // Navigation Events
  if (metadata.category === "navigation") {
    const navData = (metadata.data || {}) as Record<string, unknown>;
    const from = navData.from || metadata.from;
    const to = navData.to || metadata.to;
    const duration = metadata.duration || navData.duration;

    if (from && to) {
      const durationPart = typeof duration === 'number' ? ` • ${formatDuration(duration)}` : "";
      return `${from} → ${to}${durationPart}`;
    } else if (to) {
      return `Navigate to ${to}`;
    }
  }

  // Error Events
  if (entry.level === "error" || metadata.sentryEventType === "error") {
    const errorType = metadata.errorType || metadata.name || "Error";
    const errorMessage =
      metadata.errorMessage ||
      (typeof message === "string" ? message : message?.message) ||
      "Unknown error";
    const handled = metadata.handled !== false ? "" : " [unhandled]";

    // Truncate long error messages
    const shortMessage =
      typeof errorMessage === "string" && errorMessage.length > 50
        ? errorMessage.substring(0, 47) + "..."
        : String(errorMessage);

    return `${errorType}: ${shortMessage}${handled}`;
  }

  // Transaction Events
  if (
    metadata.sentryEventType === "transaction" ||
    metadata.source === "transaction"
  ) {
    const name =
      metadata.transactionName || metadata.transaction || "Transaction";
    const duration = metadata.duration;
    const op = metadata.operation || metadata.op;

    if (op === "app.start.cold" || op === "app.start.warm") {
      const type = op.includes("cold") ? "Cold" : "Warm";
      return `${type} start${duration ? ` • ${formatDuration(Number(duration))}` : ""}`;
    }

    return `${name}${duration ? ` • ${formatDuration(Number(duration))}` : ""}`;
  }

  // Span Events
  if (metadata.sentryEventType === "span" || metadata.source === "span") {
    const op = metadata.operation || metadata.op || "span";
    const description = metadata.description || "";
    const duration = metadata.duration;

    return `${op}: ${description}${duration ? ` • ${formatDuration(Number(duration))}` : ""}`;
  }

  // Default to original message
  return typeof message === "string"
    ? message
    : message?.message || "Sentry Event";
}

/**
 * Extract touch event details
 */
export interface TouchEventDetails {
  componentPath: {
    name: string;
    label?: string;
    file?: string;
  }[];
  route?: string;
  timestamp: number;
  customizable: {
    labelName: boolean;
    ignoreNames: boolean;
    breadcrumbCategory: boolean;
  };
}

export function extractTouchEventDetails(
  entry: ConsoleTransportEntry,
): TouchEventDetails | null {
  if (entry.metadata.category !== "touch") return null;

  const data = (entry.metadata.data || {}) as Record<string, unknown>;

  return {
    componentPath: Array.isArray(data.path) ? data.path as { name: string; label?: string; file?: string }[] : [],
    route: typeof data.route === 'string' ? data.route : undefined,
    timestamp: entry.timestamp,
    customizable: {
      labelName: true,
      ignoreNames: true,
      breadcrumbCategory: true,
    },
  };
}

/**
 * Extract component file location from touch event path
 * Looks for components with file extensions like .tsx, .jsx, .js, .ts
 */
export function extractComponentFileFromPath(
  path: { name: string; label?: string; file?: string }[] | undefined,
): string | null {
  if (!path || !Array.isArray(path)) return null;

  // Look for a component with a file property that has a known extension
  const fileExtensions = [".tsx", ".jsx", ".js", ".ts"];

  for (const component of path) {
    if (component.file) {
      // Check if it has a valid file extension
      const hasValidExtension = fileExtensions.some((ext) =>
        component.file?.endsWith(ext),
      );
      if (hasValidExtension) {
        // Format as ComponentName(file-path)
        return `${component.name}(${component.file})`;
      }
    }

    // Sometimes the file might be embedded in the name itself
    // e.g., "SignInScreen(./auth/sign-in.tsx)"
    if (component.name && component.name.includes("(")) {
      const match = component.name.match(/([^(]+)\(([^)]+\.(tsx?|jsx?))\)/);
      if (match) {
        return component.name; // Already formatted correctly
      }
    }
  }

  // If no file found, return the first component with a label or just the first component
  const firstWithLabel = path.find((c) => c.label);
  if (firstWithLabel) {
    return `${firstWithLabel.name}${firstWithLabel.label ? ` (${firstWithLabel.label})` : ""}`;
  }

  return path[0]?.name || null;
}

/**
 * Extract navigation event details
 */
export interface NavigationEventDetails {
  from?: string;
  to: string;
  duration?: number;
  routeKey?: string;
  hasBeenSeen?: boolean;
  actionType?: string;
  ttid?: number; // Time to initial display
  customizable: {
    routeNames: boolean;
    ignorePatterns: boolean;
    enableTTID: boolean;
  };
}

export function extractNavigationEventDetails(
  entry: ConsoleTransportEntry,
): NavigationEventDetails | null {
  if (
    entry.metadata.category !== "navigation" &&
    entry.metadata.operation !== "navigation" &&
    entry.metadata.op !== "navigation"
  ) {
    return null;
  }

  const data = (entry.metadata.data || entry.metadata) as Record<string, unknown>;

  return {
    from: typeof data.from === 'string' ? data.from : 
      typeof data["previous_route.name"] === 'string' ? data["previous_route.name"] : undefined,
    to: typeof data.to === 'string' ? data.to : 
      typeof data["route.name"] === 'string' ? data["route.name"] :
      typeof data.routeName === 'string' ? data.routeName : "Unknown",
    duration: typeof data.duration === 'number' ? data.duration : undefined,
    routeKey: typeof data["route.key"] === 'string' ? data["route.key"] :
      typeof data.routeKey === 'string' ? data.routeKey : undefined,
    hasBeenSeen: typeof data["route.has_been_seen"] === 'boolean' ? data["route.has_been_seen"] : undefined,
    actionType: typeof data.actionType === 'string' ? data.actionType : undefined,
    ttid: typeof data.ttid === 'number' ? data.ttid : 
      typeof data.time_to_initial_display === 'number' ? data.time_to_initial_display : undefined,
    customizable: {
      routeNames: true,
      ignorePatterns: true,
      enableTTID: true,
    },
  };
}

/**
 * Extract error event details
 */
export interface ErrorEventDetails {
  type: string;
  message: string;
  stackTrace?: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  handled: boolean;
  mechanism?: string;
  isNative?: boolean;
  customizable: {
    message: boolean;
    level: boolean;
    fingerprint: boolean;
    tags: boolean;
    user: boolean;
  };
}

export function extractErrorEventDetails(
  entry: ConsoleTransportEntry,
): ErrorEventDetails | null {
  if (entry.level !== "error" && entry.metadata.sentryEventType !== "error") {
    return null;
  }

  const metadata = entry.metadata;
  const rawData = metadata._sentryRawData as SentryEvent | undefined;

  // Try to extract from exception data
  const exception = (rawData as { exception?: { values?: unknown[] } })?.exception?.values?.[0] as { type?: string; value?: string; stacktrace?: { frames?: unknown[] }; mechanism?: { type?: string; handled?: boolean } } | undefined;

  return {
    type: typeof metadata.errorType === 'string' ? metadata.errorType : 
      typeof exception?.type === 'string' ? exception.type : 
      typeof metadata.name === 'string' ? metadata.name : "Error",
    message: typeof metadata.errorMessage === 'string' ? metadata.errorMessage : 
      typeof exception?.value === 'string' ? exception.value : 
      typeof entry.message === 'string' ? entry.message : "",
    stackTrace: typeof metadata.stackTrace === 'string' ? metadata.stackTrace :
      exception?.stacktrace?.frames
        ? exception.stacktrace.frames
            .map(
              (f: unknown) => {
                const frame = f as { function?: string; filename?: string; lineno?: number; colno?: number };
                return `  at ${frame.function || "anonymous"} (${frame.filename}:${frame.lineno}:${frame.colno})`;
              }
            )
            .join("\n")
        : undefined,
    fileName: (metadata.fileName || metadata.file) as string | undefined,
    lineNumber: (metadata.lineNumber || metadata.line) as number | undefined,
    columnNumber: (metadata.columnNumber || metadata.column) as
      | number
      | undefined,
    handled:
      metadata.handled !== false && exception?.mechanism?.handled !== false,
    mechanism: exception?.mechanism?.type,
    isNative:
      metadata.platform === "native" ||
      exception?.mechanism?.type === "onerror",
    customizable: {
      message: true,
      level: true,
      fingerprint: true,
      tags: true,
      user: true,
    },
  };
}

/**
 * Extract performance/transaction details
 */
export interface PerformanceEventDetails {
  name: string;
  operation: string;
  duration?: number;
  status?: string;
  measurements?: Record<string, { value: number; unit: string }>;
  spans?: {
    op: string;
    description: string;
    duration?: number;
  }[];
  appStart?: {
    type: "cold" | "warm";
    duration: number;
    breakdown?: Record<string, number>;
  };
  customizable: {
    name: boolean;
    sampling: boolean;
    measurements: boolean;
  };
}

export function extractPerformanceEventDetails(
  entry: ConsoleTransportEntry,
): PerformanceEventDetails | null {
  const metadata = entry.metadata;

  if (
    metadata.sentryEventType !== "transaction" &&
    metadata.source !== "transaction" &&
    !metadata.transactionName
  ) {
    return null;
  }

  const rawData = metadata._sentryRawData as SentryEvent | undefined;
  const op =
    metadata.operation || metadata.op || rawData?.contexts?.trace?.op || "";

  // Check for app start
  let appStart: PerformanceEventDetails["appStart"];
  if (typeof op === "string" && op.includes("app.start")) {
    appStart = {
      type: op.includes("cold") ? "cold" : "warm",
      duration: Number(metadata.duration) || 0,
      breakdown: rawData?.measurements as Record<string, number> | undefined,
    };
  }

  return {
    name:
      ((metadata.transactionName ||
        metadata.transaction ||
        rawData?.transaction) as string) || "Transaction",
    operation: String(op),
    duration: metadata.duration as number | undefined,
    status: (metadata.status || (rawData?.contexts?.trace as { status?: unknown })?.status) as
      | string
      | undefined,
    measurements: rawData?.measurements as Record<string, { value: number; unit: string }> | undefined,
    spans: rawData?.spans?.map((span) => ({
      op: span.op || "",
      description: span.description || "",
      duration:
        span.timestamp && span.start_timestamp
          ? (span.timestamp - span.start_timestamp) * 1000
          : undefined,
    })),
    appStart,
    customizable: {
      name: true,
      sampling: true,
      measurements: false, // Auto-captured
    },
  };
}

/**
 * Extract device context information
 */
export interface DeviceContextInfo {
  app: {
    name?: string;
    version?: string;
    build?: string;
    inForeground?: boolean;
  };
  device: {
    model?: string;
    manufacturer?: string;
    os?: string;
    osVersion?: string;
    isEmulator?: boolean;
    memory?: number;
  };
  runtime: {
    name?: string;
    version?: string;
    engine?: string;
  };
  customizable: boolean; // Generally not customizable
}

export function extractDeviceContext(
  entry: ConsoleTransportEntry,
): DeviceContextInfo | null {
  const rawData = entry.metadata._sentryRawData as SentryEvent | undefined;
  if (!rawData?.contexts) return null;

  const contexts = rawData.contexts;
  const app = contexts.app as Record<string, unknown> | undefined;
  const device = contexts.device as Record<string, unknown> | undefined;
  const os = contexts.os as Record<string, unknown> | undefined;
  const runtime = contexts.runtime as Record<string, unknown> | undefined;

  return {
    app: {
      name: typeof app?.app_name === 'string' ? app.app_name : undefined,
      version: typeof app?.app_version === 'string' ? app.app_version : undefined,
      build: typeof app?.app_build === 'string' ? app.app_build : undefined,
      inForeground: typeof app?.in_foreground === 'boolean' ? app.in_foreground : undefined,
    },
    device: {
      model: typeof device?.model === 'string' ? device.model : undefined,
      manufacturer: typeof device?.manufacturer === 'string' ? device.manufacturer : undefined,
      os: typeof os?.name === 'string' ? os.name : undefined,
      osVersion: typeof os?.version === 'string' ? os.version : undefined,
      isEmulator: typeof device?.simulator === 'boolean' ? device.simulator : undefined,
      memory: typeof device?.memory_size === 'number' ? device.memory_size : undefined,
    },
    runtime: {
      name: typeof runtime?.name === 'string' ? runtime.name : undefined,
      version: typeof runtime?.version === 'string' ? runtime.version : undefined,
      engine: typeof runtime?.engine === 'string' ? runtime.engine : undefined,
    },
    customizable: false,
  };
}
