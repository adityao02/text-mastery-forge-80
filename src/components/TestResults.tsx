import React from 'react';

interface TestResultsProps {
  speed: number;
  accuracy: number;
  leftHand: number;
  rightHand: number;
  wordsTyped: number;
  timeLeft: number;
  isTestActive: boolean;
  isTestComplete: boolean;
  inputLength: number;
  onRestart?: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  speed,
  accuracy,
  leftHand,
  rightHand,
  wordsTyped,
  timeLeft,
  isTestActive,
  isTestComplete,
  inputLength,
  onRestart
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle hand distribution display logic
  const renderDistribution = () => {
    if (inputLength === 0) {
      return <span>text distribution: 0% left | 0% right</span>;
    }
    
    return (
      <span>text distribution: {leftHand}% left | {rightHand}% right</span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 p-8">
      {isTestComplete ? (
        <>
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Test Completed</h2>
          </div>

          {/* Main Stats Row */}
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-sm opacity-70 uppercase tracking-wider">Speed (WPM)</div>
              <div className="text-4xl font-bold">{speed}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm opacity-70 uppercase tracking-wider">Accuracy (%)</div>
              <div className="text-4xl font-bold">{accuracy}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm opacity-70 uppercase tracking-wider">Words Typed</div>
              <div className="text-4xl font-bold">{wordsTyped}</div>
            </div>
          </div>

          {/* Text Distribution */}
          <div className="space-y-4">
            <div className="text-sm opacity-70">
              {renderDistribution()}
            </div>
            <div className="w-full h-3 border border-current rounded-sm overflow-hidden">
              <div 
                className="h-full bg-current opacity-30 transition-all duration-1000 ease-out"
                style={{ width: `${leftHand}%` }}
              />
            </div>
          </div>

          {/* Restart Button */}
          <div className="pt-4">
            <button
              onClick={onRestart}
              className="px-6 py-3 border border-current hover:bg-current hover:text-black transition-colors duration-200 font-mono"
            >
              [ restart ]
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Live Stats Display */}
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-sm opacity-70 uppercase tracking-wider">Speed (WPM)</div>
              <div className="text-2xl font-bold">{speed}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm opacity-70 uppercase tracking-wider">Accuracy (%)</div>
              <div className="text-2xl font-bold">{accuracy}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm opacity-70 uppercase tracking-wider">Time Left</div>
              <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
            </div>
          </div>

          {/* Live Distribution */}
          <div className="space-y-4">
            <div className="text-sm opacity-70">
              {renderDistribution()}
            </div>
            <div className="w-full h-3 border border-current rounded-sm overflow-hidden">
              <div 
                className="h-full bg-current opacity-30 transition-all duration-300 ease-out"
                style={{ width: `${leftHand}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestResults;