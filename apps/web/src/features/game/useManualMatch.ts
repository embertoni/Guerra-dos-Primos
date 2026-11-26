import { useReducer } from 'react';
import { type Player } from '@primos/shared';
import {
  createManualGame,
  nextTurn,
  selectTurn,
  setTerritoryChip,
  type ManualGame,
  type TerritoryChip,
} from '@primos/shared/game';

interface MatchState {
  game: ManualGame | null;
  previous: ManualGame | null;
}
type Action =
  | { type: 'start'; players: Player[] }
  | { type: 'reset' }
  | { type: 'undo' }
  | { type: 'next' }
  | { type: 'select'; index: number }
  | { type: 'chip'; territoryId: string; chip: TerritoryChip | null };
export function manualMatchReducer(
  state: MatchState,
  action: Action,
): MatchState {
  if (action.type === 'start')
    return { game: createManualGame(action.players), previous: null };
  if (action.type === 'reset') return { game: null, previous: null };
  if (action.type === 'undo')
    return state.previous ? { game: state.previous, previous: null } : state;
  if (!state.game || state.game.goalOrder.length > 0) return state;
  if (action.type === 'next') return { ...state, game: nextTurn(state.game) };
  if (action.type === 'select')
    return { ...state, game: selectTurn(state.game, action.index) };
  return {
    game: setTerritoryChip(state.game, action.territoryId, action.chip),
    previous: state.game,
  };
}
export function useManualMatch() {
  return useReducer(manualMatchReducer, { game: null, previous: null });
}
