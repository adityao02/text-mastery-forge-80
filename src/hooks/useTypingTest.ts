import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  calculateHandDistribution,
  calculateAccuracy,
  calculateSpeed
} from '../lib/typingUtils';

export default function useTypingTest(targetText: string) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [stats, setStats] = useState({
    speed: 0,
    accuracy: 0,
    leftHand: 0,
    rightHand: 0,
    wordsTyped: 0
  });
  
  // Use refs to maintain accurate values during timeout
  const inputRef = useRef(input);
  const startTimeRef = useRef(startTime);

  // Sync refs with state
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  // Handle text input
  const handleInput = useCallback((value: string) => {
    if (isTestComplete) return;
    
    // Start timer on first keystroke
    if (!isTestActive && value.length > 0) {
      setIsTestActive(true);
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
    }
    
    // Prevent typing beyond target text length
    if (value.length <= targetText.length) {
      setInput(value);
    }
  }, [isTestActive, isTestComplete, targetText]);

  // Calculate stats
  useEffect(() => {
    if (!isTestActive) return;

    const newStats = {
      speed: calculateSpeed(startTime, input.length),
      accuracy: calculateAccuracy(input, targetText),
      ...calculateHandDistribution(input),
      wordsTyped: Math.floor(input.length / 5)
    };

    setStats(newStats);
  }, [input, startTime, targetText, isTestActive]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTestActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTestActive(false);
            setIsTestComplete(true);
            
            // Calculate final stats using refs to ensure fresh values
            const finalInput = inputRef.current;
            const finalStartTime = startTimeRef.current;
            
            setStats({
              speed: calculateSpeed(finalStartTime, finalInput.length),
              accuracy: calculateAccuracy(finalInput, targetText),
              ...calculateHandDistribution(finalInput),
              wordsTyped: Math.floor(finalInput.length / 5)
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTestActive, timeLeft, targetText]);

  // Reset test
  const resetTest = useCallback(() => {
    setInput('');
    setStartTime(null);
    setIsTestActive(false);
    setIsTestComplete(false);
    setTimeLeft(60);
    setStats({
      speed: 0,
      accuracy: 0,
      leftHand: 0,
      rightHand: 0,
      wordsTyped: 0
    });
  }, []);

  return {
    input,
    stats,
    timeLeft,
    isTestActive,
    isTestComplete,
    handleInput,
    resetTest
  };
}