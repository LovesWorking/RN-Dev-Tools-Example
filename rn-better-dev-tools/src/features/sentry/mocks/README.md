# Sentry Mock Implementation for RN Better Dev Tools

This mock implementation allows the Sentry dev tools to work in environments where the actual `@sentry/react-native` package is not available (e.g., Expo Go).

## Features

The mock client provides:

- **Complete Event Emitter System**: Mimics Sentry's event system with `on()`, `off()`, and `emit()` methods
- **Automatic Event Generation**: Generates realistic Sentry events periodically for testing
- **All Event Types Supported**:
  - Error events
  - HTTP breadcrumbs (xhr/fetch)
  - Navigation breadcrumbs
  - Console breadcrumbs
  - UI interaction breadcrumbs
  - HTTP spans with timing data
  - Transactions with nested spans
  - Session events
  - Envelopes with various payload types

## How It Works

1. **Automatic Detection**: The system automatically detects if `@sentry/react-native` is available
2. **Fallback to Mock**: If Sentry is not installed, it seamlessly falls back to the mock client
3. **Event Generation**: The mock client generates realistic events every 3 seconds
4. **Full Compatibility**: All dev tool features work identically with both real and mock clients

## Usage

### Automatic Usage (Default)

The mock is automatically used when Sentry is not available. Just use the dev tools normally:

```tsx
import { RnBetterDevToolsBubble } from "rn-better-dev-tools";

// The Sentry button will work automatically with mock or real client
<RnBetterDevToolsBubble queryClient={queryClient} environment="development" />;
```

### Manual Configuration (Optional)

If you want to explicitly use the mock client for testing:

```tsx
import {
  configureSentryClient,
  getMockSentryClient,
} from "rn-better-dev-tools/sentry";

// Configure to use mock client
configureSentryClient(() => getMockSentryClient());
```

### Controlling Mock Events

```tsx
import { getMockSentryClient } from "rn-better-dev-tools/sentry";

const mockClient = getMockSentryClient();

// Stop automatic event generation
mockClient.stopMockEventGeneration();

// Generate specific event types manually
mockClient.generateMockEvent("error");
mockClient.generateMockEvent("breadcrumb-http");
mockClient.generateMockEvent("transaction");

// Restart automatic generation
mockClient.startMockEventGeneration();
```

## Event Types Generated

### HTTP Events

- Random endpoints: `/api/users`, `/api/posts`, `/api/auth/login`, etc.
- Various HTTP methods: GET, POST, PUT, DELETE, PATCH
- Status codes: 200, 201, 400, 401, 404, 500
- Includes timing data and request/response sizes

### Error Events

- TypeError: "Cannot read property 'data' of undefined"
- NetworkError: "Failed to fetch"
- ReferenceError: "variable is not defined"
- SyntaxError: "Unexpected token"
- RangeError: "Maximum call stack size exceeded"

### Navigation Events

- Route transitions between common app screens
- Includes from/to route information

### Transaction Events

- Complete transactions with multiple child spans
- HTTP spans nested within transactions
- Realistic timing data

## Testing

The mock client is perfect for:

- Testing in Expo Go without native modules
- Development without Sentry setup
- UI/UX testing with predictable events
- Demo environments

## Differences from Real Sentry

The mock client:

- Generates synthetic events (not from real app activity)
- Doesn't send data to any external service
- Events are stored only in memory
- Perfect for development and testing

## Troubleshooting

If the Sentry button is not working:

1. Check console for initialization messages:
   - ✅ "Sentry event listeners initialized" - Real client active
   - ℹ️ "Using mock Sentry client" - Mock client active

2. Ensure the button is enabled in settings:
   - Open the dial menu
   - Tap the center button for settings
   - Enable "Sentry" in both Dial Tools and Floating Tools

3. Check that events are being generated:
   - Open Sentry logs modal
   - Tap the flask icon to generate test events
   - Events should appear in the list

## API Reference

### MockSentryClient

```typescript
interface MockSentryClient {
  on(event: string, callback: (arg: unknown) => unknown): void;
  off(event: string, callback?: (arg: unknown) => unknown): void;
  emit(event: string, data: unknown, hint?: unknown): void;
  startMockEventGeneration(): void;
  stopMockEventGeneration(): void;
  generateMockEvent(type: string): void;
}
```

### Event Types

```typescript
type MockEventType =
  | "session"
  | "breadcrumb-http"
  | "breadcrumb-navigation"
  | "breadcrumb-console"
  | "breadcrumb-ui"
  | "span-http"
  | "transaction"
  | "error"
  | "envelope";
```
