import { type TerritoryDefinition } from '@primos/shared';
// Presentation-only adjustments in original board coordinates. Small European
// regions and islands need tighter type to keep labels on their own territory.
const overrides: Record<string, { x?: number; y?: number; fontSize: number }> =
  {
    'europe-01': { fontSize: 24 },
    'europe-02': { x: 925, y: 229, fontSize: 22 },
    'europe-03': { fontSize: 24 },
    'europe-05': { fontSize: 24 },
    'europe-06': { y: 244, fontSize: 24 },
    'europe-07': { fontSize: 24 },
    'north-07': { fontSize: 28 },
    'north-08': { fontSize: 28 },
    'africa-06': { x: 1226, y: 750, fontSize: 18 },
    'asia-03': { fontSize: 22 },
    'asia-04': { fontSize: 28 },
    'asia-05': { fontSize: 28 },
    'asia-10': { fontSize: 28 },
    'asia-11': { y: 474, fontSize: 24 },
    'asia-12': { x: 1776, y: 296, fontSize: 18 },
    'oceania-01': { x: 1585, y: 603, fontSize: 18 },
    'oceania-02': { fontSize: 26 },
    'oceania-03': { fontSize: 26 },
  };
export function getLabelLayout(territory: Readonly<TerritoryDefinition>) {
  return {
    ...territory.labelPosition,
    fontSize: 32,
    ...overrides[territory.id],
  };
}
