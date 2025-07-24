# React Native DevTools Example

Enhanced developer tools for React Native applications, supporting React Query DevTools and device storage monitoring with a beautiful native interface.

![ios pokemon](https://github.com/user-attachments/assets/25ffb38c-2e41-4aa9-a3c7-6f74383a75fc)

https://github.com/user-attachments/assets/fce3cba3-b30a-409a-8f8f-db2bd28579be


https://github.com/user-attachments/assets/24183264-fff2-4e7d-86f7-2775362cf485


## ✨ Features

- 🔄 Real-time React Query state monitoring
- 💾 **Device storage monitoring with CRUD operations** - MMKV, AsyncStorage, and SecureStorage
- 🌐 **Environment variables monitoring** - View and track public environment variables
- 🎨 Beautiful native macOS interface
- 🚀 Automatic connection to React apps
- 📊 Query status visualization
- 🔌 Socket.IO integration for reliable communication
- ⚡️ Simple setup with NPM package
- 📱 Works with **any React-based platform**: React Native, React Web, Next.js, Expo, tvOS, VR, etc.
- 🛑 Zero-config production safety - automatically disabled in production builds

## 🚀 Quick Start

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Download and launch the [React Native DevTools](https://github.com/LovesWorking/rn-better-dev-tools) desktop app
5. The app will automatically connect and sync React Query state, storage, and environment variables

## 💾 Storage Demo

This example app demonstrates real-time storage monitoring with:

- **Mock MMKV Storage**: High-performance key-value storage simulation (using AsyncStorage for Expo Go compatibility)
- **AsyncStorage**: React Native's standard async storage
- **SecureStore**: Secure storage for sensitive data (Expo SecureStore)

### Features Demonstrated

- **Real-time monitoring**: See storage changes as they happen in DevTools
- **CRUD operations**: Create, read, update, and delete storage entries directly from the app
- **React Query integration**: Access storage data via queries like `['#storage', 'mmkv', 'keyName']`
- **Type-safe operations**: Automatic serialization/deserialization of complex data types
- **Expo Go compatibility**: Mock MMKV implementation that works with Expo Go

> **Note**: This demo uses a mock MMKV implementation for Expo Go compatibility. In a real development build or production app, you would use the actual [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) package for better performance.

## 🌐 Environment Variables Demo

The app showcases environment variable monitoring with:

- **Public variables**: `EXPO_PUBLIC_*` variables visible to the client
- **Private variables**: Server-side only variables for development
- **Real-time sync**: Environment variables are automatically synced with DevTools
- **Visual indicators**: Clear distinction between public and private variables

### Example Environment Variables

```bash
# Public variables (visible in client)
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=RN DevTools Example
EXPO_PUBLIC_DEBUG_MODE=true

# Private variables (development only)
NODE_ENV=development
SECRET_KEY=demo-secret-key-not-for-production
DATABASE_URL=sqlite://demo.db
```

## 📱 Related Projects

- **Desktop App**: [React Native DevTools](https://github.com/LovesWorking/rn-better-dev-tools)
- **NPM Package**: [react-query-external-sync](https://www.npmjs.com/package/react-query-external-sync)
- **Expo Plugin**: [tanstack-query-dev-tools-expo-plugin](https://github.com/LovesWorking/tanstack-query-dev-tools-expo-plugin)

## 🛠️ Technical Implementation

This example uses:

- **React Query v5** for state management
- **Expo Router** for navigation
- **Mock MMKV** for high-performance storage simulation (Expo Go compatible)
- **AsyncStorage** for standard React Native storage
- **Expo SecureStore** for secure data storage
- **Socket.IO** for real-time communication with DevTools

## 📄 License

MIT

---

Made with ❤️ by [LovesWorking](https://github.com/LovesWorking)



## 🚀 More

**Take a shortcut from web developer to mobile development fluency with guided learning**

Enjoyed this project? Learn to use React Native to build production-ready, native mobile apps for both iOS and Android based on your existing web development skills.

<img width="1800" height="520" alt="banner" src="https://github.com/user-attachments/assets/cdf63dea-464f-44fe-bed1-a517785bfd99" />
