import { z } from 'zod';
import { playerSchema, territories, type Player } from '../index';
export const WINNING_SCORE = 18;
export const playerRosterSchema = z
  .array(playerSchema)
  .min(2)
  .max(6)
  .superRefine((players, context) => {
    if (
      new Set(players.map((p) => p.id)).size !== players.length ||
      new Set(players.map((p) => p.color.toLowerCase())).size !== players.length
    )
      context.addIssue({
        code: 'custom',
        message:
          'Cada jogador precisa de uma identificação e uma cor diferentes.',
      });
  });
export const chipValueSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
export type ChipValue = z.infer<typeof chipValueSchema>;
export interface TerritoryChip {
  ownerId: string;
  points: ChipValue;
}
export type TerritoryChips = Readonly<
  Record<string, TerritoryChip | undefined>
>;
export interface ManualGame {
  players: Player[];
  chips: TerritoryChips;
  turnIndex: number;
  round: number;
  goalOrder: string[];
}
export function createManualGame(players: Player[]): ManualGame {
  return {
    players: playerRosterSchema
      .parse(players)
      .map((player, index) => ({ ...player, seatIndex: index })),
    chips: {},
    turnIndex: 0,
    round: 1,
    goalOrder: [],
  };
}
export function getStandings(game: ManualGame) {
  return game.players
    .map((player) => ({
      ...player,
      score: Object.values(game.chips).reduce(
        (sum, chip) => sum + (chip?.ownerId === player.id ? chip.points : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score || a.seatIndex - b.seatIndex);
}
export function nextTurn(game: ManualGame): ManualGame {
  const turnIndex = (game.turnIndex + 1) % game.players.length;
  return { ...game, turnIndex, round: game.round + (turnIndex === 0 ? 1 : 0) };
}
export function selectTurn(game: ManualGame, index: number): ManualGame {
  if (!Number.isInteger(index) || index < 0 || index >= game.players.length)
    throw new Error('Jogador da vez inválido.');
  return { ...game, turnIndex: index };
}
/** Manual bookkeeping only: no primality, attack or continent validation. */
export function setTerritoryChip(
  game: ManualGame,
  territoryId: string,
  chip: TerritoryChip | null,
): ManualGame {
  if (!territories.some((t) => t.id === territoryId))
    throw new Error('Território inválido.');
  if (
    chip &&
    (!game.players.some((p) => p.id === chip.ownerId) ||
      !chipValueSchema.safeParse(chip.points).success)
  )
    throw new Error('Ficha ou jogador inválido.');
  const chips = { ...game.chips };
  if (chip) chips[territoryId] = { ...chip };
  else delete chips[territoryId];
  const updated = { ...game, chips };
  const qualified = getStandings(updated)
    .filter((player) => player.score >= WINNING_SCORE)
    .map((player) => player.id);
  // Preserve chronological goal crossings independently of leaderboard order.
  // A correction below 18 invalidates that crossing; a later one is appended.
  const goalOrder = game.goalOrder.filter((id) => qualified.includes(id));
  for (const id of qualified) if (!goalOrder.includes(id)) goalOrder.push(id);
  return { ...updated, goalOrder };
}
