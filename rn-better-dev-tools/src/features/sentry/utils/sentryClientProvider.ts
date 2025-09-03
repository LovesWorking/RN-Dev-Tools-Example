/**
 * Sentry client provider that handles both real and mock clients
 * Avoids dynamic imports that cause Metro bundler issues
 */

import { createMockSentryClient } from "../mocks/mockSentryClient";

interface SentryClient extends Record<string, unknown> {
  on?: (event: string, callback: (arg: unknown) => unknown) => void;
}

let realSentryGetClient: (() => SentryClient | null) | null = null;
let mockClientInstance: SentryClient | null = null;
let userProvidedGetClient: (() => SentryClient | null) | null = null;

// Try to load real Sentry SDK if available
try {
  // This will be resolved at build time by Metro
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sentry = require("@sentry/react-native");
  if (sentry && sentry.getClient) {
    realSentryGetClient = sentry.getClient;
    console.log("✅ Real Sentry SDK detected");
  }
} catch {
  // Sentry not available, will use mock
  console.log("ℹ️ @sentry/react-native not available, will use mock client");
}

/**
 * Configure a custom client provider
 */
export function configureSentryClient(
  getClientFn: () => SentryClient | null
): void {
  userProvidedGetClient = getClientFn;
}

/**
 * Get the appropriate Sentry client (real, mock, or user-provided)
 */
export function getSentryClient(): SentryClient | null {
  // Priority: user-provided > real > mock
  if (userProvidedGetClient) {
    return userProvidedGetClient();
  }

  if (realSentryGetClient) {
    const client = realSentryGetClient();
    if (client) {
      return client;
    }
  }

  // Fall back to mock client
  if (!mockClientInstance) {
    console.log("📦 Creating mock Sentry client for dev tools");
    mockClientInstance = createMockSentryClient();
    // Auto-start event generation for testing
    (mockClientInstance as any).startMockEventGeneration?.();
  }

  return mockClientInstance;
}

/**
 * Check if using mock client
 */
export function isUsingMockClient(): boolean {
  return !realSentryGetClient && !userProvidedGetClient;
}
