# @rn-dev-tools/react-native-env-manager

Dynamic environment variable management for React Native applications.

## Features

- 🔄 Hot-reload environment variables without rebuilding
- 🎯 Type-safe environment variable access
- 📱 Works with Expo and React Native
- 🔍 Automatic type detection for values
- 💾 Persistent storage support
- 🚀 Zero configuration required
- 📝 Full TypeScript support

## Installation

```bash
npm install @rn-dev-tools/react-native-env-manager
# or
yarn add @rn-dev-tools/react-native-env-manager
```

## Usage

### Basic Setup

```typescript
import { useDynamicEnv } from '@rn-dev-tools/react-native-env-manager';

function App() {
  const env = useDynamicEnv();

  // Access environment variables
  const apiUrl = env.get('API_URL');
  const debugMode = env.get('DEBUG_MODE');

  // Update environment variables at runtime
  const handleUpdateEnv = () => {
    env.set('API_URL', 'https://new-api.example.com');
  };

  return (
    <View>
      <Text>API URL: {apiUrl}</Text>
      <Text>Debug Mode: {debugMode ? 'ON' : 'OFF'}</Text>
      <Button title="Update API URL" onPress={handleUpdateEnv} />
    </View>
  );
}
```

### Type Detection

The library automatically detects and converts environment variable types:

```typescript
import { detectEnvType, parseEnvValue } from '@rn-dev-tools/react-native-env-manager';

// Detect type from value
const type = detectEnvType('true'); // returns 'boolean'
const type2 = detectEnvType('123'); // returns 'number'
const type3 = detectEnvType('hello'); // returns 'string'

// Parse value with type conversion
const value = parseEnvValue('true', 'boolean'); // returns true (boolean)
const value2 = parseEnvValue('123', 'number'); // returns 123 (number)
```

### Storage Integration

```typescript
import { 
  saveEnvToStorage,
  loadEnvFromStorage,
  clearEnvStorage 
} from '@rn-dev-tools/react-native-env-manager';

// Save current environment to persistent storage
await saveEnvToStorage({
  API_URL: 'https://api.example.com',
  DEBUG_MODE: 'true'
});

// Load environment from storage
const env = await loadEnvFromStorage();

// Clear stored environment
await clearEnvStorage();
```

### Utilities

```typescript
import { 
  validateEnvValue,
  formatEnvDisplay,
  getEnvType 
} from '@rn-dev-tools/react-native-env-manager';

// Validate environment value
const isValid = validateEnvValue('https://api.com', 'url');

// Format for display
const display = formatEnvDisplay('SECRET_KEY', 'abc123def');
// Returns: 'SECRET_KEY: abc***def'

// Get type information
const typeInfo = getEnvType('PORT');
// Returns: { type: 'number', required: true, default: 3000 }
```

## API Reference

### Hooks

#### `useDynamicEnv()`

Returns an object with methods to manage environment variables:

- `get(key: string): any` - Get environment variable value
- `set(key: string, value: any): void` - Set environment variable
- `remove(key: string): void` - Remove environment variable
- `getAll(): Record<string, any>` - Get all environment variables
- `reset(): void` - Reset to default environment

### Type Detection

- `detectEnvType(value: string): EnvType` - Detect type from string value
- `parseEnvValue(value: string, type: EnvType): any` - Parse value with type conversion

### Storage Functions

- `saveEnvToStorage(env: Record<string, any>): Promise<void>` - Save to persistent storage
- `loadEnvFromStorage(): Promise<Record<string, any>>` - Load from storage
- `clearEnvStorage(): Promise<void>` - Clear storage

### Utilities

- `validateEnvValue(value: any, type: EnvType): boolean` - Validate value against type
- `formatEnvDisplay(key: string, value: any): string` - Format for display
- `getEnvType(key: string): TypeInfo` - Get type information for key

## Types

```typescript
type EnvType = 'string' | 'number' | 'boolean' | 'json' | 'url' | 'array';

interface EnvVariable {
  key: string;
  value: any;
  type: EnvType;
  description?: string;
  required?: boolean;
  default?: any;
}

interface EnvConfig {
  variables: EnvVariable[];
  persistent?: boolean;
  validation?: boolean;
}
```

## Configuration

### Type-Safe Environment Schema

Define your environment schema for type safety:

```typescript
interface AppEnv {
  API_URL: string;
  API_KEY: string;
  DEBUG_MODE: boolean;
  MAX_RETRIES: number;
  FEATURES: string[];
}

const env = useDynamicEnv<AppEnv>();
const apiUrl = env.get('API_URL'); // Type-safe access
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

## Best Practices

1. **Never commit sensitive values** - Use `.env.local` for secrets
2. **Validate environment variables** - Always validate before use
3. **Provide defaults** - Have sensible defaults for all variables
4. **Document variables** - Add descriptions for each variable
5. **Use type safety** - Define TypeScript interfaces for your env schema

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please [create an issue](https://github.com/aj/react-native-env-manager/issues).