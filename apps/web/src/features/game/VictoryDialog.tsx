import { useEffect, useRef, type KeyboardEvent } from 'react';
import { type Player } from '@primos/shared';
import { WINNING_SCORE } from '@primos/shared/game';

export function VictoryDialog({
  winner,
  score,
  canUndo,
  onUndo,
  onReset,
  onViewMap,
}: {
  winner: Player;
  score: number;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onViewMap: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current!;
    // Effects run after the game and standings have committed to the DOM.
    dialog.showModal();
    (canUndo
      ? undoRef.current
      : dialog.querySelector<HTMLButtonElement>('button:not(:disabled)')
    )?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [canUndo]);
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const buttons = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
        'button:not(:disabled)',
      ),
    ];
    const first = buttons[0]!,
      last = buttons.at(-1)!;
    if (!buttons.includes(document.activeElement as HTMLButtonElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  return (
    <dialog
      className="victory-dialog"
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="victory-title"
      aria-describedby="victory-description"
      onCancel={(event) => event.preventDefault()}
      onKeyDown={trapFocus}
      style={{ borderTopColor: winner.color }}
    >
      <div
        className="victory-color"
        style={{ background: winner.color }}
        role="img"
        aria-label={`Cor de ${winner.displayName}`}
      />
      <p className="victory-eyebrow">VITÓRIA</p>
      <h2 id="victory-title">{winner.displayName} venceu!</h2>
      <p id="victory-description">
        {score} pontos · primeiro a alcançar {WINNING_SCORE}.
      </p>
      <div className="victory-actions">
        <button
          ref={undoRef}
          className="undo-victory"
          disabled={!canUndo}
          onClick={onUndo}
        >
          Voltar último movimento
        </button>
        <button
          className="view-victory"
          onClick={() => {
            dialogRef.current?.close();
            onViewMap();
          }}
        >
          Ver mapa
        </button>
        <button className="reset-victory" onClick={onReset}>
          Resetar jogo
        </button>
      </div>
    </dialog>
  );
}