/**
 * Sentry event types used internally by the dev tools
 */

/**
 * Sentry event entry stored in memory for admin display
 */
export type SentryEventEntry = {
  id: string;
  timestamp: number;
  source: "envelope" | "span" | "transaction" | "breadcrumb" | "native";
  eventType: SentryEventType;
  level: SentryEventLevel;
  message: string;
  data: Record<string, unknown>;
  rawData: unknown;
};

/**
 * Event types for categorization
 */
export enum SentryEventType {
  Error = "Error",
  Transaction = "Transaction",
  Span = "Span",
  Session = "Session",
  UserFeedback = "User Feedback",
  Profile = "Profile",
  Replay = "Replay",
  Attachment = "Attachment",
  ClientReport = "Client Report",
  Log = "Log",
  Breadcrumb = "Breadcrumb",
  Native = "Native",
  Unknown = "Unknown",
}

/**
 * Event levels for severity
 */
export enum SentryEventLevel {
  Debug = "debug",
  Info = "info",
  Warning = "warning",
  Error = "error",
  Fatal = "fatal",
}
