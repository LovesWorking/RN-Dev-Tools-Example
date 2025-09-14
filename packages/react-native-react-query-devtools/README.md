# @rn-dev-tools/react-native-react-query-devtools

Powerful DevTools for debugging and inspecting React Query in React Native applications.

## Features

- 🔍 **Query Browser** - Browse and inspect all queries in your application
- 🎯 **Mutation Inspector** - View and trigger mutations
- ✏️ **Data Editor** - Edit query data on the fly for testing
- 📊 **Status Overview** - See query states at a glance
- 🔄 **Actions** - Invalidate, refetch, remove queries
- 💾 **Persistence** - View AsyncStorage cached queries
- 🎨 **Beautiful UI** - Native modal interface with smooth animations
- 📱 **Mobile Optimized** - Designed specifically for React Native

## Installation

```bash
npm install @rn-dev-tools/react-native-react-query-devtools
# or
yarn add @rn-dev-tools/react-native-react-query-devtools
# or
pnpm add @rn-dev-tools/react-native-react-query-devtools
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install @tanstack/react-query react-native-safe-area-context
# Optional for full features:
npm install @react-native-async-storage/async-storage react-native-svg
```

## Usage

### Basic Setup

```tsx
import { ReactQueryDevTools } from '@rn-dev-tools/react-native-react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      
      {/* Add DevTools - only in development */}
      {__DEV__ && <ReactQueryDevTools />}
    </QueryClientProvider>
  );
}
```

### With Custom Trigger

```tsx
import { ReactQueryDevTools } from '@rn-dev-tools/react-native-react-query-devtools';

function App() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  return (
    <>
      {/* Custom trigger button */}
      <TouchableOpacity onPress={() => setDevToolsOpen(true)}>
        <Text>Open DevTools</Text>
      </TouchableOpacity>

      {/* DevTools modal */}
      <ReactQueryDevTools 
        visible={devToolsOpen}
        onClose={() => setDevToolsOpen(false)}
      />
    </>
  );
}
```

### Advanced Configuration

```tsx
<ReactQueryDevTools
  visible={devToolsOpen}
  onClose={() => setDevToolsOpen(false)}

  // Start with mutations tab
  initialTab="mutations"
  onTabChange={(tab) => console.log('tab changed:', tab)}

  // Filter queries by default
  defaultFilter="user"

  // Use shared modal size between query/mutation modals
  enableSharedModalDimensions={true}

  // Custom position for floating button (uncontrolled mode)
  showFloatingButton={true}
  floatingButtonPosition={{ bottom: 100, right: 20 }}
/>
```

## API Reference

### ReactQueryDevTools Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Controls modal visibility |
| `onClose` | `() => void` | Required | Callback when modal closes |
| `initialTab` | `'queries' \| 'mutations'` | `'queries'` | Initial tab to display |
| `onTabChange` | `(tab) => void` | `-` | Callback when tab changes |
| `defaultFilter` | `string \| null` | `null` | Default filter string |
| `enableSharedModalDimensions` | `boolean` | `false` | Share modal size between views |
| `floatingButtonPosition` | `{ bottom?: number, right?: number }` | `{ bottom: 50, right: 20 }` | Position of floating trigger |
| `showFloatingButton` | `boolean` | `true` | Show floating trigger button |

### Available Hooks

```tsx
import { 
  useAllQueries,
  useAllMutations,
  useQueryStatusCounts,
  useStorageQueryCounts 
} from '@rn-dev-tools/react-native-react-query-devtools';

// Get all queries in your app
const queries = useAllQueries();

// Get all mutations
const mutations = useAllMutations();

// Get query status counts
const { active, inactive, stale, fresh } = useQueryStatusCounts();

// Get AsyncStorage query counts
const { storedQueries, totalSize } = useStorageQueryCounts();
```

## Features in Detail

### Query Browser
- View all active queries
- See query keys, status, and data
- Filter queries by key
- View detailed query information
- Perform actions (refetch, invalidate, remove, reset)

### Mutation Browser
- View all mutations
- See mutation status and variables
- Trigger mutations manually
- View mutation history

### Data Editor
- Edit query data in real-time
- JSON editor with syntax highlighting
- Validate changes before applying
- Useful for testing edge cases

### Storage Inspector
- View queries persisted to AsyncStorage
- See storage size and count
- Clear storage cache
- Useful for debugging offline scenarios

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
```

## Troubleshooting

### DevTools not showing up
- Ensure you're in development mode (`__DEV__ === true`)
- Check that React Query is properly initialized
- Verify peer dependencies are installed

### Performance issues
- Disable DevTools in production builds
- Use filtering to reduce the number of displayed queries
- Consider disabling persistence features if not needed

### Type errors
- Ensure TypeScript version is compatible (>= 4.5)
- Check that @tanstack/react-query types are installed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please [create an issue](https://github.com/your-org/rn-dev-tools/issues).
