const CX = 60;
const CY = 84;
const R = 38;

function wedge(fraction: number): string | null {
  if (fraction <= 0) return null;
  if (fraction >= 1)
    return `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R} Z`;
  const a = fraction * 2 * Math.PI;
  const x = (CX + R * Math.sin(a)).toFixed(2);
  const y = (CY - R * Math.cos(a)).toFixed(2);
  return `M ${CX} ${CY} L ${CX} ${CY - R} A ${R} ${R} 0 ${fraction > 0.5 ? 1 : 0} 1 ${x} ${y} Z`;
}

/** Cronômetro ilustrado: o amarelo avança no sentido horário conforme o tempo passa. */
export function ClockTimer({
  remaining,
  total,
  running,
}: {
  remaining: number;
  total: number;
  running: boolean;
}) {
  const safeTotal = Math.max(1, total);
  const left = Math.min(Math.max(0, remaining), safeTotal);
  const fraction = 1 - left / safeTotal;
  const path = wedge(fraction);
  return (
    <svg
      viewBox="0 0 120 142"
      className={`clock-svg${running ? ' is-running' : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="60"
        cy="15"
        r="9"
        fill="none"
        stroke="#1f1b4d"
        strokeWidth="3"
      />
      <rect x="51" y="21" width="18" height="12" rx="3" fill="#b9b5e6" />
      <rect
        x="16"
        y="30"
        width="14"
        height="9"
        rx="3"
        fill="#b9b5e6"
        transform="rotate(-38 23 34)"
      />
      <rect
        x="90"
        y="30"
        width="14"
        height="9"
        rx="3"
        fill="#b9b5e6"
        transform="rotate(38 97 34)"
      />
      <circle cx={CX} cy={CY} r="52" fill="#c9c6ee" />
      <circle
        cx={CX}
        cy={CY}
        r="43"
        fill="#fffdf7"
        stroke="#1f1b4d"
        strokeWidth="3"
      />
      {path && <path d={path} fill="#f7b91c" />}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={CX}
          y1={CY - 40}
          x2={CX}
          y2={CY - (i % 3 === 0 ? 33 : 36)}
          stroke="#1f1b4d"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${i * 30} ${CX} ${CY})`}
        />
      ))}
      <g transform={`rotate(${fraction * 360} ${CX} ${CY})`}>
        <polygon
          points={`${CX - 3},${CY} ${CX},${CY - 31} ${CX + 3},${CY} ${CX},${CY + 7}`}
          fill="#e8412a"
        />
      </g>
      <circle
        cx={CX}
        cy={CY}
        r="5"
        fill="#b9b5e6"
        stroke="#1f1b4d"
        strokeWidth="2"
      />
    </svg>
  );
}