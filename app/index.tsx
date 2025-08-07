import React, { useState, useEffect, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

export default function PokemonScreen() {
  const [pokemonName, setPokemonName] = useState('pikachu');
  const [inputValue, setInputValue] = useState('');
  const { data, error, isLoading } = usePokemon(pokemonName);
  const [isChangingPokemon, setIsChangingPokemon] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  // Floating particles - lots of them!
  const particleAnims = useRef(
    Array(30).fill(0).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random()),
      scale: new Animated.Value(Math.random() * 0.8 + 0.2),
    }))
  ).current;

  useEffect(() => {
    // Card entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 30,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Floating animation for card
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
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

    // 3D rotation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(rotateX, {
            toValue: 0.03,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateX, {
            toValue: -0.03,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateY, {
            toValue: 0.05,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(rotateY, {
            toValue: -0.05,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Glow pulse for Pokemon
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Animate floating particles
    particleAnims.forEach((particle, index) => {
      // Random starting position
      particle.x.setValue(Math.random() * width);
      particle.y.setValue(Math.random() * height);
      
      Animated.loop(
        Animated.parallel([
          // Float up
          Animated.sequence([
            Animated.timing(particle.y, {
              toValue: -50,
              duration: 10000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: height + 50,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          // Fade in and out
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.8,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          // Slight horizontal movement
          Animated.sequence([
            Animated.timing(particle.x, {
              toValue: particle.x._value + 30,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.x, {
              toValue: particle.x._value - 30,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, []);

  // Handle search
  function handleSearch() {
    if (inputValue.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsChangingPokemon(true);
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setPokemonName(inputValue.trim().toLowerCase());
        setInputValue('');
      });
    }
  }

  // Random Pokemon
  function getRandomPokemon() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsChangingPokemon(true);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const randomId = Math.floor(Math.random() * 1010) + 1;
      setPokemonName(randomId.toString());
      setInputValue('');
    });
  }

  // Reset when data changes
  useEffect(() => {
    if (data && isChangingPokemon) {
      setIsChangingPokemon(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [data, isChangingPokemon]);

  // Get gradient based on Pokemon type
  const getBackgroundGradient = () => {
    if (!data?.types?.length) return PokemonTheme.gradients.dark;
    const mainType = data.types[0];
    return PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] 
      || PokemonTheme.gradients.dark;
  };

  const mainType = data?.types?.[0] || 'normal';
  const gradientColors = PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] 
    || PokemonTheme.gradients.normal;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getBackgroundGradient()}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Floating particles */}
      {particleAnims.map((particle, index) => (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
              backgroundColor: index % 3 === 0 ? '#FFD700' : index % 3 === 1 ? '#FF6B35' : '#4FC3F7',
            },
          ]}
        />
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simple Header like before */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>POKÉDEX</Text>
          <Text style={styles.subtitle}>Gotta Catch 'Em All!</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <BlurView intensity={30} tint="dark" style={styles.searchBlur}>
              <View style={styles.inputWrapper}>
                <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Search Pokémon..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch} activeOpacity={0.7}>
                  <LinearGradient
                    colors={PokemonTheme.gradients.electric}
                    style={styles.searchButton}
                  >
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Random Button without dice */}
          <TouchableOpacity onPress={getRandomPokemon} activeOpacity={0.8}>
            <LinearGradient
              colors={PokemonTheme.gradients.rainbow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.randomButton}
            >
              <Ionicons name="shuffle" size={24} color="#FFFFFF" />
              <Text style={styles.randomText}>SURPRISE ME!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Pokemon Card - Smaller and Floating */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {isLoading || isChangingPokemon ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>😢</Text>
              <Text style={styles.errorText}>Pokemon not found!</Text>
              <Text style={styles.errorHint}>Try "Charizard" or "Mew"</Text>
            </View>
          ) : data ? (
            <View style={styles.cardContainer}>
              <Animated.View
                style={[
                  styles.pokemonCard,
                  {
                    transform: [
                      { translateY: floatAnim },
                      { scale: scaleAnim },
                      { 
                        rotateX: rotateX.interpolate({
                          inputRange: [-0.03, 0.03],
                          outputRange: ['-2deg', '2deg'],
                        }),
                      },
                      {
                        rotateY: rotateY.interpolate({
                          inputRange: [-0.05, 0.05],
                          outputRange: ['-3deg', '3deg'],
                        }),
                      },
                      { perspective: 1000 },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {/* Shimmer effect */}
                  <Animated.View
                    style={[
                      styles.shimmer,
                      {
                        transform: [
                          {
                            translateX: shimmerAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-width, width],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.shimmerGradient}
                    />
                  </Animated.View>

                  <BlurView intensity={15} tint="light" style={styles.cardContent}>
                    {/* Pokemon Image */}
                    <Animated.Image
                      source={{ uri: data.image }}
                      style={[
                        styles.pokemonImage,
                        {
                          transform: [{ scale: glowAnim }],
                        },
                      ]}
                      resizeMode="contain"
                    />

                    {/* Pokemon Name */}
                    <Text style={styles.pokemonName}>{data.name.toUpperCase()}</Text>

                    {/* Types */}
                    <View style={styles.typesContainer}>
                      {data.types.map((type) => (
                        <View
                          key={type}
                          style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}
                        >
                          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                      {data.stats.slice(0, 3).map((stat) => (
                        <View key={stat.name} style={styles.statItem}>
                          <Text style={styles.statValue}>{stat.value}</Text>
                          <Text style={styles.statLabel}>
                            {stat.name.slice(0, 3).toUpperCase()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </BlurView>
                </LinearGradient>
              </Animated.View>
            </View>
          ) : null}
        </Animated.View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    letterSpacing: 2,
  },
  searchSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchBlur: {
    height: 55,
    borderRadius: 27.5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    ...PokemonTheme.shadows.card,
  },
  randomText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 10,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pokemonCard: {
    width: width - 60,
    height: 420,
    borderRadius: 25,
    ...PokemonTheme.shadows.card,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 25,
    padding: 2,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 10,
  },
  shimmerGradient: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    borderRadius: 23,
    padding: 20,
    alignItems: 'center',
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  loadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  errorContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 70,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorHint: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});