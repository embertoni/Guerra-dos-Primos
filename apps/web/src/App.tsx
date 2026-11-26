import { useState } from 'react';
import { continents, territories, type Player } from '@primos/shared';
import { Board, type PreviewOwners } from './features/board/Board';
const previewPlayers: readonly Player[] = [
  { id: 'preview-a', displayName: 'Ana', color: '#6641c9', seatIndex: 0 },
  { id: 'preview-b', displayName: 'Bruno', color: '#08695b', seatIndex: 1 },
];
export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [owners, setOwners] = useState<PreviewOwners>({});
  const [mode, setMode] = useState<'vector' | 'original' | 'overlay'>('vector');
  const [showNumbers, setShowNumbers] = useState(true);
  const selected = territories.find((t) => t.id === selectedId);
  const continent = continents.find((c) => c.id === selected?.continentId);
  const owner = previewPlayers.find(
    (p) => p.id === (selectedId ? owners[selectedId] : null),
  );
  function setPreviewOwner(ownerId: string | null) {
    if (selectedId)
      setOwners((current) => ({ ...current, [selectedId]: ownerId }));
  }
  return (
    <>
      <header className="header">
        <a className="brand" href="/">
          GUERRA <span>DOS PRIMOS</span>
        </a>
        <div className="phase">
          Fase 1 <span>Revisão do tabuleiro</span>
        </div>
      </header>
      <main className="workspace">
        <section className="map-panel" aria-label="Mapa interativo">
          <Board
            selectedId={selectedId}
            owners={owners}
            players={previewPlayers}
            onSelect={setSelectedId}
            showNumbers={showNumbers}
            mode={mode}
          />
          <section className="map-controls" aria-label="Controles do mapa">
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
          </section>
        </section>
        <aside className="details" aria-label="Detalhes do território">
          <p className="eyebrow">TERRITÓRIO SELECIONADO</p>
          <div aria-live="polite" aria-atomic="true">
            {selected ? (
              <>
                <h2 className="selected-number">{selected.number}</h2>
                <p className="continent-name">{continent?.name}</p>
                <dl>
                  <dt>Proprietário</dt>
                  <dd>
                    {owner
                      ? `${owner.displayName} · J${owner.seatIndex + 1}`
                      : 'Neutro'}
                  </dd>
                  <dt>Identificador</dt>
                  <dd className="identifier">{selected.id}</dd>
                </dl>
              </>
            ) : (
              <div className="empty">
                <span aria-hidden="true">◎</span>
                <h2>Por onde começar?</h2>
                <p>
                  Clique ou toque no mapa. Você também pode escolher na lista
                  abaixo.
                </p>
              </div>
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
          <div className="preview">
            <h3>Teste visual de domínio</h3>
            <p>Estado apenas neste navegador. Recarregar limpa o teste.</p>
            <label>
              Proprietário de teste
              <select
                disabled={!selected}
                value={owner?.id ?? ''}
                onChange={(e) => setPreviewOwner(e.target.value || null)}
              >
                <option value="">Neutro</option>
                {previewPlayers.map((p) => (
                  <option value={p.id} key={p.id}>
                    J{p.seatIndex + 1} · {p.displayName}
                  </option>
                ))}
              </select>
            </label>
            <div className="players">
              {previewPlayers.map((p) => (
                <span key={p.id}>
                  <i style={{ background: p.color }} />J{p.seatIndex + 1} ·{' '}
                  {p.displayName}
                </span>
              ))}
            </div>
            <button className="reset" onClick={() => setOwners({})}>
              Limpar domínios de teste
            </button>
          </div>
        </aside>
      </main>
    </>
  );
}
