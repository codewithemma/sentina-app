
import React from 'react';

const HomeostasisScore: React.FC = () => {
  const score = 68; // Simulated score
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  let scoreColor = 'text-accent-green';
  let scoreRingColor = 'stroke-accent-green';
  let statusText = 'Stable';
  if (score < 75) {
    scoreColor = 'text-accent-yellow';
    scoreRingColor = 'stroke-accent-yellow';
    statusText = 'Strained';
  }
  if (score < 50) {
    scoreColor = 'text-accent-red';
    scoreRingColor = 'stroke-accent-red';
    statusText = 'Critical';
  }

  return (
    <div className="bg-background-secondary p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full">
      <h3 className="text-lg font-semibold text-text-secondary mb-4">Homeostasis Score</h3>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle className="stroke-current text-background-tertiary" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60" />
          <circle
            className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${scoreRingColor}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColor}`}>
          <span className="text-4xl sm:text-5xl font-bold">{score}</span>
          <span className="text-xs sm:text-sm font-medium -mt-1">{statusText}</span>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-text-secondary mt-4">
        4-Hour Forecast: <span className="font-semibold text-accent-orange">Increased Load</span>
      </p>
    </div>
  );
};

export default HomeostasisScore;