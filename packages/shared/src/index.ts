import { z } from 'zod';
import data from './board/catalog.json' with { type: 'json' };
export { default as geometry } from './board/geometry.json' with { type: 'json' };

export const continentSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseColor: z.string().regex(/^#[0-9a-f]{6}$/i),
});
export const territoryDefinitionSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  continentId: z.string(),
  labelPosition: z.object({
    x: z.number().nonnegative(),
    y: z.number().nonnegative(),
  }),
});
export const playerSchema = z.object({
  id: z.string(),
  displayName: z.string().trim().min(1).max(40),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  seatIndex: z.number().int().nonnegative(),
});
export type Continent = z.infer<typeof continentSchema>;
export type TerritoryDefinition = z.infer<typeof territoryDefinitionSchema>;
export type Player = z.infer<typeof playerSchema>;
export const board = Object.freeze({
  width: data.width,
  height: data.height,
  version: data.version,
});
export const continents: readonly Readonly<Continent>[] = Object.freeze(
  data.continents.map((c) => Object.freeze(continentSchema.parse(c))),
);
export const territories: readonly Readonly<TerritoryDefinition>[] =
  Object.freeze(
    data.territories.map((t) =>
      Object.freeze({
        ...territoryDefinitionSchema.parse(t),
        labelPosition: Object.freeze(t.labelPosition),
      }),
    ),
  );
