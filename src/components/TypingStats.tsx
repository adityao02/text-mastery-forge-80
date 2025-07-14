
import React from 'react';

interface PerformanceData {
  time: number;
  wpm: number;
  errors: number;
}

interface TypingStatsProps {
  stats: {
    wpm: number;
    accuracy: number;
    wordsTyped: number;
    timeElapsed: number;
    totalCharacters: number;
    correctCharacters: number;
    leftHandPercentage: number;
    rightHandPercentage: number;
    performanceHistory: PerformanceData[];
  };
  timeRemaining?: number;
  currentTime?: number;
}

export function TypingStats({ stats, timeRemaining, currentTime }: TypingStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto text-center space-y-6">
      {/* Main Stats Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="text-sm opacity-70">SPEED (WPM)</div>
          <div className="text-3xl font-bold">{stats.wpm}</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm opacity-70">ACCURACY (%)</div>
          <div className="text-3xl font-bold">{stats.accuracy}</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm opacity-70">WORDS TYPED</div>
          <div className="text-3xl font-bold">{stats.wordsTyped}</div>
        </div>
      </div>

      {/* Timer Row (only when available) */}
      {timeRemaining !== undefined && (
        <div className="space-y-2">
          <div className="text-sm opacity-70">TIME LEFT</div>
          <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
        </div>
      )}

      {/* Text Distribution */}
      <div className="space-y-3">
        <div className="text-sm opacity-70">
          text distribution: {stats.leftHandPercentage}% left | {stats.rightHandPercentage}% right
        </div>
        <div className="w-full h-2 border border-current">
          <div 
            className="h-full bg-current opacity-30"
            style={{ width: `${stats.leftHandPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
