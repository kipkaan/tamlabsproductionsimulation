
import type { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'superbites',
    name: 'SuperBites',
    employeeProductionRate: 200,
    weightGrams: 40,
    ovenConstraint: 'none',
    imageUrl: '/images/superbites.png'
  },
  {
    id: 'supercookies',
    name: 'SuperCookies',
    employeeProductionRate: 180,
    weightGrams: 80,
    ovenConstraint: 'capped',
    dailyCap: 600,
    imageUrl: '/images/supercookies.png'
  },
  {
    id: 'supercrackers',
    name: 'SuperCrackers',
    employeeProductionRate: 90,
    weightGrams: 50,
    ovenConstraint: 'capped',
    dailyCap: 300,
    imageUrl: '/images/supercrackers.png'
  },
  {
    id: 'supermuffins',
    name: 'SuperMuffins',
    employeeProductionRate: 180,
    weightGrams: 130,
    ovenConstraint: 'capped',
    dailyCap: 600,
    imageUrl: '/images/supermuffins.png'
  },
  {
    id: 'superpuddings',
    name: 'SuperPuddings',
    employeeProductionRate: 170,
    weightGrams: 230,
    ovenConstraint: 'none',
    imageUrl: '/images/superpuddings.png'
  },
  {
    id: 'superwater',
    name: 'SuperWater',
    employeeProductionRate: Infinity, // Outsourced, no employee impact
    weightGrams: 500, // Assuming 500ml bottle
    ovenConstraint: 'none',
    imageUrl: 'https://picsum.photos/seed/water/400/300'
  }
];
