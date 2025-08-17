---
id: index
title: Documentation Index
---

Quick navigation guide to all RN Better Dev Tools documentation.

## 🚀 Getting Started

Essential documentation to begin using RN Better Dev Tools:

### [Overview](./overview.md)
Introduction to RN Better Dev Tools, key features, and why you should use it for React Native debugging.

### [Quick Start](./quick-start.md)
Get up and running in 5 minutes with basic setup, essential configuration, and common usage patterns.

### [Installation](./installation.md)
Complete installation guide for all platforms including React Native CLI, Expo, Web, and platform-specific setup.

### [Configuration](./configuration.md)
Comprehensive configuration options, environment setup, feature toggles, and advanced customization.

## 📚 Feature Guides

Detailed guides for each debugging tool:

### [React Query DevTools](./guides/react-query-tools.md)
**Monitor and debug React Query state**
- Query browser with filtering and search
- Live data editing and cache management
- Mutation tracking and optimization
- WiFi toggle for network simulation

### [Environment Variables Monitoring](./guides/environment-monitoring.md)
**Track and validate app configuration**
- View all environment variables
- Required variable validation
- Missing variable detection
- Environment-specific debugging

### [Storage Monitoring](./guides/storage-monitoring.md)
**Inspect and manage device storage**
- MMKV, AsyncStorage, and SecureStorage support
- CRUD operations interface
- Real-time storage updates
- Required key validation

### [Storage Events Listener](./guides/storage-events.md) *(Coming Soon)*
**Real-time storage operation tracking**
- Monitor AsyncStorage mutations
- Event history and timestamps
- Operation filtering
- Performance analysis

### [Network Monitoring](./guides/network-monitoring.md) *(In Development)*
**Track HTTP requests and responses**
- Request/response inspection
- Error tracking and analysis
- Performance metrics
- Request filtering and search

### [Sentry Events Viewer](./guides/sentry-integration.md) *(Temporarily Disabled)*
**Debug error tracking events**
- Error and warning monitoring
- Stack trace viewing
- Breadcrumb trails
- User context tracking

## 🎨 Interface Components

Documentation for UI elements:

### [Floating Bubble](./guides/floating-bubble.md)
**Main interface control**
- Draggable positioning
- Menu style options (Game UI, Claude, Dial)
- Environment and user indicators
- Section visibility controls

### [Modal Persistence](./guides/modal-persistence.md)
**State preservation across sessions**
- Automatic state restoration
- Position and size persistence
- Selection memory
- Layout preservation

## 📖 Reference

Technical documentation and API details:

### [API Reference](./reference/api.md)
**Complete component API**
- RnBetterDevToolsBubble props
- Type definitions
- Hooks and utilities
- Events and constants

## 🔧 Common Tasks

Quick guides for frequent operations:

### Debug React Query
1. Open menu → Select **REACT QUERY**
2. Browse queries and mutations
3. Edit cached data directly
4. Test offline mode with WiFi toggle
→ [Full Guide](./guides/react-query-tools.md)

### Check Environment Variables
1. Open menu → Select **ENV VARS**
2. View all variables and values
3. Check for missing required vars
4. Verify environment configuration
→ [Full Guide](./guides/environment-monitoring.md)

### Inspect Storage
1. Open menu → Select **STORAGE**
2. Browse all storage entries
3. Edit or delete values
4. Monitor storage changes
→ [Full Guide](./guides/storage-monitoring.md)

### Monitor Network Requests
1. Open menu → Select **NETWORK**
2. View request/response data
3. Filter by status or method
4. Analyze performance metrics
→ [Full Guide](./guides/network-monitoring.md)

## 🎯 Use Case Scenarios

### For API Development
- [React Query Tools](./guides/react-query-tools.md) - Debug queries and mutations
- [Network Monitoring](./guides/network-monitoring.md) - Track requests
- [WiFi Toggle](./guides/react-query-tools.md#wifi-toggle) - Test offline handling

### For Authentication Debugging
- [Storage Monitoring](./guides/storage-monitoring.md) - Check auth tokens
- [Environment Variables](./guides/environment-monitoring.md) - Verify API endpoints
- [Storage Events](./guides/storage-events.md) - Track token updates

### For Performance Optimization
- [React Query Tools](./guides/react-query-tools.md#performance-monitoring) - Query statistics
- [Network Monitoring](./guides/network-monitoring.md#performance-metrics) - Request timing
- [Storage Events](./guides/storage-events.md#performance-monitoring) - Storage bottlenecks

### For Error Debugging
- [Sentry Integration](./guides/sentry-integration.md) - Error tracking
- [Network Monitoring](./guides/network-monitoring.md#error-tracking) - Failed requests
- [Environment Variables](./guides/environment-monitoring.md#debugging-missing-variables) - Config issues

## 📦 Package Information

### Compatibility
- **React Native**: 0.64+
- **React**: 18+
- **TanStack Query**: v5+
- **TypeScript**: 4.7+

### Platform Support
- ✅ iOS
- ✅ Android
- ✅ Expo & Expo Go
- ✅ React Native Web
- ✅ Windows & macOS
- ✅ tvOS

### Related Projects
- [Desktop Companion App](https://github.com/LovesWorking/rn-better-dev-tools)
- [NPM Package](https://www.npmjs.com/package/rn-better-dev-tools)
- [Example Repository](https://github.com/LovesWorking/rn-dev-tools-example)

## 🚦 Feature Status

### ✅ Stable
- React Query DevTools
- Environment Variables Monitoring
- Storage Monitoring (MMKV, AsyncStorage, SecureStorage)
- Floating Bubble Interface
- Modal Persistence
- WiFi Toggle

### ⏳ In Development
- Network Monitoring (partial functionality)
- Storage Events Listener (component exists, not integrated)

### 🚧 Temporarily Disabled
- Sentry Events Viewer (import issues)

### 🔮 Planned
- WebSocket debugging
- GraphQL specific features
- Performance profiling
- Custom plugin system
- Cloud sync
- Team collaboration

## 💡 Tips & Best Practices

### Development Workflow
1. **Keep tools visible** - Position bubble for easy access
2. **Use persistence** - Let modals restore automatically
3. **Configure requirements** - Set required env vars and storage keys
4. **Test edge cases** - Use data editing and WiFi toggle

### Performance
- Tools auto-disable in production
- Minimal overhead in development
- Lazy loading for efficiency
- Virtualized lists for large data

### Team Usage
- Share configurations
- Standardize required variables
- Document storage keys
- Use consistent menu styles

## 🆘 Troubleshooting

### Common Issues
- [Bubble not appearing](./guides/floating-bubble.md#troubleshooting)
- [Modals not restoring](./guides/modal-persistence.md#troubleshooting)
- [Storage not showing](./guides/storage-monitoring.md#troubleshooting)
- [Environment vars missing](./guides/environment-monitoring.md#debugging-missing-variables)

### Getting Help
- [GitHub Issues](https://github.com/LovesWorking/rn-better-dev-tools/issues)
- [Configuration Guide](./configuration.md)
- [API Reference](./reference/api.md)

## 📝 Contributing

RN Better Dev Tools welcomes contributions:
- Report bugs via GitHub Issues
- Submit feature requests
- Contribute documentation
- Share usage examples

---

**Quick Links**: [Overview](./overview.md) | [Quick Start](./quick-start.md) | [API Reference](./reference/api.md) | [GitHub](https://github.com/LovesWorking/rn-better-dev-tools)