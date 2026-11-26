import {
  board,
  continents,
  territories,
  geometry,
  type Player,
} from '@primos/shared';
import { useMapNavigation } from './useMapNavigation';
import { getLabelLayout } from './labelLayout';
import { type TerritoryChips } from '@primos/shared/game';
export type PreviewOwners = Readonly<Record<string, string | null>>;
interface Props {
  selectedId: string | null;
  owners: PreviewOwners;
  chips?: TerritoryChips;
  players: readonly Player[];
  onSelect: (id: string) => void;
  showNumbers: boolean;
  mode: 'vector' | 'original' | 'overlay';
  interactive: boolean;
}
export function Board({
  selectedId,
  owners,
  chips,
  players,
  onSelect,
  showNumbers,
  mode,
  interactive,
}: Props) {
  const navigation = useMapNavigation();
  function select(id: string) {
    if (interactive) onSelect(id);
  }
  return (
    <div
      className={`board-viewport${navigation.dragging ? ' dragging' : ''}${interactive ? '' : ' board-locked'}`}
    >
      <svg
        ref={navigation.svgRef}
        {...navigation.handlers}
        className={`board mode-${mode}`}
        viewBox={`0 0 ${board.width} ${board.height}`}
        tabIndex={0}
        role="group"
        aria-label="Tabuleiro com 42 territórios"
        aria-description={
          interactive
            ? 'Arraste para mover, use a roda do mouse para ampliar. No teclado: setas, mais, menos e zero para recentralizar.'
            : 'Inicie a partida para selecionar territórios. Você pode arrastar e ampliar o mapa.'
        }
      >
        <title>Guerra dos Primos — mapa para revisão</title>
        <g
          className="map-camera"
          transform={`translate(${navigation.camera.x} ${navigation.camera.y}) scale(${navigation.camera.scale})`}
        >
          <rect width={board.width} height={board.height} fill="#09658e" />
          {mode !== 'vector' && (
            <image
              href="/assets/tabuleiro-original.jpeg"
              width={board.width}
              height={board.height}
            />
          )}
          <g className="territory-layer">
            {territories.map((territory) => {
              const owner = players.find((p) => p.id === owners[territory.id]);
              const continent = continents.find(
                (c) => c.id === territory.continentId,
              )!;
              const selected = territory.id === selectedId;
              const chip = chips?.[territory.id];
              const label = `Território ${territory.number}, ${continent.name}, ${owner ? `domínio de ${owner.displayName}` : 'neutro'}${chip ? `, ficha de ${chip.points} ${chip.points === 1 ? 'ponto' : 'pontos'}` : ''}`;
              return (
                <g
                  key={territory.id}
                  id={`territory-${territory.id}`}
                  className={`territory${selected ? ' selected' : ''}${owner ? ' occupied' : ''}`}
                  role="button"
                  tabIndex={interactive ? 0 : -1}
                  aria-disabled={!interactive}
                  aria-label={label}
                  aria-pressed={selected}
                  data-territory-id={territory.id}
                  onClick={() => select(territory.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      select(territory.id);
                    }
                  }}
                >
                  <title>{label}</title>
                  {geometry[territory.id as keyof typeof geometry].map(
                    (path, index) => (
                      <path
                        key={index}
                        d={path}
                        fill={owner?.color ?? continent.baseColor}
                        className="land"
                      />
                    ),
                  )}
                </g>
              );
            })}
          </g>
          <g className="marker-layer" aria-hidden="true">
            {territories.map((territory) => {
              const owner = players.find((p) => p.id === owners[territory.id]);
              const chip = chips?.[territory.id];
              const label = getLabelLayout(territory);
              return (
                <g key={territory.id} data-markers-for={territory.id}>
                  {owner && (
                    <g className="owner-label">
                      <rect
                        x={label.x - 20}
                        y={label.y + 18}
                        width="40"
                        height="24"
                        rx="7"
                      />
                      <text x={label.x} y={label.y + 31}>
                        J{owner.seatIndex + 1}
                      </text>
                    </g>
                  )}
                  {chip && (
                    <g className="map-chip">
                      <circle cx={label.x + 38} cy={label.y + 30} r="16" />
                      <text x={label.x + 38} y={label.y + 31}>
                        {chip.points}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
          {showNumbers && (
            <g className="number-layer" aria-hidden="true">
              {territories.map((territory) => {
                const label = getLabelLayout(territory);
                return (
                  <text
                    key={territory.id}
                    className="territory-number"
                    data-number-for={territory.id}
                    x={label.x}
                    y={label.y}
                    style={{ fontSize: label.fontSize }}
                    onClick={() => select(territory.id)}
                  >
                    {territory.number}
                  </text>
                );
              })}
            </g>
          )}
        </g>
      </svg>
      <button
        className="recenter"
        onClick={navigation.reset}
        aria-label="Recentralizar mapa"
        title="Recentralizar mapa e restaurar zoom"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      </button>
    </div>
  );
}
