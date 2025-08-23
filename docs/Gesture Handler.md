# Complete React Native Gesture Handler to Pure React Native Migration Guide

## 📚 Quick Navigation

Jump directly to the API you want to migrate:

### Core Gesture Handlers
- [PanGestureHandler → PanResponder](#1-pangesturehandler--panresponder)
- [TapGestureHandler → TouchableOpacity/Pressable](#2-tapgesturehandler--touchableopacitypressable)
- [LongPressGestureHandler → Pressable with onLongPress](#3-longpressgesturehandler--pressable-with-onlongpress)
- [PinchGestureHandler → Custom PanResponder](#4-pinchgesturehandler--custom-panresponder)
- [RotationGestureHandler → Custom PanResponder](#5-rotationgesturehandler--custom-panresponder)
- [FlingGestureHandler → PanResponder with velocity](#6-flinggesturehandler--panresponder-with-velocity)
- [ForceTouchGestureHandler → Pressable (iOS)](#7-forcetouchgesturehandler--pressable-ios)
- [NativeViewGestureHandler → View with responder](#8-nativeviewgesturehandler--view-with-responder)

### Gesture Detector API (New API)
- [Gesture.Tap() → TouchableOpacity](#9-gesturetap--touchableopacity)
- [Gesture.Pan() → PanResponder](#10-gesturepan--panresponder)
- [Gesture.Pinch() → Multi-touch PanResponder](#11-gesturepinch--multi-touch-panresponder)
- [Gesture.Rotation() → Multi-touch PanResponder](#12-gesturerotation--multi-touch-panresponder)
- [Gesture.Fling() → PanResponder with velocity](#13-gesturefling--panresponder-with-velocity)
- [Gesture.LongPress() → Pressable](#14-gesturelongpress--pressable)
- [GestureDetector → View with responder](#15-gesturedetector--view-with-responder)

### Gesture States & Events
- [State enum → Custom state management](#16-state-enum--custom-state-management)
- [onGestureEvent → PanResponder callbacks](#17-ongestureevent--panresponder-callbacks)
- [onHandlerStateChange → State tracking](#18-onhandlerstatechange--state-tracking)
- [Event payloads → Gesture state](#19-event-payloads--gesture-state)

### Components
- [GestureHandlerRootView → View](#20-gesturehandlerrootview--view)
- [Swipeable → Animated with PanResponder](#21-swipeable--animated-with-panresponder)
- [DrawerLayout → Custom drawer](#22-drawerlayout--custom-drawer)
- [TouchableOpacity (RNGH) → TouchableOpacity (RN)](#23-touchableopacity-rngh--touchableopacity-rn)
- [TouchableHighlight (RNGH) → TouchableHighlight (RN)](#24-touchablehighlight-rngh--touchablehighlight-rn)
- [TouchableWithoutFeedback (RNGH) → Pressable](#25-touchablewithoutfeedback-rngh--pressable)
- [TouchableNativeFeedback (RNGH) → TouchableNativeFeedback (RN)](#26-touchablenativefeedback-rngh--touchablenativefeedback-rn)

### Button Components
- [RectButton → Pressable](#27-rectbutton--pressable)
- [BorderlessButton → Pressable](#28-borderlessbutton--pressable)
- [BaseButton → TouchableOpacity](#29-basebutton--touchableopacity)
- [RawButton → Pressable](#30-rawbutton--pressable)

### Gesture Composition
- [Simultaneous gestures → Multiple responders](#31-simultaneous-gestures--multiple-responders)
- [Exclusive gestures → Responder negotiation](#32-exclusive-gestures--responder-negotiation)
- [Race gestures → First responder wins](#33-race-gestures--first-responder-wins)

### Utility Features
- [Directions → Custom direction detection](#34-directions--custom-direction-detection)
- [simultaneousHandlers → Responder negotiation](#35-simultaneoushandlers--responder-negotiation)
- [waitFor → Delayed activation](#36-waitfor--delayed-activation)
- [enabled prop → Conditional responders](#37-enabled-prop--conditional-responders)
- [shouldCancelWhenOutside → Responder release](#38-shouldcancelwhenoutside--responder-release)

### Advanced Features
- [Manual gestures → Direct state control](#39-manual-gestures--direct-state-control)
- [Hover gestures → onMouseEnter/Leave (Web)](#40-hover-gestures--onmouseenterleave-web)

---

## Complete API Migrations

### 1. PanGestureHandler → PanResponder

#### React Native Gesture Handler
```javascript
import { PanGestureHandler, State } from 'react-native-gesture-handler';

function DraggableBox() {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );
  
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Reset position
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
    }
  };
  
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      minPointers={1}
      maxPointers={1}
      activeOffsetX={[-10, 10]}
      activeOffsetY={[-10, 10]}
    >
      <Animated.View 
        style={{
          transform: [{ translateX }, { translateY }]
        }}
      />
    </PanGestureHandler>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated } from 'react-native';

function DraggableBox() {
  const pan = useRef(new Animated.ValueXY()).current;
  const [gestureState, setGestureState] = useState('UNDETERMINED');
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Equivalent to activeOffsetX and activeOffsetY
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      
      onPanResponderGrant: () => {
        setGestureState('BEGAN');
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false } // Note: PanResponder doesn't support native driver
      ),
      
      onPanResponderRelease: () => {
        setGestureState('END');
        pan.flattenOffset();
        // Reset position
        Animated.spring(pan, { 
          toValue: { x: 0, y: 0 }, 
          useNativeDriver: false 
        }).start();
      },
      
      onPanResponderTerminate: () => {
        setGestureState('CANCELLED');
      }
    })
  ).current;
  
  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }]
      }}
    />
  );
}
```

---

### 2. TapGestureHandler → TouchableOpacity/Pressable

#### React Native Gesture Handler
```javascript
import { TapGestureHandler, State } from 'react-native-gesture-handler';

function TapBox() {
  const doubleTapRef = useRef();
  
  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log('Single tap');
    }
  };
  
  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log('Double tap');
    }
  };
  
  return (
    <TapGestureHandler
      onHandlerStateChange={onDoubleTap}
      numberOfTaps={2}
      ref={doubleTapRef}
    >
      <TapGestureHandler
        onHandlerStateChange={onSingleTap}
        waitFor={doubleTapRef}
        numberOfTaps={1}
      >
        <View style={styles.box} />
      </TapGestureHandler>
    </TapGestureHandler>
  );
}
```

#### React Native
```javascript
import { Pressable } from 'react-native';

function TapBox() {
  const lastTap = useRef(0);
  const tapTimeout = useRef(null);
  
  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      clearTimeout(tapTimeout.current);
      console.log('Double tap');
      lastTap.current = 0;
    } else {
      // Single tap - wait to see if it becomes a double tap
      lastTap.current = now;
      tapTimeout.current = setTimeout(() => {
        console.log('Single tap');
        lastTap.current = 0;
      }, DOUBLE_TAP_DELAY);
    }
  };
  
  return (
    <Pressable onPress={handlePress}>
      <View style={styles.box} />
    </Pressable>
  );
}
```

---

### 3. LongPressGestureHandler → Pressable with onLongPress

#### React Native Gesture Handler
```javascript
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

function LongPressBox() {
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log('Long press activated');
    }
  };
  
  return (
    <LongPressGestureHandler
      onHandlerStateChange={onHandlerStateChange}
      minDurationMs={800}
      maxDist={10}
    >
      <View style={styles.box} />
    </LongPressGestureHandler>
  );
}
```

#### React Native
```javascript
import { Pressable } from 'react-native';

function LongPressBox() {
  const [pressIn, setPressIn] = useState(null);
  
  return (
    <Pressable
      onLongPress={() => console.log('Long press activated')}
      delayLongPress={800}
      onPressIn={(e) => setPressIn({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY })}
      onPressMove={(e) => {
        // Equivalent to maxDist - cancel if moved too far
        if (pressIn) {
          const dist = Math.sqrt(
            Math.pow(e.nativeEvent.pageX - pressIn.x, 2) + 
            Math.pow(e.nativeEvent.pageY - pressIn.y, 2)
          );
          if (dist > 10) {
            // Can't directly cancel, but can track state
            setPressIn(null);
          }
        }
      }}
    >
      <View style={styles.box} />
    </Pressable>
  );
}
```

---

### 4. PinchGestureHandler → Custom PanResponder

#### React Native Gesture Handler
```javascript
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

function PinchableView() {
  const scale = useRef(new Animated.Value(1)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: true }
  );
  
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    }
  };
  
  return (
    <PinchGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={{ transform: [{ scale }] }} />
    </PinchGestureHandler>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated } from 'react-native';

function PinchableView() {
  const scale = useRef(new Animated.Value(1)).current;
  const baseDistance = useRef(0);
  const scaleFactor = useRef(1);
  
  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    return Math.sqrt(
      Math.pow(touch2.pageX - touch1.pageX, 2) +
      Math.pow(touch2.pageY - touch1.pageY, 2)
    );
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length >= 2) {
          baseDistance.current = getDistance(evt.nativeEvent.touches);
          scaleFactor.current = scale._value;
        }
      },
      
      onPanResponderMove: (evt) => {
        if (evt.nativeEvent.touches.length >= 2 && baseDistance.current > 0) {
          const distance = getDistance(evt.nativeEvent.touches);
          const newScale = (distance / baseDistance.current) * scaleFactor.current;
          scale.setValue(newScale);
        }
      },
      
      onPanResponderRelease: () => {
        Animated.spring(scale, { 
          toValue: 1, 
          useNativeDriver: false 
        }).start();
      }
    })
  ).current;
  
  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={{ transform: [{ scale }] }}
    />
  );
}
```

---

### 5. RotationGestureHandler → Custom PanResponder

#### React Native Gesture Handler
```javascript
import { RotationGestureHandler, State } from 'react-native-gesture-handler';

function RotatableView() {
  const rotation = useRef(new Animated.Value(0)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { rotation } }],
    { useNativeDriver: true }
  );
  
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      Animated.spring(rotation, { toValue: 0, useNativeDriver: true }).start();
    }
  };
  
  return (
    <RotationGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View 
        style={{
          transform: [{ rotate: rotation.interpolate({
            inputRange: [-Math.PI, Math.PI],
            outputRange: ['-180deg', '180deg']
          })}]
        }}
      />
    </RotationGestureHandler>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated } from 'react-native';

function RotatableView() {
  const rotation = useRef(new Animated.Value(0)).current;
  const baseAngle = useRef(0);
  const currentAngle = useRef(0);
  
  const getAngle = (touches) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    return Math.atan2(
      touch2.pageY - touch1.pageY,
      touch2.pageX - touch1.pageX
    );
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length >= 2) {
          baseAngle.current = getAngle(evt.nativeEvent.touches);
          currentAngle.current = rotation._value;
        }
      },
      
      onPanResponderMove: (evt) => {
        if (evt.nativeEvent.touches.length >= 2) {
          const angle = getAngle(evt.nativeEvent.touches);
          const deltaAngle = angle - baseAngle.current;
          rotation.setValue(currentAngle.current + deltaAngle);
        }
      },
      
      onPanResponderRelease: () => {
        Animated.spring(rotation, { 
          toValue: 0, 
          useNativeDriver: false 
        }).start();
      }
    })
  ).current;
  
  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={{
        transform: [{ rotate: rotation.interpolate({
          inputRange: [-Math.PI, Math.PI],
          outputRange: ['-180deg', '180deg']
        })}]
      }}
    />
  );
}
```

---

### 6. FlingGestureHandler → PanResponder with velocity

#### React Native Gesture Handler
```javascript
import { FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';

function FlingBox() {
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const { velocityX, velocityY } = event.nativeEvent;
      console.log('Fling detected', { velocityX, velocityY });
    }
  };
  
  return (
    <FlingGestureHandler
      direction={Directions.RIGHT | Directions.LEFT}
      onHandlerStateChange={onHandlerStateChange}
      numberOfPointers={1}
    >
      <View style={styles.box} />
    </FlingGestureHandler>
  );
}
```

#### React Native
```javascript
import { PanResponder } from 'react-native';

function FlingBox() {
  const VELOCITY_THRESHOLD = 0.3;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderRelease: (evt, gestureState) => {
        const { vx, vy } = gestureState;
        
        // Check for horizontal fling
        if (Math.abs(vx) > VELOCITY_THRESHOLD) {
          const direction = vx > 0 ? 'RIGHT' : 'LEFT';
          console.log('Fling detected', { 
            direction, 
            velocityX: vx, 
            velocityY: vy 
          });
        }
      }
    })
  ).current;
  
  return (
    <View {...panResponder.panHandlers} style={styles.box} />
  );
}
```

---

### 7. ForceTouchGestureHandler → Pressable (iOS)

#### React Native Gesture Handler
```javascript
import { ForceTouchGestureHandler, State } from 'react-native-gesture-handler';

function ForceTouchView() {
  const onGestureEvent = (event) => {
    console.log('Force:', event.nativeEvent.force);
  };
  
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log('Force touch activated');
    }
  };
  
  return (
    <ForceTouchGestureHandler
      minForce={0.5}
      maxForce={1}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View style={styles.box} />
    </ForceTouchGestureHandler>
  );
}
```

#### React Native
```javascript
import { Pressable, Platform } from 'react-native';

function ForceTouchView() {
  // Note: Force touch is deprecated in iOS 13+
  // Use Haptic Touch (long press) instead
  
  return (
    <Pressable
      onPress={(e) => {
        if (Platform.OS === 'ios' && e.nativeEvent.force) {
          console.log('Force:', e.nativeEvent.force);
        }
      }}
      onLongPress={() => {
        // Haptic Touch replacement
        console.log('Force touch activated (via long press)');
      }}
      delayLongPress={500}
    >
      <View style={styles.box} />
    </Pressable>
  );
}
```

---

### 8. NativeViewGestureHandler → View with responder

#### React Native Gesture Handler
```javascript
import { NativeViewGestureHandler, State } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native';

function NativeHandlerExample() {
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log('Native gesture active');
    }
  };
  
  return (
    <NativeViewGestureHandler
      onHandlerStateChange={onHandlerStateChange}
      shouldActivateOnStart
      disallowInterruption
    >
      <ScrollView>
        <Text>Scrollable content</Text>
      </ScrollView>
    </NativeViewGestureHandler>
  );
}
```

#### React Native
```javascript
import { ScrollView, View } from 'react-native';

function NativeHandlerExample() {
  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderGrant={() => console.log('Native gesture active')}
      onResponderTerminationRequest={() => false} // disallowInterruption
    >
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(e) => {
          // Handle scroll events
        }}
      >
        <Text>Scrollable content</Text>
      </ScrollView>
    </View>
  );
}
```

---

### 9. Gesture.Tap() → TouchableOpacity

#### React Native Gesture Handler (New API)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function TapExample() {
  const tap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      console.log('Tap started');
    })
    .onEnd(() => {
      console.log('Double tap completed');
    });
  
  return (
    <GestureDetector gesture={tap}>
      <View style={styles.box} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { TouchableOpacity } from 'react-native';

function TapExample() {
  const lastTap = useRef(0);
  
  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      console.log('Double tap completed');
      lastTap.current = 0;
    } else {
      console.log('Tap started');
      lastTap.current = now;
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.box} />
    </TouchableOpacity>
  );
}
```

---

### 10. Gesture.Pan() → PanResponder

#### React Native Gesture Handler (New API)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

function PanExample() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));
  
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated } from 'react-native';

function PanExample() {
  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: () => {
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    })
  ).current;
  
  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={[styles.box, {
        transform: [
          { translateX: pan.x },
          { translateY: pan.y }
        ]
      }]}
    />
  );
}
```

---

### 11. Gesture.Pinch() → Multi-touch PanResponder

#### React Native Gesture Handler (New API)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

function PinchExample() {
  const scale = useSharedValue(1);
  
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  
  return (
    <GestureDetector gesture={pinch}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated } from 'react-native';

function PinchExample() {
  const scale = useRef(new Animated.Value(1)).current;
  const baseDistance = useRef(0);
  const scaleFactor = useRef(1);
  
  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const [t1, t2] = touches;
    return Math.sqrt(
      Math.pow(t2.pageX - t1.pageX, 2) +
      Math.pow(t2.pageY - t1.pageY, 2)
    );
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          baseDistance.current = getDistance(touches);
          scaleFactor.current = scale._value;
        }
      },
      
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2 && baseDistance.current > 0) {
          const distance = getDistance(touches);
          const newScale = (distance / baseDistance.current) * scaleFactor.current;
          scale.setValue(newScale);
        }
      },
      
      onPanResponderRelease: () => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false
        }).start();
      }
    })
  ).current;
  
  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={[styles.box, {
        transform: [{ scale }]
      }]}
    />
  );
}
```

---

### 12. Gesture.Rotation() → Multi-touch PanResponder

#### React Native Gesture Handler (New API)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

function RotationExample() {
  const rotation = useSharedValue(0);
  
  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation;
    })
    .onEnd(() => {
      rotation.value = withSpring(0);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}rad` }]
  }));
  
  return (
    <GestureDetector gesture={rotationGesture}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated } from 'react-native';

function RotationExample() {
  const rotation = useRef(new Animated.Value(0)).current;
  const baseAngle = useRef(0);
  const currentRotation = useRef(0);
  
  const getAngle = (touches) => {
    if (touches.length < 2) return 0;
    const [t1, t2] = touches;
    return Math.atan2(
      t2.pageY - t1.pageY,
      t2.pageX - t1.pageX
    );
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          baseAngle.current = getAngle(touches);
          currentRotation.current = rotation._value;
        }
      },
      
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          const angle = getAngle(touches);
          const deltaAngle = angle - baseAngle.current;
          rotation.setValue(currentRotation.current + deltaAngle);
        }
      },
      
      onPanResponderRelease: () => {
        Animated.spring(rotation, {
          toValue: 0,
          useNativeDriver: false
        }).start();
      }
    })
  ).current;
  
  const interpolatedRotation = rotation.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ['-180deg', '180deg']
  });
  
  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={[styles.box, {
        transform: [{ rotate: interpolatedRotation }]
      }]}
    />
  );
}
```

---

### 13. Gesture.Fling() → PanResponder with velocity

#### React Native Gesture Handler (New API)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Directions } from 'react-native-gesture-handler';

function FlingExample() {
  const fling = Gesture.Fling()
    .direction(Directions.LEFT | Directions.RIGHT)
    .onStart((e) => {
      console.log('Fling detected', e);
    });
  
  return (
    <GestureDetector gesture={fling}>
      <View style={styles.box} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { PanResponder } from 'react-native';

function FlingExample() {
  const VELOCITY_THRESHOLD = 0.3;
  const DISTANCE_THRESHOLD = 50;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        const { vx, dx } = gestureState;
        
        if (Math.abs(vx) > VELOCITY_THRESHOLD && 
            Math.abs(dx) > DISTANCE_THRESHOLD) {
          const direction = vx > 0 ? 'RIGHT' : 'LEFT';
          console.log('Fling detected', { direction, velocity: vx });
        }
      }
    })
  ).current;
  
  return (
    <View {...panResponder.panHandlers} style={styles.box} />
  );
}
```

---

### 14. Gesture.LongPress() → Pressable

#### React Native Gesture Handler (New API)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function LongPressExample() {
  const longPress = Gesture.LongPress()
    .minDuration(800)
    .maxDistance(10)
    .onStart(() => console.log('Long press started'))
    .onEnd(() => console.log('Long press ended'));
  
  return (
    <GestureDetector gesture={longPress}>
      <View style={styles.box} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { Pressable } from 'react-native';

function LongPressExample() {
  const [longPressActive, setLongPressActive] = useState(false);
  
  return (
    <Pressable
      onLongPress={() => {
        console.log('Long press ended');
        setLongPressActive(false);
      }}
      onPressIn={() => {
        setLongPressActive(true);
        console.log('Long press started');
      }}
      onPressOut={() => {
        if (longPressActive) {
          setLongPressActive(false);
        }
      }}
      delayLongPress={800}
    >
      <View style={styles.box} />
    </Pressable>
  );
}
```

---

### 15. GestureDetector → View with responder

#### React Native Gesture Handler
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function GestureDetectorExample() {
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      console.log('Pan update:', e.translationX, e.translationY);
    });
  
  const tap = Gesture.Tap()
    .onEnd(() => {
      console.log('Tap detected');
    });
  
  const composed = Gesture.Simultaneous(pan, tap);
  
  return (
    <GestureDetector gesture={composed}>
      <View style={styles.box} />
    </GestureDetector>
  );
}
```

#### React Native
```javascript
import { View, PanResponder } from 'react-native';

function GestureDetectorExample() {
  const lastTap = useRef(0);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          console.log('Tap detected');
        }
        lastTap.current = now;
      },
      
      onPanResponderMove: (evt, gestureState) => {
        console.log('Pan update:', gestureState.dx, gestureState.dy);
      }
    })
  ).current;
  
  return (
    <View {...panResponder.panHandlers} style={styles.box} />
  );
}
```

---

### 16. State enum → Custom state management

#### React Native Gesture Handler
```javascript
import { State } from 'react-native-gesture-handler';

const gestureStates = {
  [State.UNDETERMINED]: 'UNDETERMINED',
  [State.FAILED]: 'FAILED',
  [State.BEGAN]: 'BEGAN',
  [State.CANCELLED]: 'CANCELLED',
  [State.ACTIVE]: 'ACTIVE',
  [State.END]: 'END'
};
```

#### React Native
```javascript
const GestureState = {
  UNDETERMINED: 'UNDETERMINED',
  FAILED: 'FAILED',
  BEGAN: 'BEGAN',
  CANCELLED: 'CANCELLED',
  ACTIVE: 'ACTIVE',
  END: 'END'
};

// Track state manually in your gesture handlers
const [gestureState, setGestureState] = useState(GestureState.UNDETERMINED);
```

---

### 17. onGestureEvent → PanResponder callbacks

#### React Native Gesture Handler
```javascript
const onGestureEvent = Animated.event(
  [{ nativeEvent: { 
    translationX: translateX,
    translationY: translateY,
    velocityX: velocityX,
    velocityY: velocityY
  }}],
  { useNativeDriver: true }
);
```

#### React Native
```javascript
// In PanResponder
onPanResponderMove: (evt, gestureState) => {
  // Manual update instead of Animated.event
  translateX.setValue(gestureState.dx);
  translateY.setValue(gestureState.dy);
  velocityX.setValue(gestureState.vx);
  velocityY.setValue(gestureState.vy);
}

// Or with Animated.event (no native driver)
onPanResponderMove: Animated.event(
  [null, { 
    dx: translateX,
    dy: translateY,
    vx: velocityX,
    vy: velocityY
  }],
  { useNativeDriver: false }
)
```

---

### 18. onHandlerStateChange → State tracking

#### React Native Gesture Handler
```javascript
const onHandlerStateChange = (event) => {
  switch(event.nativeEvent.state) {
    case State.BEGAN:
      console.log('Gesture began');
      break;
    case State.ACTIVE:
      console.log('Gesture active');
      break;
    case State.END:
      console.log('Gesture ended');
      break;
    case State.CANCELLED:
      console.log('Gesture cancelled');
      break;
    case State.FAILED:
      console.log('Gesture failed');
      break;
  }
};
```

#### React Native
```javascript
// Map to PanResponder callbacks
const panResponder = PanResponder.create({
  onPanResponderGrant: () => {
    console.log('Gesture began');
  },
  
  onPanResponderMove: () => {
    console.log('Gesture active');
  },
  
  onPanResponderRelease: () => {
    console.log('Gesture ended');
  },
  
  onPanResponderTerminate: () => {
    console.log('Gesture cancelled');
  },
  
  onPanResponderReject: () => {
    console.log('Gesture failed');
  }
});
```

---

### 19. Event payloads → Gesture state

#### React Native Gesture Handler
```javascript
// PanGestureHandler event payload
{
  absoluteX: number,
  absoluteY: number,
  translationX: number,
  translationY: number,
  velocityX: number,
  velocityY: number,
  x: number,
  y: number
}
```

#### React Native
```javascript
// PanResponder gestureState
{
  dx: number,        // accumulated distance X (translationX)
  dy: number,        // accumulated distance Y (translationY)
  vx: number,        // current velocity X (velocityX)
  vy: number,        // current velocity Y (velocityY)
  x0: number,        // initial touch X
  y0: number,        // initial touch Y
  moveX: number,     // current touch X (absoluteX)
  moveY: number,     // current touch Y (absoluteY)
  numberActiveTouches: number
}

// To get relative position (x, y in RNGH):
const x = gestureState.moveX - containerX;
const y = gestureState.moveY - containerY;
```

---

### 20. GestureHandlerRootView → View

#### React Native Gesture Handler
```javascript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YourApp />
    </GestureHandlerRootView>
  );
}
```

#### React Native
```javascript
import { View } from 'react-native';

function App() {
  // No special root view needed
  return (
    <View style={{ flex: 1 }}>
      <YourApp />
    </View>
  );
}
```

---

### 21. Swipeable → Animated with PanResponder

#### React Native Gesture Handler
```javascript
import Swipeable from 'react-native-gesture-handler/Swipeable';

function SwipeableRow() {
  const renderLeftActions = () => (
    <View style={{ backgroundColor: 'green', justifyContent: 'center' }}>
      <Text>Archive</Text>
    </View>
  );
  
  const renderRightActions = () => (
    <View style={{ backgroundColor: 'red', justifyContent: 'center' }}>
      <Text>Delete</Text>
    </View>
  );
  
  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => console.log(`Opened ${direction}`)}
    >
      <View style={styles.row}>
        <Text>Swipe me</Text>
      </View>
    </Swipeable>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated, View, Text } from 'react-native';

function SwipeableRow() {
  const pan = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(null);
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: pan }],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = 100;
        
        if (gestureState.dx > threshold) {
          // Open left
          Animated.spring(pan, {
            toValue: 150,
            useNativeDriver: false
          }).start();
          setIsOpen('left');
          console.log('Opened left');
        } else if (gestureState.dx < -threshold) {
          // Open right
          Animated.spring(pan, {
            toValue: -150,
            useNativeDriver: false
          }).start();
          setIsOpen('right');
          console.log('Opened right');
        } else {
          // Close
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false
          }).start();
          setIsOpen(null);
        }
      }
    })
  ).current;
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {/* Left actions */}
      <View style={{
        position: 'absolute',
        left: 0,
        backgroundColor: 'green',
        justifyContent: 'center',
        width: 150
      }}>
        <Text>Archive</Text>
      </View>
      
      {/* Right actions */}
      <View style={{
        position: 'absolute',
        right: 0,
        backgroundColor: 'red',
        justifyContent: 'center',
        width: 150
      }}>
        <Text>Delete</Text>
      </View>
      
      {/* Main content */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.row, {
          transform: [{ translateX: pan }]
        }]}
      >
        <Text>Swipe me</Text>
      </Animated.View>
    </View>
  );
}
```

---

### 22. DrawerLayout → Custom drawer

#### React Native Gesture Handler
```javascript
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

function DrawerExample() {
  const drawer = useRef(null);
  
  const renderDrawer = () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text>Drawer Content</Text>
    </View>
  );
  
  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={200}
      drawerPosition="left"
      renderNavigationView={renderDrawer}
    >
      <View style={{ flex: 1 }}>
        <Button 
          title="Open Drawer" 
          onPress={() => drawer.current.openDrawer()} 
        />
      </View>
    </DrawerLayout>
  );
}
```

#### React Native
```javascript
import { PanResponder, Animated, View, Dimensions } from 'react-native';

function DrawerExample() {
  const { width } = Dimensions.get('window');
  const drawerWidth = 200;
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const [isOpen, setIsOpen] = useState(false);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      
      onPanResponderMove: (evt, gestureState) => {
        const newX = isOpen 
          ? Math.min(0, Math.max(-drawerWidth, gestureState.dx))
          : Math.min(0, Math.max(-drawerWidth, -drawerWidth + gestureState.dx));
        translateX.setValue(newX);
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = drawerWidth / 2;
        const shouldOpen = isOpen 
          ? gestureState.dx > -threshold
          : gestureState.dx > threshold;
        
        Animated.spring(translateX, {
          toValue: shouldOpen ? 0 : -drawerWidth,
          useNativeDriver: false
        }).start();
        
        setIsOpen(shouldOpen);
      }
    })
  ).current;
  
  const openDrawer = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: false
    }).start();
    setIsOpen(true);
  };
  
  const closeDrawer = () => {
    Animated.spring(translateX, {
      toValue: -drawerWidth,
      useNativeDriver: false
    }).start();
    setIsOpen(false);
  };
  
  return (
    <View style={{ flex: 1 }}>
      {/* Main content */}
      <View style={{ flex: 1 }}>
        <Button title="Open Drawer" onPress={openDrawer} />
      </View>
      
      {/* Drawer */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: drawerWidth,
          backgroundColor: '#fff',
          transform: [{ translateX }],
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 4
        }}
      >
        <Text>Drawer Content</Text>
      </Animated.View>
      
      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: drawerWidth,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
          onPress={closeDrawer}
          activeOpacity={1}
        />
      )}
    </View>
  );
}
```

---

### 23-26. Touchable Components Migration

All RNGH touchable components can be directly replaced with their React Native equivalents:

#### React Native Gesture Handler
```javascript
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback
} from 'react-native-gesture-handler';
```

#### React Native
```javascript
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Pressable // More modern alternative
} from 'react-native';
```

The APIs are identical, just change the import source.

---

### 27-30. Button Components → Pressable

#### React Native Gesture Handler
```javascript
import { RectButton, BorderlessButton, BaseButton, RawButton } from 'react-native-gesture-handler';

// RectButton
<RectButton onPress={handlePress} rippleColor="#fff">
  <Text>Rectangle Button</Text>
</RectButton>

// BorderlessButton
<BorderlessButton onPress={handlePress} borderless>
  <Text>Borderless Button</Text>
</BorderlessButton>
```

#### React Native
```javascript
import { Pressable, Platform } from 'react-native';

// RectButton equivalent
<Pressable
  onPress={handlePress}
  android_ripple={{ color: '#fff' }}
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.7 }
  ]}
>
  <Text>Rectangle Button</Text>
</Pressable>

// BorderlessButton equivalent
<Pressable
  onPress={handlePress}
  android_ripple={{ borderless: true, color: '#fff' }}
  style={({ pressed }) => pressed && { opacity: 0.7 }}
>
  <Text>Borderless Button</Text>
</Pressable>
```

---

### 31. Simultaneous gestures → Multiple responders

#### React Native Gesture Handler
```javascript
const pan = Gesture.Pan();
const pinch = Gesture.Pinch();
const composed = Gesture.Simultaneous(pan, pinch);

<GestureDetector gesture={composed}>
  <View />
</GestureDetector>
```

#### React Native
```javascript
// Combine multiple gesture handlers
function SimultaneousGestures() {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        // Handle pan
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        
        // Handle pinch if 2 fingers
        if (touches.length === 2) {
          const distance = Math.sqrt(
            Math.pow(touches[1].pageX - touches[0].pageX, 2) +
            Math.pow(touches[1].pageY - touches[0].pageY, 2)
          );
          // Update scale based on distance
          scale.setValue(distance / 200); // Adjust divisor as needed
        }
      }
    })
  ).current;
  
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { scale }
        ]
      }}
    />
  );
}
```

---

### 32. Exclusive gestures → Responder negotiation

#### React Native Gesture Handler
```javascript
const tap = Gesture.Tap();
const longPress = Gesture.LongPress();
const composed = Gesture.Exclusive(tap, longPress);
```

#### React Native
```javascript
// Use timing to determine which gesture wins
function ExclusiveGestures() {
  const [gestureType, setGestureType] = useState(null);
  const longPressTimer = useRef(null);
  
  const handlePressIn = () => {
    longPressTimer.current = setTimeout(() => {
      setGestureType('longPress');
      console.log('Long press detected');
    }, 500);
  };
  
  const handlePressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      if (gestureType !== 'longPress') {
        setGestureType('tap');
        console.log('Tap detected');
      }
    }
    setGestureType(null);
  };
  
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.box} />
    </Pressable>
  );
}
```

---

### 33. Race gestures → First responder wins

#### React Native Gesture Handler
```javascript
const pan = Gesture.Pan();
const tap = Gesture.Tap();
const composed = Gesture.Race(pan, tap);
```

#### React Native
```javascript
// First gesture to activate wins
function RaceGestures() {
  const [activeGesture, setActiveGesture] = useState(null);
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!activeGesture && Math.abs(gestureState.dx) > 5) {
          setActiveGesture('pan');
          return true;
        }
        return false;
      },
      
      onPanResponderRelease: () => {
        setActiveGesture(null);
      }
    })
  ).current;
  
  const handlePress = () => {
    if (!activeGesture) {
      setActiveGesture('tap');
      console.log('Tap won the race');
      setTimeout(() => setActiveGesture(null), 100);
    }
  };
  
  return (
    <Pressable onPress={handlePress}>
      <View {...panResponder.panHandlers} style={styles.box} />
    </Pressable>
  );
}
```

---

### 34. Directions → Custom direction detection

#### React Native Gesture Handler
```javascript
import { Directions } from 'react-native-gesture-handler';

const fling = Gesture.Fling()
  .direction(Directions.LEFT | Directions.RIGHT);
```

#### React Native
```javascript
const Directions = {
  RIGHT: 1,
  LEFT: 2,
  UP: 4,
  DOWN: 8
};

function detectDirection(dx, dy, vx, vy) {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  
  if (absX > absY) {
    return dx > 0 ? Directions.RIGHT : Directions.LEFT;
  } else {
    return dy > 0 ? Directions.DOWN : Directions.UP;
  }
}

// In PanResponder
onPanResponderRelease: (evt, gestureState) => {
  const direction = detectDirection(
    gestureState.dx,
    gestureState.dy,
    gestureState.vx,
    gestureState.vy
  );
  
  if (direction & (Directions.LEFT | Directions.RIGHT)) {
    console.log('Horizontal fling detected');
  }
}
```

---

### 35. simultaneousHandlers → Responder negotiation

#### React Native Gesture Handler
```javascript
<PanGestureHandler
  ref={panRef}
  simultaneousHandlers={[scrollRef, pinchRef]}
>
  <ScrollView ref={scrollRef}>
    <PinchGestureHandler ref={pinchRef}>
      <View />
    </PinchGestureHandler>
  </ScrollView>
</PanGestureHandler>
```

#### React Native
```javascript
// Allow multiple responders through careful negotiation
const panResponder = PanResponder.create({
  onStartShouldSetPanResponderCapture: () => false, // Don't capture
  onMoveShouldSetPanResponder: () => true,
  onPanResponderTerminationRequest: () => true, // Allow others to take over
});

// ScrollView will handle its own gestures
<View {...panResponder.panHandlers}>
  <ScrollView scrollEnabled={true}>
    <View />
  </ScrollView>
</View>
```

---

### 36. waitFor → Delayed activation

#### React Native Gesture Handler
```javascript
<TapGestureHandler
  ref={doubleTapRef}
  numberOfTaps={2}
>
  <TapGestureHandler
    waitFor={doubleTapRef}
    numberOfTaps={1}
  >
    <View />
  </TapGestureHandler>
</TapGestureHandler>
```

#### React Native
```javascript
function DelayedActivation() {
  const [waitingForDouble, setWaitingForDouble] = useState(false);
  const tapTimer = useRef(null);
  
  const handlePress = () => {
    if (waitingForDouble) {
      // Double tap
      clearTimeout(tapTimer.current);
      console.log('Double tap');
      setWaitingForDouble(false);
    } else {
      // Might be single tap, wait
      setWaitingForDouble(true);
      tapTimer.current = setTimeout(() => {
        console.log('Single tap');
        setWaitingForDouble(false);
      }, 300);
    }
  };
  
  return (
    <Pressable onPress={handlePress}>
      <View style={styles.box} />
    </Pressable>
  );
}
```

---

### 37. enabled prop → Conditional responders

#### React Native Gesture Handler
```javascript
<PanGestureHandler enabled={isEnabled}>
  <View />
</PanGestureHandler>
```

#### React Native
```javascript
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => isEnabled,
    onMoveShouldSetPanResponder: () => isEnabled,
    // ... other handlers
  })
).current;

// Or conditionally apply handlers
<View {...(isEnabled ? panResponder.panHandlers : {})}>
  {/* content */}
</View>
```

---

### 38. shouldCancelWhenOutside → Responder release

#### React Native Gesture Handler
```javascript
<PanGestureHandler shouldCancelWhenOutside={true}>
  <View />
</PanGestureHandler>
```

#### React Native
```javascript
const panResponder = PanResponder.create({
  onPanResponderMove: (evt, gestureState) => {
    // Check if touch moved outside bounds
    const { moveX, moveY } = gestureState;
    const { x, y, width, height } = viewBounds;
    
    if (moveX < x || moveX > x + width || 
        moveY < y || moveY > y + height) {
      // Release responder
      return false;
    }
  }
});
```

---

### 39. Manual gestures → Direct state control

#### React Native Gesture Handler
```javascript
const manual = Gesture.Manual();

// Control gesture state manually
manual.activate();
manual.end();
manual.fail();
```

#### React Native
```javascript
// Direct state control
function ManualGesture() {
  const [gestureState, setGestureState] = useState('idle');
  
  const activate = () => setGestureState('active');
  const end = () => setGestureState('end');
  const fail = () => setGestureState('failed');
  
  // Use state to control behavior
  return (
    <View>
      <Button title="Activate" onPress={activate} />
      <Button title="End" onPress={end} />
      <Button title="Fail" onPress={fail} />
      <Text>State: {gestureState}</Text>
    </View>
  );
}
```

---

### 40. Hover gestures → onMouseEnter/Leave (Web)

#### React Native Gesture Handler
```javascript
const hover = Gesture.Hover()
  .onBegin(() => console.log('Hover begin'))
  .onEnd(() => console.log('Hover end'));

<GestureDetector gesture={hover}>
  <View />
</GestureDetector>
```

#### React Native (Web)
```javascript
// Web-specific hover handling
function HoverableView() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <View
      onMouseEnter={() => {
        setIsHovered(true);
        console.log('Hover begin');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        console.log('Hover end');
      }}
      style={[styles.box, isHovered && styles.hovered]}
    />
  );
}
```

---

## Migration Tips & Best Practices

### 1. Performance Considerations

**RNGH Advantages Lost:**
- Native thread gesture processing
- Better performance for complex gestures
- Simultaneous gesture handling

**Pure RN Limitations:**
- PanResponder runs on JS thread
- No `useNativeDriver` for PanResponder
- More complex multi-gesture coordination

**Mitigation Strategies:**
```javascript
// 1. Use InteractionManager for heavy operations
InteractionManager.runAfterInteractions(() => {
  // Heavy computation
});

// 2. Throttle gesture updates
const throttledMove = useCallback(
  throttle((dx, dy) => {
    // Update state
  }, 16), // ~60fps
  []
);

// 3. Use Animated API where possible
Animated.event([...], { useNativeDriver: false });
```

### 2. Common Patterns

#### Gesture State Management
```javascript
// Custom hook for gesture state
function useGestureState() {
  const [state, setState] = useState('UNDETERMINED');
  
  const transitions = {
    begin: () => setState('BEGAN'),
    activate: () => setState('ACTIVE'),
    end: () => setState('END'),
    cancel: () => setState('CANCELLED'),
    fail: () => setState('FAILED'),
    reset: () => setState('UNDETERMINED')
  };
  
  return [state, transitions];
}
```

#### Multi-touch Handling
```javascript
// Helper for multi-touch gestures
function useMultiTouch() {
  const touches = useRef([]);
  
  const updateTouches = (evt) => {
    touches.current = Array.from(evt.nativeEvent.touches);
  };
  
  const getTouchCount = () => touches.current.length;
  
  const getTouchDistance = () => {
    if (touches.current.length < 2) return 0;
    const [t1, t2] = touches.current;
    return Math.sqrt(
      Math.pow(t2.pageX - t1.pageX, 2) +
      Math.pow(t2.pageY - t1.pageY, 2)
    );
  };
  
  return { updateTouches, getTouchCount, getTouchDistance };
}
```

### 3. Testing Gestures

```javascript
// Mock PanResponder for testing
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  PanResponder: {
    create: jest.fn(() => ({
      panHandlers: {
        onStartShouldSetPanResponder: jest.fn(),
        onMoveShouldSetPanResponder: jest.fn(),
        onPanResponderGrant: jest.fn(),
        onPanResponderMove: jest.fn(),
        onPanResponderRelease: jest.fn(),
      }
    }))
  }
}));
```

### 4. Platform Differences

```javascript
// Handle platform-specific gesture behavior
const createPlatformGesture = () => {
  if (Platform.OS === 'ios') {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // iOS-specific config
    });
  } else if (Platform.OS === 'android') {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      // Android-specific config
    });
  }
  // Web config
  return null;
};
```

### 5. Migration Checklist

- [ ] Remove `react-native-gesture-handler` from package.json
- [ ] Remove `GestureHandlerRootView` wrapper
- [ ] Replace imports with React Native equivalents
- [ ] Convert gesture handlers to PanResponder/Pressable
- [ ] Update gesture state management
- [ ] Test gesture interactions thoroughly
- [ ] Profile performance on actual devices
- [ ] Handle platform-specific differences
- [ ] Update documentation and comments
- [ ] Remove native configuration (iOS/Android setup)

## Summary

While React Native's built-in gesture system is less powerful than RNGH, it's sufficient for many use cases. Key differences:

**You lose:**
- Native thread processing
- Complex gesture composition
- Built-in gesture recognizers
- Better performance

**You gain:**
- Zero native dependencies
- Simpler setup
- No native configuration
- Pure JavaScript solution

Choose based on your needs: use RNGH for complex gesture-heavy apps, pure RN for simpler interactions or when avoiding native dependencies.