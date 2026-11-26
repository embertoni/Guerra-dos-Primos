import { useEffect, useState } from 'react';
import { ClockTimer } from './ClockTimer';
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
  const [editing, setEditing] = useState(false);
  const seconds = Number(duration);
  const valid = Number.isInteger(seconds) && seconds >= 1 && seconds <= 3600;
  const running = deadline !== null;
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
  const paused = !running && remaining > 0 && remaining < seconds;
  const toggleLabel = running
    ? 'Pausar timer'
    : paused
      ? 'Retomar timer'
      : 'Iniciar timer';

  function pause() {
    if (deadline !== null) setRemaining(secondsLeft(deadline));
    setDeadline(null);
  }
  function toggle() {
    if (running) return pause();
    const left = paused ? remaining : seconds;
    setRemaining(left);
    setDeadline(Date.now() + left * 1000);
  }
  function restore() {
    setDeadline(null);
    setRemaining(valid ? seconds : 0);
  }
  function startEditing() {
    pause();
    setEditing(true);
  }
  function finishEditing() {
    if (valid) setEditing(false);
  }
  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;

  return (
    <section
      className="turn-timer clock-overlay"
      aria-label="Timer do território"
    >
      <div className="clock-face">
        <ClockTimer
          remaining={remaining}
          total={valid ? seconds : Math.max(remaining, 1)}
          running={running}
        />
      </div>
      <output role="timer" aria-label="Tempo restante" className="sr-only">
        {mmss}
      </output>
      <p className="sr-only">
        {playerName} · território {territoryNumber}
      </p>
      {editing ? (
        <div className="clock-edit">
          <label className="sr-only" htmlFor="clock-seconds-input">
            Tempo em segundos
          </label>
          <input
            id="clock-seconds-input"
            type="number"
            min={1}
            max={3600}
            step={1}
            autoFocus
            placeholder="60"
            value={duration}
            aria-invalid={!valid}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              onDurationChange(event.target.value);
              const next = Number(event.target.value);
              setRemaining(Number.isInteger(next) && next > 0 ? next : 0);
            }}
            onBlur={finishEditing}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape')
                finishEditing();
            }}
          />
          <span aria-hidden="true">s</span>
        </div>
      ) : (
        <button
          type="button"
          className="clock-time"
          aria-label="Editar tempo (segundos)"
          title="Clique para alterar o tempo"
          onClick={startEditing}
        >
          {remaining}s
        </button>
      )}
      <div className="clock-actions">
        <button
          type="button"
          className="clock-action"
          aria-label="Restaurar tempo"
          title="Recomeçar"
          onClick={restore}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 12a8 8 0 1 0 2.5-5.8" />
            <path d="M4 4v5h5" />
          </svg>
        </button>
        <button
          type="button"
          className="clock-action"
          aria-label={toggleLabel}
          title={toggleLabel}
          disabled={!valid}
          onClick={toggle}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            {running ? (
              <path d="M6.5 4h4v16h-4zM13.5 4h4v16h-4z" />
            ) : (
              <path d="M7 4v16l13-8z" />
            )}
          </svg>
        </button>
      </div>
      {remaining === 0 && valid && (
        <p role="status" className="time-up">
          Tempo esgotado!
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