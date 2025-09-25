import React, { useState, useMemo, useCallback } from 'react';
import { PRODUCTS } from './constants';
import type { ProductFocus, CalculatedProduction, Product } from './types';
import { Switch } from './components/Switch';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';

const UsersIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);

const FireIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.553 3.12c.974-1.745 2.693-2.428 4.238-1.855a.75.75 0 01.209 1.282c-1.331.95-2.261 2.503-2.659 4.191-.122.525-.19 1.072-.19 1.634 0 .91.164 1.782.472 2.585.308.803.731 1.523 1.246 2.193.515.67 1.09 1.268 1.712 1.78.622.511 1.266.927 1.921 1.23a.75.75 0 01-.63 1.352c-1.095-.508-2.115-1.21-3.023-2.071-.908-.86-1.683-1.848-2.29-2.942-.607-1.094-.997-2.28-1.142-3.521a10.28 10.28 0 01-.19-2.12c0-1.87.533-3.628 1.488-5.118zM8.072 6.81c.823-1.472 2.272-2.048 3.578-1.565a.75.75 0 01.176 1.082c-1.124.799-1.908 2.112-2.244 3.536-.104.442-.16.904-.16 1.378 0 .768.138 1.504.4 2.18.26.678.617 1.285 1.05 1.85.434.565.92 1.07 1.444 1.502.524.432 1.066.782 1.62.96a.75.75 0 01-.532 1.408c-.924-.428-1.784-1.02-2.55-1.748-.766-.728-1.42-1.558-1.932-2.483-.513-.924-.84-1.923-.962-2.97a8.67 8.67 0 01-.16-1.79c0-1.58.45-3.06 1.256-4.316z" clipRule="evenodd" />
    </svg>
);

const ScaleIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.818-5.62-2.247m0 0a5.988 5.988 0 00-2.036-.243c-2.132 0-4.14.818-5.62 2.247m11.24 0a24.258 24.258 0 01-11.24 0m0 0c-1.01-.143-2.01-.317-3-.52m3 .52l-2.62 10.726c-.122.499.106 1.028.589 1.202a5.988 5.988 0 002.036.243c2.132 0 4.14-.818 5.62-2.247" />
    </svg>
);


const App: React.FC = () => {
    const [employeeCount, setEmployeeCount] = useState<number>(5);
    const initialFocus = PRODUCTS.reduce((acc, product) => {
        acc[product.id] = 5;
        return acc;
    }, {} as ProductFocus);
    const [productFocus, setProductFocus] = useState<ProductFocus>(initialFocus);
    const [hasNewOven, setHasNewOven] = useState<boolean>(false);

    const handleFocusChange = useCallback((productId: string, value: number) => {
        setProductFocus(prev => ({ ...prev, [productId]: value }));
    }, []);

    const { calculatedProduction, totalWeightKg, ovenUtilization } = useMemo(() => {
        // FIX: Explicitly typing the `reduce` function's parameters fixes an issue where they were inferred as `unknown`. This ensures `totalEffort` is a `number`, resolving both TypeScript errors.
        const totalEffort = Object.values(productFocus).reduce((sum: number, val: number) => sum + val, 0) || 1;
        
        // FIX: Explicitly type `product` to ensure correct type inference for its properties.
        const potentialProduction = PRODUCTS.map((product: Product) => {
            if (product.id === 'superwater') return { ...product, units: Infinity };
            const focusPercentage = (productFocus[product.id] || 0) / totalEffort;
            const units = employeeCount * product.employeeProductionRate * focusPercentage;
            return { ...product, units };
        });

        let ovenDemand = 0;
        potentialProduction.forEach(p => {
            if (p.ovenConstraint === 'capped' && p.dailyCap) {
                ovenDemand += p.units / p.dailyCap;
            }
        });

        const ovenCapacity = hasNewOven ? 2.5 : 1; // 10 trays / 4 trays = 2.5x capacity
        const isOvenOverloaded = ovenDemand > ovenCapacity;
        const overloadFactor = isOvenOverloaded ? ovenCapacity / ovenDemand : 1;
        
        let finalProduction: CalculatedProduction[] = potentialProduction.map(p => {
            let finalUnits = p.units;
            let isBottlenecked = false;
            
            if(p.id === 'superwater') {
                finalUnits = 0; // Water is not produced, it's sourced. We show it as an option but don't add to totals.
            } else if (p.ovenConstraint === 'capped') {
                finalUnits *= overloadFactor;
                isBottlenecked = isOvenOverloaded;
            }

            return {
                id: p.id,
                name: p.name,
                units: finalUnits,
                weightKg: (finalUnits * p.weightGrams) / 1000,
                isBottlenecked: isBottlenecked,
                imageUrl: p.imageUrl,
            }
        }).filter(p => p.id !== 'superwater');

        const totalWeightKg = finalProduction.reduce((sum, p) => sum + p.weightKg, 0);

        return {
            calculatedProduction: finalProduction,
            totalWeightKg,
            ovenUtilization: ovenDemand / ovenCapacity
        };

    }, [employeeCount, productFocus, hasNewOven]);

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <header className="text-center mb-10">
                <h1 className="font-grotesque text-4xl sm:text-5xl md:text-6xl text-[#50463F] tracking-tighter">TAM LABS</h1>
                <p className="text-lg text-[#50463F]/70 mt-1">Production Capacity Simulator</p>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Controls Section */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white/50 p-6 rounded-xl shadow-lg border border-black/5">
                        <h2 className="font-grotesque text-2xl border-b border-[#50463F]/10 pb-3 mb-4">Controls</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="employees" className="flex justify-between items-center text-base font-bold text-[#50463F]">
                                    <div className="flex items-center">
                                        <UsersIcon className="h-6 w-6 text-[#50463F]/80" />
                                        <span className="ml-2">Employees</span>
                                    </div>
                                    <span className="font-grotesque text-2xl">{employeeCount}</span>
                                </label>
                                <input
                                    type="range"
                                    id="employees"
                                    min="1"
                                    max="25"
                                    value={employeeCount}
                                    onChange={(e) => setEmployeeCount(Number(e.target.value))}
                                    className="w-full mt-2"
                                />
                            </div>

                            <Switch
                                icon={<FireIcon className="h-6 w-6" />}
                                label="Upgrade Oven"
                                description="Current: 4-Trays | New: 10-Trays"
                                checked={hasNewOven}
                                onChange={setHasNewOven}
                            />
                        </div>
                    </div>
                    
                    <div className="bg-white/50 p-6 rounded-xl shadow-lg border border-black/5">
                        <h3 className="font-grotesque text-2xl border-b border-[#50463F]/10 pb-3 mb-4">Employee Focus</h3>
                        <div className="space-y-5">
                            {PRODUCTS.filter(p => p.id !== 'superwater').map(product => (
                                <div key={product.id}>
                                    <label htmlFor={product.id} className="flex justify-between items-baseline text-sm font-bold text-[#50463F]">
                                        <span>{product.name}</span>
                                        <span className="font-sans font-normal text-xs text-[#50463F]/70">Effort: {productFocus[product.id]}/10</span>
                                    </label>
                                    <input
                                        type="range"
                                        id={product.id}
                                        min="0"
                                        max="10"
                                        step="1"
                                        value={productFocus[product.id]}
                                        onChange={(e) => handleFocusChange(product.id, Number(e.target.value))}
                                        className="w-full mt-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
                
                {/* Results Section */}
                <section className="lg:col-span-2 space-y-8">
                    <div className="bg-white/50 p-6 rounded-xl shadow-lg border border-black/5 text-center">
                        <h2 className="font-grotesque text-2xl mb-4">Daily Production Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-[#FFFDF4]/80 rounded-lg flex flex-col items-center justify-center space-y-1">
                                <ScaleIcon className="h-8 w-8 text-[#50463F]/60" />
                                <p className="text-sm text-[#50463F]/60">Total Weight Output</p>
                                <p className="text-4xl font-grotesque font-bold text-[#50463F]">{totalWeightKg.toLocaleString('en-US', { maximumFractionDigits: 1 })} <span className="text-2xl font-normal">kg</span></p>
                            </div>
                            <div className="p-4 bg-[#FFFDF4]/80 rounded-lg flex flex-col items-center justify-center space-y-1">
                                <FireIcon className="h-8 w-8 text-[#50463F]/60" />
                                <p className="text-sm text-[#50463F]/60">Oven Utilization</p>
                                <p className={`text-4xl font-grotesque font-bold ${ovenUtilization > 1 ? 'text-amber-600' : 'text-[#50463F]'}`}>
                                    {(ovenUtilization * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                         {ovenUtilization > 1 && <p className="text-amber-700/80 text-xs mt-3">Oven is the bottleneck. Production of oven-based items is automatically scaled down.</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {calculatedProduction.map(p => <ProductCard key={p.id} production={p} />)}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default App;