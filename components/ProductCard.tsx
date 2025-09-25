
import React from 'react';
import type { CalculatedProduction } from '../types';

interface ProductCardProps {
  production: CalculatedProduction;
}

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


export const ProductCard: React.FC<ProductCardProps> = ({ production }) => {
    return (
        <div className="bg-[#FFFDF4]/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-black/5 transition-shadow duration-300 hover:shadow-xl">
            <img src={production.imageUrl} alt={production.name} className="w-full h-52 object-cover" />
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-grotesque text-xl text-[#50463F]">{production.name}</h3>
                    {production.isBottlenecked && (
                         <div className="flex items-center space-x-1 bg-amber-500/20 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full" title="Production limited by oven capacity">
                            <WarningIcon />
                            <span>Oven</span>
                        </div>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-[#50463F]/60">Daily Units</p>
                        <p className="text-2xl font-grotesque font-bold text-[#50463F]">{production.units.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#50463F]/60">Daily Weight</p>
                        <p className="text-2xl font-grotesque font-bold text-[#50463F]">{production.weightKg.toLocaleString('en-US', { maximumFractionDigits: 1 })} <span className="text-lg font-normal">kg</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
