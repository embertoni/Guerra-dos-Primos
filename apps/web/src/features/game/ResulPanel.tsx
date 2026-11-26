import { type Player } from '@primos/shared';

/** Sidebar do jogo concluído, enquanto a pessoa observa o mapa final. */
export function ResultPanel({
  winner,
  canUndo,
  onUndo,
  onReset,
}: {
  winner: Player;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
}) {
  return (
    <section className="result-panel" aria-label="Partida concluída">
      <i
        className="result-color"
        style={{ background: winner.color }}
        aria-hidden="true"
      />
      <h2>{winner.displayName} venceu!</h2>
      <p>Partida concluída. Explore o mapa final ou escolha uma opção.</p>
      <button className="primary" disabled={!canUndo} onClick={onUndo}>
        Voltar último movimento
      </button>
      <button onClick={onReset}>Resetar jogo</button>
    </section>
  );
}