
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function Compete() {
  const { state } = useApp();
  const [selectedCompetition, setSelectedCompetition] = useState('daily');

  // Mock leaderboard data
  const dailyLeaderboard = [
    { rank: 1, username: 'speedster_pro', wpm: 125, accuracy: 98 },
    { rank: 2, username: 'type_master', wpm: 118, accuracy: 96 },
    { rank: 3, username: 'keyboard_ninja', wpm: 112, accuracy: 99 },
    { rank: 4, username: 'fast_fingers', wpm: 108, accuracy: 94 },
    { rank: 5, username: 'typing_ace', wpm: 105, accuracy: 97 },
  ];

  if (!state.user) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Competition</h1>
        <p className="opacity-70 text-lg">[ COMING SOON ]</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Competition</h1>
        <p className="opacity-70">Compete with typists worldwide</p>
      </div>

      {/* Competition Mode Selection */}
      <div className="space-y-6">
        <h2 className="text-xl">Select Competition Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedCompetition('daily')}
            className={`p-6 border border-current text-left hover:opacity-70 ${
              selectedCompetition === 'daily' ? 'bg-current text-black' : ''
            }`}
          >
            <div className="font-bold text-lg">[ Daily Challenge ]</div>
            <div className="text-sm opacity-70 mt-2">
              Complete today's challenge and see how you rank against other typists.
            </div>
            <div className="text-xs mt-4 opacity-50">
              Resets every 24 hours
            </div>
          </button>
          
          <button
            onClick={() => setSelectedCompetition('race')}
            className={`p-6 border border-current text-left hover:opacity-70 ${
              selectedCompetition === 'race' ? 'bg-current text-black' : ''
            }`}
          >
            <div className="font-bold text-lg">[ Type Racing ]</div>
            <div className="text-sm opacity-70 mt-2">
              Real-time multiplayer racing. Race against other typists live.
            </div>
            <div className="text-xs mt-4 opacity-50">
              Live multiplayer
            </div>
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="text-center space-y-8">
        <div className="border border-current p-12">
          <h3 className="text-2xl font-bold mb-4">Multiplayer Competition</h3>
          <p className="opacity-70 mb-6">Daily challenges, live racing, and global leaderboards</p>
          <div className="text-lg font-bold opacity-50">[ COMING SOON ]</div>
        </div>
      </div>
    </div>
  );
}
