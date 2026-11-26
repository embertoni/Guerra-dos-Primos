import { useEffect, useState } from 'react';
function secondsLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}
export function TurnTimer({
  territoryNumber,
  playerName,
  duration,
  onDurationChange,
}: {
  territoryNumber: number;
  playerName: string;
  duration: string;
  onDurationChange: (duration: string) => void;
}) {
  const [remaining, setRemaining] = useState(Number(duration));
  const [deadline, setDeadline] = useState<number | null>(null);
  const seconds = Number(duration);
  const valid = Number.isInteger(seconds) && seconds >= 1 && seconds <= 3600;
  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const left = secondsLeft(deadline);
      setRemaining(left);
      if (left === 0) setDeadline(null);
    };
    tick();
    const interval = window.setInterval(tick, 100);
    return () => window.clearInterval(interval);
  }, [deadline]);
  const paused = deadline === null && remaining > 0 && remaining < seconds;
  return (
    <section className="turn-timer" aria-label="Timer do território">
      <div className="section-heading">
        <h3>Tempo de resposta</h3>
        <output role="timer" aria-label="Tempo restante">
          {String(Math.floor(remaining / 60)).padStart(2, '0')}:
          {String(remaining % 60).padStart(2, '0')}
        </output>
      </div>
      <p>
        {playerName} · território {territoryNumber}
      </p>
      <label>
        Tempo em segundos
        <input
          type="number"
          min={1}
          max={3600}
          step={1}
          value={duration}
          disabled={deadline !== null}
          onChange={(event) => {
            onDurationChange(event.target.value);
            setRemaining(
              Number.isInteger(Number(event.target.value)) &&
                Number(event.target.value) > 0
                ? Number(event.target.value)
                : 0,
            );
          }}
        />
      </label>
      <div className="button-row">
        <button
          disabled={!valid}
          onClick={() => {
            if (deadline !== null) {
              setRemaining(secondsLeft(deadline));
              setDeadline(null);
            } else {
              const left = paused ? remaining : seconds;
              setRemaining(left);
              setDeadline(Date.now() + left * 1000);
            }
          }}
        >
          {deadline !== null
            ? 'Pausar timer'
            : paused
              ? 'Retomar timer'
              : 'Iniciar timer'}
        </button>
        <button
          onClick={() => {
            setDeadline(null);
            setRemaining(valid ? seconds : 0);
          }}
        >
          Restaurar tempo
        </button>
      </div>
      {remaining === 0 && valid && (
        <p role="status" className="time-up">
          Tempo esgotado. Valide a resposta e registre o resultado.
        </p>
      )}
      {!valid && (
        <p role="alert" className="form-error">
          Use um tempo inteiro entre 1 e 3600 segundos.
        </p>
      )}
    </section>
  );
}
