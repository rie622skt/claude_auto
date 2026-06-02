import { BandStyle, WatchFace } from '../components/WatchRender';

/** Configurator option shared shape. */
export type Option<T = {}> = {
  id: string;
  name: string;
  /** Price delta in whole currency units, added to the running total. */
  delta: number;
} & T;

export const BASE_PRICE = 399;

export const caseOptions: Option<{ hex: string; sheen: string; sub: string }>[] = [
  { id: 'alu-silver', name: 'Aluminum · Silver', sub: 'Aluminum', hex: '#d8d9dd', sheen: '#f3f4f6', delta: 0 },
  { id: 'alu-midnight', name: 'Aluminum · Midnight', sub: 'Aluminum', hex: '#3a3d44', sheen: '#5a5e68', delta: 0 },
  { id: 'ti-natural', name: 'Titanium · Natural', sub: 'Titanium', hex: '#b7b4ad', sheen: '#e4e1d9', delta: 200 },
  { id: 'ti-gold', name: 'Titanium · Gold', sub: 'Titanium', hex: '#c6a875', sheen: '#ecd8ad', delta: 300 },
  { id: 'ti-slate', name: 'Titanium · Slate', sub: 'Titanium', hex: '#54565c', sheen: '#83868e', delta: 300 },
];

export const sizeOptions: Option<{ mm: string }>[] = [
  { id: 's41', name: '41mm', mm: '41mm', delta: 0 },
  { id: 's45', name: '45mm', mm: '45mm', delta: 30 },
];

export const bandStyleOptions: Option<{ style: BandStyle }>[] = [
  { id: 'solid', name: 'Solid Silicone', style: 'solid', delta: 0 },
  { id: 'sport', name: 'Sport Loop', style: 'sport', delta: 0 },
  { id: 'woven', name: 'Woven', style: 'woven', delta: 50 },
  { id: 'link', name: 'Link Bracelet', style: 'link', delta: 320 },
];

export const bandColorOptions: Option<{ hex: string }>[] = [
  { id: 'b-blue', name: 'Pacific Blue', hex: '#2f4a6b', delta: 0 },
  { id: 'b-clay', name: 'Clay', hex: '#b86b4b', delta: 0 },
  { id: 'b-sage', name: 'Sage', hex: '#6f7d63', delta: 0 },
  { id: 'b-black', name: 'Black', hex: '#26262a', delta: 0 },
  { id: 'b-stone', name: 'Stone', hex: '#c9c4ba', delta: 0 },
];

export const faceOptions: Option<{ face: WatchFace }>[] = [
  { id: 'analog', name: 'California', face: 'analog', delta: 0 },
  { id: 'modular', name: 'Modular', face: 'modular', delta: 0 },
  { id: 'minimal', name: 'Minimal', face: 'minimal', delta: 0 },
];

/** Accessories index — rendered as vector swatches (no photography pipeline here). */
export type Accessory = {
  id: string;
  name: string;
  category: 'Bands' | 'Charging' | 'Cases' | 'Docks';
  price: number;
  /** Primary art color for the vector crop. */
  hex: string;
  kind: 'band' | 'charger' | 'case' | 'dock';
};

export const accessories: Accessory[] = [
  { id: 'a1', name: 'Sport Loop — Pacific Blue', category: 'Bands', price: 49, hex: '#2f4a6b', kind: 'band' },
  { id: 'a2', name: 'Woven Band — Clay', category: 'Bands', price: 99, hex: '#b86b4b', kind: 'band' },
  { id: 'a3', name: 'Link Bracelet — Slate', category: 'Bands', price: 349, hex: '#54565c', kind: 'band' },
  { id: 'a4', name: 'Solid Band — Sage', category: 'Bands', price: 49, hex: '#6f7d63', kind: 'band' },
  { id: 'a5', name: 'Fast Charger — USB‑C', category: 'Charging', price: 29, hex: '#e7e7ea', kind: 'charger' },
  { id: 'a6', name: 'Travel Charging Dock', category: 'Docks', price: 79, hex: '#1d1d1f', kind: 'dock' },
  { id: 'a7', name: 'Duo Charging Stand', category: 'Docks', price: 129, hex: '#3a3d44', kind: 'dock' },
  { id: 'a8', name: 'Bumper Case — Clear', category: 'Cases', price: 39, hex: '#dfe3ea', kind: 'case' },
  { id: 'a9', name: 'Bumper Case — Graphite', category: 'Cases', price: 39, hex: '#3a3a3e', kind: 'case' },
  { id: 'a10', name: 'Magnetic Charging Puck', category: 'Charging', price: 35, hex: '#f3f4f6', kind: 'charger' },
  { id: 'a11', name: 'Woven Band — Sage', category: 'Bands', price: 99, hex: '#6f7d63', kind: 'band' },
  { id: 'a12', name: 'Nightstand Dock — Oak', category: 'Docks', price: 89, hex: '#c6a875', kind: 'dock' },
];
