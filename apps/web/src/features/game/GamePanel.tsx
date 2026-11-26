import { useEffect, useRef, useState } from 'react';
import {
  getStandings,
  WINNING_SCORE,
  type ManualGame,
} from '@primos/shared/game';
import type { CSSProperties } from 'react';
import { ScoreDots } from './ScoreDots';

export function TurnControls({
  game,
  onNext,
  onSelect,
}: {
  game: ManualGame;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const active = game.players[game.turnIndex]!;
  useEffect(() => {
    const row = rowRef.current;
    const button = row?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (row && button)
      row.scrollLeft = Math.max(
        0,
        button.offsetLeft - (row.clientWidth - button.offsetWidth) / 2,
      );
  }, [game.turnIndex]);
  return (
    <section className="turn-overlay" aria-label="Controle de rodadas">
      <div className="turn-caption">
        <div className="round-badge" aria-hidden="true">
          <span>Rodada</span>
          <b key={game.round}>{game.round}</b>
        </div>
        <div className="turn-who">
          <span className="turn-label" aria-hidden="true">
            Na vez
          </span>
          <h2>{active.displayName}</h2>
        </div>
        <span className="sr-only">
          RODADA {game.round} · VEZ {game.turnIndex + 1}/{game.players.length}
        </span>
      </div>
      <div
        className="turn-seats"
        ref={rowRef}
        role="group"
        aria-label="Escolher vez do jogador"
      >
        {game.players.map((player, index) => (
          <button
            key={player.id}
            className="turn-seat"
            aria-label={`Vez de ${player.displayName}`}
            aria-pressed={game.turnIndex === index}
            title={`J${index + 1} · ${player.displayName}`}
            onClick={() => onSelect(index)}
          >
            <span
              className="turn-circle"
              style={{ background: player.color }}
            />
          </button>
        ))}
      </div>
      <button
        className="next-turn"
        aria-label="Próximo jogador"
        title="Próximo jogador"
        onClick={onNext}
      >
        <span>Próximo</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}

export function Scoreboard({ game }: { game: ManualGame }) {
  const active = game.players[game.turnIndex]!;
  const winner = game.players.find((player) => player.id === game.goalOrder[0]);
  return (
    <section className="scoreboard scoreboard-overlay" aria-label="Placar">
      <div className="section-heading">
        <h3>Placar</h3>
        <span>Meta: {WINNING_SCORE}</span>
      </div>
      {winner && (
        <p className="winner" role="status">
          {winner.displayName} venceu! Primeiro a alcançar {WINNING_SCORE}{' '}
          pontos.
        </p>
      )}
      <ol>
        {getStandings(game).map((player) => (
          <li
            key={player.id}
            className={`score-card${player.id === active.id ? ' is-active' : ''}`}
            style={{ '--player-color': player.color } as CSSProperties}
            data-player-id={player.id}
            aria-label={`${player.displayName}: ${player.score} ${player.score === 1 ? 'ponto' : 'pontos'}`}
          >
            <div className="score-head">
              <span className="score-name">
                {player.displayName}
                {player.id === active.id && (
                  <small className="sr-only">Na vez</small>
                )}
              </span>
              <strong>{player.score}</strong>
            </div>
            <ScoreDots score={player.score} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export function MatchOptions({ onNew }: { onNew: () => void }) {
  const [confirmNew, setConfirmNew] = useState(false);
  return (
    <div className="match-options">
      <button
        type="button"
        className="new-match"
        onClick={() => setConfirmNew(true)}
      >
        Nova partida
      </button>
      {confirmNew && (
        <div
          role="alertdialog"
          aria-label="Confirmar nova partida"
          className="confirmation"
        >
          <p>Limpar fichas, pontos e rodadas para configurar outra partida?</p>
          <div className="button-row">
            <button onClick={onNew}>Confirmar nova partida</button>
            <button onClick={() => setConfirmNew(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}