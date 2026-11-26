import { useState } from 'react';
import { continents, territories, type Player } from '@primos/shared';
import { getStandings } from '@primos/shared/game';
import { Board } from './features/board/Board';
import { PlayerSetup } from './features/game/PlayerSetup';
import {
  TurnControls,
  Scoreboard,
  MatchOptions,
} from './features/game/GamePanel';
import { TurnTimer } from './features/game/TurnTimer';
import { ChipEditor } from './features/game/ChipEditor';
import { useManualMatch } from './features/game/useManualMatch';
import { VictoryDialog } from './features/game/VictoryDialog';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [{ game, previous }, dispatch] = useManualMatch();
  const [initialPlayers, setInitialPlayers] = useState<Player[] | undefined>();
  const [mode, setMode] = useState<'vector' | 'original' | 'overlay'>('vector');
  const [showNumbers, setShowNumbers] = useState(true);
  const [legendExpanded, setLegendExpanded] = useState(true);
  const [timerDuration, setTimerDuration] = useState('60');
  const selected = territories.find((t) => t.id === selectedId);
  const continent = continents.find((c) => c.id === selected?.continentId);
  const chip = selectedId ? game?.chips[selectedId] : undefined;
  const owner = game?.players.find((p) => p.id === chip?.ownerId);
  const active = game?.players[game.turnIndex];
  const winner = game?.players.find(
    (player) => player.id === game.goalOrder[0],
  );
  function resetMatch() {
    dispatch({ type: 'reset' });
    setSelectedId(null);
  }
  const owners = Object.fromEntries(
    Object.entries(game?.chips ?? {}).map(([id, chip]) => [
      id,
      chip?.ownerId ?? null,
    ]),
  );
  return (
    <>
      <header className="header" inert={!!winner}>
        <a className="brand" href="/">
          GUERRA <span>DOS PRIMOS</span>
        </a>
        <div className="phase">
          Controle manual <span>Partida local</span>
        </div>
      </header>
      <main className="workspace" inert={!!winner}>
        <section className="map-panel" aria-label="Mapa interativo">
          <Board
            selectedId={selectedId}
            owners={owners}
            chips={game?.chips}
            players={game?.players ?? []}
            onSelect={setSelectedId}
            showNumbers={showNumbers}
            mode={mode}
            interactive={game !== null && !winner}
          />
          {game && (
            <TurnControls
              game={game}
              onNext={() => dispatch({ type: 'next' })}
              onSelect={(index) => dispatch({ type: 'select', index })}
            />
          )}
          <div className="map-overlays">
            {game && <Scoreboard game={game} />}
            <section
              className={`map-controls${legendExpanded ? '' : ' is-collapsed'}`}
              aria-label="Controles do mapa"
            >
              <div className="legend-header">
                {legendExpanded && <span>Legenda</span>}
                <button
                  type="button"
                  className="legend-toggle"
                  aria-label={
                    legendExpanded ? 'Recolher legenda' : 'Mostrar legenda'
                  }
                  title={
                    legendExpanded ? 'Recolher legenda' : 'Mostrar legenda'
                  }
                  aria-expanded={legendExpanded}
                  aria-controls="map-legend-content"
                  onClick={() => setLegendExpanded((expanded) => !expanded)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d={legendExpanded ? 'm6 9 6 6 6-6' : 'm6 15 6-6 6 6'}
                    />
                  </svg>
                </button>
              </div>
              <div
                id="map-legend-content"
                className="legend-content"
                hidden={!legendExpanded}
              >
                <ul className="legend" aria-label="Legenda geográfica">
                  {continents.map((c) => (
                    <li key={c.id}>
                      <i style={{ background: c.baseColor }} />
                      {c.name}
                    </li>
                  ))}
                </ul>
                <label>
                  Visualização
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as typeof mode)}
                  >
                    <option value="vector">Mapa vetorizado</option>
                    <option value="original">Imagem original</option>
                    <option value="overlay">Comparar contornos</option>
                  </select>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={showNumbers}
                    onChange={(e) => setShowNumbers(e.target.checked)}
                  />
                  Números
                </label>
              </div>
            </section>
          </div>
        </section>
        <aside
          className={`details${game ? '' : ' setup-mode'}`}
          aria-label="Controle da partida"
        >
          {game ? (
            <MatchOptions onNew={resetMatch} />
          ) : (
            <PlayerSetup
              initialPlayers={initialPlayers}
              onStart={(players) => {
                setInitialPlayers(players);
                dispatch({ type: 'start', players });
              }}
            />
          )}
          {game && (
            <section
              className="territory-details"
              aria-label="Detalhes do território"
            >
              <p className="eyebrow">TERRITÓRIO SELECIONADO</p>
              <div aria-live="polite" aria-atomic="true">
                {selected ? (
                  <>
                    <h2 className="selected-number">{selected.number}</h2>
                    <p className="continent-name">{continent?.name}</p>
                    <p className="ownership">
                      {owner
                        ? `${owner.displayName} · J${owner.seatIndex + 1} · ${chip!.points} ${chip!.points === 1 ? 'ponto' : 'pontos'}`
                        : 'Neutro'}
                    </p>
                  </>
                ) : (
                  <p className="empty">
                    Selecione um território no mapa ou pela lista.
                  </p>
                )}
              </div>
              <label className="territory-picker">
                Escolher território
                <select
                  value={selectedId ?? ''}
                  onChange={(e) => setSelectedId(e.target.value || null)}
                >
                  <option value="">Selecione um número</option>
                  {continents.map((c) => (
                    <optgroup label={c.name} key={c.id}>
                      {territories
                        .filter((t) => t.continentId === c.id)
                        .map((t) => (
                          <option value={t.id} key={t.id}>
                            {t.number} · {c.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            </section>
          )}
          {game && active && selected && !winner && (
            <>
              <TurnTimer
                key={`timer-${active.id}-${selected.id}`}
                territoryNumber={selected.number}
                playerName={active.displayName}
                duration={timerDuration}
                onDurationChange={setTimerDuration}
              />
              <ChipEditor
                key={`chip-${active.id}-${selected.id}`}
                players={game.players}
                activePlayerId={active.id}
                currentChip={chip}
                onSave={(chip) =>
                  dispatch({ type: 'chip', territoryId: selected.id, chip })
                }
              />
            </>
          )}
        </aside>
      </main>
      {game && winner && (
        <VictoryDialog
          key={winner.id}
          winner={winner}
          score={
            getStandings(game).find((player) => player.id === winner.id)!.score
          }
          canUndo={previous !== null}
          onUndo={() => dispatch({ type: 'undo' })}
          onReset={resetMatch}
        />
      )}
    </>
  );
}
