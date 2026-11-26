import { useEffect, useRef, useState } from 'react';
import {
  getStandings,
  WINNING_SCORE,
  type ManualGame,
} from '@primos/shared/game';

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
        <span>Rodada {game.round}</span>
        <h2>{active.displayName}</h2>
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
        Próximo
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
            data-player-id={player.id}
            aria-label={`${player.displayName}: ${player.score} ${player.score === 1 ? 'ponto' : 'pontos'}`}
          >
            <i className="player-swatch" style={{ background: player.color }} />
            <span>
              {player.displayName}
              {player.id === active.id && <small>Na vez</small>}
            </span>
            <strong>{player.score}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function MatchOptions({ onNew }: { onNew: () => void }) {
  const [confirmNew, setConfirmNew] = useState(false);
  return (
    <details className="match-options">
      <summary>Opções da partida</summary>
      <p>O usuário controla as vezes, as fichas e a validação das respostas.</p>
      <button onClick={() => setConfirmNew(true)}>Nova partida</button>
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
    </details>
  );
}
