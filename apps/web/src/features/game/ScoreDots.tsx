import type { CSSProperties } from 'react';
import { WINNING_SCORE } from '@primos/shared/game';

const ROWS = 3;

/** Uma bolinha por ponto; cada coluna enche de baixo para o topo. */
export function ScoreDots({ score }: { score: number }) {
  const filled = Math.min(Math.max(0, score), WINNING_SCORE);
  const columns = Math.ceil(WINNING_SCORE / ROWS);
  const dotStyle = (i: number): CSSProperties => ({
    gridColumn: Math.floor(i / ROWS) + 1,
    gridRow: ROWS - (i % ROWS),
  });
  return (
    <div
      className="score-dots"
      aria-hidden="true"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: WINNING_SCORE }, (_, i) => (
        <span
          key={i}
          className={`score-dot${i < filled ? ' is-on' : ''}`}
          style={dotStyle(i)}
        />
      ))}
    </div>
  );
}