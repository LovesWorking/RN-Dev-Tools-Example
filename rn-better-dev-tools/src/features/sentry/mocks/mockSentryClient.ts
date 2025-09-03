/**
 * Mock Sentry Client for testing in Expo Go
 * Provides a complete mock implementation that mimics the real Sentry SDK behavior
 */

import type {
  Breadcrumb,
  SentryEvent,
  SpanJSON,
  FetchBreadcrumbHint,
} from "../types";

interface EventListener {
  event: string;
  callback: (arg: unknown) => unknown;
}

interface MockSentryClient extends Record<string, unknown> {
  on: (event: string, callback: (arg: unknown) => unknown) => void;
  off: (event: string, callback?: (arg: unknown) => unknown) => void;
  emit: (event: string, data: unknown, hint?: unknown) => void;
  _listeners: EventListener[];
  _isRunning: boolean;
  startMockEventGeneration: () => void;
  stopMockEventGeneration: () => void;
  generateMockEvent: (type: string) => void;
}

/**
 * Creates a mock Sentry client with event emitter functionality
 */
export function createMockSentryClient(): MockSentryClient {
  const listeners: EventListener[] = [];
  let isRunning = false;
  let eventInterval: ReturnType<typeof setInterval> | null = null;
  let eventCounter = 0;

  const client: MockSentryClient = {
    _listeners: listeners,
    _isRunning: isRunning,

    on: (event: string, callback: (arg: unknown) => unknown) => {
      listeners.push({ event, callback });
    },

    off: (event: string, callback?: (arg: unknown) => unknown) => {
      const index = listeners.findIndex(
        (l) => l.event === event && (!callback || l.callback === callback),
      );
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    },

    emit: (event: string, data: unknown, hint?: unknown) => {
      listeners
        .filter((l) => l.event === event)
        .forEach((l) => {
          try {
            const result = l.callback(data);
            // Handle beforeAddBreadcrumb which can return modified breadcrumb or null
            if (event === "beforeAddBreadcrumb") {
              return result;
            }
          } catch (error) {
            console.warn(`Mock Sentry: Error in ${event} listener:`, error);
          }
        });
    },

    startMockEventGeneration: () => {
      if (isRunning) return;
      isRunning = true;
      client._isRunning = true;

      // Generate initial events
      setTimeout(() => {
        client.generateMockEvent("session");
        client.generateMockEvent("breadcrumb-navigation");
      }, 100);

      // Generate periodic events
      eventInterval = setInterval(() => {
        const eventTypes = [
          "breadcrumb-http",
          "breadcrumb-navigation",
          "breadcrumb-console",
          "breadcrumb-ui",
          "span-http",
          "transaction",
          "error",
          "envelope",
        ];

        // Pick a random event type
        const randomType =
          eventTypes[Math.floor(Math.random() * eventTypes.length)];
        client.generateMockEvent(randomType);
      }, 3000);
    },

    stopMockEventGeneration: () => {
      isRunning = false;
      client._isRunning = false;
      if (eventInterval) {
        clearInterval(eventInterval);
        eventInterval = null;
      }
    },

    generateMockEvent: (type: string) => {
      eventCounter++;
      const timestamp = Date.now();
      const eventId = `mock-event-${eventCounter}`;

      switch (type) {
        case "session":
          client.emit("session", {
            status: "ok",
            started: timestamp,
            session_id: `session-${eventCounter}`,
            release: "1.0.0-mock",
            environment: "development",
          });
          break;

        case "breadcrumb-http": {
          const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
          const endpoints = [
            "/api/users",
            "/api/posts",
            "/api/auth/login",
            "/api/data",
            "/api/analytics",
            "/api/products",
          ];
          const statuses = [200, 201, 400, 401, 404, 500];

          const method = methods[Math.floor(Math.random() * methods.length)];
          const url = endpoints[Math.floor(Math.random() * endpoints.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const duration = Math.floor(Math.random() * 2000) + 100;

          const breadcrumb: Breadcrumb = {
            type: "http",
            category: Math.random() > 0.5 ? "xhr" : "fetch",
            message: `HTTP ${method} ${url}`,
            level: status >= 400 ? "error" : "info",
            timestamp: timestamp / 1000,
            data: {
              method,
              url,
              status_code: status,
              request_body_size: Math.floor(Math.random() * 1000),
              response_body_size: Math.floor(Math.random() * 10000),
            },
          };

          const hint: FetchBreadcrumbHint = {
            input: [url, { method }],
            startTimestamp: (timestamp - duration) / 1000,
            endTimestamp: timestamp / 1000,
            response: {
              status,
              headers: {
                get: (key: string) =>
                  key === "content-length" ? "1234" : null,
              },
            } as unknown,
          };

          client.emit("beforeAddBreadcrumb", breadcrumb, hint);
          break;
        }

        case "breadcrumb-navigation": {
          const routes = [
            "/home",
            "/profile",
            "/settings",
            "/messages",
            "/dashboard",
          ];
          const fromRoute = routes[Math.floor(Math.random() * routes.length)];
          const toRoute = routes[Math.floor(Math.random() * routes.length)];

          const breadcrumb: Breadcrumb = {
            type: "navigation",
            category: "navigation",
            message: `Navigated from ${fromRoute} to ${toRoute}`,
            level: "info",
            timestamp: timestamp / 1000,
            data: {
              from: fromRoute,
              to: toRoute,
            },
          };

          client.emit("beforeAddBreadcrumb", breadcrumb);
          break;
        }

        case "breadcrumb-console": {
          const messages = [
            "User clicked button",
            "Data loaded successfully",
            "Cache updated",
            "Form submitted",
            "API call completed",
          ];

          const breadcrumb: Breadcrumb = {
            type: "console",
            category: "console",
            message: messages[Math.floor(Math.random() * messages.length)],
            level: "info",
            timestamp: timestamp / 1000,
            data: {
              logger: "console.log",
            },
          };

          client.emit("beforeAddBreadcrumb", breadcrumb);
          break;
        }

        case "breadcrumb-ui": {
          const actions = ["touch", "click", "swipe", "press"];
          const targets = ["Button", "Link", "Tab", "Card", "Modal"];

          const breadcrumb: Breadcrumb = {
            type: "user",
            category:
              "ui." + actions[Math.floor(Math.random() * actions.length)],
            message: `User interacted with ${targets[Math.floor(Math.random() * targets.length)]}`,
            level: "info",
            timestamp: timestamp / 1000,
            data: {
              target: targets[Math.floor(Math.random() * targets.length)],
            },
          };

          client.emit("beforeAddBreadcrumb", breadcrumb);
          break;
        }

        case "span-http": {
          const spanId = `span-${eventCounter}`;
          const traceId = `trace-${Math.floor(eventCounter / 5)}`;
          const startTime =
            (timestamp - Math.floor(Math.random() * 3000)) / 1000;

          const methods = ["GET", "POST", "PUT", "DELETE"];
          const urls = [
            "/api/users",
            "/api/products",
            "/api/orders",
            "/api/inventory",
          ];

          const method = methods[Math.floor(Math.random() * methods.length)];
          const url = urls[Math.floor(Math.random() * urls.length)];
          const status = Math.random() > 0.2 ? 200 : 500;

          const spanStart: SpanJSON = {
            span_id: spanId,
            trace_id: traceId,
            parent_span_id: `parent-${Math.floor(eventCounter / 2)}`,
            op: "http.client",
            description: `${method} ${url}`,
            start_timestamp: startTime,
            timestamp: undefined,
            status: undefined,
            data: {
              "http.request.method": method,
              "url.full": url,
            },
          };

          client.emit("spanStart", spanStart);

          // Emit span end after a delay
          setTimeout(() => {
            const spanEnd: SpanJSON = {
              ...spanStart,
              timestamp: timestamp / 1000,
              status: status === 200 ? "ok" : "internal_error",
              data: {
                ...spanStart.data,
                "http.response.status_code": status,
                "http.response_content_length": Math.floor(
                  Math.random() * 50000,
                ),
              },
            };

            client.emit("spanEnd", spanEnd);
          }, 100);
          break;
        }

        case "transaction": {
          const transactionName = [
            "PageLoad",
            "UserCheckout",
            "DataSync",
            "FormSubmit",
            "NavigationTransition",
          ][Math.floor(Math.random() * 5)];

          const traceId = `trace-${eventCounter}`;
          const startTime = timestamp - Math.floor(Math.random() * 5000);

          // Start transaction
          client.emit("transactionStart", {
            name: transactionName,
            op: "navigation",
            traceId,
            startTimestamp: startTime / 1000,
          });

          // Finish transaction after delay
          setTimeout(() => {
            const transaction: SentryEvent = {
              transaction: transactionName,
              start_timestamp: startTime / 1000,
              timestamp: timestamp / 1000,
              contexts: {
                trace: {
                  trace_id: traceId,
                  span_id: `span-${eventCounter}`,
                  op: "navigation",
                  status: "ok",
                },
              },
              spans: Array.from(
                { length: Math.floor(Math.random() * 5) + 1 },
                (_, i) =>
                  ({
                    span_id: `span-${eventCounter}-${i}`,
                    trace_id: traceId,
                    op: "http.client",
                    description: `GET /api/resource-${i}`,
                    start_timestamp: (startTime + i * 200) / 1000,
                    timestamp: (startTime + i * 200 + 150) / 1000,
                    data: {
                      "http.request.method": "GET",
                      "url.full": `/api/resource-${i}`,
                      "http.response.status_code": 200,
                    },
                  }) as SpanJSON,
              ),
            };

            client.emit("transactionFinish", transaction);
          }, 200);
          break;
        }

        case "error": {
          const errors = [
            {
              type: "TypeError",
              message: "Cannot read property 'data' of undefined",
            },
            { type: "NetworkError", message: "Failed to fetch" },
            { type: "ReferenceError", message: "variable is not defined" },
            { type: "SyntaxError", message: "Unexpected token" },
            { type: "RangeError", message: "Maximum call stack size exceeded" },
          ];

          const error = errors[Math.floor(Math.random() * errors.length)];

          const envelope = [
            {
              event_id: eventId,
              sent_at: new Date().toISOString(),
              sdk: {
                name: "@sentry/react-native-mock",
                version: "1.0.0",
              },
            },
            [
              [
                {
                  type: "event",
                  content_type: "application/json",
                },
                {
                  level: "error",
                  message: error.message,
                  exception: {
                    values: [
                      {
                        type: error.type,
                        value: error.message,
                        stacktrace: {
                          frames: [
                            {
                              filename: "app.js",
                              function: "handleError",
                              lineno: Math.floor(Math.random() * 500),
                              colno: Math.floor(Math.random() * 100),
                            },
                          ],
                        },
                      },
                    ],
                  },
                  timestamp: timestamp / 1000,
                },
              ],
            ],
          ];

          client.emit("beforeEnvelope", envelope);
          break;
        }

        case "envelope": {
          const types = ["session", "client_report", "attachment", "profile"];
          const envelopeType = types[Math.floor(Math.random() * types.length)];

          const envelope = [
            {
              event_id: eventId,
              sent_at: new Date().toISOString(),
              sdk: {
                name: "@sentry/react-native-mock",
                version: "1.0.0",
              },
            },
            [
              [
                {
                  type: envelopeType,
                  content_type: "application/json",
                },
                {
                  message: `Mock ${envelopeType} event`,
                  timestamp: timestamp / 1000,
                  level: "info",
                },
              ],
            ],
          ];

          client.emit("beforeEnvelope", envelope);
          break;
        }
      }
    },
  };

  return client;
}

// Global mock client instance
let mockClientInstance: MockSentryClient | null = null;

/**
 * Get or create the mock Sentry client singleton
 */
export function getMockSentryClient(): MockSentryClient {
  if (!mockClientInstance) {
    mockClientInstance = createMockSentryClient();
    // Auto-start mock event generation for testing
    mockClientInstance.startMockEventGeneration();
    console.log("✅ Mock Sentry client created and event generation started");
  }
  return mockClientInstance;
}

/**
 * Mock getClient function that returns the mock client
 */
export function mockGetClient(): MockSentryClient | null {
  return getMockSentryClient();
}

/**
 * Clean up mock client (for testing)
 */
export function cleanupMockClient(): void {
  if (mockClientInstance) {
    mockClientInstance.stopMockEventGeneration();
    mockClientInstance = null;
  }
}
