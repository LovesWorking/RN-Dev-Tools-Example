---
id: sentry-integration
title: Sentry Events Viewer
---

Monitor and debug Sentry error tracking events directly within your React Native application, providing instant visibility into errors, warnings, and custom events.

> **Temporarily Disabled**: The Sentry integration is currently disabled due to import issues. This feature will be re-enabled in an upcoming release.

## Overview

Sentry Events Viewer captures and displays all events sent to Sentry, allowing you to debug error tracking, view stack traces, and monitor application health without leaving your app.

## Planned Features

### Event Types

The Sentry viewer will capture:

#### Error Events

Application errors and exceptions:

[//]: # 'ErrorEvents'
```tsx
Sentry.captureException(new Error('Something went wrong'))

// Displays in viewer:
// Type: Error
// Message: Something went wrong
// Stack trace: ...
// Timestamp: 10:30:45
```
[//]: # 'ErrorEvents'

#### Message Events

Custom log messages:

[//]: # 'MessageEvents'
```tsx
Sentry.captureMessage('User completed onboarding', 'info')

// Shows as:
// Type: Message
// Level: Info
// Message: User completed onboarding
```
[//]: # 'MessageEvents'

#### Breadcrumbs

Navigation and action trail:

[//]: # 'Breadcrumbs'
```tsx
Sentry.addBreadcrumb({
  message: 'User clicked submit',
  category: 'ui.click',
  level: 'info'
})

// Breadcrumb trail visible in event details
```
[//]: # 'Breadcrumbs'

### Event Details View

Each Sentry event will display:

- **Event ID** - Unique Sentry identifier
- **Level** - Fatal, error, warning, info, debug
- **Message** - Error message or description
- **Stack trace** - Full call stack
- **User context** - User ID, email, etc.
- **Tags** - Custom tags and metadata
- **Breadcrumbs** - Action trail
- **Device info** - OS, version, model
- **App context** - Version, build number

### Event Filtering

Filter events by:

- **Level** - Error, warning, info
- **Time range** - Last hour, day, week
- **User** - Specific user events
- **Tags** - Custom tag filters
- **Search** - Text search in messages

## Integration Setup

### Installing Sentry

First, install Sentry for React Native:

```bash
npm i @sentry/react-native
```

### Configuration

Initialize Sentry in your app:

[//]: # 'SentryInit'
```tsx
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__,
  environment: process.env.EXPO_PUBLIC_APP_ENV,
  integrations: [
    new Sentry.ReactNativeTracing()
  ],
  tracesSampleRate: 1.0
})
```
[//]: # 'SentryInit'

### Enabling in Dev Tools

Once re-enabled, access via:

[//]: # 'EnablingDevTools'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideSentryButton={false} // Currently must be true
/>
```
[//]: # 'EnablingDevTools'

## Planned Interface

### Event List

The main view will show:
- Recent events in chronological order
- Color-coded by severity
- Event count badge
- Real-time updates

### Event Statistics

Dashboard showing:
- **Total events** - Count in current session
- **Error rate** - Errors per minute
- **Most common** - Frequent error types
- **Affected users** - Unique user count

### Event Actions

For each event:
- **View details** - Full event information
- **Copy ID** - For Sentry dashboard lookup
- **Mark resolved** - Clear from local view
- **Share** - Export event details

## Use Cases

### Error Debugging

Debug production-like errors locally:

[//]: # 'ErrorDebugging'
```tsx
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error)
  // See immediately in dev tools
}
```
[//]: # 'ErrorDebugging'

### Performance Monitoring

Track performance issues:

[//]: # 'PerformanceMonitoring'
```tsx
const transaction = Sentry.startTransaction({
  name: 'api-call',
  op: 'http.request'
})

// ... perform operation

transaction.finish()
// Transaction appears in viewer
```
[//]: # 'PerformanceMonitoring'

### User Feedback

Correlate user reports with errors:

[//]: # 'UserFeedback'
```tsx
Sentry.setUser({
  id: user.id,
  email: user.email
})

// All subsequent events tagged with user
```
[//]: # 'UserFeedback'

## Custom Event Tracking

### Adding Context

Enhance events with context:

[//]: # 'AddingContext'
```tsx
Sentry.setContext('order', {
  orderId: '12345',
  amount: 99.99,
  items: 3
})

// Context appears in all events
```
[//]: # 'AddingContext'

### Custom Tags

Tag events for filtering:

[//]: # 'CustomTags'
```tsx
Sentry.setTag('feature', 'checkout')
Sentry.setTag('experiment', 'new-flow')

// Filter by tags in viewer
```
[//]: # 'CustomTags'

### Breadcrumbs

Add navigation trail:

[//]: # 'BreadcrumbsTracking'
```tsx
// Automatic breadcrumbs
Sentry.addBreadcrumb({
  type: 'navigation',
  category: 'navigation',
  data: {
    from: 'Home',
    to: 'Profile'
  }
})
```
[//]: # 'BreadcrumbsTracking'

## Development Workflow

### Testing Error Handling

Use dev tools to verify error tracking:

1. Trigger an error in your app
2. Check Sentry viewer for the event
3. Verify all context is captured
4. Test error boundaries
5. Validate user feedback flow

### Monitoring During Development

Keep Sentry viewer open to:
- Catch unexpected errors early
- Monitor performance issues
- Track user actions
- Verify error handling

## Configuration Options

### Severity Levels

Configure which events to capture:

[//]: # 'SeverityLevels'
```tsx
Sentry.init({
  // Only capture warnings and above
  beforeSend(event) {
    if (event.level === 'info' || event.level === 'debug') {
      return null // Don't send
    }
    return event
  }
})
```
[//]: # 'SeverityLevels'

### Sampling

Control event volume:

[//]: # 'Sampling'
```tsx
Sentry.init({
  // Send 50% of events
  sampleRate: 0.5,
  // Send 10% of transactions
  tracesSampleRate: 0.1
})
```
[//]: # 'Sampling'

## Best Practices

### Error Boundaries

Implement React error boundaries:

[//]: # 'ErrorBoundaries'
```tsx
import { ErrorBoundary } from '@sentry/react-native'

<ErrorBoundary fallback={ErrorFallback} showDialog>
  <YourApp />
</ErrorBoundary>
```
[//]: # 'ErrorBoundaries'

### Sensitive Data

Scrub sensitive information:

[//]: # 'SensitiveData'
```tsx
Sentry.init({
  beforeSend(event) {
    // Remove sensitive data
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers['authorization']
    }
    return event
  }
})
```
[//]: # 'SensitiveData'

### Performance Impact

Minimize overhead:

[//]: # 'PerformanceImpact'
```tsx
// Use sampling in production
const sampleRate = __DEV__ ? 1.0 : 0.1

// Disable in performance-critical paths
Sentry.withScope(scope => {
  scope.setLevel('debug')
  // Won't be sent if filtering debug
})
```
[//]: # 'PerformanceImpact'

## Common Issues

### Events Not Appearing

When events don't show:
1. Verify Sentry DSN is configured
2. Check network connectivity
3. Ensure debug mode is enabled
4. Look for beforeSend filters

### Missing Context

If context is incomplete:
1. Set user context early
2. Add breadcrumbs throughout flow
3. Use scope for temporary context
4. Verify tag names are valid

## Current Status

### Why It's Disabled

The Sentry integration is temporarily disabled due to:
- Import resolution issues with the modal component
- Compatibility concerns with certain React Native versions
- Performance optimizations in progress

### Workaround

Until re-enabled, use Sentry's web dashboard:
1. Log into sentry.io
2. Select your project
3. View real-time events
4. Use issue search and filters

### Expected Timeline

The Sentry viewer is expected to be re-enabled:
- Next minor release (for basic functionality)
- Following release (for full features)

## Future Enhancements

### Planned Features

- **Issue grouping** - Similar errors grouped
- **Trends** - Error rate over time
- **Assignments** - Assign issues to team
- **Releases** - Track errors by version
- **Source maps** - Better stack traces

### Integration Improvements

- Direct link to Sentry dashboard
- Two-way sync with Sentry API
- Team collaboration features
- Custom alert rules

## Alternative Error Tracking

While Sentry is disabled, consider:

### Console Logging

Enhanced console output:

[//]: # 'ConsoleLogging'
```tsx
if (__DEV__) {
  console.error('Error:', error)
  console.log('Context:', { user, action })
}
```
[//]: # 'ConsoleLogging'

### Custom Error Handler

Temporary error tracking:

[//]: # 'CustomErrorHandler'
```tsx
const errorHandler = (error, isFatal) => {
  // Log to your service
  console.error('App Error:', error)
  
  // Store locally
  AsyncStorage.setItem('last_error', JSON.stringify({
    error: error.message,
    stack: error.stack,
    timestamp: Date.now()
  }))
}

ErrorUtils.setGlobalHandler(errorHandler)
```
[//]: # 'CustomErrorHandler'

## Next Steps

- [React Query Tools](./react-query-tools.md) - Debug API state
- [Network Monitoring](./network-monitoring.md) - Track requests
- [Storage Monitoring](./storage-monitoring.md) - Inspect local data