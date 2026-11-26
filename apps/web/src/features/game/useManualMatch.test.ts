import { it, expect } from 'vitest';
import { getStandings } from '@primos/shared/game';
import { manualMatchReducer } from './useManualMatch';
it('restaura a ficha anterior, dono, pontos e vez ao desfazer a vitória e bloqueia novas ações', () => {
  let state = manualMatchReducer(
    { game: null, previous: null },
    {
      type: 'start',
      players: [
        { id: 'a', displayName: 'Ana', color: '#6641c9', seatIndex: 0 },
        { id: 'b', displayName: 'Bruno', color: '#08695b', seatIndex: 1 },
      ],
    },
  );
  state = manualMatchReducer(state, {
    type: 'chip',
    territoryId: 'north-01',
    chip: { ownerId: 'b', points: 1 },
  });
  for (const id of ['north-02', 'north-03', 'north-04', 'north-05', 'north-06'])
    state = manualMatchReducer(state, {
      type: 'chip',
      territoryId: id,
      chip: { ownerId: 'a', points: 3 },
    });
  state = manualMatchReducer(state, { type: 'select', index: 1 });
  const before = state.game;
  state = manualMatchReducer(state, {
    type: 'chip',
    territoryId: 'north-01',
    chip: { ownerId: 'a', points: 3 },
  });
  expect(state.game!.goalOrder).toEqual(['a']);
  expect(getStandings(state.game!)[0]!.score).toBe(18);
  expect(manualMatchReducer(state, { type: 'next' })).toBe(state);
  expect(manualMatchReducer(state, { type: 'select', index: 0 })).toBe(state);
  expect(
    manualMatchReducer(state, {
      type: 'chip',
      territoryId: 'north-02',
      chip: null,
    }),
  ).toBe(state);
  state = manualMatchReducer(state, { type: 'undo' });
  expect(state.game).toBe(before);
  expect(state.game!.chips['north-01']).toEqual({ ownerId: 'b', points: 1 });
  expect(getStandings(state.game!).map((player) => player.score)).toEqual([
    15, 1,
  ]);
  expect(state.game!.turnIndex).toBe(1);
  expect(state.game!.goalOrder).toEqual([]);
  expect(state.previous).toBeNull();
  state = manualMatchReducer(state, { type: 'reset' });
  expect(state).toEqual({ game: null, previous: null });
});
