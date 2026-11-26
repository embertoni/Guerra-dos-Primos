import { useState } from 'react';
import { type Player } from '@primos/shared';
import { type ChipValue, type TerritoryChip } from '@primos/shared/game';
export function ChipEditor({
  players,
  activePlayerId,
  currentChip,
  onSave,
}: {
  players: readonly Player[];
  activePlayerId: string;
  currentChip?: TerritoryChip;
  onSave: (chip: TerritoryChip | null) => void;
}) {
  const [ownerId, setOwnerId] = useState(activePlayerId);
  const [points, setPoints] = useState<ChipValue>(currentChip?.points ?? 1);
  const [pending, setPending] = useState<{ chip: TerritoryChip | null } | null>(
    null,
  );
  function save(chip: TerritoryChip | null) {
    if (currentChip) {
      setPending({ chip });
    } else onSave(chip);
  }
  return (
    <section className="chip-editor" aria-label="Registro manual de ficha">
      <h3>Registrar resultado</h3>
      <p>Valide a resposta fora do site e escolha a ficha.</p>
      <label>
        Jogador da ficha
        <select
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.displayName} · J{player.seatIndex + 1}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="chip-options">
        <legend>Valor da ficha</legend>
        {([1, 2, 3] as const).map((value) => (
          <label key={value}>
            <input
              type="radio"
              aria-label={`${value} ${value === 1 ? 'ponto' : 'pontos'}`}
              name="chip-value"
              value={value}
              checked={points === value}
              onChange={() => setPoints(value)}
            />
            <span className="red-chip">{value}</span>
            <span>
              {value} {value === 1 ? 'ponto' : 'pontos'}
            </span>
          </label>
        ))}
      </fieldset>
      <button className="primary" onClick={() => save({ ownerId, points })}>
        Registrar ficha
      </button>
      {currentChip && (
        <button className="text-button" onClick={() => save(null)}>
          Retirar ficha e domínio
        </button>
      )}
      {pending && (
        <div
          className="confirmation"
          role="alertdialog"
          aria-label="Confirmar alteração de ficha"
        >
          <p>
            {pending.chip
              ? 'Substituir a ficha e atualizar o proprietário deste território?'
              : 'Retirar a ficha e deixar este território neutro?'}
          </p>
          <p>O placar será recalculado.</p>
          <div className="button-row">
            <button
              onClick={() => {
                onSave(pending.chip);
                setPending(null);
              }}
            >
              Confirmar alteração
            </button>
            <button onClick={() => setPending(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  );
}
