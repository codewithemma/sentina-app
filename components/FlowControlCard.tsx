
import React from 'react';

interface FlowControlCardProps {
  title: string;
  stats: { label: string; value: string }[];
  icon: React.ReactNode;
}

const FlowControlCard: React.FC<FlowControlCardProps> = ({ title, stats, icon }) => {
  return (
    <div className="bg-background-secondary p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <h3 className="text-base sm:text-lg font-semibold text-text-secondary">{title}</h3>
      </div>
      <div className="space-y-3">
        {stats.map(stat => (
          <div key={stat.label} className="flex justify-between items-baseline">
            <p className="text-base sm:text-lg text-text-primary">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowControlCard;