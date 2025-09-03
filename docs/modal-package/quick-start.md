---
id: quick-start
title: Quick Start
---

# Quick Start

Get up and running with React Native Pure Modal in under 5 minutes.

## Installation

React Native Pure Modal requires **zero native dependencies**. Just install and use:

```bash
npm install @yourscope/react-native-pure-modal
```

```bash
yarn add @yourscope/react-native-pure-modal
```

```bash
pnpm add @yourscope/react-native-pure-modal
```

> **Note:** No `pod install` or linking required! Works immediately after installation.

## Basic Example

The simplest way to use React Native Pure Modal:

[//]: # "BasicExample"

```tsx
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { Modal } from "@yourscope/react-native-pure-modal";

export default function App() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Open Modal" onPress={() => setIsVisible(true)} />

      <Modal visible={isVisible} onClose={() => setIsVisible(false)}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Welcome to Pure Modal!
          </Text>
          <Text>This modal works without any native dependencies.</Text>
          <Button title="Close" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
```

[//]: # "BasicExample"

## Bottom Sheet Example

Transform your modal into a bottom sheet with snap points:

[//]: # "BottomSheetExample"

```tsx
import React, { useState } from "react";
import { Button, Text, ScrollView } from "react-native";
import { Modal } from "@yourscope/react-native-pure-modal";

export default function BottomSheetExample() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button title="Open Bottom Sheet" onPress={() => setIsVisible(true)} />

      <Modal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        mode="bottom-sheet"
        snapPoints={["25%", "50%", "90%"]}
        enablePanDownToClose
      >
        <ScrollView style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bottom Sheet</Text>
          <Text style={{ marginTop: 10 }}>
            Drag the handle to resize, or swipe down to close.
          </Text>
          {/* Add your content here */}
        </ScrollView>
      </Modal>
    </>
  );
}
```

[//]: # "BottomSheetExample"

## Using Hooks

For more control, use the `useModal` hook:

[//]: # "HookExample"

```tsx
import React from "react";
import { Button, Text, View } from "react-native";
import { useModal } from "@yourscope/react-native-pure-modal";

export default function HookExample() {
  const modal = useModal({
    mode: "bottom-sheet",
    snapPoints: ["50%", "90%"],
  });

  const handleOpenModal = () => {
    modal.present(
      <View style={{ padding: 20 }}>
        <Text>Modal Content</Text>
        <Button title="Close" onPress={modal.dismiss} />
      </View>,
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Open Modal" onPress={handleOpenModal} />

      <Text>Modal is {modal.isVisible ? "visible" : "hidden"}</Text>
      <Text>Current snap index: {modal.currentSnapIndex}</Text>
    </View>
  );
}
```

[//]: # "HookExample"

## With Provider

For global modal management, wrap your app with `ModalProvider`:

[//]: # "ProviderExample"

```tsx
import React from "react";
import { Button, Text } from "react-native";
import {
  ModalProvider,
  useModalContext,
} from "@yourscope/react-native-pure-modal";

function MyScreen() {
  const { showModal } = useModalContext();

  const handlePress = () => {
    showModal({
      content: <Text>Global Modal</Text>,
      mode: "floating",
    });
  };

  return <Button title="Show Global Modal" onPress={handlePress} />;
}

export default function App() {
  return (
    <ModalProvider>
      <MyScreen />
    </ModalProvider>
  );
}
```

[//]: # "ProviderExample"

## Theming

Customize the modal appearance with the theme prop:

[//]: # "ThemingExample"

```tsx
import React, { useState } from "react";
import { Modal } from "@yourscope/react-native-pure-modal";

const darkTheme = {
  colors: {
    background: "#1a1a1a",
    surface: "#2a2a2a",
    text: "#ffffff",
    backdrop: "rgba(0, 0, 0, 0.8)",
    handle: "#666666",
    border: "#333333",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 24,
  },
};

export default function ThemedModal() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Modal
      visible={isVisible}
      onClose={() => setIsVisible(false)}
      theme={darkTheme}
    >
      {/* Your content */}
    </Modal>
  );
}
```

[//]: # "ThemingExample"

## Platform-Specific Behavior

React Native Pure Modal automatically optimizes for each platform:

[//]: # "PlatformExample"

```tsx
import { Platform } from "react-native";
import { Modal } from "@yourscope/react-native-pure-modal";

export default function PlatformModal() {
  return (
    <Modal
      // iOS gets spring animations
      // Android gets timing animations
      animationType={Platform.select({
        ios: "spring",
        android: "timing",
      })}
      // iOS-specific props
      presentationStyle="formSheet"
      // Android-specific props
      statusBarTranslucent
      hardwareAccelerated
    >
      {/* Content */}
    </Modal>
  );
}
```

[//]: # "PlatformExample"

## Common Patterns

### Confirmation Dialog

[//]: # "ConfirmationDialog"

```tsx
function ConfirmationModal({ visible, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} onClose={onCancel} mode="standard" size="small">
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Are you sure?</Text>
        <Text style={{ marginBottom: 20 }}>This action cannot be undone.</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button title="Cancel" onPress={onCancel} />
          <Button title="Confirm" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}
```

[//]: # "ConfirmationDialog"

### Form Modal

[//]: # "FormModal"

```tsx
function FormModal({ visible, onClose, onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      mode="bottom-sheet"
      snapPoints={["70%"]}
      keyboardAvoidingEnabled
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter Details</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type here..."
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 20,
          }}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </Modal>
  );
}
```

[//]: # "FormModal"

## What's Next?

Now that you have a basic understanding, explore more features:

- [Installation Guide](./installation.md) - Detailed setup instructions
- [Modal Modes](./guides/modal-modes.md) - Standard, bottom sheet, and floating modes
- [Gestures](./guides/gestures.md) - Drag, resize, and swipe behaviors
- [Theming](./guides/theming.md) - Complete customization guide
- [API Reference](./reference/Modal.md) - All props and methods

## Need Help?

- Check our [FAQ](./faq.md)
- Join our [Discord Community](https://discord.gg/pure-modal)
- Open an [issue on GitHub](https://github.com/yourscope/react-native-pure-modal/issues)
