---
id: overview
title: Overview
---

RN Better Dev Tools is a comprehensive debugging and monitoring solution for React Native applications, providing real-time insights into React Query state, storage operations, network requests, and environment variables through a beautiful native interface.

## Why RN Better Dev Tools?

React Native development often requires juggling multiple debugging tools and console logs to understand application state. **RN Better Dev Tools** consolidates these into a single, elegant floating interface that stays accessible while you develop, making debugging faster and more intuitive.

## Key Features

**React Query Integration** - Monitor queries, mutations, and cache state in real-time with full CRUD capabilities

**Storage Monitoring** - Track MMKV, AsyncStorage, and SecureStorage operations with live updates

**Environment Variables** - View and validate environment configurations with missing variable detection

**Network Inspection** - Monitor HTTP requests and responses with detailed timing and status information

**Modal Persistence** - All debugging windows remember their position, size, and state between sessions

**Production Safety** - Automatically disabled in production builds to ensure zero performance impact

## How It Works

RN Better Dev Tools integrates directly into your React Native application through a simple component wrapper. Once installed, a floating bubble appears on your screen that provides instant access to all debugging features without interrupting your development flow.

[//]: # 'BasicUsage'
```tsx
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools'
import { queryClient } from './queryClient'

export function App() {
  return (
    <>
      <RnBetterDevToolsBubble 
        queryClient={queryClient}
        environment="development"
      />
      <YourAppContent />
    </>
  )
}
```
[//]: # 'BasicUsage'

The tools operate in a non-intrusive overlay, allowing you to:
- Drag the bubble to any position on screen
- Access different debugging panels through intuitive menus
- Modify application state in real-time
- Monitor events as they happen

## Platform Support

RN Better Dev Tools works with **any React-based platform**:
- React Native (iOS & Android)
- Expo & Expo Go
- React Native Web
- React Native Windows & macOS
- React Native tvOS
- React Native VR

## Desktop Companion App

For enhanced debugging capabilities, RN Better Dev Tools includes an optional [desktop companion app](https://github.com/LovesWorking/rn-better-dev-tools) that provides:
- Larger viewing area for complex data
- Advanced filtering and search
- Export capabilities
- Multi-app monitoring

## Getting Started

Ready to enhance your debugging experience? 

- [Quick Start](./quick-start.md) - Get up and running in minutes
- [Installation](./installation.md) - Detailed setup instructions
- [Configuration](./configuration.md) - Customize the tools to your needs

## Community

RN Better Dev Tools is actively maintained and welcomes contributions:

- [GitHub Repository](https://github.com/LovesWorking/rn-better-dev-tools)
- [NPM Package](https://www.npmjs.com/package/rn-better-dev-tools)
- [Report Issues](https://github.com/LovesWorking/rn-better-dev-tools/issues)