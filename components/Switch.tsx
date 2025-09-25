import React from 'react';

interface SwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({ label, description, checked, onChange, icon }) => {
  const bgColor = checked ? 'bg-[#50463F]' : 'bg-[#50463F]/20';
  const circlePosition = checked ? 'translate-x-5' : 'translate-x-0';

  return (
    <label className="flex items-center justify-between cursor-pointer w-full">
      <div className="flex items-center">
        {icon && <div className="mr-3 text-[#50463F]/80">{icon}</div>}
        <div className="flex flex-col">
            <span className="text-base font-bold text-[#50463F]">{label}</span>
            <span className="text-xs text-[#50463F]/70">{description}</span>
        </div>
      </div>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${bgColor}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${circlePosition}`}></div>
      </div>
    </label>
  );
};
