import React, { useRef, useEffect } from 'react';
import useTypingTest from '../hooks/useTypingTest';
import TestResults from './TestResults';

export default function TypingTest() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const targetText = "Time management is a crucial skill that can significantly impact productivity and overall quality of life in both personal and professional settings. The ability to prioritize tasks, set realistic goals, and maintain focus on important objectives distinguishes successful individuals from those who struggle with daily demands.";
  
  const {
    input,
    stats,
    timeLeft,
    isTestActive,
    isTestComplete,
    handleInput,
    resetTest
  } = useTypingTest(targetText);

  useEffect(() => {
    if (textareaRef.current && !isTestComplete) {
      textareaRef.current.focus();
    }
  }, [isTestComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInput(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {!isTestComplete ? (
        <>
          <div className="relative p-6 border rounded-lg bg-muted/20">
            <div className="text-lg leading-relaxed font-mono">
              {targetText.split('').map((char, i) => {
                let className = 'transition-colors duration-150';
                if (i < input.length) {
                  className += input[i] === char ? ' text-primary bg-primary/10' : ' text-destructive bg-destructive/10';
                } else if (i === input.length) {
                  className += ' bg-primary/20 animate-pulse';
                }
                return (
                  <span 
                    key={i} 
                    className={className}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            placeholder="Start typing here..."
            className="w-full p-4 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            disabled={isTestComplete}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-4">Great job! Your typing test is complete.</h3>
        </div>
      )}

      <TestResults 
        speed={stats.speed} 
        accuracy={stats.accuracy} 
        leftHand={stats.leftHand} 
        rightHand={stats.rightHand} 
        wordsTyped={stats.wordsTyped}
        timeLeft={timeLeft}
        isTestActive={isTestActive}
        isTestComplete={isTestComplete}
        inputLength={input.length}
        onRestart={resetTest}
      />

      {!isTestComplete && (
        <div className="text-center">
          <button 
            onClick={resetTest} 
            className="px-6 py-3 border border-current hover:bg-current hover:text-background transition-colors duration-200 font-mono"
          >
            [ restart test ]
          </button>
        </div>
      )}
    </div>
  );
}