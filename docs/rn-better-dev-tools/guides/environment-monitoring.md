---
id: environment-monitoring
title: Environment Variables Monitoring
---

Monitor, validate, and debug environment variables in your React Native application with real-time updates and validation.

## Overview

Environment Variables Monitoring helps you track configuration values, detect missing required variables, and ensure your app has the correct environment setup during development.

## Accessing Environment Variables

1. Tap any menu button (G, C, or D) on the floating bubble
2. Select **ENV VARS** from the menu
3. View all available environment variables

## Environment Variable Types

### Public Variables

Variables accessible in the client application:

[//]: # 'PublicVars'
```tsx
// .env file
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=MyApp
EXPO_PUBLIC_VERSION=1.0.0

// Accessible in your app
const apiUrl = process.env.EXPO_PUBLIC_API_URL
```
[//]: # 'PublicVars'

Public variables are indicated with:
- **Green badge** - Variable is present
- **Variable name** - Full key name
- **Value preview** - First 50 characters

### Private Variables

Server-side variables (development only):

[//]: # 'PrivateVars'
```tsx
// .env file
SECRET_KEY=super-secret-key
DATABASE_URL=postgres://localhost/myapp
NODE_ENV=development

// Not accessible in client, shown in dev tools for debugging
```
[//]: # 'PrivateVars'

> Note: Private variables are only visible in development builds

## Required Variables Validation

### Configuring Required Variables

Define which environment variables your app needs:

[//]: # 'RequiredVarsConfig'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredEnvVars={[
    { 
      key: 'EXPO_PUBLIC_API_URL', 
      description: 'Backend API endpoint'
    },
    { 
      key: 'EXPO_PUBLIC_APP_ENV', 
      description: 'Current environment (dev/staging/prod)'
    },
    {
      key: 'EXPO_PUBLIC_FEATURE_FLAG',
      description: 'Feature toggle',
      optional: true
    }
  ]}
/>
```
[//]: # 'RequiredVarsConfig'

### Validation Indicators

The ENV VARS section shows validation status:

- **✓ All Set** - All required variables present
- **⚠️ 2 Missing** - Number of missing required variables
- **Red highlight** - Missing required variable
- **Yellow highlight** - Optional variable not set

## Environment Variable Details

### Variable Card Information

Each environment variable displays:

- **Key name** - Full variable name
- **Value** - Current value (truncated for long values)
- **Type** - String, number, boolean, or undefined
- **Description** - From your configuration
- **Status** - Required, optional, or additional

### Viewing Full Values

Tap any variable card to:
- View the complete value
- Copy to clipboard
- See usage examples
- Check related variables

## Common Use Cases

### API Endpoint Configuration

Monitor different API endpoints per environment:

[//]: # 'APIEndpoints'
```tsx
// Development
EXPO_PUBLIC_API_URL=http://localhost:3000

// Staging
EXPO_PUBLIC_API_URL=https://staging-api.example.com

// Production
EXPO_PUBLIC_API_URL=https://api.example.com
```
[//]: # 'APIEndpoints'

### Feature Flags

Toggle features using environment variables:

[//]: # 'FeatureFlags'
```tsx
// In your .env
EXPO_PUBLIC_ENABLE_NEW_FEATURE=true
EXPO_PUBLIC_ENABLE_BETA_FEATURES=false

// In your app
if (process.env.EXPO_PUBLIC_ENABLE_NEW_FEATURE === 'true') {
  // Show new feature
}
```
[//]: # 'FeatureFlags'

### Version Information

Track app and API versions:

[//]: # 'VersionInfo'
```tsx
EXPO_PUBLIC_APP_VERSION=1.2.3
EXPO_PUBLIC_BUILD_NUMBER=456
EXPO_PUBLIC_API_VERSION=v2
EXPO_PUBLIC_COMMIT_SHA=abc123
```
[//]: # 'VersionInfo'

## Environment Indicators

### Visual Environment Badge

The floating bubble displays your current environment:

- **Green (DEV)** - Development environment
- **Yellow (STAGING)** - Staging environment
- **Red (PROD)** - Production environment

### Environment-Specific Configuration

Load different configurations per environment:

[//]: # 'EnvironmentConfig'
```tsx
const getEnvironment = () => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || 'development'
  
  return env // Displayed in dev tools
}

<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment={getEnvironment()}
/>
```
[//]: # 'EnvironmentConfig'

## Debugging Missing Variables

### Troubleshooting Steps

When variables show as missing:

1. **Check .env file** - Ensure variable is defined
2. **Verify naming** - Must start with `EXPO_PUBLIC_` for Expo
3. **Restart bundler** - Changes require restart
4. **Clear cache** - Run with `--clear` flag

### Common Issues

**Variable not showing:**

[//]: # 'TroubleshootingVars'
```bash
# Clear cache and restart
npx expo start --clear

# For React Native CLI
npx react-native start --reset-cache
```
[//]: # 'TroubleshootingVars'

**Variable shows as undefined:**

[//]: # 'UndefinedVars'
```tsx
// Check spelling and casing
EXPO_PUBLIC_API_URL ✓
EXPO_PUBLIC_api_url ✗
expo_public_API_URL ✗
```
[//]: # 'UndefinedVars'

## Advanced Features

### Dynamic Environment Detection

Automatically detect environment from variables:

[//]: # 'DynamicEnvironment'
```tsx
const detectEnvironment = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  
  if (apiUrl?.includes('localhost')) return 'development'
  if (apiUrl?.includes('staging')) return 'staging'
  if (apiUrl?.includes('api.')) return 'production'
  
  return 'development'
}

<RnBetterDevToolsBubble 
  environment={detectEnvironment()}
/>
```
[//]: # 'DynamicEnvironment'

### Variable Grouping

Variables are automatically grouped by prefix:

- **EXPO_PUBLIC_API_** - API configuration
- **EXPO_PUBLIC_FEATURE_** - Feature flags
- **EXPO_PUBLIC_AUTH_** - Authentication settings

### Default Values

Provide fallbacks for optional variables:

[//]: # 'DefaultValues'
```tsx
requiredEnvVars={[
  {
    key: 'EXPO_PUBLIC_TIMEOUT',
    description: 'Request timeout in ms',
    defaultValue: '5000',
    optional: true
  }
]}

// In your app
const timeout = process.env.EXPO_PUBLIC_TIMEOUT || '5000'
```
[//]: # 'DefaultValues'

## Best Practices

### Naming Conventions

Use consistent, descriptive names:

[//]: # 'NamingConventions'
```bash
# Good
EXPO_PUBLIC_API_BASE_URL
EXPO_PUBLIC_AUTH_DOMAIN
EXPO_PUBLIC_FEATURE_CHAT_ENABLED

# Avoid
EXPO_PUBLIC_URL
EXPO_PUBLIC_KEY
EXPO_PUBLIC_FLAG1
```
[//]: # 'NamingConventions'

### Security Considerations

Never expose sensitive data:

[//]: # 'SecurityConsiderations'
```bash
# Never use EXPO_PUBLIC_ for secrets
EXPO_PUBLIC_API_KEY=secret123 ✗

# Use server-side only
API_SECRET=secret123 ✓
DATABASE_PASSWORD=pass123 ✓
```
[//]: # 'SecurityConsiderations'

### Documentation

Document all environment variables:

[//]: # 'Documentation'
```tsx
requiredEnvVars={[
  {
    key: 'EXPO_PUBLIC_API_URL',
    description: 'Main API endpoint. Use localhost:3000 for local development'
  },
  {
    key: 'EXPO_PUBLIC_SENTRY_DSN',
    description: 'Sentry error tracking. Optional in development',
    optional: true
  }
]}
```
[//]: # 'Documentation'

## Platform-Specific Notes

### Expo

Variables must be prefixed with `EXPO_PUBLIC_`:

```bash
EXPO_PUBLIC_VAR=value ✓
MY_VAR=value ✗
```

### React Native CLI

Use react-native-config for environment variables:

```bash
npm i react-native-config
```

### Web

Standard process.env works:

```tsx
const apiUrl = process.env.REACT_APP_API_URL
```

## Next Steps

- [Storage Monitoring](./storage-monitoring.md) - Inspect device storage
- [React Query Tools](./react-query-tools.md) - Debug server state
- [Network Monitoring](./network-monitoring.md) - Track API calls