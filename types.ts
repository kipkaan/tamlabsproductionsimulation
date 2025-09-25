
export interface Product {
  id: string;
  name: string;
  employeeProductionRate: number; // units per day per employee
  weightGrams: number;
  ovenConstraint: 'none' | 'capped';
  dailyCap?: number; // max units per day with current 4-tray oven
  imageUrl: string;
}

export interface ProductFocus {
  [productId: string]: number; // value from 0-10 representing effort
}

export interface CalculatedProduction {
  id: string;
  name: string;
  units: number;
  weightKg: number;
  isBottlenecked: boolean;
  imageUrl: string;
}
