/**
 * Main entry point for the Sentry Logs feature
 * This component orchestrates all sentry-related functionality
 */

// Re-export all public APIs from this feature
export * from "./utils/sentryEventListeners";
export * from "./utils/sentryEventStore";
export * from "./utils/SentryEventAdapter";

// Re-export hooks
export { useSentryEvents, useSentryEventCounts } from "./hooks/useSentryEvents";
export { useSentrySubtitle } from "./hooks/useSentrySubtitle";

// Re-export components
export {
  SentryLogsSection,
  SentryLogsContent,
} from "./components/SentryLogsSection";
export { SentryLogsModal } from "./components/SentryLogsModal";
export { SentryEventDetailView } from "./components/SentryEventDetailView";
export { SentryFilterView } from "./components/SentryFilterView";
export { SentryLogsDetailContent } from "./components/SentryLogsDetailContent";
export { SentryEventLogEntryItem } from "./components/SentryEventLogEntryItem";

// Logger exports
export * from "./logger/index-sentry";
