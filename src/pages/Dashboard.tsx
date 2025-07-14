
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { state } = useApp();

  // Mock data for charts
  const progressData = [
    { date: '12/10', wpm: 45, accuracy: 92 },
    { date: '12/11', wpm: 48, accuracy: 94 },
    { date: '12/12', wpm: 52, accuracy: 91 },
    { date: '12/13', wpm: 55, accuracy: 95 },
    { date: '12/14', wpm: 58, accuracy: 96 },
    { date: '12/15', wpm: 62, accuracy: 97 },
  ];

  const averageWpm = progressData.reduce((acc, curr) => acc + curr.wpm, 0) / progressData.length;
  const averageAccuracy = progressData.reduce((acc, curr) => acc + curr.accuracy, 0) / progressData.length;
  const totalTime = state.typingHistory.reduce((acc, curr) => acc + curr.stats.timeElapsed, 0);

  if (!state.user) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="opacity-70 text-lg">[ COMING SOON ]</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="opacity-70">Welcome back, {state.user.email}</p>
        <div className="mt-2">
          <span className={`px-3 py-1 border border-current text-sm ${
            state.user.subscriptionTier === 'pro' ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {state.user.subscriptionTier.toUpperCase()} PLAN
          </span>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-sm opacity-70">AVERAGE SPEED</div>
          <div className="text-3xl font-bold">{Math.round(averageWpm)} WPM</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm opacity-70">AVERAGE ACCURACY</div>
          <div className="text-3xl font-bold">{Math.round(averageAccuracy)}%</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm opacity-70">TOTAL TIME PRACTICED</div>
          <div className="text-3xl font-bold">{Math.round(totalTime / 60)} min</div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="text-center space-y-8">
        <div className="border border-current p-12">
          <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
          <p className="opacity-70 mb-6">Detailed progress tracking, performance insights, and personalized recommendations</p>
          <div className="text-lg font-bold opacity-50">[ COMING SOON ]</div>
        </div>
      </div>
    </div>
  );
}
