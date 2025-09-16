# @rn-dev-tools/react-native-network-inspector

React Native network monitoring and inspection tools for development.

## Features

- 🔍 Real-time network request monitoring
- 📊 Network statistics and insights
- 🎯 Request filtering and search
- 📱 Built-in UI components for easy integration
- 🚀 Zero configuration required
- 📝 TypeScript support

## Installation

```bash
npm install @rn-dev-tools/react-native-network-inspector
# or
yarn add @rn-dev-tools/react-native-network-inspector
```

## Usage

### Basic Setup

```typescript
import { 
  startNetworkListener,
  stopNetworkListener 
} from '@rn-dev-tools/react-native-network-inspector';

// Start monitoring network requests
startNetworkListener();

// Stop monitoring when done
stopNetworkListener();
```

### Using the Network Modal Component

```typescript
import { SimpleNetworkModal } from '@rn-dev-tools/react-native-network-inspector';

function App() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button title="Show Network Inspector" onPress={() => setModalVisible(true)} />
      <SimpleNetworkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
```

### Using Hooks

```typescript
import { useNetworkEvents } from '@rn-dev-tools/react-native-network-inspector';

function NetworkMonitor() {
  const { events, stats, clearEvents } = useNetworkEvents();

  return (
    <View>
      <Text>Total Requests: {stats.totalRequests}</Text>
      <Text>Failed Requests: {stats.failedRequests}</Text>
      {/* Render network events */}
    </View>
  );
}
```

### Programmatic Access

```typescript
import { 
  networkEventStore,
  networkListener 
} from '@rn-dev-tools/react-native-network-inspector';

// Get all network events
const events = networkEventStore.getEvents();

// Clear events
networkEventStore.clearEvents();

// Add custom listener
const unsubscribe = addNetworkListener((event) => {
  console.log('Network event:', event);
});
```

## API Reference

### Core Functions

- `startNetworkListener()` - Start monitoring network requests
- `stopNetworkListener()` - Stop monitoring network requests
- `isNetworkListening()` - Check if monitoring is active
- `addNetworkListener(listener)` - Add custom event listener
- `removeAllNetworkListeners()` - Remove all listeners

### Hooks

- `useNetworkEvents()` - React hook for network events and stats

### Components

- `SimpleNetworkModal` - Pre-built modal for network inspection
- `SectionButton` - Customizable button component

### Utilities

- `formatBytes(bytes)` - Format byte sizes
- `formatDuration(ms)` - Format time durations
- `formatHttpStatus(status)` - Format HTTP status codes

## Types

```typescript
interface NetworkEvent {
  id: string;
  method: string;
  url: string;
  status?: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  startTime: number;
  endTime?: number;
  duration?: number;
  error?: string;
}

interface NetworkStats {
  totalRequests: number;
  failedRequests: number;
  averageDuration: number;
  totalDataTransferred: number;
}
```

## Development

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck

# Build the package
npm run build

# Run linting
npm run lint

# Clean build artifacts
npm run clean
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please [create an issue](https://github.com/your-org/rn-dev-tools/issues).