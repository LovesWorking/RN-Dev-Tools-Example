import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { usePokemon } from './_hooks/usePokemon';
import { PokemonTheme } from '@/constants/PokemonTheme';
import { getTypeColor } from './_utils/pokemonTypeColors';
import * as Haptics from 'expo-haptics';
import { pokemonNames, searchPokemon } from './_data/pokemonNames';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedAnimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS, 
  interpolate 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedReanimatedView = ReanimatedAnimated.View;

// Pokemon Card Component with Swipe
function PokemonCardSwipeable({ 
  pokemonId, 
  index, 
  isActive, 
  onSwipe, 
  shimmerAnim, 
  floatAnim, 
  cardGlowAnim,
  onTypeChange 
}: {
  pokemonId: string;
  index: number;
  isActive: boolean;
  onSwipe: () => void;
  shimmerAnim: any;
  floatAnim: any;
  cardGlowAnim: any;
  onTypeChange?: (type: string) => void;
}) {
  const { data, isLoading } = usePokemon(pokemonId);
  
  // Gesture values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(index === 0 ? 1 : 1 - index * 0.05);
  const gestureRotation = useSharedValue(0);
  const opacity = useSharedValue(index === 0 ? 1 : index < 3 ? 0.8 : 0);
  
  // Set initial position based on stack - cards staggered behind
  React.useEffect(() => {
    if (index === 0) {
      scale.value = 1;
      translateY.value = 0;
      translateX.value = 0;
      opacity.value = 1;
    } else if (index === 1) {
      scale.value = withSpring(0.95);
      translateY.value = withSpring(8);
      translateX.value = withSpring(8);
      opacity.value = withSpring(0.9);
    } else if (index === 2) {
      scale.value = withSpring(0.9);
      translateY.value = withSpring(16);
      translateX.value = withSpring(16);
      opacity.value = withSpring(0.8);
    } else {
      opacity.value = 0;
    }
  }, [index]);
  
  const gesture = Gesture.Pan()
    .enabled(isActive)
    .onUpdate((e) => {
      'worklet';
      if (!isActive) return;
      
      translateX.value = e.translationX;
      translateY.value = e.translationY / 4 + index * -10;
      
      gestureRotation.value = interpolate(
        e.translationX,
        [-width, 0, width],
        [-30, 0, 30]
      );
      
      opacity.value = interpolate(
        Math.abs(e.translationX),
        [0, width],
        [1, 0.3]
      );
    })
    .onEnd((e) => {
      'worklet';
      if (!isActive) return;
      
      const SWIPE_THRESHOLD = width * 0.3;
      const VELOCITY_THRESHOLD = 500;
      
      const shouldSwipe = Math.abs(e.translationX) > SWIPE_THRESHOLD || 
                         Math.abs(e.velocityX) > VELOCITY_THRESHOLD;
      
      if (shouldSwipe) {
        const direction = e.translationX > 0 ? 1 : -1;
        
        translateX.value = withTiming(width * 1.5 * direction, { duration: 300 });
        translateY.value = withTiming(-100, { duration: 300 });
        gestureRotation.value = withTiming(direction * 45, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(onSwipe)();
      } else {
        translateX.value = withSpring(index === 1 ? 8 : index === 2 ? 16 : 0);
        translateY.value = withSpring(index === 1 ? 8 : index === 2 ? 16 : 0);
        gestureRotation.value = withSpring(0);
        opacity.value = withSpring(index === 0 ? 1 : index === 1 ? 0.9 : 0.8);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${gestureRotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: 100 - index * 10,
    elevation: 20 - index * 2,
  }));
  
  const mainType = data?.types?.[0] || 'normal';
  const gradientColors = PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] 
    || PokemonTheme.gradients.normal;
  
  // Notify parent of type change when this card is active
  React.useEffect(() => {
    if (isActive && data?.types?.[0] && onTypeChange) {
      onTypeChange(data.types[0]);
    }
  }, [isActive, data?.types, onTypeChange]);
  
  if (isLoading || !data) {
    return (
      <AnimatedReanimatedView style={[styles.pokemonCard, animatedStyle]}>
        <LinearGradient
          colors={PokemonTheme.gradients.dark}
          style={styles.cardGradient}
        >
          <BlurView intensity={20} tint="light" style={styles.cardContent}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </BlurView>
        </LinearGradient>
      </AnimatedReanimatedView>
    );
  }
  
  return (
    <GestureDetector gesture={gesture}>
      <AnimatedReanimatedView style={[styles.pokemonCard, animatedStyle]}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: floatAnim }],
          }}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Holographic shimmer effect */}
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [
                    {
                      translateX: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width * 1.5, width * 1.5],
                      }),
                    },
                    { rotate: '25deg' },
                    { scaleY: 3 },
                  ],
                },
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'transparent',
                  'rgba(255,182,193,0.15)',
                  'rgba(255,218,185,0.2)',
                  'rgba(255,255,224,0.25)',
                  'rgba(144,238,144,0.2)',
                  'rgba(173,216,230,0.25)',
                  'rgba(221,160,221,0.2)',
                  'rgba(255,182,193,0.15)',
                  'transparent',
                  'transparent'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 0.1, 0.25, 0.35, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1]}
                style={styles.shimmerGradient}
              />
            </Animated.View>
            
            {/* Additional prismatic layer */}
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [
                    {
                      translateX: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width * 1.2, width * 1.2],
                      }),
                    },
                    { rotate: '-15deg' },
                    { scaleY: 2.5 },
                  ],
                  opacity: shimmerAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.3, 0],
                  }),
                },
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255,0,255,0.1)',
                  'rgba(0,255,255,0.1)',
                  'rgba(255,255,0,0.1)',
                  'transparent'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
            
            <BlurView intensity={10} tint="light" style={styles.cardContent}>
              {/* Card border frame - Pokemon card style */}
              <View style={styles.cardFrame}>
                <View style={styles.cardFrameInner} />
              </View>
              {/* Card Header with HP */}
              <View style={styles.cardHeader}>
                <Text style={styles.pokemonNameHeader}>{data.name.toUpperCase()}</Text>
                <View style={styles.hpContainer}>
                  <Text style={styles.hpText}>HP</Text>
                  <Text style={styles.hpValue}>{data.stats.find((s: any) => s.name === 'hp')?.value || 100}</Text>
                </View>
              </View>
              
              
              {/* Pokemon Image Container with art frame */}
              <View style={styles.artFrame}>
                <LinearGradient
                  colors={[
                    `${getTypeColor(mainType)}22`,
                    'transparent',
                    `${getTypeColor(mainType)}11`
                  ]}
                  style={styles.artBackground}
                />
                <View style={styles.imageContainer}>
                  {data.image && (
                    <Animated.Image
                      source={{ uri: data.image }}
                      style={[
                        styles.pokemonImage,
                        {
                          transform: [
                            { 
                              scale: cardGlowAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.08],
                              })
                            },
                          ],
                        },
                      ]}
                      resizeMode="contain"
                    />
                  )}
                  {/* Sparkle effects */}
                  <View style={styles.sparkleContainer}>
                    <View style={[styles.sparkle, { top: 5, left: 5 }]} />
                    <View style={[styles.sparkle, { top: 20, right: 15 }]} />
                    <View style={[styles.sparkle, { bottom: 15, left: 20 }]} />
                    <View style={[styles.sparkle, { bottom: 5, right: 5 }]} />
                  </View>
                </View>
                <Text style={styles.stageName}>Basic Pokémon</Text>
              </View>
              
              
              {/* Types */}
              <View style={styles.typesContainer}>
                {data.types.map((type: string) => (
                  <LinearGradient
                    key={type}
                    colors={[
                      getTypeColor(type),
                      `${getTypeColor(type)}CC`
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.typeBadge}
                  >
                    <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                  </LinearGradient>
                ))}
              </View>
              
              {/* Attack Moves */}
              <View style={styles.movesContainer}>
                <View style={styles.moveRow}>
                  <View style={styles.energyBadge}>
                    <View style={[styles.energyIcon, { backgroundColor: getTypeColor(mainType) }]} />
                  </View>
                  <Text style={styles.moveName}>Quick Attack</Text>
                  <Text style={styles.moveDamage}>{data.stats.find((s: any) => s.name === 'attack')?.value || 50}</Text>
                </View>
                <View style={styles.moveRow}>
                  <View style={styles.energyBadge}>
                    <View style={[styles.energyIcon, { backgroundColor: getTypeColor(mainType) }]} />
                    <View style={[styles.energyIcon, { backgroundColor: getTypeColor(mainType) }]} />
                  </View>
                  <Text style={styles.moveName}>Special Attack</Text>
                  <Text style={styles.moveDamage}>{(data.stats.find((s: any) => s.name === 'attack')?.value || 50) * 2}</Text>
                </View>
              </View>
              
              {/* Bottom Stats Bar */}
              <View style={styles.bottomStats}>
                <View style={styles.weaknessResistance}>
                  <Text style={styles.statMiniLabel}>Weakness</Text>
                  <View style={[styles.typeMini, { backgroundColor: getTypeColor(data.types[1] || mainType) }]} />
                </View>
                <View style={styles.weaknessResistance}>
                  <Text style={styles.statMiniLabel}>Retreat</Text>
                  <View style={styles.retreatCost}>
                    <Text style={styles.retreatText}>⚪⚪</Text>
                  </View>
                </View>
              </View>
              
              {/* Card Set Info and Rarity */}
              <View style={styles.cardSetInfo}>
                <Text style={styles.cardSetText}>1st Edition</Text>
                <Text style={styles.raritySymbol}>★</Text>
                <Text style={styles.cardNumber}>{data.id}/151</Text>
              </View>
              
              {/* Copyright */}
              <Text style={styles.copyright}>©2024 Pokémon TCG</Text>
              
              {/* Swipe hint indicators */}
              {isActive && (
                <>
                  <Animated.View 
                    style={[
                      styles.swipeHint,
                      styles.swipeHintLeft,
                      {
                        opacity: shimmerAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 0.4, 0],
                        }),
                      },
                    ]}
                  >
                    <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.5)" />
                  </Animated.View>
                  
                  <Animated.View 
                    style={[
                      styles.swipeHint,
                      styles.swipeHintRight,
                      {
                        opacity: shimmerAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 0.4, 0],
                        }),
                      },
                    ]}
                  >
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                  </Animated.View>
                </>
              )}
            </BlurView>
          </LinearGradient>
        </Animated.View>
      </AnimatedReanimatedView>
    </GestureDetector>
  );
}

// Get random Pokemon from our database
function getRandomPokemonNames(count: number): string[] {
  const shuffled = [...pokemonNames].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function PokemonScreen() {
  const [pokemonStack, setPokemonStack] = useState(() => [
    'pikachu',
    'charizard',
    'blastoise',
    'gengar',
    'dragonite',
    'mewtwo',
    'lucario',
    'garchomp',
    'greninja',
    'mimikyu'
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [currentPokemonType, setCurrentPokemonType] = useState<string>('electric');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Only keep essential animations for effects
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const cardGlowAnim = useRef(new Animated.Value(0)).current;
  
  // Premium bubble particles with enhanced effects
  const bubbleAnims = useRef(
    Array(60).fill(0).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(height + 50),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(Math.random() * 0.6 + 0.3),
      wobble: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Floating animation for cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effect - continuous smooth animation with holographic feel
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();

    // Card glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(cardGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate soda bubbles - continuous loop
    bubbleAnims.forEach((bubble, index) => {
      const startDelay = index * 80;
      const duration = 5000 + Math.random() * 3000;
      const initialScale = Math.random() * 0.6 + 0.4;
      const wobbleAmount = 15 + Math.random() * 10;
      
      bubble.y.setValue(height + 50);
      bubble.scale.setValue(initialScale);
      bubble.opacity.setValue(0);
      
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(bubble.y, {
                toValue: height + 50,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.scale, {
                toValue: initialScale,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(bubble.y, {
                toValue: -100,
                duration: duration,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(bubble.opacity, {
                  toValue: 0.4,
                  duration: 800,
                  useNativeDriver: true,
                }),
                Animated.timing(bubble.opacity, {
                  toValue: 0.4,
                  duration: duration - 1600,
                  useNativeDriver: true,
                }),
                Animated.timing(bubble.opacity, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: true,
                }),
              ]),
              Animated.loop(
                Animated.sequence([
                  Animated.timing(bubble.wobble, {
                    toValue: wobbleAmount,
                    duration: 1000,
                    useNativeDriver: true,
                  }),
                  Animated.timing(bubble.wobble, {
                    toValue: -wobbleAmount,
                    duration: 1000,
                    useNativeDriver: true,
                  }),
                ]),
                { iterations: Math.floor(duration / 2000) }
              ),
              Animated.timing(bubble.scale, {
                toValue: initialScale * 1.3,
                duration: duration,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      }, startDelay);
    });
  }, []);

  // Handle search with haptic feedback
  function handleSearch() {
    if (inputValue.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setPokemonStack([inputValue.trim().toLowerCase(), ...pokemonStack]);
      setCurrentIndex(0);
      setInputValue('');
      
      // Trigger success animation
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  // Get random Pokemon with animation feedback
  const getRandomPokemon = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const randomPokemon = getRandomPokemonNames(1)[0];
    setPokemonStack(prev => [randomPokemon, ...prev]);
    setCurrentIndex(0);
    
    // Trigger dice roll animation
    Animated.sequence([
      Animated.timing(cardGlowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardGlowAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardGlowAnim]);

  // Refill stack when getting low
  useEffect(() => {
    if (pokemonStack.length - currentIndex < 5) {
      const newPokemon = getRandomPokemonNames(5);
      setPokemonStack(prev => [...prev, ...newPokemon]);
    }
  }, [currentIndex, pokemonStack.length]);
  
  // Handle input change with autocomplete
  const handleInputChange = useCallback((text: string) => {
    setInputValue(text);
    
    if (text.length >= 1) {
      const results = searchPokemon(text);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, []);
  
  // Select a suggestion
  const selectSuggestion = useCallback((pokemon: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPokemonStack([pokemon, ...pokemonStack]);
    setCurrentIndex(0);
    setInputValue('');
    setShowSuggestions(false);
    setSuggestions([]);
  }, [pokemonStack]);

  return (
    <View style={styles.container}>
      {/* Premium Animated Background */}
      <LinearGradient
        colors={['#0A0E27', '#1a1f3a', '#2d1b69']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Animated Background Orbs */}
      <Animated.View style={[
        styles.backgroundOrb,
        styles.orb1,
        {
          transform: [{
            translateY: floatAnim.interpolate({
              inputRange: [-10, 0],
              outputRange: [-20, 0],
            })
          }]
        }
      ]}>
        <LinearGradient
          colors={['rgba(147,51,234,0.3)', 'transparent']}
          style={styles.orbGradient}
        />
      </Animated.View>
      
      <Animated.View style={[
        styles.backgroundOrb,
        styles.orb2,
        {
          transform: [{
            translateX: floatAnim.interpolate({
              inputRange: [-10, 0],
              outputRange: [20, 0],
            })
          }]
        }
      ]}>
        <LinearGradient
          colors={['rgba(59,130,246,0.3)', 'transparent']}
          style={styles.orbGradient}
        />
      </Animated.View>
      
      {/* Dynamic colored bubbles based on Pokemon */}
      {bubbleAnims.map((bubble, index) => {
        // Dynamic bubble colors based on current Pokemon type
        const typeColorMapping: { [key: string]: string[] } = {
          fire: ['rgba(239, 68, 68, 0.3)', 'rgba(251, 146, 60, 0.3)', 'rgba(252, 211, 77, 0.3)'],
          water: ['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.3)', 'rgba(147, 197, 253, 0.3)'],
          grass: ['rgba(34, 197, 94, 0.3)', 'rgba(74, 222, 128, 0.3)', 'rgba(134, 239, 172, 0.3)'],
          electric: ['rgba(250, 204, 21, 0.3)', 'rgba(253, 224, 71, 0.3)', 'rgba(254, 240, 138, 0.3)'],
          psychic: ['rgba(236, 72, 153, 0.3)', 'rgba(244, 114, 182, 0.3)', 'rgba(251, 182, 206, 0.3)'],
          ice: ['rgba(165, 243, 252, 0.3)', 'rgba(207, 250, 254, 0.3)', 'rgba(224, 242, 254, 0.3)'],
          dragon: ['rgba(147, 51, 234, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(196, 167, 255, 0.3)'],
          dark: ['rgba(75, 85, 99, 0.3)', 'rgba(107, 114, 128, 0.3)', 'rgba(156, 163, 175, 0.3)'],
          fairy: ['rgba(244, 114, 182, 0.3)', 'rgba(251, 182, 206, 0.3)', 'rgba(252, 231, 243, 0.3)'],
          normal: ['rgba(203, 213, 225, 0.3)', 'rgba(226, 232, 240, 0.3)', 'rgba(241, 245, 249, 0.3)'],
          fighting: ['rgba(220, 38, 38, 0.3)', 'rgba(239, 68, 68, 0.3)', 'rgba(248, 113, 113, 0.3)'],
          flying: ['rgba(125, 211, 252, 0.3)', 'rgba(186, 230, 253, 0.3)', 'rgba(224, 242, 254, 0.3)'],
          poison: ['rgba(168, 85, 247, 0.3)', 'rgba(196, 167, 255, 0.3)', 'rgba(221, 214, 254, 0.3)'],
          ground: ['rgba(217, 119, 6, 0.3)', 'rgba(245, 158, 11, 0.3)', 'rgba(251, 191, 36, 0.3)'],
          rock: ['rgba(120, 113, 108, 0.3)', 'rgba(168, 162, 158, 0.3)', 'rgba(214, 211, 209, 0.3)'],
          bug: ['rgba(132, 204, 22, 0.3)', 'rgba(163, 230, 53, 0.3)', 'rgba(190, 242, 100, 0.3)'],
          ghost: ['rgba(147, 51, 234, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(196, 167, 255, 0.3)'],
          steel: ['rgba(148, 163, 184, 0.3)', 'rgba(203, 213, 225, 0.3)', 'rgba(226, 232, 240, 0.3)'],
        };
        
        const colors = typeColorMapping[currentPokemonType] || typeColorMapping.normal;
        const color = colors[index % colors.length];
        
        return (
          <Animated.View
            key={`bubble-${index}`}
            style={[
              styles.bubble,
              {
                transform: [
                  { translateX: Animated.add(bubble.x || 0, bubble.wobble) },
                  { translateY: bubble.y },
                  { scale: bubble.scale },
                ],
                opacity: bubble.opacity,
                left: (index * 9) % width,
                backgroundColor: color,
                borderColor: color.replace('0.3', '0.5'),
              },
            ]}
          />
        );
      })}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Premium Header */}
        <Animated.View style={[
          styles.headerContainer,
          {
            transform: [{
              scale: floatAnim.interpolate({
                inputRange: [-10, 0],
                outputRange: [1.02, 1],
              })
            }]
          }
        ]}>
          <LinearGradient
            colors={['rgba(255,215,0,0.1)', 'transparent']}
            style={styles.headerGlow}
          />
          <View style={styles.titleContainer}>
            <View style={styles.titleBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF6347']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.titleGradient}
              >
                <Text style={styles.titleSmall}>ULTIMATE</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>POKÉDEX</Text>
            <View style={styles.titleAccent}>
              <Animated.View style={[
                styles.pulsingDot,
                {
                  opacity: cardGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                  transform: [{
                    scale: cardGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5],
                    })
                  }]
                }
              ]} />
            </View>
          </View>
          <Text style={styles.subtitle}>Gotta Catch 'Em All!</Text>
        </Animated.View>

        {/* Premium Search Section */}
        <View style={styles.searchSection}>
          <Animated.View style={[
            styles.searchContainer,
            {
              transform: [{
                translateY: floatAnim.interpolate({
                  inputRange: [-10, 0],
                  outputRange: [-2, 0],
                })
              }]
            }
          ]}>
            {/* Glowing border effect */}
            <Animated.View style={[
              styles.searchGlowBorder,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
              }
            ]}>
              <LinearGradient
                colors={['#FFD700', '#FF69B4', '#00CED1', '#FFD700']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glowGradient}
              />
            </Animated.View>
            
            <BlurView intensity={40} tint="dark" style={styles.searchBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                style={styles.searchGradientOverlay}
              >
                <View style={styles.inputWrapper}>
                  {/* Animated Search Icon */}
                  <Animated.View style={{
                    transform: [{
                      rotate: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }}>
                    <Ionicons name="search-circle" size={24} color="rgba(255,215,0,0.7)" />
                  </Animated.View>
                  
                  <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder="Name or Number"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    onSubmitEditing={handleSearch}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  
                  {/* Premium Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={handleSearch}
                      activeOpacity={0.7}
                      style={styles.actionButton}
                    >
                      <LinearGradient
                        colors={['#4A90E2', '#357ABD']}
                        style={styles.gradientButton}
                      >
                        <Ionicons name="search" size={18} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={getRandomPokemon}
                      activeOpacity={0.7}
                      style={styles.actionButton}
                    >
                      <Animated.View style={{
                        transform: [{
                          rotate: cardGlowAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          })
                        }]
                      }}>
                        <LinearGradient
                          colors={['#FFD700', '#FFA500']}
                          style={styles.gradientButton}
                        >
                          <Ionicons name="dice" size={18} color="#FFFFFF" />
                        </LinearGradient>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <Animated.View style={styles.suggestionsContainer}>
                <BlurView intensity={30} tint="dark" style={styles.suggestionsBlur}>
                  {suggestions.map((pokemon, index) => (
                    <TouchableOpacity
                      key={pokemon}
                      style={[
                        styles.suggestionItem,
                        index === suggestions.length - 1 && styles.lastSuggestion
                      ]}
                      onPress={() => selectSuggestion(pokemon)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.suggestionContent}>
                        <Ionicons name="sparkles" size={14} color="rgba(255,215,0,0.6)" />
                        <Text style={styles.suggestionText}>
                          {pokemon.charAt(0).toUpperCase() + pokemon.slice(1)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                  ))}
                </BlurView>
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {/* Pokemon Card Stack */}
        <View style={styles.cardStackContainer}>
          <View style={{ width: width - 60, height: 430, position: 'relative' }}>
            {pokemonStack.slice(currentIndex, currentIndex + 3).map((pokemonId, stackIndex) => (
              <PokemonCardSwipeable
                key={`${pokemonId}-${currentIndex + stackIndex}`}
                pokemonId={pokemonId}
                index={stackIndex}
                isActive={stackIndex === 0}
                onSwipe={() => {
                  if (stackIndex === 0) {
                    setCurrentIndex(prev => prev + 1);
                    // Add a new random Pokemon to the end of the stack
                    const newPokemon = getRandomPokemonNames(1);
                    setPokemonStack(prev => [...prev, ...newPokemon]);
                  }
                }}
                onTypeChange={setCurrentPokemonType}
                shimmerAnim={shimmerAnim}
                floatAnim={floatAnim}
                cardGlowAnim={cardGlowAnim}
              />
            )).reverse()}
          </View>
        </View>

        {/* Card Stack Indicator */}
        <View style={styles.stackIndicator}>
          {[0, 1, 2].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                i === 0 && styles.activeDot,
                i === 0 && {
                  transform: [{
                    scale: cardGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    })
                  }]
                }
              ]}
            />
          ))}
        </View>
        
        {/* Premium Footer */}
        <View style={styles.footer}>
          <LinearGradient
            colors={['transparent', 'rgba(255,215,0,0.05)']}
            style={styles.footerGradient}
          >
            <Text style={styles.footerText}>Swipe to Explore</Text>
            <Animated.View style={{
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3],
              })
            }}>
              <Ionicons name="swap-horizontal" size={20} color="rgba(255,215,0,0.6)" />
            </Animated.View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 25,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: -20,
    left: -50,
    right: -50,
    height: 100,
    opacity: 0.3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleBadge: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  titleGradient: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  titleSmall: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  titleAccent: {
    marginLeft: 10,
    position: 'relative',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,215,0,0.6)',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 3,
    textShadowColor: '#FF6347',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 15,
  },
  searchSection: {
    marginHorizontal: 15,
    marginBottom: 20,
    zIndex: 9998,
  },
  searchContainer: {
    position: 'relative',
    zIndex: 9999,
  },
  searchGlowBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 26,
    zIndex: -1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 26,
  },
  searchGradientOverlay: {
    flex: 1,
    borderRadius: 24,
  },
  searchBlur: {
    height: 52,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,40,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerGradient: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardStackContainer: {
    height: 460,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 0,
    zIndex: 1,
  },
  pokemonCard: {
    position: 'absolute',
    width: width - 60,
    height: 430,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 25,
    padding: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  shimmer: {
    position: 'absolute',
    top: -50,
    left: -200,
    right: -200,
    bottom: -50,
    width: 300,
    zIndex: 10,
  },
  shimmerGradient: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    paddingBottom: 35,
    paddingHorizontal: 15,
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardFrame: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderRadius: 18,
    borderWidth: 6,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardFrameInner: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginTop: 3,
    marginBottom: 3,
    width: '85%',
    alignSelf: 'center',
  },
  pokemonNameHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,100,100,1)',
  },
  hpValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pokemonIdBadge: {
    position: 'absolute',
    top: 38,
    right: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  pokemonIdText: {
    color: 'rgba(255,215,0,0.9)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  artFrame: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 6,
    marginHorizontal: 0,
    marginTop: 3,
    marginBottom: 3,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  artBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  stageName: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 5,
    fontStyle: 'italic',
  },
  imageContainer: {
    width: 130,
    height: 130,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  pokemonImage: {
    width: 120,
    height: 120,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: 100,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  movesContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 0,
    marginBottom: 6,
    gap: 6,
    width: '85%',
    alignSelf: 'center',
  },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  energyBadge: {
    flexDirection: 'row',
    gap: 3,
  },
  energyIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  moveName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moveDamage: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    minWidth: 35,
    textAlign: 'right',
  },
  bottomStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    marginBottom: 8,
    marginTop: 3,
    width: '60%',
    alignSelf: 'center',
  },
  weaknessResistance: {
    alignItems: 'center',
  },
  statMiniLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 3,
  },
  typeMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  retreatCost: {
    flexDirection: 'row',
  },
  retreatText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  cardSetInfo: {
    position: 'absolute',
    bottom: 15,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSetText: {
    color: 'rgba(255,215,0,0.6)',
    fontSize: 8,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  raritySymbol: {
    fontSize: 12,
    color: 'rgba(255,215,0,0.8)',
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    fontWeight: '600',
  },
  copyright: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    fontSize: 6,
    color: 'rgba(255,255,255,0.3)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  bubble: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  backgroundOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  orb1: {
    top: -100,
    left: -100,
  },
  orb2: {
    bottom: -100,
    right: -100,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 150,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    zIndex: 10000,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 100,
  },
  suggestionsBlur: {
    backgroundColor: 'rgba(20,20,40,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    borderRadius: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lastSuggestion: {
    borderBottomWidth: 0,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  swipeHint: {
    position: 'absolute',
    top: '45%',
    marginTop: -10,
    zIndex: 20,
  },
  swipeHintLeft: {
    left: 10,
  },
  swipeHintRight: {
    right: 10,
  },
});