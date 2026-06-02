import {
  BASE_PRICE,
  bandColorOptions,
  bandStyleOptions,
  caseOptions,
  faceOptions,
  Option,
  sizeOptions,
} from './catalog';

export type WatchConfig = {
  caseId: string;
  sizeId: string;
  bandStyleId: string;
  bandColorId: string;
  faceId: string;
};

export const defaultConfig: WatchConfig = {
  caseId: 'ti-natural',
  sizeId: 's45',
  bandStyleId: 'sport',
  bandColorId: 'b-blue',
  faceId: 'modular',
};

function find<T extends Option>(list: T[], id: string): T {
  return list.find((o) => o.id === id) ?? list[0];
}

export function resolveConfig(cfg: WatchConfig) {
  const caseOpt = find(caseOptions, cfg.caseId);
  const sizeOpt = find(sizeOptions, cfg.sizeId);
  const bandStyleOpt = find(bandStyleOptions, cfg.bandStyleId);
  const bandColorOpt = find(bandColorOptions, cfg.bandColorId);
  const faceOpt = find(faceOptions, cfg.faceId);

  const total =
    BASE_PRICE +
    caseOpt.delta +
    sizeOpt.delta +
    bandStyleOpt.delta +
    bandColorOpt.delta +
    faceOpt.delta;

  return { caseOpt, sizeOpt, bandStyleOpt, bandColorOpt, faceOpt, total };
}

export function formatPrice(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

export function deltaLabel(delta: number) {
  return delta === 0 ? 'Included' : `+${formatPrice(delta)}`;
}
