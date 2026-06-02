export type Section = 'overview' | 'configure' | 'accessories';

export const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'configure', label: 'Configure' },
  { id: 'accessories', label: 'Accessories' },
];
