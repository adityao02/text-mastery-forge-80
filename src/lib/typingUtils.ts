// Calculate hand distribution with comprehensive key mapping
export const calculateHandDistribution = (text: string) => {
  if (!text || text.length === 0) {
    return { leftHand: 0, rightHand: 0 };
  }

  // Comprehensive key mapping
  const LEFT_HAND_KEYS = 'qwertasdfgzxcvb12345!@#$%';
  const RIGHT_HAND_KEYS = 'yuiophjklnm67890^&*()';

  let leftCount = 0;
  let rightCount = 0;
  let totalCount = 0;

  for (const char of text.toLowerCase()) {
    if (LEFT_HAND_KEYS.includes(char)) {
      leftCount++;
      totalCount++;
    } else if (RIGHT_HAND_KEYS.includes(char)) {
      rightCount++;
      totalCount++;
    }
    // Ignore other characters (spaces, punctuation, etc.)
  }

  return {
    leftHand: totalCount > 0 ? Math.round((leftCount / totalCount) * 100) : 0,
    rightHand: totalCount > 0 ? Math.round((rightCount / totalCount) * 100) : 0
  };
};

// Calculate accuracy with error tolerance
export const calculateAccuracy = (typed: string, target: string) => {
  if (!typed || typed.length === 0) return 0;
  
  let correct = 0;
  const length = Math.min(typed.length, target.length);
  
  for (let i = 0; i < length; i++) {
    if (typed[i] === target[i]) correct++;
  }
  
  // Allow 1% tolerance for minor errors
  const accuracy = (correct / typed.length) * 100;
  return Math.max(0, Math.min(100, Math.round(accuracy)));
};

// Calculate typing speed with minimum time requirement
export const calculateSpeed = (
  startTime: number | null, 
  charCount: number
): number => {
  if (!startTime || charCount === 0) return 0;
  
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  
  // Require at least 3 seconds of typing for accurate speed
  if (elapsedSeconds < 3) return 0;
  
  const elapsedMinutes = elapsedSeconds / 60;
  return Math.round((charCount / 5) / elapsedMinutes);
};