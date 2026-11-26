import { describe, it, expect } from 'vitest';
import { territories, type Player } from '../index';
import {
  createManualGame,
  nextTurn,
  setTerritoryChip,
  getStandings,
  playerRosterSchema,
} from './manualGame';
const players: Player[] = [
  { id: 'a', displayName: 'Ana', color: '#6641c9', seatIndex: 0 },
  { id: 'b', displayName: 'Bruno', color: '#08695b', seatIndex: 1 },
];
describe('controle manual da partida', () => {
  it('valida de 2 a 6 jogadores, nomes e cores distintas', () => {
    expect(() => createManualGame(players.slice(0, 1))).toThrow();
    expect(() =>
      createManualGame([
        ...players,
        ...Array.from({ length: 5 }, (_, i) => ({
          ...players[0]!,
          id: `x${i}`,
          color: `#00000${i}`,
        })),
      ]),
    ).toThrow();
    expect(
      playerRosterSchema.safeParse([
        players[0],
        { ...players[1]!, color: players[0]!.color },
      ]).success,
    ).toBe(false);
    expect(() =>
      createManualGame([{ ...players[0]!, displayName: ' ' }, players[1]!]),
    ).toThrow();
  });
  it('volta ao primeiro jogador e incrementa a rodada sem seguir a ordem do placar', () => {
    let game = createManualGame(players);
    game = setTerritoryChip(game, 'north-01', { ownerId: 'b', points: 3 });
    expect(getStandings(game)[0]!.id).toBe('b');
    expect(game.turnIndex).toBe(0);
    game = nextTurn(game);
    expect(game.turnIndex).toBe(1);
    expect(game.round).toBe(1);
    game = nextTurn(game);
    expect(game.turnIndex).toBe(0);
    expect(game.round).toBe(2);
  });
  it('soma fichas atuais, substitui sem duplicar e retira pontos do dono anterior', () => {
    let game = createManualGame(players);
    game = setTerritoryChip(game, 'north-01', { ownerId: 'a', points: 1 });
    game = setTerritoryChip(game, 'north-02', { ownerId: 'a', points: 3 });
    expect(getStandings(game).find((p) => p.id === 'a')!.score).toBe(4);
    game = setTerritoryChip(game, 'north-01', { ownerId: 'b', points: 2 });
    expect(getStandings(game).map((p) => [p.id, p.score])).toEqual([
      ['a', 3],
      ['b', 2],
    ]);
    game = setTerritoryChip(game, 'north-01', { ownerId: 'b', points: 2 });
    expect(getStandings(game)[1]!.score).toBe(2);
    game = setTerritoryChip(game, 'north-02', null);
    expect(getStandings(game).map((p) => [p.id, p.score])).toEqual([
      ['b', 2],
      ['a', 0],
    ]);
  });
  it('registra quem chegou primeiro a 18 mesmo que outro assuma a liderança', () => {
    let game = createManualGame(players);
    for (const t of territories.slice(0, 6))
      game = setTerritoryChip(game, t.id, { ownerId: 'a', points: 3 });
    expect(game.goalOrder).toEqual(['a']);
    for (const t of territories.slice(6, 13))
      game = setTerritoryChip(game, t.id, { ownerId: 'b', points: 3 });
    expect(getStandings(game)[0]!.id).toBe('b');
    expect(game.goalOrder).toEqual(['a', 'b']);
    game = setTerritoryChip(game, territories[0]!.id, null);
    expect(game.goalOrder).toEqual(['b']);
  });
  it('rejeita território, dono e ficha inválidos sem mutar o estado original', () => {
    const game = createManualGame(players);
    expect(() =>
      setTerritoryChip(game, 'unknown', { ownerId: 'a', points: 1 }),
    ).toThrow();
    expect(() =>
      setTerritoryChip(game, 'north-01', { ownerId: 'unknown', points: 1 }),
    ).toThrow();
    expect(() =>
      setTerritoryChip(game, 'north-01', { ownerId: 'a', points: 0 as 1 }),
    ).toThrow();
    expect(game.chips).toEqual({});
  });
});
