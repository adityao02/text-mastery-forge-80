import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Progress } from '@/components/ui/progress';

interface LoadingPageProps {
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const { state } = useApp();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('initializing');

  const loadingSteps = [
    { threshold: 0, text: 'initializing' },
    { threshold: 15, text: 'loading interface' },
    { threshold: 35, text: 'preparing typing engine' },
    { threshold: 55, text: 'setting up analytics' },
    { threshold: 75, text: 'optimizing performance' },
    { threshold: 90, text: 'finalizing setup' },
    { threshold: 100, text: 'ready' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + (100 / (duration / 50)), 100);
        
        // Update loading text based on progress
        const currentStep = loadingSteps
          .reverse()
          .find(step => newProgress >= step.threshold);
        if (currentStep) {
          setLoadingText(currentStep.text);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center font-mono bg-black text-white">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Tpix</h1>
          <div className="text-sm opacity-70">
            [ master the art of typing ]
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-muted border border-current"
            />
            <div className="flex justify-between text-xs opacity-70">
              <span>0%</span>
              <span>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Loading Text */}
          <div className="h-6 flex items-center justify-center">
            <span className="text-sm opacity-70 animate-pulse">
              [ {loadingText}... ]
            </span>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1 h-1 border border-current animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Stats */}
        <div className="border-t border-current pt-6 space-y-2 text-xs opacity-50">
          <div>Loading keyboard layouts...</div>
          <div>Preparing word database...</div>
          <div>Initializing timer systems...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;