import { useState } from "react";
import { EvidenceDrawer } from "./EvidenceDrawer";

export interface ThemeData {
  id: string;
  label: string;
  score: number;
  color: string;
  delta: number;
}

interface ThemeExposureBarProps {
  theme: ThemeData;
  isActive: boolean;
  onClick: () => void;
}

export function ThemeExposureBar({ theme, isActive, onClick }: ThemeExposureBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scoreLabel =
    theme.score >= 80 ? "High" :
    theme.score >= 60 ? "Moderate" :
    theme.score >= 40 ? "Low" : "Minimal";

  return (
    <>
      <div
        onClick={onClick}
        className="group cursor-pointer py-3 transition-colors"
        style={{ borderBottom: "1px solid #1E2A3A" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-200 font-medium w-44 shrink-0">{theme.label}</span>
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded-sm hidden sm:inline"
              style={{
                background: isActive ? theme.color + "18" : "#2B364840",
                color: isActive ? theme.color : "#64748B",
                border: `1px solid ${isActive ? theme.color + "30" : "#2B364860"}`,
              }}
            >
              {scoreLabel}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {theme.delta > 0 && (
              <span className="text-xs font-mono tabular-nums" style={{ color: "#10B981" }}>
                +{theme.delta} YoY
              </span>
            )}
            <span className="font-mono text-sm font-semibold tabular-nums text-slate-100 w-8 text-right">
              {theme.score}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDrawerOpen(true);
              }}
              className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity tabular-nums px-2 py-1 rounded-sm"
              style={{ color: "#4F8CFF", background: "#4F8CFF14", border: "1px solid #4F8CFF30" }}
            >
              View Evidence
            </button>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#2B3648" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${theme.score}%`,
              background: isActive
                ? `linear-gradient(90deg, ${theme.color}80, ${theme.color})`
                : `${theme.color}60`,
            }}
          />
        </div>
      </div>

      <EvidenceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        theme={theme}
      />
    </>
  );
}
