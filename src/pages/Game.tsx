import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { soundUtils } from '@/utils/soundUtils';

interface Word {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  type: 'normal' | 'bonus' | 'speed' | 'freeze' | 'bomb';
  points: number;
}

interface GameStats {
  level: number;
  score: number;
  speed: number;
  lives: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  wpm: number;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  speed: number;
  wordFrequency: number;
  lives: number;
  wordLengthMin: number;
  wordLengthMax: number;
}

const GAME_MODES: GameMode[] = [
  {
    id: 'chill',
    name: 'Chill Ride',
    description: 'Easy Mode',
    speed: 5,
    wordFrequency: 6000, // 6 seconds
    lives: 5,
    wordLengthMin: 2,
    wordLengthMax: 3
  },
  {
    id: 'cruise',
    name: 'Cruise Control',
    description: 'Medium Mode',
    speed: 20,
    wordFrequency: 5000, // 5 seconds
    lives: 3,
    wordLengthMin: 2,
    wordLengthMax: 5
  },
  {
    id: 'beast',
    name: 'Beast Mode',
    description: 'Hard Mode',
    speed: 30,
    wordFrequency: 4000, // 4 seconds
    lives: 1,
    wordLengthMin: 4,
    wordLengthMax: 8
  },
  {
    id: 'typing-rookie',
    name: 'Typing Rookie',
    description: 'TYPING Shooter Easy',
    speed: 15,
    wordFrequency: 4000,
    lives: 5,
    wordLengthMin: 3,
    wordLengthMax: 5
  },
  {
    id: 'typing-warrior',
    name: 'Typing Warrior',
    description: 'TYPING Shooter Medium',
    speed: 25,
    wordFrequency: 3000,
    lives: 4,
    wordLengthMin: 4,
    wordLengthMax: 6
  },
  {
    id: 'typing-master',
    name: 'Typing Master',
    description: 'TYPING Shooter Hard',
    speed: 35,
    wordFrequency: 2000,
    lives: 3,
    wordLengthMin: 4,
    wordLengthMax: 8
  }
];

// Special word bank for Chill Ride mode (2-3 letter words)
const CHILL_RIDE_WORDS = [
  // 2-Letter Words
  'at', 'as', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 'is', 'it', 'me', 'no', 'of', 'on', 'or', 'ox', 'to', 'up', 'us', 'we', 'ye', 'am',
  // 3-Letter Words
  'ace', 'bad', 'bag', 'ban', 'bat', 'bed', 'bee', 'beg', 'bet', 'bow', 'box', 'boy', 'bun', 'but', 'buy', 'bye', 'can', 'cap', 'cat', 'cod', 'cop', 'cot', 'cut', 'day', 'dig', 'dip', 'dog', 'dot', 'dry', 'eat', 'egg', 'end', 'fan', 'far', 'fat', 'fin', 'fit', 'fix', 'for', 'fun', 'get', 'gum', 'hat', 'hit', 'hop', 'hot', 'how', 'ice', 'ink', 'jar', 'job', 'joy', 'jet', 'jug', 'key', 'let', 'lip', 'log', 'man', 'map', 'mat', 'nap', 'net', 'new', 'nod', 'not', 'nut', 'opt', 'out', 'pan', 'pat', 'pet', 'pot'
];

export default function Game() {
  const { state } = useApp();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    score: 0,
    speed: 20,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    accuracy: 100,
    wpm: 0
  });
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [gameRunning, setGameRunning] = useState(false);
  const [carPosition, setCarPosition] = useState(50); // percentage from left
  const [nextWordId, setNextWordId] = useState(1);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [firstWordSpawned, setFirstWordSpawned] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(10000); // Dynamic frequency for Chill Ride
  const [gameTimer, setGameTimer] = useState(5); // 5-second timer for all games
  const [gameStarted, setGameStarted] = useState(false);
  const [shots, setShots] = useState<{id: number, x: number, y: number, targetX: number, targetY: number}[]>([]);
  const [nextShotId, setNextShotId] = useState(1);
  
  // New features
  const [powerUps, setPowerUps] = useState<{type: string, timeLeft: number}[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [comboDisplay, setComboDisplay] = useState<{show: boolean, text: string, color: string}>({show: false, text: '', color: ''});
  const [explosions, setExplosions] = useState<{id: number, x: number, y: number}[]>([]);
  const [nextExplosionId, setNextExplosionId] = useState(1);
  const [totalWordsAttempted, setTotalWordsAttempted] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [startTypingTime, setStartTypingTime] = useState<number | null>(null);

  // Global keyboard event listener for direct typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning || !gameStarted) return;
      
      // Prevent default behavior for typing keys
      if (e.key.length === 1 || e.key === 'Backspace') {
        e.preventDefault();
      }
      
      if (e.key === 'Backspace') {
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setCurrentInput(prev => {
          const newInput = prev + e.key;
          
          // Check if typed word matches any visible word
          const matchedWord = words.find(word => 
            word.text.toLowerCase() === newInput.toLowerCase().trim()
          );
          
          if (matchedWord) {
            // Handle word match (same logic as before)
            handleWordMatch(matchedWord);
            return '';
          }
          
          return newInput;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning, gameStarted, words]);

  const handleWordMatch = (matchedWord: Word) => {
    // Track accuracy
    setCorrectWords(prev => prev + 1);
    setTotalWordsAttempted(prev => prev + 1);
    
    // Play correct sound
    soundUtils.playKeySound(true);
    
    // In space mode, create a shooting effect
    if (selectedMode?.id.startsWith('typing-')) {
      const shot = {
        id: nextShotId,
        x: 50, // Start from spaceship position
        y: 85,
        targetX: matchedWord.x,
        targetY: matchedWord.y
      };
      setShots(prev => [...prev, shot]);
      setNextShotId(prev => prev + 1);
      
      // Remove shot and word after a short delay
      setTimeout(() => {
        setShots(prev => prev.filter(s => s.id !== shot.id));
      }, 200);
    }
    
    // Handle special word types and power-ups
    if (matchedWord.type !== 'normal') {
      activatePowerUp(matchedWord.type);
      if (matchedWord.type === 'bomb') {
        soundUtils.playKeySound(false); // Different sound for explosion
      }
    }
    
    // Remove the matched word
    setWords(prev => prev.filter(word => word.id !== matchedWord.id));
    
    // Increment words typed count
    setWordsTyped(prev => {
      const newWordsTyped = prev + 1;
      
      // For Chill Ride mode, decrease frequency gradually with each correct word
      if (selectedMode?.id === 'chill') {
        const reductionAmount = 200; // Reduce by 200ms each correct word
        const minFrequency = 2000; // Minimum 2 seconds
        setCurrentFrequency(prevFreq => Math.max(minFrequency, prevFreq - reductionAmount));
      }
      
      // Check if we've completed 100 words
      if (newWordsTyped >= 100) {
        setGameRunning(false);
      }
      
      return newWordsTyped;
    });
    
    // Update stats with enhanced features
    setGameStats(prev => {
      const newCombo = prev.combo + 1;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);
      const comboMultiplier = Math.floor(newCombo / 5) + 1;
      const basePoints = matchedWord.points || 10;
      const bonusPoints = basePoints * comboMultiplier;
      const newScore = prev.score + bonusPoints;
      const newLevel = Math.floor(newScore / 100) + 1;
      const newSpeed = Math.min(100, 20 + newLevel * 5);
      const newAccuracy = Math.round((correctWords / totalWordsAttempted) * 100);
      
      // Show combo display
      showCombo(newCombo);
      
      // Check for achievements
      if (newCombo === 10) triggerAchievement('combo_master');
      if (newCombo === 25) triggerAchievement('combo_legend');
      if (newScore >= 1000) triggerAchievement('score_1000');
      if (newAccuracy === 100 && totalWordsAttempted >= 10) triggerAchievement('perfect_accuracy');
      
      return {
        ...prev,
        score: newScore,
        level: newLevel,
        speed: newSpeed,
        combo: newCombo,
        maxCombo: newMaxCombo,
        accuracy: newAccuracy
      };
    });
    
    // Move car slightly towards the word
    setCarPosition(prev => {
      const targetX = matchedWord.x;
      return prev + (targetX - prev) * 0.3;
    });
  };

  const wordBank = [
    'speed', 'drive', 'road', 'fast', 'car', 'move', 'race', 'turn', 'brake', 'shift',
    'engine', 'wheel', 'fuel', 'boost', 'drift', 'track', 'lane', 'gear', 'motor', 'cruise',
    'highway', 'street', 'avenue', 'journey', 'travel', 'navigate', 'steer', 'throttle'
  ];

  const spaceWordBank = [
    'star', 'moon', 'sun', 'comet', 'orbit', 'galaxy', 'planet', 'space', 'rocket', 'laser',
    'alien', 'cosmos', 'nebula', 'meteor', 'asteroid', 'satellite', 'universe', 'void',
    'stellar', 'quantum', 'plasma', 'photon', 'neutron', 'supernova', 'wormhole', 'blackhole',
    'starship', 'hyperdrive', 'teleport', 'dimension', 'antimatter', 'graviton'
  ];

  const spawnWord = useCallback(() => {
    console.log('spawnWord called, gameRunning:', gameRunning, 'words.length:', words.length);
    if (!gameRunning || !selectedMode) {
      console.log('Game not running or no mode selected, not spawning word');
      return;
    }
    
    let randomWord;
    if (selectedMode.id === 'chill') {
      // Use special word bank for Chill Ride mode
      randomWord = CHILL_RIDE_WORDS[Math.floor(Math.random() * CHILL_RIDE_WORDS.length)];
    } else if (selectedMode.id.startsWith('typing-')) {
      // Use space word bank for typing modes
      const filteredWords = spaceWordBank.filter(word => 
        word.length >= selectedMode.wordLengthMin && word.length <= selectedMode.wordLengthMax
      );
      randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    } else {
      // Filter words by length based on selected mode for other modes
      const filteredWords = wordBank.filter(word => 
        word.length >= selectedMode.wordLengthMin && word.length <= selectedMode.wordLengthMax
      );
      randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    }
    
    let x, y, speed;
    
    if (selectedMode.id.startsWith('typing-')) {
      // Typing mode: spawn from top edge, spread across the width
      x = Math.random() * 80 + 10; // 10% to 90% across screen width
      y = -10; // Start above the visible area
      speed = selectedMode.speed / 6 + gameStats.level * 0.3;
    } else {
      // Road mode: spawn words more centrally within the road at the top
      const roadWidthAtTop = 40; // Road width at top
      const roadCenterLeft = 50 - roadWidthAtTop / 2 + 5; // Add padding
      const roadCenterRight = 50 + roadWidthAtTop / 2 - 5; // Add padding
      
      x = Math.random() * (roadCenterRight - roadCenterLeft) + roadCenterLeft;
      y = -50; // Start much further back for longer road view
      speed = selectedMode.speed / 6 + gameStats.level * 0.3; // Speed based on selected mode
    }
    
    // Determine word type and points based on chance
    let wordType: 'normal' | 'bonus' | 'speed' | 'freeze' | 'bomb' = 'normal';
    let points = 10;
    
    const typeChance = Math.random();
    if (typeChance < 0.05) { // 5% chance
      wordType = 'bomb';
      points = 50;
    } else if (typeChance < 0.1) { // 5% chance
      wordType = 'freeze';
      points = 30;
    } else if (typeChance < 0.15) { // 5% chance
      wordType = 'speed';
      points = 25;
    } else if (typeChance < 0.25) { // 10% chance
      wordType = 'bonus';
      points = 20;
    }

    const newWord: Word = {
      id: nextWordId,
      text: randomWord,
      x: x,
      y: y,
      speed: speed,
      type: wordType,
      points: points
    };
    
    console.log('Created new word:', newWord);
    
    setWords(prev => {
      console.log('Previous words:', prev.length, 'Adding word:', newWord.text);
      const newWords = [...prev, newWord];
      console.log('New words array length:', newWords.length);
      return newWords;
    });
    setNextWordId(prev => prev + 1);
  }, [gameRunning, selectedMode, gameStats.level, nextWordId, words]);

  // Game timer effect - 5 seconds for all games
  useEffect(() => {
    if (!gameRunning || gameStarted) return;
    
    const timerInterval = setInterval(() => {
      setGameTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [gameRunning, gameStarted]);


  // Spawn words periodically with 10-second delay for first word
  useEffect(() => {
    console.log('Spawn effect running, gameRunning:', gameRunning, 'firstWordSpawned:', firstWordSpawned);
    if (!gameRunning || !gameStarted) return;
    
    // Check if we've reached 100 words
    if (wordsTyped >= 100) {
      setGameRunning(false);
      return;
    }
    
    if (!firstWordSpawned) {
      // First word spawns immediately
      console.log('Setting up first word spawn timeout');
      if (gameRunning) {
        spawnWord();
        setFirstWordSpawned(true);
      }
    } else {
      // Subsequent words spawn at intervals based on current frequency
      const spawnInterval = selectedMode?.id === 'chill' ? currentFrequency : (selectedMode?.wordFrequency || 3000);
      console.log('Setting spawn interval:', spawnInterval);
      
      const intervalId = setInterval(() => {
        console.log('Interval triggered, spawning word');
        if (wordsTyped < 100 && gameRunning) {
          spawnWord();
        }
      }, spawnInterval);
      
      return () => {
        console.log('Cleaning up spawn interval');
        clearInterval(intervalId);
      };
    }
  }, [gameRunning, gameStarted, firstWordSpawned, selectedMode, wordsTyped, currentFrequency]);

  // Handle missing words (combo breaker)
  const handleMissedWord = useCallback(() => {
    setGameStats(prev => ({ ...prev, combo: 0 }));
    setTotalWordsAttempted(prev => prev + 1);
    soundUtils.playKeySound(false);
  }, []);

  // Move words down (or towards spaceship in space mode)
  useEffect(() => {
    if (!gameRunning || !gameStarted) return;
    
    const interval = setInterval(() => {
      setWords(prev => {
        console.log('Movement interval running, gameRunning:', gameRunning, 'gameStarted:', gameStarted, 'words count:', prev.length);
        return prev.map(word => {
          if (selectedMode?.id.startsWith('typing-')) {
            // Space mode: words move towards spaceship (bottom center at 50%)
            const spaceshipX = 50;
            const spaceshipY = 85; // Bottom of screen
            
            // Calculate direction towards spaceship
            const deltaX = spaceshipX - word.x;
            const deltaY = spaceshipY - word.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Add console log to debug movement
            console.log(`Word "${word.text}" at (${word.x.toFixed(1)}, ${word.y.toFixed(1)}) moving to spaceship, distance: ${distance.toFixed(1)}`);
            
            // Prevent division by zero and ensure minimum movement
            if (distance < 1) {
              return word; // Don't move if too close
            }
            
            // Normalize direction and apply speed (increased multiplier for visibility)
            const moveX = (deltaX / distance) * word.speed * 1.0;
            const moveY = (deltaY / distance) * word.speed * 1.2;
            
            return {
              ...word,
              x: word.x + moveX,
              y: word.y + moveY
            };
          } else {
            // Road mode: words move straight down
            return {
              ...word,
              y: word.y + word.speed
            };
          }
        }).filter(word => {
          if (selectedMode?.id.startsWith('typing-')) {
            // Space mode: remove words that reach the spaceship
            const spaceshipX = 50;
            const spaceshipY = 85;
            const distance = Math.sqrt((word.x - spaceshipX) ** 2 + (word.y - spaceshipY) ** 2);
            
            if (distance < 5) {
              // Word hit spaceship - lose a life and break combo
              handleMissedWord();
              setGameStats(stats => ({
                ...stats,
                lives: stats.lives - 1
              }));
              return false;
            }
            return true;
          } else {
            // Road mode: remove words that reach bottom
            if (word.y > 110) {
              // Word hit bottom - lose a life and break combo
              handleMissedWord();
              setGameStats(stats => ({
                ...stats,
                lives: stats.lives - 1
              }));
              return false;
            }
            return true;
          }
        });
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [gameRunning, selectedMode, gameStarted, handleMissedWord]);

  // Move shots
  useEffect(() => {
    if (!gameRunning || !gameStarted) return;
    
    const interval = setInterval(() => {
      setShots(prev => prev.map(shot => {
        const deltaX = shot.targetX - shot.x;
        const deltaY = shot.targetY - shot.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 5) {
          return { ...shot, x: shot.targetX, y: shot.targetY };
        }
        
        const speed = 8;
        const moveX = (deltaX / distance) * speed;
        const moveY = (deltaY / distance) * speed;
        
        return {
          ...shot,
          x: shot.x + moveX,
          y: shot.y + moveY
        };
      }).filter(shot => {
        const distance = Math.sqrt((shot.x - shot.targetX) ** 2 + (shot.y - shot.targetY) ** 2);
        return distance >= 5;
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [gameRunning, gameStarted]);

  // Check for game over
  useEffect(() => {
    if (gameStats.lives <= 0) {
      setGameRunning(false);
    }
  }, [gameStats.lives]);

  // Power-ups effect management
  useEffect(() => {
    if (!gameRunning) return;
    
    const interval = setInterval(() => {
      setPowerUps(prev => prev.filter(powerUp => {
        if (powerUp.timeLeft <= 100) {
          return false;
        }
        return true;
      }).map(powerUp => ({
        ...powerUp,
        timeLeft: powerUp.timeLeft - 100
      })));
    }, 100);
    
    return () => clearInterval(interval);
  }, [gameRunning]);

  // Screen shake effect
  useEffect(() => {
    if (screenShake) {
      const timeout = setTimeout(() => setScreenShake(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [screenShake]);

  // Combo display effect
  useEffect(() => {
    if (comboDisplay.show) {
      const timeout = setTimeout(() => setComboDisplay({show: false, text: '', color: ''}), 2000);
      return () => clearTimeout(timeout);
    }
  }, [comboDisplay.show]);

  // Explosions effect
  useEffect(() => {
    if (!gameRunning) return;
    
    const interval = setInterval(() => {
      setExplosions(prev => prev.filter(explosion => Date.now() - explosion.id < 1000));
    }, 100);
    
    return () => clearInterval(interval);
  }, [gameRunning]);

  // WPM calculation
  useEffect(() => {
    if (gameStartTime && wordsTyped > 0) {
      const timeElapsed = (Date.now() - gameStartTime) / 60000; // minutes
      const wpm = Math.round(wordsTyped / timeElapsed);
      setGameStats(prev => ({ ...prev, wpm }));
    }
  }, [wordsTyped, gameStartTime]);


  const activatePowerUp = (type: string) => {
    switch(type) {
      case 'freeze':
        setPowerUps(prev => [...prev, { type: 'freeze', timeLeft: 5000 }]);
        break;
      case 'speed':
        setPowerUps(prev => [...prev, { type: 'speed', timeLeft: 8000 }]);
        break;
      case 'bomb':
        // Clear all words on screen
        setWords([]);
        setExplosions(prev => [...prev, { id: nextExplosionId, x: 50, y: 50 }]);
        setNextExplosionId(prev => prev + 1);
        setScreenShake(true);
        break;
    }
  };

  const triggerAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
    }
  };

  const showCombo = (combo: number) => {
    if (combo >= 5) {
      let text = '';
      let color = '';
      
      if (combo >= 20) {
        text = 'LEGENDARY!';
        color = '#FFD700';
      } else if (combo >= 15) {
        text = 'UNSTOPPABLE!';
        color = '#FF6B6B';
      } else if (combo >= 10) {
        text = 'AMAZING!';
        color = '#4ECDC4';
      } else {
        text = `${combo}x COMBO!`;
        color = '#95E1D3';
      }
      
      setComboDisplay({ show: true, text, color });
    }
  };

  // No longer need handleInputChange - using global keyboard listener


  const startGame = (mode?: GameMode) => {
    console.log('Starting game...');
    const gameMode = mode || selectedMode;
    if (!gameMode) return;
    
    setSelectedMode(gameMode);
    setGameStats({ 
      level: 1, 
      score: 0, 
      speed: gameMode.speed, 
      lives: gameMode.lives,
      combo: 0,
      maxCombo: 0,
      accuracy: 100,
      wpm: 0
    });
    setWords([]);
    setCurrentInput('');
    setCarPosition(50);
    setNextWordId(1);
    setWordsTyped(0);
    setGameStartTime(Date.now());
    setFirstWordSpawned(false);
    setCurrentFrequency(10000); // Reset frequency for Chill Ride
    setGameTimer(5); // Reset timer to 5 seconds
    setGameStarted(false);
    setShots([]);
    setNextShotId(1);
    setGameRunning(true);
    console.log('Game started, gameRunning should be true');
  };

  const resetGame = () => {
    console.log('Resetting game...');
    setGameRunning(false);
    setWords([]);
    setShots([]);
    setCurrentInput('');
    setSelectedMode(null);
    setCurrentFrequency(10000); // Reset frequency
    setGameTimer(5);
    setGameStarted(false);
    
    // Reset new feature states
    setPowerUps([]);
    setAchievements([]);
    setScreenShake(false);
    setComboDisplay({show: false, text: '', color: ''});
    setExplosions([]);
    setTotalWordsAttempted(0);
    setCorrectWords(0);
    setStartTypingTime(null);
  };

  // Mode Selection Screen
  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-black text-white font-mono p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-white">[ TYPING RACER ]</h1>
            <p className="text-white">Select your game mode to begin</p>
          </div>
          
          {/* Regular Game Modes */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {GAME_MODES.filter(mode => !mode.id.startsWith('typing-')).map((mode) => (
               <div
                key={mode.id}
                className="bg-black border border-white rounded-lg p-6 hover:bg-white hover:text-black transition-colors cursor-pointer"
                onClick={() => startGame(mode)}
              >
                <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                <p className="mb-4">{mode.description}</p>
                
                <button className="w-full mt-4 bg-white text-black hover:bg-black hover:text-white border border-white py-2 rounded transition-colors font-bold">
                  [ START {mode.name.toUpperCase()} ]
                </button>
              </div>
            ))}
          </div>

          {/* TYPING Shooter Section */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white border-2 border-white rounded-lg p-4 bg-black">
              [ TYPING SHOOTER ]
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {GAME_MODES.filter(mode => mode.id.startsWith('typing-')).map((mode) => (
               <div
                key={mode.id}
                className="bg-black border border-white rounded-lg p-6 hover:bg-white hover:text-black transition-colors cursor-pointer"
                onClick={() => startGame(mode)}
              >
                <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                <p className="mb-4">{mode.description}</p>
                
                <button className="w-full mt-4 bg-white text-black hover:bg-black hover:text-white border border-white py-2 rounded transition-colors font-bold">
                  [ START {mode.name.toUpperCase()} ]
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isSpaceMode = selectedMode.id.startsWith('typing-');

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Timer Overlay - shown during first 5 seconds */}
        {!gameStarted && gameRunning && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <h2 className="text-6xl font-bold text-white mb-4">
                GET READY!
              </h2>
              <div className="text-8xl font-bold text-white animate-pulse">
                {gameTimer}
              </div>
            </div>
          </div>
        )}
        {/* Enhanced Game Header */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black p-4 rounded border border-white">
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="bg-white text-black px-3 py-1 rounded text-sm">
                {selectedMode.name}
              </div>
              <div className="bg-white text-black px-3 py-1 rounded font-bold text-sm">
                SCORE: {gameStats.score}
              </div>
              <div className="bg-black text-white px-3 py-1 rounded border border-white text-sm">
                COMBO: {gameStats.combo}x
              </div>
              <div className="bg-black text-white px-3 py-1 rounded border border-white text-sm">
                WORDS: {wordsTyped}/100
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-black text-cyan-400 px-2 py-1 rounded border border-cyan-400 text-xs">
                WPM: {gameStats.wpm}
              </div>
              <div className="bg-black text-green-400 px-2 py-1 rounded border border-green-400 text-xs">
                ACC: {gameStats.accuracy}%
              </div>
              <div className="bg-black text-yellow-400 px-2 py-1 rounded border border-yellow-400 text-xs">
                MAX COMBO: {gameStats.maxCombo}
              </div>
            </div>
          </div>
          
          <div className="bg-black p-4 rounded border border-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Lives:</span>
              <div className="flex space-x-1">
                {[...Array(selectedMode.lives)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border border-white ${
                      i < gameStats.lives ? 'bg-white' : 'bg-black'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Power-ups display */}
            {powerUps.length > 0 && (
              <div className="text-xs">
                <span className="text-cyan-400">Active Power-ups:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {powerUps.map((powerUp, index) => (
                    <div
                      key={index}
                      className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded text-xs border border-cyan-400"
                    >
                      {powerUp.type.toUpperCase()} ({Math.ceil(powerUp.timeLeft / 1000)}s)
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Achievements display */}
            {achievements.length > 0 && (
              <div className="text-xs mt-2">
                <span className="text-yellow-400">Achievements:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {achievements.slice(-3).map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs border border-yellow-400"
                    >
                      🏆 {achievement.replace(/_/g, ' ').toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div className={`relative w-full h-[600px] rounded-lg overflow-hidden border border-white ${
          isSpaceMode ? 'bg-gradient-to-b from-black via-purple-900 to-black' : 'bg-white'
        } ${screenShake ? 'animate-bounce' : ''}`}>
          {/* Road/Space Background */}
          {!isSpaceMode ? (
            <div 
              className="absolute inset-0 bg-black"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)'
              }}
            >
              {/* Animated Road lines */}
              <div className="absolute top-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2">
                <div 
                  className="w-full h-full bg-white"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(to bottom, white 0px, white 20px, transparent 20px, transparent 40px)',
                    animation: gameRunning ? 'move-lines 0.5s linear infinite' : 'none'
                  }}
                />
              </div>
              
              {/* Side road markings */}
              <div className="absolute top-0 left-[35%] w-0.5 h-full bg-white transform -translate-x-1/2 opacity-70">
                <div 
                  className="w-full h-full bg-white"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(to bottom, white 0px, white 15px, transparent 15px, transparent 30px)',
                    animation: gameRunning ? 'move-lines 0.3s linear infinite' : 'none'
                  }}
                />
              </div>
              <div className="absolute top-0 right-[35%] w-0.5 h-full bg-white transform translate-x-1/2 opacity-70">
                <div 
                  className="w-full h-full bg-white"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(to bottom, white 0px, white 15px, transparent 15px, transparent 30px)',
                    animation: gameRunning ? 'move-lines 0.3s linear infinite' : 'none'
                  }}
                />
              </div>
            </div>
          ) : (
            /* Space background elements */
            <div className="absolute inset-0 overflow-hidden">
              {/* Animated stars */}
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
              
              {/* Moving stars */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                  animation: gameRunning ? 'move-stars 3s linear infinite' : 'none'
                }}
              />
            </div>
          )}

          {/* Words with special types */}
          {words.map(word => {
            if (word.y < -20 || word.y > 110) return null;
            
            // Determine colors and effects based on word type
            let wordColor = '#00ffff';
            let borderColor = '#00ffff';
            let backgroundColor = 'rgba(0, 255, 255, 0.1)';
            let extraEffects = '';
            
            switch (word.type) {
              case 'bonus':
                wordColor = '#FFD700';
                borderColor = '#FFD700';
                backgroundColor = 'rgba(255, 215, 0, 0.2)';
                extraEffects = 'animate-pulse';
                break;
              case 'speed':
                wordColor = '#00FF00';
                borderColor = '#00FF00';
                backgroundColor = 'rgba(0, 255, 0, 0.2)';
                break;
              case 'freeze':
                wordColor = '#87CEEB';
                borderColor = '#87CEEB';
                backgroundColor = 'rgba(135, 206, 235, 0.2)';
                break;
              case 'bomb':
                wordColor = '#FF4500';
                borderColor = '#FF4500';
                backgroundColor = 'rgba(255, 69, 0, 0.3)';
                extraEffects = 'animate-bounce';
                break;
            }
            
            if (isSpaceMode) {
              // Space mode: enhanced rendering with special effects
              return (
                <div
                  key={word.id}
                  className={`absolute text-white font-bold z-15 select-none ${extraEffects}`}
                  style={{
                    left: `${word.x}%`,
                    top: `${Math.max(0, word.y)}%`,
                    transform: 'translateX(-50%)',
                    textShadow: `0 0 10px ${wordColor}, 0 0 20px ${wordColor}, 0 0 30px ${wordColor}`,
                    fontSize: word.type === 'bomb' ? '1.8rem' : word.type === 'bonus' ? '1.6rem' : '1.5rem',
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                    color: wordColor,
                    border: `2px solid ${borderColor}`,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: backgroundColor,
                    boxShadow: word.type === 'bomb' ? `0 0 20px ${wordColor}` : 
                               word.type === 'bonus' ? `0 0 15px ${wordColor}` : 'none'
                  }}
                >
                  {word.text}
                  {word.type === 'bomb' && <span className="ml-1">💥</span>}
                  {word.type === 'bonus' && <span className="ml-1">⭐</span>}
                  {word.type === 'speed' && <span className="ml-1">⚡</span>}
                  {word.type === 'freeze' && <span className="ml-1">❄️</span>}
                </div>
              );
            } else {
              // Road mode: enhanced perspective rendering with special effects
              const perspectiveScale = Math.max(0.2, (word.y + 50) / 80);
              const fontSize = 0.8 + perspectiveScale * 2;
              
              const roadWidthAtY = 40 + (word.y / 100) * 30;
              const roadLeftEdge = 50 - roadWidthAtY / 2;
              const roadRightEdge = 50 + roadWidthAtY / 2;
              
              const wordX = Math.max(roadLeftEdge + 5, Math.min(roadRightEdge - 5, word.x));
              const opacity = Math.min(1, Math.max(0.4, (word.y + 40) / 60));
              
              return (
                <div
                  key={word.id}
                  className={`absolute text-white font-bold z-15 select-none ${extraEffects}`}
                  style={{
                    left: `${wordX}%`,
                    top: `${Math.max(0, word.y)}%`,
                    transform: 'translateX(-50%)',
                    textShadow: `3px 3px 6px rgba(0,0,0,0.9), 0 0 10px ${wordColor}`,
                    fontSize: `${fontSize * (word.type === 'bomb' ? 1.2 : word.type === 'bonus' ? 1.1 : 1)}rem`,
                    opacity: opacity,
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    color: wordColor,
                    border: word.type !== 'normal' ? `1px solid ${borderColor}` : 'none',
                    padding: word.type !== 'normal' ? '2px 4px' : '0',
                    borderRadius: word.type !== 'normal' ? '3px' : '0',
                    backgroundColor: word.type !== 'normal' ? backgroundColor : 'transparent'
                  }}
                >
                  {word.text}
                </div>
              );
            }
          })}
          
          {/* Shots/Lasers (only in space mode) */}
          {isSpaceMode && shots.map(shot => (
            <div
              key={shot.id}
              className="absolute z-15"
              style={{
                left: `${shot.x}%`,
                top: `${shot.y}%`,
                transform: 'translateX(-50%)',
                width: '2px',
                height: '20px',
                background: 'linear-gradient(to top, #00ffff, #ffffff)',
                boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
                borderRadius: '1px'
              }}
            />
          ))}
          
          {/* Explosion effects */}
          {explosions.map(explosion => (
            <div
              key={explosion.id}
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${explosion.x}%`,
                top: `${explosion.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-6xl animate-ping">💥</div>
              <div className="absolute inset-0 bg-orange-400 rounded-full opacity-50 animate-ping"></div>
            </div>
          ))}
          
          {/* Combo display */}
          {comboDisplay.show && (
            <div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              style={{
                color: comboDisplay.color,
                textShadow: `0 0 20px ${comboDisplay.color}, 0 0 40px ${comboDisplay.color}`,
                fontSize: '3rem',
                fontWeight: 'bold',
                animation: 'fade-in 0.5s ease-out'
              }}
            >
              {comboDisplay.text}
            </div>
          )}
          


          {/* Player (Car or Spaceship) */}
          {isSpaceMode ? (
            /* Spaceship */
            <div
              className="absolute bottom-8 w-8 h-12 transition-all duration-300 z-20"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                animation: gameRunning ? 'spaceship-hover 2s ease-in-out infinite' : 'none'
              }}
            >
              {/* Spaceship body */}
              <div className="relative w-full h-full">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-t from-cyan-400 to-white rounded-t-full border border-cyan-300"></div>
                
                {/* Wings */}
                <div className="absolute bottom-2 left-0 w-2 h-4 bg-cyan-300 transform -rotate-45 rounded"></div>
                <div className="absolute bottom-2 right-0 w-2 h-4 bg-cyan-300 transform rotate-45 rounded"></div>
                
                {/* Engine glow */}
                {gameRunning && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-orange-400 to-transparent rounded-b-full animate-pulse"></div>
                )}
              </div>
            </div>
          ) : (
            /* Car */
            <div
              className="absolute bottom-8 w-8 h-12 bg-white rounded-t-lg border-2 border-black transition-all duration-300 z-20"
              style={{
                left: `${carPosition}%`,
                transform: 'translateX(-50%)',
                animation: gameRunning ? 'car-bounce 1s ease-in-out infinite' : 'none'
              }}
            >
              <div className="w-full h-2 bg-black rounded-t-lg mt-2"></div>
              <div className="flex justify-between px-1 mt-1">
                <div 
                  className="w-1 h-1 bg-black rounded-full"
                  style={{
                    animation: gameRunning ? 'pulse 0.5s infinite' : 'none'
                  }}
                ></div>
                <div 
                  className="w-1 h-1 bg-black rounded-full"
                  style={{
                    animation: gameRunning ? 'pulse 0.5s infinite' : 'none'
                  }}
                ></div>
              </div>
              
              {/* Car exhaust effect */}
              {gameRunning && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-2 bg-black opacity-60 animate-pulse"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Display current input for feedback */}
        {currentInput && gameRunning && (
          <div className="text-center mt-4">
            <div className="text-white text-lg font-mono bg-black border border-white rounded px-4 py-2 inline-block">
              Typing: <span className="text-cyan-400">{currentInput}</span>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div className="flex space-x-4 justify-center">
            {!gameRunning && gameStats.lives > 0 && (
              <button
                onClick={() => startGame()}
                className="bg-white text-black hover:bg-black hover:text-white border border-white px-6 py-2 rounded font-mono transition-colors font-bold"
              >
                [ START GAME ]
              </button>
            )}
            
            {gameRunning && (
              <button
                onClick={resetGame}
                className="bg-black text-white hover:bg-white hover:text-black px-6 py-2 rounded font-mono transition-colors border border-white"
              >
                [ STOP GAME ]
              </button>
            )}

            {gameStats.lives <= 0 && (
              <div className="text-center">
                <div className="text-white text-xl mb-2">[ GAME OVER ]</div>
                <div className="mb-4">Final Score: {gameStats.score} | Level Reached: {gameStats.level}</div>
                <button
                  onClick={() => startGame()}
                  className="bg-white text-black hover:bg-black hover:text-white border border-white px-6 py-2 rounded font-mono transition-colors font-bold"
                >
                  [ PLAY AGAIN ]
                </button>
              </div>
            )}

            {!gameRunning && wordsTyped >= 100 && gameStats.lives > 0 && (
              <div className="text-center">
                <div className="text-white text-xl mb-2">[ CONGRATULATIONS! ]</div>
                <div className="mb-4">You completed all 100 words! Final Score: {gameStats.score} | Level Reached: {gameStats.level}</div>
                <button
                  onClick={() => startGame()}
                  className="bg-white text-black hover:bg-black hover:text-white border border-white px-6 py-2 rounded font-mono transition-colors font-bold"
                >
                  [ PLAY AGAIN ]
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-white text-sm">
            Type words correctly to score points and advance levels. Miss words and lose lives!
          </div>
        </div>
      </div>
    </div>
  );
}
