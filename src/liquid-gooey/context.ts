import { createContext, useContext } from 'solid-js';
import type { ObserveEngine } from './observer';

export interface GooeyContextValue {
  portal: () => SVGGElement | null;
  meltPortal: () => SVGGElement | null;
  fill: () => string;
  getGroup: () => HTMLDivElement | null;
  engine: ObserveEngine;
}

export const GooeyContext = createContext<GooeyContextValue | null>(null);

export function useGooeyContext(): GooeyContextValue {
  const ctx = useContext(GooeyContext);
  if (!ctx) throw new Error('<Liquid.Item> must be rendered inside a <Liquid> group.');
  return ctx;
}
