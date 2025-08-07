import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { usePokemon } from '../_hooks/usePokemon';
import { pokemonStore } from './_layout';
import { PokemonCard } from '../_components/PokemonCard';
import { PokemonSearchBar } from '../_components/PokemonSearchBar';
import { PokemonTheme } from '@/constants/PokemonTheme';
import { getTypeColor } from '../_utils/pokemonTypeColors';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState('pikachu');
  const [inputValue, setInputValue] = useState('');
  const { data, error, isLoading } = usePokemon(pokemonName);
  const [isChangingPokemon, setIsChangingPokemon] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array(10).fill(0).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random()),
    }))
  ).current;

  // Particle animation
  useEffect(() => {
    particleAnims.forEach((particle) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(particle.y, {
              toValue: -50,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: height + 50,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 2000,
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
      
      // Fade out animation
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
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Update store
      if (data?.types?.length) {
        pokemonStore.setState({ currentPokemonType: data.types[0] });
      }
    }
  }, [data, isChangingPokemon]);

  // Get gradient colors based on Pokemon type
  const getBackgroundGradient = () => {
    if (!data?.types?.length) return PokemonTheme.gradients.dark;
    const mainType = data.types[0];
    return PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] 
      || PokemonTheme.gradients.dark;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getBackgroundGradient()}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Animated Particles */}
      {particleAnims.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with glass effect */}
        <BlurView intensity={30} tint="dark" style={styles.header}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent']}
            style={styles.headerGradient}
          />
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>POKÉDEX</Text>
              <View style={styles.titleGlow} />
            </View>
            <Text style={styles.subtitle}>Gotta Catch 'Em All!</Text>
          </View>
        </BlurView>

        {/* Search Bar */}
        <PokemonSearchBar
          value={inputValue}
          onChangeText={setInputValue}
          onSearch={handleSearch}
          onRandom={getRandomPokemon}
          isLoading={isLoading || isChangingPokemon}
        />

        {/* Pokemon Display */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {isLoading || isChangingPokemon ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>❌</Text>
              <Text style={styles.errorText}>Pokemon not found!</Text>
              <Text style={styles.errorHint}>Try "Charizard" or "Mew"</Text>
            </View>
          ) : data ? (
            <PokemonCard pokemon={data} />
          ) : null}
        </Animated.View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    height: 120,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'relative',
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
  titleGlow: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    bottom: 0,
    backgroundColor: '#FFD700',
    opacity: 0.2,
    borderRadius: 20,
    ...PokemonTheme.shadows.neon('#FFD700'),
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    letterSpacing: 2,
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
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 60,
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
    color: 'rgba(255, 255, 255, 0.5)',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
  },
});

export default HomeScreen;