import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { type Player } from '@primos/shared';
import { playerRosterSchema } from '@primos/shared/game';
const colors = [
  '#6641c9',
  '#08695b',
  '#d45b16',
  '#246fc3',
  '#ba2471',
  '#675b15',
];
export function PlayerSetup({
  initialPlayers,
  onStart,
}: {
  initialPlayers?: readonly Player[];
  onStart: (players: Player[]) => void;
}) {
  const [players, setPlayers] = useState<Player[]>(
    () =>
      initialPlayers?.map((p) => ({ ...p })) ??
      [0, 1].map((index) => ({
        id: `player-${index + 1}`,
        displayName: '',
        color: colors[index]!,
        seatIndex: index,
      })),
  );
  const [error, setError] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const rowsRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; pointerId: number } | null>(null);
  const nextId = useRef(1);
  const keyboardFocus = useRef<string | null>(null);
  useEffect(() => {
    if (!keyboardFocus.current) return;
    const row = [
      ...rowsRef.current!.querySelectorAll<HTMLElement>('[data-player-id]'),
    ].find((row) => row.dataset.playerId === keyboardFocus.current);
    row?.querySelector<HTMLButtonElement>('.reorder-handle')?.focus();
    keyboardFocus.current = null;
  }, [players]);
  function update(id: string, patch: Partial<Player>) {
    setPlayers((current) =>
      current.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
    setError('');
  }
  function reorder(id: string, targetIndex: number) {
    setPlayers((current) => {
      const from = current.findIndex((p) => p.id === id);
      if (
        from < 0 ||
        from === targetIndex ||
        targetIndex < 0 ||
        targetIndex >= current.length
      )
        return current;
      const updated = [...current];
      const [player] = updated.splice(from, 1);
      updated.splice(targetIndex, 0, player!);
      return updated;
    });
  }
  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
    setDraggedId(null);
    setAnnouncement('Ordem dos jogadores atualizada.');
  }
  return (
    <form
      className="player-setup"
      aria-label="Preparar partida"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = playerRosterSchema.safeParse(players);
        if (!parsed.success) {
          setError(
            'Informe nomes de 1 a 40 caracteres e uma cor diferente para cada jogador.',
          );
          return;
        }
        onStart(parsed.data);
      }}
    >
      <div className="setup-body">
        <h2>Preparar partida</h2>
        <p>
          De 2 a 6 jogadores. Arraste a alça para definir a ordem das vezes.
        </p>
        <p className="sr-only" id="reorder-help">
          Na alça, arraste ou use as setas para cima e para baixo para mudar a
          ordem.
        </p>
        <div
          ref={rowsRef}
          className="player-rows"
          onPointerMove={(event) => {
            if (!drag.current || drag.current.pointerId !== event.pointerId)
              return;
            const rows = [
              ...event.currentTarget.querySelectorAll<HTMLElement>(
                '[data-player-id]',
              ),
            ];
            let target = 0,
              distance = Infinity;
            rows.forEach((row, index) => {
              const bounds = row.getBoundingClientRect();
              const delta = Math.abs(
                event.clientY - (bounds.top + bounds.height / 2),
              );
              if (delta < distance) {
                distance = delta;
                target = index;
              }
            });
            reorder(drag.current.id, target);
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {players.map((player, index) => (
            <div
              className={`player-input${draggedId === player.id ? ' reordering' : ''}`}
              data-player-id={player.id}
              key={player.id}
            >
              <button
                className="reorder-handle"
                type="button"
                aria-label={`Reordenar jogador ${index + 1}`}
                aria-describedby="reorder-help"
                title="Arraste para mudar a ordem"
                onPointerDown={(event) => {
                  if (event.button !== 0 || !event.isPrimary) return;
                  event.preventDefault();
                  drag.current = { id: player.id, pointerId: event.pointerId };
                  setDraggedId(player.id);
                  rowsRef.current?.setPointerCapture(event.pointerId);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    const target = index + (event.key === 'ArrowUp' ? -1 : 1);
                    if (target < 0 || target >= players.length) return;
                    keyboardFocus.current = player.id;
                    reorder(player.id, target);
                    setAnnouncement('Ordem dos jogadores atualizada.');
                  }
                }}
              >
                <svg viewBox="0 0 12 20" aria-hidden="true">
                  {[4, 10, 16].flatMap((y) =>
                    [3, 9].map((x) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />
                    )),
                  )}
                </svg>
              </button>
              <label className="sr-only" htmlFor={`name-${player.id}`}>
                Nome do jogador {index + 1}
              </label>
              <input
                id={`name-${player.id}`}
                required
                maxLength={40}
                placeholder={`Jogador ${index + 1}`}
                value={player.displayName}
                onChange={(event) =>
                  update(player.id, { displayName: event.target.value })
                }
              />
              <label className="sr-only" htmlFor={`color-${player.id}`}>
                Cor do jogador {index + 1}
              </label>
              <input
                id={`color-${player.id}`}
                type="color"
                value={player.color}
                onChange={(event) =>
                  update(player.id, { color: event.target.value })
                }
              />
              <button
                className="remove-player"
                type="button"
                aria-label={`Excluir jogador ${index + 1}`}
                title={`Excluir ${player.displayName || `jogador ${index + 1}`}`}
                disabled={players.length <= 2}
                onClick={() => {
                  setPlayers((current) =>
                    current.filter((p) => p.id !== player.id),
                  );
                  setError('');
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          className="add-player"
          type="button"
          disabled={players.length >= 6}
          onClick={() =>
            setPlayers((current) => {
              while (current.some((p) => p.id === `player-${nextId.current}`))
                nextId.current++;
              return [
                ...current,
                {
                  id: `player-${nextId.current++}`,
                  displayName: '',
                  color: colors.find(
                    (color) =>
                      !current.some((p) => p.color.toLowerCase() === color),
                  )!,
                  seatIndex: current.length,
                },
              ];
            })
          }
        >
          Adicionar jogador
        </button>
        <p className="sr-only" role="status">
          {announcement}
        </p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </div>
      <div className="setup-footer">
        <button className="primary" type="submit">
          Iniciar partida
        </button>
      </div>
    </form>
  );
}
