const data = [
  { quarter: "Q1'23", AI: 35, Gaming: 72, Cloud: 48, ESG: 30 },
  { quarter: "Q2'23", AI: 42, Gaming: 75, Cloud: 52, ESG: 32 },
  { quarter: "Q3'23", AI: 51, Gaming: 78, Cloud: 58, ESG: 35 },
  { quarter: "Q4'23", AI: 58, Gaming: 80, Cloud: 62, ESG: 37 },
  { quarter: "Q1'24", AI: 64, Gaming: 83, Cloud: 66, ESG: 39 },
  { quarter: "Q2'24", AI: 70, Gaming: 86, Cloud: 69, ESG: 41 },
  { quarter: "Q3'24", AI: 76, Gaming: 88, Cloud: 72, ESG: 43 },
  { quarter: "Q4'24", AI: 80, Gaming: 89, Cloud: 73, ESG: 44 },
  { quarter: "Q1'25", AI: 85, Gaming: 90, Cloud: 75, ESG: 45 },
];

export const themeLines = [
  { key: "AI" as const,     color: "#4F8CFF", label: "Artificial Intelligence" },
  { key: "Gaming" as const, color: "#22C55E", label: "Gaming" },
  { key: "Cloud" as const,  color: "#A78BFA", label: "Cloud Computing" },
  { key: "ESG" as const,    color: "#94A3B8", label: "ESG" },
];

const W = 800;
const H = 200;
const PAD = { top: 12, right: 12, bottom: 28, left: 32 };
const MIN_VAL = 20;
const MAX_VAL = 100;

function toX(i: number) {
  return PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
}

function toY(v: number) {
  return PAD.top + (1 - (v - MIN_VAL) / (MAX_VAL - MIN_VAL)) * (H - PAD.top - PAD.bottom);
}

function polyline(key: keyof typeof data[0]) {
  return data.map((d, i) => `${toX(i)},${toY(d[key] as number)}`).join(" ");
}

export function MomentumChart() {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: H, display: "block" }}
        aria-label="Theme exposure trend chart"
      >
        {/* Horizontal grid lines */}
        {[20, 40, 60, 80, 100].map((v) => (
          <g key={`grid-${v}`}>
            <line
              x1={PAD.left} y1={toY(v)}
              x2={W - PAD.right} y2={toY(v)}
              stroke="#2B364850" strokeWidth={1} strokeDasharray="3 5"
            />
            <text
              x={PAD.left - 6} y={toY(v) + 4}
              textAnchor="end" fontSize={9}
              fill="#64748B" fontFamily="DM Mono, monospace"
            >{v}</text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={`xlabel-${i}`}
            x={toX(i)} y={H - 6}
            textAnchor="middle" fontSize={9}
            fill="#64748B" fontFamily="DM Mono, monospace"
          >{d.quarter}</text>
        ))}

        {/* Lines */}
        {themeLines.map((t) => (
          <polyline
            key={`line-${t.key}`}
            points={polyline(t.key)}
            fill="none"
            stroke={t.color}
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Dots at last point */}
        {themeLines.map((t) => {
          const last = data[data.length - 1];
          return (
            <circle
              key={`dot-${t.key}`}
              cx={toX(data.length - 1)}
              cy={toY(last[t.key] as number)}
              r={3}
              fill={t.color}
              stroke="#0B1220"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </div>
  );
}
