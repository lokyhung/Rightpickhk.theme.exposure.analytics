import { useState } from "react";
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export interface AssignmentData {
  primaryTheme: string;
  secondaryThemes: string[];
  hsicsSubsector: string;
  hsicsSector: string;
  evidenceCoverage: number;
  assignmentConfidence: "High" | "Moderate" | "Low";
  rationale: { label: string; detail: string }[];
  status: "Pending Review" | "Analyst Reviewed" | "Final";
  reviewedBy?: string;
  reviewDate?: string;
  overrideAvailable: boolean;
}

const confidenceConfig = {
  High: { color: "#10B981", bg: "#10B98115", border: "#10B98130", bar: 92 },
  Moderate: { color: "#F59E0B", bg: "#F59E0B15", border: "#F59E0B30", bar: 65 },
  Low: { color: "#EF4444", bg: "#EF444415", border: "#EF444430", bar: 38 },
};

const statusConfig = {
  "Pending Review": { color: "#F59E0B", label: "Pending Analyst Review" },
  "Analyst Reviewed": { color: "#4F8CFF", label: "Analyst Reviewed" },
  "Final": { color: "#10B981", label: "Final Classification" },
};

interface Props {
  data: AssignmentData;
  companyName: string;
}

export function ThemeAssignment({ data, companyName }: Props) {
  const [rationaleOpen, setRationaleOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [overrideMode, setOverrideMode] = useState(false);
  const [overrideTheme, setOverrideTheme] = useState(data.primaryTheme);
  const [overrideNote, setOverrideNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const conf = confidenceConfig[data.assignmentConfidence];
  const stat = statusConfig[data.status];

  const workflowSteps = [
    {
      step: 1,
      label: "Multi-Source Data Collection",
      detail: "Annual reports, earnings calls, news, patents, recruitment data",
      done: true,
    },
    {
      step: 2,
      label: "Quantitative Scoring",
      detail: "Signal aggregation across 5 evidence categories",
      done: true,
    },
    {
      step: 3,
      label: "Theme Classification",
      detail: "Recommended assignment generated from scoring model",
      done: true,
    },
    {
      step: 4,
      label: "Analyst Review",
      detail: data.status === "Pending Review" ? "Awaiting analyst sign-off" : `Reviewed by ${data.reviewedBy ?? "Analyst"} on ${data.reviewDate ?? "—"}`,
      done: data.status !== "Pending Review",
      active: data.status === "Pending Review",
    },
    {
      step: 5,
      label: "Final Classification",
      detail: "Published to HSIL Theme Index methodology",
      done: data.status === "Final",
    },
  ];

  return (
    <div className="rounded overflow-hidden" style={{ border: "1px solid #2B3648" }}>
      {/* Module Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "#0F1929", borderBottom: "1px solid #2B3648" }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Theme Assignment
          </h2>
          <span className="text-xs font-mono text-slate-600">·</span>
          <span className="text-xs font-mono text-slate-500">{companyName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-mono px-2.5 py-1 rounded-sm font-medium"
            style={{ background: stat.color + "15", color: stat.color, border: `1px solid ${stat.color}30` }}
          >
            {stat.label}
          </span>
          {data.overrideAvailable && !submitted && (
            <button
              onClick={() => setOverrideMode(!overrideMode)}
              className="text-xs font-mono px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1.5"
              style={{ background: "#2B364850", color: "#94A3B8", border: "1px solid #2B3648" }}
            >
              <RotateCcw size={10} />
              Analyst Override
            </button>
          )}
        </div>
      </div>

      <div style={{ background: "#131C2E" }}>
        {/* Main Assignment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0" style={{ borderBottom: "1px solid #1E2A3A" }}>

          {/* Primary Theme */}
          <div className="p-5" style={{ borderRight: "1px solid #1E2A3A" }}>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
              Recommended Primary Theme
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-sm mb-3"
              style={{ background: "#4F8CFF12", border: "1px solid #4F8CFF35" }}
            >
              <div className="w-2 h-2 rounded-full bg-[#4F8CFF]" />
              <span className="text-base font-semibold text-[#4F8CFF]">{data.primaryTheme}</span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Secondary Classifications:
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              {data.secondaryThemes.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#2B3648" }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* HSICS Classification */}
          <div className="p-5" style={{ borderRight: "1px solid #1E2A3A" }}>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
              HSICS Classification
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-sm mb-3"
              style={{ background: "#A78BFA12", border: "1px solid #A78BFA35" }}
            >
              <div className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              <span className="text-base font-semibold text-[#A78BFA]">{data.hsicsSubsector}</span>
            </div>
            <div className="text-xs font-mono text-slate-500 mb-1">Parent Sector:</div>
            <div className="text-sm text-slate-400">{data.hsicsSector}</div>
            <div className="mt-3 text-xs font-mono text-slate-600 leading-relaxed">
              HSICS (Hang Seng Industry Classification Standard) subsector assignment based on primary revenue exposure and business model analysis.
            </div>
          </div>

          {/* Assignment Confidence */}
          <div className="p-5">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
              Assignment Confidence
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xl font-mono font-bold"
                style={{ color: conf.color }}
              >
                {data.assignmentConfidence}
              </span>
              {data.assignmentConfidence === "High"
                ? <CheckCircle size={16} style={{ color: conf.color }} />
                : <AlertCircle size={16} style={{ color: conf.color }} />}
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
                  <span>Evidence Coverage</span>
                  <span className="tabular-nums text-slate-300">{data.evidenceCoverage}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#2B3648" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${data.evidenceCoverage}%`, background: conf.color }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
                  <span>Source Validation Score</span>
                  <span className="tabular-nums text-slate-300">{conf.bar}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#2B3648" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${conf.bar}%`, background: "#4F8CFF" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="mt-4 p-2.5 rounded-sm text-xs font-mono text-slate-500 leading-relaxed"
              style={{ background: "#0B1220", border: "1px solid #1E2A3A" }}
            >
              Classification strength based on signal density across primary and secondary evidence sources.
            </div>
          </div>
        </div>

        {/* Assignment Rationale — collapsible */}
        <div style={{ borderBottom: "1px solid #1E2A3A" }}>
          <button
            onClick={() => setRationaleOpen(!rationaleOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Assignment Rationale
              </span>
              <span className="text-xs font-mono text-slate-600">
                Why {data.primaryTheme} was assigned as primary
              </span>
            </div>
            {rationaleOpen
              ? <ChevronUp size={13} className="text-slate-500" />
              : <ChevronDown size={13} className="text-slate-500" />}
          </button>

          {rationaleOpen && (
            <div className="px-5 pb-5">
              <div
                className="rounded-sm p-4"
                style={{ background: "#0B1220", border: "1px solid #1E2A3A" }}
              >
                <div className="text-xs font-mono text-slate-500 mb-3">
                  Assigned to <span className="text-slate-300">{data.primaryTheme}</span> because:
                </div>
                <div className="space-y-0">
                  {data.rationale.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 py-2.5"
                      style={{ borderBottom: i < data.rationale.length - 1 ? "1px solid #1E2A3A" : "none" }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: "#4F8CFF" }}
                      />
                      <div className="flex-1">
                        <span className="text-sm text-slate-300">{item.detail}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 shrink-0 ml-4 mt-0.5">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analyst Review Workflow — collapsible */}
        <div style={{ borderBottom: overrideMode ? "1px solid #1E2A3A" : "none" }}>
          <button
            onClick={() => setWorkflowOpen(!workflowOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Review Workflow
              </span>
              <span className="text-xs font-mono text-slate-600">
                Multi-source scoring → Analyst review → Final classification
              </span>
            </div>
            {workflowOpen
              ? <ChevronUp size={13} className="text-slate-500" />
              : <ChevronDown size={13} className="text-slate-500" />}
          </button>

          {workflowOpen && (
            <div className="px-5 pb-5">
              <div className="relative">
                {/* Vertical connector */}
                <div
                  className="absolute left-[18px] top-4 bottom-4 w-px"
                  style={{ background: "#2B3648" }}
                />
                <div className="space-y-0">
                  {workflowSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 py-3 relative">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 font-mono text-xs font-semibold"
                        style={{
                          background: step.done
                            ? "#10B98120"
                            : step.active
                            ? "#4F8CFF20"
                            : "#2B364840",
                          border: `1px solid ${step.done ? "#10B98140" : step.active ? "#4F8CFF40" : "#2B3648"}`,
                          color: step.done ? "#10B981" : step.active ? "#4F8CFF" : "#64748B",
                        }}
                      >
                        {step.done ? "✓" : step.step}
                      </div>
                      <div className="pt-1.5">
                        <div
                          className="text-sm font-medium mb-0.5"
                          style={{
                            color: step.done ? "#D1D5DB" : step.active ? "#4F8CFF" : "#64748B",
                          }}
                        >
                          {step.label}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">{step.detail}</div>
                        {step.active && (
                          <div
                            className="mt-2 text-xs font-mono px-2.5 py-1 rounded-sm inline-block"
                            style={{ background: "#F59E0B15", color: "#F59E0B", border: "1px solid #F59E0B30" }}
                          >
                            Manual Review Required
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analyst Override Panel */}
        {overrideMode && !submitted && (
          <div className="px-5 py-4" style={{ background: "#0F1929", borderTop: "1px solid #1E2A3A" }}>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
              Analyst Override
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-mono text-slate-500 block mb-1.5">Override Theme Assignment</label>
                <select
                  value={overrideTheme}
                  onChange={(e) => setOverrideTheme(e.target.value)}
                  className="w-full text-sm text-slate-300 px-3 py-2 rounded-sm outline-none"
                  style={{ background: "#131C2E", border: "1px solid #2B3648" }}
                >
                  {["Artificial Intelligence", "Cloud Computing", "Interactive Entertainment", "ESG & Sustainability", "Fintech", "Semiconductors"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-500 block mb-1.5">Rationale Note</label>
                <input
                  type="text"
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  placeholder="Briefly state reason for override..."
                  className="w-full text-sm text-slate-300 px-3 py-2 rounded-sm outline-none placeholder:text-slate-600"
                  style={{ background: "#131C2E", border: "1px solid #2B3648" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setSubmitted(true); setOverrideMode(false); }}
                className="text-xs font-mono px-4 py-2 rounded-sm font-medium transition-colors"
                style={{ background: "#4F8CFF", color: "#0B1220" }}
              >
                Submit Override
              </button>
              <button
                onClick={() => setOverrideMode(false)}
                className="text-xs font-mono px-4 py-2 rounded-sm transition-colors"
                style={{ color: "#64748B", border: "1px solid #2B3648" }}
              >
                Cancel
              </button>
              <span className="text-xs font-mono text-slate-600 ml-auto">
                Override will be logged against your analyst ID
              </span>
            </div>
          </div>
        )}

        {submitted && (
          <div
            className="px-5 py-3 flex items-center gap-3 text-xs font-mono"
            style={{ background: "#10B98110", borderTop: "1px solid #10B98125" }}
          >
            <CheckCircle size={13} style={{ color: "#10B981" }} />
            <span style={{ color: "#10B981" }}>Override submitted.</span>
            <span className="text-slate-500">
              New assignment: <span className="text-slate-300">{overrideTheme}</span>. Pending final review.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
