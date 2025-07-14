import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TypingStats } from './TypingStats';
import TestResults from './TestResults';
import { soundUtils } from '@/utils/soundUtils';

interface TypingInterfaceProps {
  mode?: string;
  topic?: string;
  customText?: string;
}

interface PerformanceData {
  time: number;
  wpm: number;
  errors: number;
}

export function TypingInterface({ mode = 'standard', topic = 'general', customText }: TypingInterfaceProps) {
  const { state, dispatch } = useApp();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60); // in seconds
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isCustomTimer, setIsCustomTimer] = useState(false);
  const [customDuration, setCustomDuration] = useState('');
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([]);
  // New state for accurate tracking
  const [totalKeysPressed, setTotalKeysPressed] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sampleTexts = {
    general: [
      "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for typing practice. The art of typing is more than just pressing keys on a keyboard; it is a skill that bridges the gap between thought and digital expression. In today's interconnected world, the ability to type efficiently and accurately has become an essential life skill, much like reading and writing were in previous generations. Whether you are composing an email to a colleague, writing a research paper for school, or engaging in online conversations with friends and family, your typing abilities directly impact your productivity and communication effectiveness. The development of muscle memory through consistent practice allows your fingers to move across the keyboard with confidence and precision. Each keystroke becomes second nature, freeing your mind to focus on the content and creativity of your writing rather than the mechanical process of letter formation. Regular typing practice not only improves speed but also enhances accuracy, reducing the need for constant backspacing and correction. As you progress in your typing journey, you will notice improvements in other areas of your digital life as well. Your ability to take notes during online meetings, participate in real-time discussions, and complete written assignments will all benefit from enhanced typing skills.",
      
      "In a world where technology evolves rapidly, the ability to adapt and learn new skills becomes increasingly important for personal and professional success. The digital revolution has transformed virtually every aspect of human life, from how we communicate and work to how we learn and entertain ourselves. Social media platforms connect billions of people across the globe, enabling instant communication and the sharing of ideas, experiences, and cultures. E-commerce has revolutionized shopping, allowing consumers to purchase products from anywhere in the world with just a few clicks. Online education platforms have democratized learning, making high-quality educational content accessible to anyone with an internet connection. Remote work has become commonplace, offering flexibility and new opportunities while also presenting challenges in maintaining work-life balance and team collaboration. Artificial intelligence and machine learning are reshaping industries, automating routine tasks while creating new categories of jobs that require different skill sets. The Internet of Things is connecting everyday devices, creating smart homes and cities that can optimize energy usage and improve quality of life. Cybersecurity has become more critical than ever as our dependence on digital systems increases. The ability to navigate this technological landscape effectively requires continuous learning and adaptation.",
      
      "The morning sun cast long shadows across the meadow as birds began their daily songs, welcoming another beautiful day filled with endless possibilities. Nature has a remarkable way of inspiring and rejuvenating the human spirit, offering moments of peace and reflection in our increasingly busy lives. The gentle rustling of leaves in the breeze creates a natural symphony that can calm even the most troubled mind. Walking through a forest path, you might encounter the intricate web of an industrious spider, glistening with morning dew like tiny diamonds. The fragrance of wildflowers fills the air, a natural perfume that no human creation can truly replicate. Rivers and streams carve their way through landscapes, carrying with them the stories of the lands they have touched. Mountains stand as silent sentinels, their peaks reaching toward the sky in majestic splendor. Ocean waves crash against rocky shores, their rhythmic sound a reminder of the planet's immense power and beauty. Wildlife goes about its daily routines, each creature playing its part in the delicate balance of ecosystems. Seasons change with predictable regularity, yet each transformation brings its own unique beauty and challenges. The interconnectedness of all living things becomes apparent when we take time to observe and appreciate the natural world around us.",
      
      "Time management is a crucial skill that can significantly impact productivity and overall quality of life in both personal and professional settings. The ability to prioritize tasks, set realistic goals, and maintain focus on important objectives distinguishes successful individuals from those who struggle with daily demands. Effective time management begins with understanding your personal rhythms and energy levels throughout the day. Some people are most productive in the early morning hours, while others find their peak performance comes later in the day. Identifying these patterns allows you to schedule your most important and challenging tasks during your optimal hours. Creating a structured daily routine provides a framework for accomplishing goals while maintaining flexibility for unexpected opportunities or challenges. The use of calendars, planners, and digital tools can help organize commitments and deadlines, but the key is finding a system that works for your individual lifestyle and preferences. Learning to say no to non-essential commitments is equally important as saying yes to opportunities that align with your goals and values. Regular breaks and periods of rest are not signs of laziness but essential components of sustainable productivity. The compound effect of consistent daily actions, even small ones, can lead to remarkable achievements over time.",
      
      "Regular exercise and a balanced diet contribute to maintaining good health and can help prevent various chronic diseases throughout life. The human body is designed for movement, and modern sedentary lifestyles often conflict with our biological needs. Physical activity strengthens not only muscles and bones but also the cardiovascular system, improving heart health and circulation. Exercise releases endorphins, natural chemicals that enhance mood and reduce stress, contributing to better mental health outcomes. Different types of exercise offer various benefits: cardiovascular activities like running or swimming improve heart and lung function, strength training builds muscle mass and bone density, and flexibility exercises like yoga or stretching maintain joint mobility and reduce injury risk. Nutrition plays an equally important role in overall health, with whole foods providing essential nutrients that processed foods often lack. A balanced diet should include a variety of fruits and vegetables, lean proteins, whole grains, and healthy fats. Proper hydration is often overlooked but crucial for optimal body function, affecting everything from energy levels to cognitive performance. Sleep quality and duration significantly impact physical recovery and mental well-being, making adequate rest a cornerstone of healthy living. The combination of regular exercise, proper nutrition, and sufficient sleep creates a foundation for long-term health and vitality.",
      
      "Reading books expands vocabulary, improves comprehension skills, and provides knowledge about different cultures, ideas, and perspectives from around the world. The act of reading is fundamentally different from consuming digital media, requiring sustained attention and deep processing of information. When we read, our brains create vivid mental images, engage in complex reasoning, and make connections between new information and existing knowledge. Fiction transports us to different worlds and allows us to experience life through diverse characters, developing empathy and emotional intelligence. Non-fiction books provide specialized knowledge and expertise from leading thinkers and practitioners in various fields. Biographies offer insights into the lives and minds of remarkable individuals, providing inspiration and practical wisdom. Historical texts help us understand the context of current events and avoid repeating past mistakes. Scientific books make complex concepts accessible to general audiences, fostering scientific literacy and critical thinking skills. Poetry and literature preserve cultural heritage and artistic expression, enriching our appreciation for language and creativity. The physical act of holding a book, turning pages, and making notes in margins creates a tactile and personal connection to the content that digital formats cannot fully replicate. Building a personal library becomes a reflection of your interests, growth, and intellectual journey over time."
    ],
    programming: [
      "function fibonacci(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    let temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return b;\n}\nconsole.log(fibonacci(10));",
      
      "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconst result = factorial(5);\nconsole.log(result);",
      
      "function gcd(a, b) {\n  while (b !== 0) {\n    let temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}\nfunction lcm(a, b) {\n  return (a * b) / gcd(a, b);\n}\nconsole.log(gcd(48, 18));\nconsole.log(lcm(12, 8));",
      
      "class Calculator {\n  constructor() {\n    this.result = 0;\n  }\n  add(num) {\n    this.result += num;\n    return this;\n  }\n  subtract(num) {\n    this.result -= num;\n    return this;\n  }\n  multiply(num) {\n    this.result *= num;\n    return this;\n  }\n  getResult() {\n    return this.result;\n  }\n}\nconst calc = new Calculator();\nconsole.log(calc.add(5).multiply(2).getResult());",
      
      "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\nconst squaredNumbers = numbers.map(num => num * num);\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\nconsole.log('Even numbers:', evenNumbers);\nconsole.log('Squared numbers:', squaredNumbers);\nconsole.log('Sum:', sum);",
      
      "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    if (!response.ok) {\n      throw new Error('Failed to fetch user data');\n    }\n    const userData = await response.json();\n    return userData;\n  } catch (error) {\n    console.error('Error:', error.message);\n    throw error;\n  }\n}\nfetchUserData(123).then(data => console.log(data));",
      
      "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}\nconst array = [3, 6, 8, 10, 1, 2, 1];\nconsole.log(quickSort(array));",
      
      "const debounce = (func, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func.apply(null, args), delay);\n  };\n};\nconst debouncedFunction = debounce(() => {\n  console.log('Function executed after delay');\n}, 300);\ndebouncedFunction();",
      
      "function isPrime(num) {\n  if (num < 2) return false;\n  for (let i = 2; i <= Math.sqrt(num); i++) {\n    if (num % i === 0) return false;\n  }\n  return true;\n}\nfunction generatePrimes(limit) {\n  const primes = [];\n  for (let i = 2; i <= limit; i++) {\n    if (isPrime(i)) primes.push(i);\n  }\n  return primes;\n}\nconsole.log(generatePrimes(50));",
      
      "const createCounter = () => {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getValue: () => count,\n    reset: () => { count = 0; return count; }\n  };\n};\nconst counter = createCounter();\nconsole.log(counter.increment());\nconsole.log(counter.getValue());"
    ],
    science: [
      "The equator is the circle of latitude that divides earth into the northern and southern hemispheres. Earth's rotation causes this imaginary line to experience unique atmospheric and oceanic phenomena that influence global weather patterns and climate zones.",
      
      "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen using chlorophyll. This fundamental biological process sustains virtually all life on Earth by converting solar energy into chemical energy.",
      
      "The periodic table organizes chemical elements by their atomic number, revealing patterns in their properties and behaviors. Dmitri Mendeleev's original periodic table arranged elements by atomic weight and predicted the existence of undiscovered elements."
    ],
    literature: [
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness. Charles Dickens opened A Tale of Two Cities with this famous paradox.",
      
      "To be or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and, by opposing, end them. Shakespeare's Hamlet delivers this iconic soliloquy.",
      
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. Herman Melville's Moby-Dick begins with this deceptively simple introduction."
    ],
    numbers: [
      "1234567890 0987654321 1357924680 2468013579 5050505050 9876543210 1111111111 2222222222 3333333333 4444444444 5555555555 6666666666 7777777777 8888888888 9999999999 0000000000",
      
      "123 456 789 012 345 678 901 234 567 890 147 258 369 741 852 963 159 357 486 284 759 137 625 943 816 572 938 461 749 283 651 947 382 165 738 294 561 847 293 658 471 829 364 785 192 546 837 291 465 739 182 546 830 927 451 683 274 958 163 748 295 637 184 529 736 418 695 237 581 462 739 184 526 837 492 615 738 294 561 847 293 685 174 729 463 815 627 394 581 762 439 185 627 394 851 726 439 185 672 394 851 672 439 187 253 694",
      
      "Phone numbers: +1-555-0123 (555) 123-4567 555.789.0123 5552345678 +44-20-7123-4567 +33-1-23-45-67-89 +81-3-1234-5678 +86-10-1234-5678 +91-11-2345-6789 +61-2-9876-5432",
      
      "Dates and times: 01/01/2024 12/31/2023 2024-03-15 15-Mar-2024 March 15, 2024 12:30 PM 23:45:30 09:15 AM 14:22:07 00:00:00 11:59 PM 06:30:45 18:45 20:15:30",
      
      "Mathematical expressions: 2 + 2 = 4, 5 × 3 = 15, 10 ÷ 2 = 5, 8 - 3 = 5, 2² = 4, 3³ = 27, √16 = 4, π ≈ 3.14159, e ≈ 2.71828, 50% = 0.5, 1/3 ≈ 0.333, 7/8 = 0.875",
      
      "Decimal numbers: 3.14159 2.71828 1.41421 1.61803 0.57721 2.30259 1.77245 0.91596 1.20206 0.66274 1.90216 0.83373 1.46035 0.76422 1.32472 0.91597 1.28243 0.69777 1.40137 0.91596",
      
      "Financial amounts: $1,234.56 €987.65 £543.21 ¥12,345 $10,000.00 €5,500.50 £8,900.99 ¥150,000 $999.99 €1,299.95 £2,450.75 ¥75,680 $25.99 €49.95 £15.50 ¥3,200",
      
      "Measurements: 5.5 inches 12.7 cm 3.2 meters 1.8 kg 2.5 lbs 98.6°F 37°C 1024 MB 4.7 GB 16 TB 300 DPI 1920×1080 4K 8K 60 fps 120 Hz 5G 802.11ac",
      
      "Time sequences: 00:00 01:15 02:30 03:45 04:00 05:15 06:30 07:45 08:00 09:15 10:30 11:45 12:00 13:15 14:30 15:45 16:00 17:15 18:30 19:45 20:00 21:15 22:30 23:45",
      
      "Statistical data: Mean: 42.5, Median: 38.0, Mode: 35, Range: 67, Standard Deviation: 12.3, Variance: 151.29, Sample Size: n=100, Correlation: r=0.85, p-value: 0.003, Confidence Interval: 95%"
    ]
  };

  const isCodeText = (text: string) => {
    const codePatterns = [
      /function\s+\w+\s*\(/,           // function declarations
      /const\s+\w+\s*=/,              // const declarations
      /let\s+\w+\s*=/,                // let declarations
      /var\s+\w+\s*=/,                // var declarations
      /class\s+\w+/,                  // class declarations
      /import\s+.*from/,              // import statements
      /export\s+(default\s+)?/,       // export statements
      /console\.log\(/,               // console.log calls
      /if\s*\(/,                      // if statements
      /for\s*\(/,                     // for loops
      /while\s*\(/,                   // while loops
      /\{\s*$/m,                      // opening braces on new lines
      /^\s*\}/m,                      // closing braces
      /=>\s*{/,                       // arrow functions
      /async\s+function/,             // async functions
      /<[A-Za-z][^>]*>/,              // HTML tags
      /<!DOCTYPE/i,                   // HTML doctype
      /#include/,                     // C/C++ includes
      /def\s+\w+\(/,                  // Python function definitions
      /print\(/,                      // Python print
      /return\s+/,                    // return statements
    ];
    
    return codePatterns.some(pattern => pattern.test(text));
  };

  const generateNewText = () => {
    let text;
    if (mode === 'custom') {
      text = customText && customText.trim() ? customText : "Please enter your custom text above to start practicing.";
    } else {
      const textArray = sampleTexts[topic as keyof typeof sampleTexts] || sampleTexts.general;
      text = Array.isArray(textArray) 
        ? textArray[Math.floor(Math.random() * textArray.length)]
        : textArray;
    }
    return text;
  };

  useEffect(() => {
    dispatch({ type: 'RESET_TYPING' });
    setTimeElapsed(0);
    setIsCompleted(false);
    setIsStarted(false);
    setIsPaused(false);
    setTimeRemaining(timerDuration);
    // Reset tracking variables
    setTotalKeysPressed(0);
    setTotalErrors(0);
    setBackspaceCount(0);
    setPerformanceHistory([]);
    
    const text = generateNewText();
    dispatch({ type: 'START_TYPING', payload: { text, mode, topic } });
    
    if (textDisplayRef.current) {
      textDisplayRef.current.focus();
    }
  }, []); // Empty dependency array - relies on key prop from parent for resets

  useEffect(() => {
    if (state.isTyping && isStarted && startTime && !intervalRef.current && !isPaused && !isCompleted) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setTimeElapsed(elapsedSeconds);
        
        // Track performance data every second
        if (elapsedSeconds > 0 && state.userInput.length > 0) {
          const currentWpm = (state.userInput.length / 5) / (elapsedSeconds / 60);
          const currentErrors = state.errors.length;
          
          setPerformanceHistory(prev => {
            const newData = { time: elapsedSeconds, wpm: Math.round(currentWpm), errors: currentErrors };
            const lastEntry = prev[prev.length - 1];
            
            // Only add if this is a new second or significantly different data
            if (!lastEntry || lastEntry.time !== elapsedSeconds) {
              return [...prev, newData];
            }
            return prev;
          });
        }
        
        if (mode === 'timed') {
          const remaining = timerDuration - elapsedSeconds;
          setTimeRemaining(Math.max(0, remaining));
          
          if (remaining <= 0) {
            finishTyping();
          }
        }
      }, 100); // Update more frequently for accuracy
    }

    if ((!state.isTyping || !isStarted || isPaused || isCompleted) && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isTyping, isStarted, startTime, isPaused, isCompleted, mode, timerDuration]);

  useEffect(() => {
    if (textDisplayRef.current) {
      textDisplayRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' && e.key !== 'F5' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (!isStarted && e.key.length === 1) {
      setIsStarted(true);
      setIsPaused(false);
      setStartTime(new Date());
    }

    if (isPaused) {
      setIsPaused(false);
    }

    if (e.key === 'Backspace') {
        if (state.userInput.length > 0) {
            setBackspaceCount(prev => prev + 1);

            const lastCharIndex = state.userInput.length - 1;
            const newInput = state.userInput.slice(0, -1);

            // First, update the input string in the state
            dispatch({ type: 'UPDATE_INPUT', payload: newInput });

            // Next, check if the character we just removed was an error
            if (state.errors.includes(lastCharIndex)) {
                // If it was, dispatch our new, safe action to remove only that error
                dispatch({ type: 'REMOVE_ERROR', payload: lastCharIndex });
            }
        }
        return;
    }

    if (e.key.length === 1 && state.userInput.length < state.practiceText.length) {
      // Track every keystroke
      setTotalKeysPressed(prev => {
        const newTotal = prev + 1;
        return newTotal;
      });
      
      const newInput = state.userInput + e.key;
      const isCorrectChar = e.key === state.practiceText[state.userInput.length];
      
      // Track errors
      if (!isCorrectChar) {
        setTotalErrors(prev => {
          const newErrors = prev + 1;
          return newErrors;
        });
      }
      
      if (soundEnabled) {
        soundUtils.playKeySound(isCorrectChar);
      }

      dispatch({ type: 'UPDATE_INPUT', payload: newInput });
      
      if (!isCorrectChar && !state.errors.includes(state.userInput.length)) {
        dispatch({ type: 'ADD_ERROR', payload: state.userInput.length });
      }
      
      // Only finish when the ENTIRE text is completed
      if (newInput.length === state.practiceText.length) {
        console.log('🏁 Test completed - full text typed!');
        console.log('📝 Final input:', `"${newInput}"`);
        console.log('📋 Target text:', `"${state.practiceText}"`);
        finishTyping();
      }
    }

    pauseTimeoutRef.current = setTimeout(() => {
      if (isStarted && !isCompleted) {
        setIsPaused(true);
      }
    }, 2000);
  };

  const toggleSound = () => {
    const newSoundState = soundUtils.toggleSound();
    setSoundEnabled(newSoundState);
  };

  const calculateHandDistribution = (input: string) => {
    if (input.length === 0) return { left: 0, right: 0 };
    
    // QWERTY keyboard hand mapping for standard touch typing
    const leftHandKeys = new Set([
      'q', 'w', 'e', 'r', 't',
      'a', 's', 'd', 'f', 'g', 
      'z', 'x', 'c', 'v', 'b',
      '1', '2', '3', '4', '5',
      '!', '@', '#', '$', '%',
      '`', '~', '\t'
    ]);
    
    const rightHandKeys = new Set([
      'y', 'u', 'i', 'o', 'p',
      'h', 'j', 'k', 'l', ';', '\'',
      'n', 'm', ',', '.', '/',
      '6', '7', '8', '9', '0',
      '^', '&', '*', '(', ')', '-', '_', '=', '+',
      '[', ']', '{', '}', '\\', '|', 
      ':', '"', '<', '>', '?', ' '  // Space bar with right thumb
    ]);
    
    let leftCount = 0;
    let rightCount = 0;
    
    for (const char of input.toLowerCase()) {
      if (leftHandKeys.has(char)) {
        leftCount++;
      } else if (rightHandKeys.has(char)) {
        rightCount++;
      }
      // Ignore characters not in either set
    }
    
    const totalCounted = leftCount + rightCount;
    if (totalCounted === 0) return { left: 0, right: 0 };
    
    return {
      left: Math.round((leftCount / totalCounted) * 100),
      right: Math.round((rightCount / totalCounted) * 100)
    };
  };

  const calculateAccuracy = () => {
    // If no input, return 0%
    if (state.userInput.length === 0) return 0;
    
    // Calculate accuracy based on correct vs total characters typed
    const totalTyped = state.userInput.length;
    const errors = state.errors.length;
    const correctChars = totalTyped - errors;
    const accuracy = totalTyped > 0 ? (correctChars / totalTyped) * 100 : 0;
    
    // Ensure accuracy is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(accuracy)));
  };

  const calculateConsistency = (history: PerformanceData[]): number => {
    if (history.length < 2) return 100; // Not enough data, assume perfect consistency
    
    const wpmValues = history.map(data => data.wpm).filter(wpm => wpm > 0);
    if (wpmValues.length < 2) return 100;
    
    const average = wpmValues.reduce((sum, wpm) => sum + wpm, 0) / wpmValues.length;
    if (average === 0) return 100;
    
    const variance = wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - average, 2), 0) / wpmValues.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate consistency as percentage (higher = more consistent)
    // Use coefficient of variation and convert to consistency percentage
    const coefficientOfVariation = (standardDeviation / average) * 100;
    const consistency = Math.max(0, Math.min(100, 100 - coefficientOfVariation));
    return Math.round(consistency);
  };

  // Store final stats in a ref to avoid race conditions
  const finalStatsRef = useRef<any>(null);

  const finishTyping = () => {
    // Stop the timer immediately to prevent further state updates
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setIsStarted(false);

    // Calculate the final time directly
    const finishTime = new Date();
    const finalTimeElapsedSeconds = startTime 
        ? Math.max(1, (finishTime.getTime() - startTime.getTime()) / 1000)  // Minimum 1 second
        : 1;

    // Calculate WPM more accurately
    const currentWpm = state.userInput.length > 0 
        ? Math.round((state.userInput.length / 5) / (finalTimeElapsedSeconds / 60)) 
        : 0;
    
    // Calculate accuracy based on current input and errors
    const totalTyped = state.userInput.length;
    const errors = state.errors.length;
    const correctChars = totalTyped - errors;
    const currentAccuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    
    // Calculate actual words typed (split by spaces and filter empty)
    const currentWordsTyped = state.userInput.trim().length > 0 
        ? state.userInput.trim().split(/\s+/).filter(word => word.length > 0).length 
        : 0;
    
    const currentHandDistribution = calculateHandDistribution(state.userInput);
    
    console.log('📊 CAPTURED FINAL STATS:');
    console.log('⏰ Final Time (sec):', finalTimeElapsedSeconds);
    console.log('📝 User input:', `"${state.userInput}"`);
    console.log('📏 Input length:', state.userInput.length);
    console.log('⚡ WPM:', currentWpm);
    console.log('🎯 Accuracy:', currentAccuracy);
    console.log('❌ Errors:', state.errors.length);
    console.log('📖 Words typed:', currentWordsTyped);
    console.log('👐 Hand distribution:', currentHandDistribution);

    // Store captured stats in ref for immediate access
    const capturedStats = {
        wpm: currentWpm,
        accuracy: currentAccuracy,
        wordsTyped: currentWordsTyped,
        timeElapsed: finalTimeElapsedSeconds, // Use the new reliable value
        totalCharacters: state.userInput.length,
        correctCharacters: state.userInput.length - state.errors.length,
        leftHandPercentage: currentHandDistribution.left,
        rightHandPercentage: currentHandDistribution.right,
        performanceHistory: performanceHistory,
    };
    
    finalStatsRef.current = capturedStats;
    
    // Create session with the captured live stats
    const session = {
        id: Date.now().toString(),
        date: new Date(),
        mode,
        topic,
        stats: capturedStats
    };
    
    dispatch({ type: 'FINISH_TYPING', payload: session });
    setIsCompleted(true);
    setIsPaused(false);
};

  const resetTest = () => {
    dispatch({ type: 'RESET_TYPING' });
    setTimeElapsed(0);
    setIsCompleted(false);
    setIsStarted(false);
    setIsPaused(false);
    setTimeRemaining(timerDuration);
    setStartTime(null);
    setPerformanceHistory([]);
    // Reset new tracking variables
    setTotalKeysPressed(0);
    setTotalErrors(0);
    setBackspaceCount(0);
    // Reset custom timer state
    setIsCustomTimer(false);
    setCustomDuration('');
    // Clear final stats ref
    finalStatsRef.current = null;
    
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    
    const text = generateNewText();
    dispatch({ type: 'START_TYPING', payload: { text, mode, topic } });
    
    if (textDisplayRef.current) {
      textDisplayRef.current.focus();
    }
  };

  const renderText = () => {
    const text = state.practiceText;
    const isProgramming = topic === 'programming' || (mode === 'custom' && isCodeText(text));
    
    if (isProgramming) {
      // For programming, display code with proper line breaks and indentation
      const lines = text.split('\n');
      let charIndex = 0;
      
      return (
        <div className="font-mono text-left">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="min-h-[1.5rem]">
              {line.split('').map((char, index) => {
                const absoluteIndex = charIndex + index;
                let className = 'relative';
                
                if (absoluteIndex < state.userInput.length) {
                  if (state.errors.includes(absoluteIndex)) {
                    className += ` ${state.theme === 'dark' ? 'bg-red-900' : 'bg-red-200'} text-red-400`;
                  } else {
                    className += ` ${state.theme === 'dark' ? 'text-green-400' : 'text-green-600'}`;
                  }
                } else if (absoluteIndex === state.userInput.length) {
                  className += ` ${state.theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`;
                } else {
                  className += ' opacity-50';
                }

                return (
                  <span key={absoluteIndex} className={className}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
              {(() => {
                charIndex += line.length + 1; // +1 for the newline character
                return null;
              })()}
            </div>
          ))}
        </div>
      );
    } else {
      // For non-programming, use the existing paragraph-style rendering
      const words = text.split(' ');
      const averageWordsPerLine = 12;
      const linesPerView = 4;
      const totalWordsInView = averageWordsPerLine * linesPerView;
      
      const currentWordIndex = text.substring(0, state.userInput.length).split(' ').length - 1;
      
      let startWordIndex = Math.max(0, currentWordIndex - Math.floor(totalWordsInView / 2));
      startWordIndex = Math.min(startWordIndex, Math.max(0, words.length - totalWordsInView));
      
      const wordsToShow = words.slice(startWordIndex, startWordIndex + totalWordsInView);
      const textToShow = wordsToShow.join(' ');
      
      const textBeforeWindow = words.slice(0, startWordIndex).join(' ');
      const charOffset = textBeforeWindow.length + (startWordIndex > 0 ? 1 : 0);
      
      return textToShow.split('').map((char, index) => {
        const absoluteIndex = index + charOffset;
        let className = 'relative';
        
        if (absoluteIndex < state.userInput.length) {
          if (state.errors.includes(absoluteIndex)) {
            className += ` ${state.theme === 'dark' ? 'bg-red-900' : 'bg-red-200'} text-red-400`;
          } else {
            className += ` ${state.theme === 'dark' ? 'text-green-400' : 'text-green-600'}`;
          }
        } else if (absoluteIndex === state.userInput.length) {
          className += ` ${state.theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`;
        } else {
          className += ' opacity-50';
        }

        return (
          <span key={absoluteIndex} className={className}>
            {char}
          </span>
        );
      });
    }
  };

  if (isCompleted) {
    // FIX: Only use the data from the ref. It's guaranteed to be correct.
    const statsToUse = finalStatsRef.current;
    
    if (statsToUse) {
      return (
        <TestResults 
          speed={statsToUse.wpm}
          accuracy={statsToUse.accuracy}
          leftHand={statsToUse.leftHandPercentage}
          rightHand={statsToUse.rightHandPercentage}
          wordsTyped={statsToUse.wordsTyped}
          timeLeft={0}
          isTestActive={false}
          isTestComplete={true}
          inputLength={statsToUse.totalCharacters}
          onRestart={resetTest}
        />
      );
    }
    // Fallback in case the ref is somehow empty
    return <p>Calculating results...</p>;
  }

  const handDistribution = calculateHandDistribution(state.userInput);

  return (
    <div className="space-y-8">
      {mode === 'timed' && !isStarted && (
        <div className="text-center space-y-4">
          <h3 className="text-lg">Set Timer Duration</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {[30, 60, 120, 300].map(duration => (
              <button
                key={duration}
                onClick={() => {
                  setIsCustomTimer(false);
                  setTimerDuration(duration);
                  setTimeRemaining(duration);
                }}
                className={`px-4 py-2 border border-current hover:opacity-70 ${
                  !isCustomTimer && timerDuration === duration ? 'bg-current text-black' : ''
                }`}
              >
                [ {duration < 60 ? `${duration}s` : `${duration / 60}m`} ]
              </button>
            ))}
            <button
              onClick={() => {
                setIsCustomTimer(true);
                setCustomDuration('');
              }}
              className={`px-4 py-2 border border-current hover:opacity-70 ${
                isCustomTimer ? 'bg-current text-black' : ''
              }`}
            >
              [ custom ]
            </button>
          </div>
          
          {isCustomTimer && (
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-3">
                <input
                  type="number"
                  placeholder="Enter seconds"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="px-3 py-2 border border-current bg-black text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-current font-mono w-32 text-center"
                  min="1"
                  max="3600"
                />
                <span className="text-sm opacity-70">seconds</span>
                <button
                  onClick={() => {
                    const duration = parseInt(customDuration);
                    if (duration && duration > 0 && duration <= 3600) {
                      setTimerDuration(duration);
                      setTimeRemaining(duration);
                    }
                  }}
                  className="px-3 py-2 border border-current hover:opacity-70 text-sm"
                  disabled={!customDuration || parseInt(customDuration) <= 0 || parseInt(customDuration) > 3600}
                >
                  [ set ]
                </button>
              </div>
              <p className="text-xs opacity-50">Enter duration between 1-3600 seconds (1 second to 1 hour)</p>
            </div>
          )}
        </div>
      )}
      
      {!isCompleted && (
        <div className={`transition-all duration-300 ${isStarted && !isCompleted && isPaused ? 'blur-sm opacity-50' : ''}`}>
           <TypingStats 
            stats={{
             wpm: timeElapsed > 0 && state.userInput.length > 0 ? 
               Math.round((state.userInput.length / 5) / Math.max(timeElapsed / 60, 0.01)) : 0,
             accuracy: calculateAccuracy(),
             wordsTyped: state.userInput.trim().length > 0 ? 
               state.userInput.trim().split(/\s+/).filter(word => word.length > 0).length : 0,
              timeElapsed: timeElapsed,
              totalCharacters: state.userInput.length,
              correctCharacters: state.userInput.length - state.errors.length,
              leftHandPercentage: handDistribution.left,
              rightHandPercentage: handDistribution.right,
              performanceHistory: performanceHistory,
            }}
          timeRemaining={mode === 'timed' ? timeRemaining : undefined}
          currentTime={timeElapsed}
        />
        </div>
      )}
      
      <div className="text-center">
        <div 
          ref={textDisplayRef}
          className={`text-lg leading-relaxed p-8 border border-current max-w-4xl mx-auto mb-6 focus:outline-none cursor-text transition-all duration-300 ${
            isStarted && !isCompleted && isPaused ? 'blur-sm opacity-50' : ''
          } ${(topic === 'programming' || (mode === 'custom' && isCodeText(state.practiceText))) ? 'text-left' : 'text-center'}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {renderText()}
        </div>
        
        {!isStarted && (
          <div className="text-center opacity-70 mb-4">
            Start typing to begin the test...
          </div>
        )}
        
        {isPaused && isStarted && !isCompleted && (
          <div className="text-center opacity-70 mb-4">
            Paused - start typing to continue...
          </div>
        )}
        
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={resetTest}
            className="px-4 py-2 border border-current hover:opacity-70"
          >
            [ restart ]
          </button>
          <button 
            onClick={toggleSound}
            className="px-4 py-2 border border-current hover:opacity-70"
          >
            [ sound: {soundEnabled ? 'on' : 'off'} ]
          </button>
        </div>
      </div>
    </div>
  );
}
