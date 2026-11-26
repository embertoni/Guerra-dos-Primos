import {
  board,
  continents,
  territories,
  geometry,
  type Player,
} from '@primos/shared';
import { useMapNavigation } from './useMapNavigation';
export type PreviewOwners = Readonly<Record<string, string | null>>;
interface Props {
  selectedId: string | null;
  owners: PreviewOwners;
  players: readonly Player[];
  onSelect: (id: string) => void;
  showNumbers: boolean;
  mode: 'vector' | 'original' | 'overlay';
}
export function Board({
  selectedId,
  owners,
  players,
  onSelect,
  showNumbers,
  mode,
}: Props) {
  const navigation = useMapNavigation();
  return (
    <div className={`board-viewport${navigation.dragging ? ' dragging' : ''}`}>
      <svg
        ref={navigation.svgRef}
        {...navigation.handlers}
        className={`board mode-${mode}`}
        viewBox={`0 0 ${board.width} ${board.height}`}
        tabIndex={0}
        role="group"
        aria-label="Tabuleiro com 42 territórios"
        aria-description="Arraste para mover, use a roda do mouse para ampliar. No teclado: setas, mais, menos e zero para recentralizar."
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
          {territories.map((territory) => {
            const owner = players.find((p) => p.id === owners[territory.id]);
            const continent = continents.find(
              (c) => c.id === territory.continentId,
            )!;
            const selected = territory.id === selectedId;
            const label = `Território ${territory.number}, ${continent.name}, ${owner ? `domínio de ${owner.displayName}` : 'neutro'}`;
            return (
              <g
                key={territory.id}
                id={`territory-${territory.id}`}
                className={`territory${selected ? ' selected' : ''}${owner ? ' occupied' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-pressed={selected}
                data-territory-id={territory.id}
                onClick={() => onSelect(territory.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(territory.id);
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
                {showNumbers && (
                  <text
                    className="territory-number"
                    x={territory.labelPosition.x}
                    y={territory.labelPosition.y}
                  >
                    {territory.number}
                  </text>
                )}
                {owner && (
                  <g className="owner-label">
                    <rect
                      x={territory.labelPosition.x - 20}
                      y={territory.labelPosition.y + 18}
                      width="40"
                      height="24"
                      rx="7"
                    />
                    <text
                      x={territory.labelPosition.x}
                      y={territory.labelPosition.y + 31}
                    >
                      J{owner.seatIndex + 1}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
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
