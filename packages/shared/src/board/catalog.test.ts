import { describe, it, expect } from 'vitest';
import {
  board,
  continents,
  territories,
  geometry,
  playerSchema,
} from '../index';
describe('catálogo conferido com a imagem', () => {
  it('mantém a costa do 150 contínua sob os dígitos impressos, preservando o fiorde', () => {
    const paths = geometry['europe-03'];
    expect(paths).toHaveLength(1);
    const polygon = paths[0]!
      .match(/\d+,\d+/g)!
      .map((pair) => pair.split(',').map(Number));
    function contains(x: number, y: number) {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i] as [number, number];
        const [xj, yj] = polygon[j] as [number, number];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
          inside = !inside;
      }
      return inside;
    }
    // Samples checked against the original, where 1 and 0 touch the coast.
    expect(contains(982, 180)).toBe(true);
    expect(contains(1022, 180)).toBe(true);
    expect(contains(1045, 160)).toBe(false);
  });
  it('tem 42 IDs e números únicos com geometria 1:1', () => {
    expect(territories).toHaveLength(42);
    expect(new Set(territories.map((t) => t.id)).size).toBe(42);
    expect(new Set(territories.map((t) => t.number)).size).toBe(42);
    expect(Object.keys(geometry).sort()).toEqual(
      territories.map((t) => t.id).sort(),
    );
    for (const t of territories) {
      expect(continents.some((c) => c.id === t.continentId)).toBe(true);
      expect(t.labelPosition.x).toBeLessThan(board.width);
      expect(t.labelPosition.y).toBeLessThan(board.height);
      const paths = geometry[t.id as keyof typeof geometry];
      expect(paths.length).toBeGreaterThan(0);
      for (const path of paths) {
        expect(path).toMatch(/^M[\d, L]+ Z$/);
        const coords = path.match(/\d+,\d+/g)!;
        expect(coords.length).toBeGreaterThanOrEqual(3);
        for (const pair of coords) {
          const [x, y] = pair.split(',').map(Number);
          expect(x).toBeLessThanOrEqual(board.width);
          expect(y).toBeLessThanOrEqual(board.height);
        }
      }
    }
  });
  it('preserva o inventário por continente', () => {
    const expected = {
      north: [52, 299, 467, 471, 548, 618, 672, 709, 907],
      south: [55, 322, 379, 415],
      europe: [92, 114, 150, 198, 271, 354, 373],
      africa: [119, 215, 216, 233, 239, 251],
      asia: [81, 302, 339, 381, 383, 391, 397, 419, 518, 822, 976, 996],
      oceania: [62, 63, 265, 369],
    };
    for (const [id, numbers] of Object.entries(expected))
      expect(
        territories
          .filter((t) => t.continentId === id)
          .map((t) => t.number)
          .sort((a, b) => a - b),
      ).toEqual(numbers);
    expect(Object.isFrozen(territories)).toBe(true);
  });
  it('valida nomes e cores sem introduzir regras matemáticas', () => {
    expect(
      playerSchema.safeParse({
        id: 'a',
        displayName: ' ',
        color: 'red',
        seatIndex: -1,
      }).success,
    ).toBe(false);
  });
});
