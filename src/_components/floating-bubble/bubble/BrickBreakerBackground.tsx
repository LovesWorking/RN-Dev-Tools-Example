import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameUIColors } from '../../../_shared/ui/gameUI';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Configuration
const CONFIG = {
  paddleWidth: 90,
  paddleHeight: 14,
  paddleBottom: 40, // Moved closer to bottom (was 80)
  ballSize: 10,
  ballSpeed: 5,
  brickRows: 12, // Way more rows (was 5)
  brickCols: 14, // Way more columns (was 8)
  brickWidth: (SCREEN_WIDTH - 40) / 14, // Smaller width
  brickHeight: 12, // Much thinner bricks (was 25)
  brickPadding: 1, // Tighter spacing
  brickOffsetTop: 80,
  brickOffsetLeft: 20,
  lives: 3,
  scorePerBrick: 5, // Less points per brick since there are more
  bonusPerRow: 2, // Less bonus per row
};

interface BrickType {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  isVisible: boolean;
}

interface BrickBreakerBackgroundProps {
  paddleX?: number;
  isUserControlling?: boolean;
  onScoreChange?: (score: number) => void;
  onGameOver?: () => void;
}

const BrickBreakerBackground: React.FC<BrickBreakerBackgroundProps> = ({
  paddleX: userPaddleX,
  isUserControlling = false,
  onScoreChange,
  onGameOver,
}) => {
  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(CONFIG.lives);
  const [bricks, setBricks] = useState<BrickType[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Ball state
  const ballX = useRef(SCREEN_WIDTH / 2);
  const ballY = useRef(SCREEN_HEIGHT / 2);
  const ballVelocityX = useRef(CONFIG.ballSpeed);
  const ballVelocityY = useRef(-CONFIG.ballSpeed);
  
  // Paddle state
  const paddleX = useRef(SCREEN_WIDTH / 2 - CONFIG.paddleWidth / 2);
  const autoPaddleTarget = useRef(SCREEN_WIDTH / 2);
  
  // Game loop
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ballPosition, setBallPosition] = useState({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
  const [paddlePosition, setPaddlePosition] = useState(SCREEN_WIDTH / 2 - CONFIG.paddleWidth / 2);

  // Load high score
  useEffect(() => {
    AsyncStorage.getItem('brickBreakerHighScore').then((value: string | null) => {
      if (value) setHighScore(parseInt(value));
    });
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      AsyncStorage.setItem('brickBreakerHighScore', score.toString());
    }
  }, [score, highScore]);

  // Initialize bricks
  const initializeBricks = useCallback(() => {
    const newBricks: BrickType[] = [];
    const brickColor = gameUIColors.info; // Cyan/blue color for all bricks
    
    for (let row = 0; row < CONFIG.brickRows; row++) {
      for (let col = 0; col < CONFIG.brickCols; col++) {
        newBricks.push({
          x: col * (CONFIG.brickWidth + CONFIG.brickPadding) + CONFIG.brickOffsetLeft,
          y: row * (CONFIG.brickHeight + CONFIG.brickPadding) + CONFIG.brickOffsetTop,
          width: CONFIG.brickWidth,
          height: CONFIG.brickHeight,
          color: brickColor,
          points: CONFIG.scorePerBrick + (CONFIG.brickRows - row) * CONFIG.bonusPerRow,
          isVisible: true,
        });
      }
    }
    setBricks(newBricks);
  }, []);

  // Initialize game
  useEffect(() => {
    initializeBricks();
    setGameStarted(true);
  }, [initializeBricks]);

  // Update paddle position
  useEffect(() => {
    if (isUserControlling && userPaddleX !== undefined) {
      paddleX.current = Math.max(0, Math.min(SCREEN_WIDTH - CONFIG.paddleWidth, userPaddleX - CONFIG.paddleWidth / 2));
    }
  }, [userPaddleX, isUserControlling]);

  // Main game loop
  useEffect(() => {
    if (!gameStarted) return;

    // Clear any existing interval before creating a new one
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }

    gameLoop.current = setInterval(() => {
      // Move ball
      ballX.current += ballVelocityX.current;
      ballY.current += ballVelocityY.current;

      // Ball collision with walls
      if (ballX.current <= CONFIG.ballSize / 2 || ballX.current >= SCREEN_WIDTH - CONFIG.ballSize / 2) {
        ballVelocityX.current *= -1;
      }
      if (ballY.current <= CONFIG.ballSize / 2) {
        ballVelocityY.current *= -1;
      }

      // Auto-play paddle movement (always tracks ball when not user controlled)
      if (!isUserControlling) {
        // Perfect tracking for auto-play - paddle always catches the ball
        autoPaddleTarget.current = ballX.current - CONFIG.paddleWidth / 2;
        const paddleSpeed = 12; // Faster paddle for better tracking
        const diff = autoPaddleTarget.current - paddleX.current;
        
        if (Math.abs(diff) > paddleSpeed) {
          paddleX.current += diff > 0 ? paddleSpeed : -paddleSpeed;
        } else {
          paddleX.current = autoPaddleTarget.current;
        }
        
        paddleX.current = Math.max(0, Math.min(SCREEN_WIDTH - CONFIG.paddleWidth, paddleX.current));
      }

      // Ball collision with paddle
      const paddleTop = SCREEN_HEIGHT - CONFIG.paddleBottom - CONFIG.paddleHeight;
      if (
        ballY.current + CONFIG.ballSize / 2 >= paddleTop &&
        ballY.current - CONFIG.ballSize / 2 <= paddleTop + CONFIG.paddleHeight &&
        ballX.current >= paddleX.current &&
        ballX.current <= paddleX.current + CONFIG.paddleWidth
      ) {
        ballVelocityY.current = -Math.abs(ballVelocityY.current);
        
        // Add spin based on where ball hits paddle
        const hitPos = (ballX.current - paddleX.current) / CONFIG.paddleWidth;
        const newXVelocity = 8 * (hitPos - 0.5);
        
        // Prevent ball from going straight up/down by ensuring minimum X velocity
        if (Math.abs(newXVelocity) < 1.5) {
          // Add random slight angle if hit too close to center
          ballVelocityX.current = (Math.random() > 0.5 ? 1.5 : -1.5) + (Math.random() - 0.5);
        } else {
          ballVelocityX.current = newXVelocity;
        }
        
        // Limit maximum X velocity to prevent ball from going too horizontal
        ballVelocityX.current = Math.max(-6, Math.min(6, ballVelocityX.current));
      }

      // Ball out of bounds (only if user is controlling)
      if (ballY.current > SCREEN_HEIGHT) {
        if (isUserControlling) {
          // User loses a life
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              onGameOver?.();
            }
            return newLives;
          });
        }
        // Reset ball with random angle to prevent vertical bouncing
        ballX.current = SCREEN_WIDTH / 2;
        ballY.current = SCREEN_HEIGHT / 2;
        // Ensure ball doesn't start straight up/down
        const randomAngle = (Math.random() * 0.6 - 0.3) + (Math.random() > 0.5 ? 0.5 : -0.5);
        ballVelocityX.current = CONFIG.ballSpeed * randomAngle * 2;
        ballVelocityY.current = -CONFIG.ballSpeed;
      }

      // Ball collision with bricks - only check if we haven't hit a brick this frame
      let brickHit = false;
      setBricks(prevBricks => {
        if (brickHit) return prevBricks; // Already hit a brick this frame
        
        const newBricks = [...prevBricks];
        
        for (let i = 0; i < newBricks.length; i++) {
          const brick = newBricks[i];
          if (!brick.isVisible) continue;
          
          if (
            ballX.current + CONFIG.ballSize / 2 >= brick.x &&
            ballX.current - CONFIG.ballSize / 2 <= brick.x + brick.width &&
            ballY.current + CONFIG.ballSize / 2 >= brick.y &&
            ballY.current - CONFIG.ballSize / 2 <= brick.y + brick.height
          ) {
            brick.isVisible = false;
            brickHit = true; // Mark that we hit a brick
            
            // Update score
            setScore(prev => {
              const newScore = prev + brick.points;
              onScoreChange?.(newScore);
              return newScore;
            });
            
            // Determine which side was hit for proper bounce
            const ballCenterX = ballX.current;
            const ballCenterY = ballY.current;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;
            
            const xDist = Math.abs(ballCenterX - brickCenterX);
            const yDist = Math.abs(ballCenterY - brickCenterY);
            
            if (xDist > yDist) {
              ballVelocityX.current *= -1;
            } else {
              ballVelocityY.current *= -1;
            }
            
            break; // Only break one brick per frame
          }
        }
        
        // Check if all bricks are destroyed
        if (newBricks.every(b => !b.isVisible)) {
          // Reset level with new bricks
          initializeBricks();
          // Increase ball speed slightly
          const speedIncrease = 1.1;
          ballVelocityX.current *= speedIncrease;
          ballVelocityY.current *= speedIncrease;
        }
        
        return newBricks;
      });

      // Update visual positions
      setBallPosition({ x: ballX.current, y: ballY.current });
      setPaddlePosition(paddleX.current);
    }, 16); // ~60 FPS

    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, [gameStarted, isUserControlling, initializeBricks, onScoreChange, onGameOver]);

  return (
    <View style={styles.container}>
      {/* Score and lives display */}
      <View style={styles.header}>
        <Text style={styles.scoreText}>SCORE: {score}</Text>
        <Text style={styles.highScoreText}>HIGH: {highScore}</Text>
        <View style={styles.livesContainer}>
          {Array.from({ length: lives }).map((_, idx) => (
            <Text key={`life-${idx}`} style={styles.life}>❤️</Text>
          ))}
        </View>
      </View>

      {/* Bricks */}
      {bricks.map((brick, idx) => (
        brick.isVisible && (
          <View
            key={`brick-${idx}`}
            style={[
              styles.brick,
              {
                left: brick.x,
                top: brick.y,
                width: brick.width,
                height: brick.height,
                backgroundColor: brick.color + 'BB',
                shadowColor: brick.color,
              },
            ]}
          />
        )
      ))}

      {/* Ball */}
      <View
        style={[
          styles.ball,
          {
            left: ballPosition.x - CONFIG.ballSize / 2,
            top: ballPosition.y - CONFIG.ballSize / 2,
          },
        ]}
      />

      {/* Paddle */}
      <View
        style={[
          styles.paddle,
          {
            left: paddlePosition,
            bottom: CONFIG.paddleBottom,
          },
        ]}
      />

      {/* Control hint */}
      {!isUserControlling && (
        <Text style={styles.hintText}>TOUCH TO CONTROL</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    top: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  scoreText: {
    color: gameUIColors.success,
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: gameUIColors.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  highScoreText: {
    color: gameUIColors.warning,
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: gameUIColors.warning,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  livesContainer: {
    flexDirection: 'row',
  },
  life: {
    fontSize: 18,
    marginLeft: 4,
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  brick: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  ball: {
    position: 'absolute',
    width: CONFIG.ballSize,
    height: CONFIG.ballSize,
    borderRadius: CONFIG.ballSize / 2,
    backgroundColor: gameUIColors.primary + 'FF',
    borderWidth: 1,
    borderColor: gameUIColors.primary,
    shadowColor: gameUIColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  paddle: {
    position: 'absolute',
    width: CONFIG.paddleWidth,
    height: CONFIG.paddleHeight,
    backgroundColor: gameUIColors.info + 'EE', // Changed to cyan/blue
    borderRadius: 7,
    borderWidth: 2,
    borderColor: gameUIColors.primary,
    shadowColor: gameUIColors.info, // Changed to cyan/blue
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  hintText: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    color: gameUIColors.muted + '66',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
});

export default BrickBreakerBackground;