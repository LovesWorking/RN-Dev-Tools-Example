import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Text,
} from 'react-native';
import { gameUIColors } from '../../../_shared/ui/gameUI';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Configuration
const CONFIG = {
  starCount: 30,
  starSize: 2,
  gameSpeed: 1000,
  speedMultiplier: 0.08,
  rocketSpeed: 16,
  alienRocketSpeed: 8,
  rocketCoolDown: 500,
  explosionDuration: 400,
  aliensPerRow: 6,
  alienRows: 3,
  alienSize: 35,
  cannonSize: 45,
  alienHorDistance: 20,
  alienVerDistance: 20,
  alienHorStep: 15,
  alienVerStep: 20,
  shootingProbability: 0.015,
  maxRocketsOnScreen: 4,
  numberOfLives: 3,
};

// Sprites - using simple shapes for better performance
const SPRITES = {
  explosion: '💥',
};

interface AlienType {
  id: string;
  x: number;
  y: number;
  type: number;
  alive: boolean;
}

interface RocketType {
  id: string;
  x: number;
  y: number;
  isPlayer: boolean;
}

interface ExplosionType {
  id: string;
  x: number;
  y: number;
}

interface SpaceInvadersBackgroundProps {
  playerX: number;
  onScoreChange?: (score: number) => void;
  isUserTouching?: boolean;
}

const SpaceInvadersBackground: React.FC<SpaceInvadersBackgroundProps> = ({
  playerX,
  onScoreChange,
  isUserTouching = false,
}) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CONFIG.numberOfLives);
  const [aliens, setAliens] = useState<AlienType[]>([]);
  const [rockets, setRockets] = useState<RocketType[]>([]);
  const [explosions, setExplosions] = useState<ExplosionType[]>([]);
  const [stars, setStars] = useState<Array<{x: number, y: number}>>([]);
  
  const alienDirection = useRef(1);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerCanFire = useRef(true);
  const frameCount = useRef(0);
  const playerXRef = useRef(playerX);
  const autoMoveDirection = useRef(1);
  const currentPlayerX = useRef(SCREEN_WIDTH / 2);

  // Update player position
  useEffect(() => {
    if (isUserTouching) {
      playerXRef.current = playerX;
      currentPlayerX.current = playerX;
    }
  }, [playerX, isUserTouching]);

  // Initialize stars
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
      newStars.push({
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
      });
    }
    setStars(newStars);
  }, []);

  // Initialize aliens
  const initializeAliens = useCallback(() => {
    const newAliens: AlienType[] = [];
    const startX = (SCREEN_WIDTH - (CONFIG.aliensPerRow * (CONFIG.alienSize + CONFIG.alienHorDistance))) / 2;
    
    for (let row = 0; row < CONFIG.alienRows; row++) {
      for (let col = 0; col < CONFIG.aliensPerRow; col++) {
        newAliens.push({
          id: `alien-${row}-${col}`,
          x: startX + col * (CONFIG.alienSize + CONFIG.alienHorDistance),
          y: 120 + row * (CONFIG.alienSize + CONFIG.alienVerDistance),
          type: row % 3,
          alive: true,
        });
      }
    }
    setAliens(newAliens);
    alienDirection.current = 1;
  }, []);

  // Initialize game
  useEffect(() => {
    initializeAliens();
  }, [initializeAliens]);

  // Manual fire on touch
  useEffect(() => {
    if (isUserTouching && playerCanFire.current && rockets.length < CONFIG.maxRocketsOnScreen) {
      setRockets(prev => [...prev, {
        id: `rocket-${Date.now()}`,
        x: playerXRef.current,
        y: SCREEN_HEIGHT - 140,
        isPlayer: true,
      }]);
      playerCanFire.current = false;
      setTimeout(() => {
        playerCanFire.current = true;
      }, CONFIG.rocketCoolDown);
    }
  }, [isUserTouching, rockets.length]);

  // Auto move and fire when not touching
  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      if (!isUserTouching) {
        // Auto move
        currentPlayerX.current += autoMoveDirection.current * 3;
        if (currentPlayerX.current <= 40 || currentPlayerX.current >= SCREEN_WIDTH - 40) {
          autoMoveDirection.current *= -1;
        }
        playerXRef.current = currentPlayerX.current;
        
        // Auto fire occasionally
        if (Math.random() < 0.1 && playerCanFire.current && rockets.length < CONFIG.maxRocketsOnScreen) {
          setRockets(prev => [...prev, {
            id: `rocket-${Date.now()}`,
            x: playerXRef.current,
            y: SCREEN_HEIGHT - 140,
            isPlayer: true,
          }]);
          playerCanFire.current = false;
          setTimeout(() => {
            playerCanFire.current = true;
          }, CONFIG.rocketCoolDown);
        }
      }
    }, 50);

    return () => clearInterval(autoPlayInterval);
  }, [isUserTouching, rockets.length]);

  // Main game loop
  useEffect(() => {
    // Clear any existing interval before creating a new one
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }
    
    gameLoop.current = setInterval(() => {
      frameCount.current++;

      // Move aliens
      if (frameCount.current % 30 === 0) {
        setAliens(prevAliens => {
          let shouldDrop = false;
          const movedAliens = prevAliens.map(alien => {
            if (!alien.alive) return alien;
            
            const newX = alien.x + (alienDirection.current * CONFIG.alienHorStep);
            if (newX <= 20 || newX >= SCREEN_WIDTH - CONFIG.alienSize - 20) {
              shouldDrop = true;
            }
            return { ...alien, x: newX };
          });

          if (shouldDrop) {
            alienDirection.current *= -1;
            return movedAliens.map(alien => ({
              ...alien,
              y: alien.y + CONFIG.alienVerStep,
            }));
          }

          return movedAliens;
        });

        // Alien shooting
        setAliens(prevAliens => {
          const aliveAliens = prevAliens.filter(a => a.alive);
          if (aliveAliens.length > 0 && Math.random() < CONFIG.shootingProbability * aliveAliens.length) {
            const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            setRockets(prev => [...prev, {
              id: `alien-rocket-${Date.now()}`,
              x: shooter.x + CONFIG.alienSize / 2,
              y: shooter.y + CONFIG.alienSize,
              isPlayer: false,
            }]);
          }
          return prevAliens;
        });
      }

      // Move rockets
      setRockets(prevRockets => 
        prevRockets
          .map(rocket => ({
            ...rocket,
            y: rocket.y + (rocket.isPlayer ? -CONFIG.rocketSpeed : CONFIG.alienRocketSpeed),
          }))
          .filter(rocket => rocket.y > 0 && rocket.y < SCREEN_HEIGHT)
      );

      // Check collisions
      setRockets(prevRockets => {
        const remainingRockets = [...prevRockets];
        const toRemove: string[] = [];

        remainingRockets.forEach(rocket => {
          if (rocket.isPlayer) {
            setAliens(prevAliens => 
              prevAliens.map(alien => {
                if (!alien.alive) return alien;
                
                const dist = Math.abs(rocket.x - alien.x) + Math.abs(rocket.y - alien.y);
                if (dist < CONFIG.alienSize) {
                  toRemove.push(rocket.id);
                  setScore(prev => {
                    const newScore = prev + (10 * (3 - alien.type));
                    onScoreChange?.(newScore);
                    return newScore;
                  });
                  setExplosions(prev => [...prev, {
                    id: `explosion-${Date.now()}`,
                    x: alien.x,
                    y: alien.y,
                  }]);
                  setTimeout(() => {
                    setExplosions(prev => prev.filter(e => e.id !== `explosion-${Date.now()}`));
                  }, CONFIG.explosionDuration);
                  return { ...alien, alive: false };
                }
                return alien;
              })
            );
          } else {
            // Check collision with player tank at bottom
            const playerDist = Math.abs(rocket.x - playerXRef.current) + 
                              Math.abs(rocket.y - (SCREEN_HEIGHT - 60));
            if (playerDist < CONFIG.cannonSize) {
              toRemove.push(rocket.id);
              setLives(prev => Math.max(0, prev - 1));
              setExplosions(prev => [...prev, {
                id: `player-explosion-${Date.now()}`,
                x: playerXRef.current,
                y: SCREEN_HEIGHT - 60,
              }]);
            }
          }
        });

        return remainingRockets.filter(r => !toRemove.includes(r.id));
      });

      // Check if all aliens are dead
      setAliens(prevAliens => {
        if (prevAliens.every(a => !a.alive)) {
          initializeAliens();
          return prevAliens;
        }
        return prevAliens;
      });
    }, 33); // ~30 FPS

    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, [initializeAliens, onScoreChange]);

  // Clear explosions
  useEffect(() => {
    const timer = setInterval(() => {
      setExplosions(prev => prev.filter(e => {
        const age = Date.now() - parseInt(e.id.split('-').pop() || '0');
        return age < CONFIG.explosionDuration;
      }));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Stars background */}
      {stars.map((star, idx) => (
        <View
          key={`star-${idx}`}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: CONFIG.starSize,
              height: CONFIG.starSize,
            },
          ]}
        />
      ))}

      {/* Score */}
      <Text style={styles.score}>SCORE: {score}</Text>
      
      {/* Lives */}
      <View style={styles.livesContainer}>
        {Array.from({ length: lives }).map((_, idx) => (
          <Text key={`life-${idx}`} style={styles.life}>❤️</Text>
        ))}
      </View>

      {/* Aliens - simple squares */}
      {aliens.map(alien => (
        alien.alive && (
          <View
            key={alien.id}
            style={[
              styles.alien,
              {
                left: alien.x,
                top: alien.y,
                width: CONFIG.alienSize,
                height: CONFIG.alienSize,
                backgroundColor: alien.type === 0 ? gameUIColors.warning : 
                               alien.type === 1 ? gameUIColors.error : 
                               gameUIColors.critical,
              },
            ]}
          />
        )
      ))}

      {/* Rockets */}
      {rockets.map(rocket => (
        <View
          key={rocket.id}
          style={[
            rocket.isPlayer ? styles.playerRocket : styles.alienRocket,
            {
              left: rocket.x - 2,
              top: rocket.y,
            },
          ]}
        />
      ))}

      {/* Explosions */}
      {explosions.map(explosion => (
        <Text
          key={explosion.id}
          style={[
            styles.explosion,
            {
              left: explosion.x,
              top: explosion.y,
            },
          ]}
        >
          {SPRITES.explosion}
        </Text>
      ))}

      {/* Player tank at bottom */}
      <View
        style={[
          styles.tank,
          {
            left: (isUserTouching ? playerX : currentPlayerX.current) - CONFIG.cannonSize / 2,
            bottom: 40,
          },
        ]}
      >
        {/* Tank barrel */}
        <View style={styles.tankBarrel} />
        {/* Tank body */}
        <View style={styles.tankBody} />
        {/* Tank tracks */}
        <View style={styles.tankTracks} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  star: {
    position: 'absolute',
    backgroundColor: gameUIColors.primary + '66',
    borderRadius: 2,
    shadowColor: gameUIColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  score: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: gameUIColors.critical,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: gameUIColors.critical,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  livesContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
  },
  life: {
    fontSize: 20,
    marginLeft: 4,
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  alien: {
    position: 'absolute',
    opacity: 0.85,
    borderRadius: 4,
    shadowColor: gameUIColors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  playerRocket: {
    position: 'absolute',
    width: 4,
    height: 12,
    backgroundColor: gameUIColors.critical,
    borderRadius: 2,
    shadowColor: gameUIColors.critical,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  alienRocket: {
    position: 'absolute',
    width: 4,
    height: 8,
    backgroundColor: gameUIColors.warning + 'DD',
    borderRadius: 2,
    shadowColor: gameUIColors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  explosion: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.9,
  },
  tank: {
    position: 'absolute',
    width: CONFIG.cannonSize,
    height: CONFIG.cannonSize,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tankBarrel: {
    position: 'absolute',
    width: 6,
    height: 20,
    backgroundColor: gameUIColors.primary + 'DD',
    bottom: 15,
    borderRadius: 2,
    shadowColor: gameUIColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  tankBody: {
    width: 35,
    height: 20,
    backgroundColor: gameUIColors.success + 'CC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.success,
    shadowColor: gameUIColors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  tankTracks: {
    width: 40,
    height: 8,
    backgroundColor: gameUIColors.muted + 'AA',
    borderRadius: 2,
    marginTop: -2,
  },
});

export default SpaceInvadersBackground;