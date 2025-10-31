
import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer p-4 bg-background-tertiary/50 rounded-lg">
      <span className="text-base sm:text-lg font-medium text-text-primary">{label}</span>
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={onChange} 
        />
        <div className="w-14 h-8 rounded-full bg-background-tertiary peer-checked:bg-accent-green transition-colors"></div>
        <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:transform peer-checked:translate-x-6"></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;