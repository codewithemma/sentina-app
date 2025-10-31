
import React from 'react';

const EquityWatch: React.FC = () => {
  return (
    <div className="bg-background-secondary p-6 rounded-2xl h-full">
      <h3 className="text-lg font-semibold text-text-secondary mb-4">Advanced Equity Watch</h3>
      <div className="space-y-3">
        <div className="bg-accent-orange/10 border-l-4 border-accent-orange p-3 rounded-md">
          <p className="font-semibold text-accent-orange">Proactive Alert</p>
          <p className="text-sm text-text-primary">Patient #8432 from an underserved area is approaching wait time threshold. Prioritization recommended.</p>
        </div>
        <div className="bg-background-tertiary/50 p-3 rounded-md">
          <p className="font-semibold text-text-secondary">Interpreter Required</p>
          <p className="text-sm text-text-primary">Patient #8451 (Russian-speaking) is waiting. Interpreter has been paged.</p>
        </div>
        <p className="text-xs text-center text-text-secondary pt-2">Monitoring historical health disparities...</p>
      </div>
    </div>
  );
};

export default EquityWatch;