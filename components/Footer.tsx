
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-[#50463F]/60 text-xs">
        <div className="border-t border-[#50463F]/10 pt-8">
            <h4 className="font-bold text-sm text-[#50463F]/80 mb-2">Scalability Notes</h4>
            <ul className="space-y-2 max-w-4xl mx-auto">
                <li><span className="font-semibold">*Fully concentrated</span> means an employee's time is dedicated to a single product line for maximum efficiency.</li>
                <li><span className="font-semibold">*Unlimited production cap</span> on select items is due to no necessity of oven or large equipment. Space can be provided for expansion if employee count raises.</li>
                <li><span className="font-semibold">*A new larger oven</span> purchase is easily attainable, increasing oven-based production capacity by 150%. The approximate cost is TRY200,000 for a 10-tray oven.</li>
                <li><span className="font-semibold">*SuperWater</span> production is currently being outsourced to an approved supplier with large capacity, effectively making it unlimited.</li>
            </ul>
        </div>
    </footer>
  );
};
