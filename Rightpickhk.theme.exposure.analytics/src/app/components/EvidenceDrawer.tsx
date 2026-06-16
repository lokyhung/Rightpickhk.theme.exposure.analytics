import { X, FileText } from "lucide-react";
import { ThemeData } from "./ThemeExposureBar";

interface EvidenceItem {
  source: string;
  excerpt: string;
  impact: number;
  date: string;
  type: string;
}

const evidenceByTheme: Record<string, EvidenceItem[]> = {
  ai: [
    { source: "Annual Report 2025 — Tencent Holdings", excerpt: "The Group increased investment in foundation model development, allocating HK$15B toward proprietary large language model capabilities, representing a 2.3x increase over the prior fiscal year.", impact: 25, date: "31 Mar 2025", type: "Annual Report" },
    { source: "Earnings Call Q1 2025", excerpt: "Management guided that AI infrastructure capital expenditure will constitute approximately 30% of total capex in FY2025, up from 18% in FY2024, with focus on inference infrastructure.", impact: 20, date: "15 May 2025", type: "Earnings Disclosure" },
    { source: "Talent Analytics — LinkedIn / Zhipin Data", excerpt: "AI and machine learning engineering headcount increased by 1,200 roles year-on-year; AI/ML competencies now listed in 38% of all engineering job specifications.", impact: 18, date: "Q1 2025", type: "Recruitment Signal" },
    { source: "Patent Database — CNIPA / USPTO", excerpt: "47 patent filings related to foundation model architecture, AI safety mechanisms, and multimodal recommendation systems recorded in Q1 2025.", impact: 12, date: "Q1 2025", type: "Patent Filing" },
    { source: "Corporate Website — Product Announcements", excerpt: "Hunyuan large language model commercially launched across WeChat Search, Tencent Meeting, and enterprise cloud products.", impact: 10, date: "Feb 2025", type: "Product Disclosure" },
  ],
  gaming: [
    { source: "Annual Report 2025 — Tencent Holdings", excerpt: "Domestic and international games segment revenues grew 22% year-on-year, driven by Honor of Kings international expansion and three new IP launches generating combined gross bookings of HK$8.2B.", impact: 30, date: "31 Mar 2025", type: "Annual Report" },
    { source: "Bloomberg Intelligence Research", excerpt: "Tencent holds equity stakes in 13 of the top 30 global game studios by revenue, maintaining unrivalled portfolio breadth in interactive entertainment.", impact: 25, date: "Feb 2025", type: "Third-Party Research" },
    { source: "Earnings Call Q1 2025", excerpt: "Mobile gaming daily active users increased 18% year-on-year; management expects continued growth driven by AI-enhanced content generation and personalisation.", impact: 20, date: "15 May 2025", type: "Earnings Disclosure" },
    { source: "App Store Market Data — Sensor Tower", excerpt: "WeChat Games mini-program platform surpassed 500 million monthly active users for the first time in recorded history.", impact: 15, date: "Q1 2025", type: "Market Data" },
  ],
  cloud: [
    { source: "Annual Report 2025 — Tencent Holdings", excerpt: "Tencent Cloud revenue reached HK$48 billion, a 31% increase year-on-year. Enterprise segment now represents 62% of total cloud revenue, reflecting sustained enterprise adoption.", impact: 22, date: "31 Mar 2025", type: "Annual Report" },
    { source: "IDC Asia Pacific Cloud Tracker 2025", excerpt: "Tencent Cloud ranked third in APAC public cloud market share at 11.2%, improving from 9.4% in the prior period.", impact: 18, date: "Feb 2025", type: "Third-Party Research" },
    { source: "Corporate Press Release", excerpt: "Tencent Cloud announced Southeast Asia data centre expansion with new facilities in Malaysia and Singapore, targeting regulated financial services clients.", impact: 15, date: "Mar 2025", type: "Corporate Disclosure" },
    { source: "Earnings Call Q1 2025", excerpt: "Cloud segment gross margin improved to 24%, with management targeting 28% by year-end through workload optimisation and reduced infrastructure costs.", impact: 20, date: "15 May 2025", type: "Earnings Disclosure" },
  ],
  esg: [
    { source: "Tencent ESG Report 2024", excerpt: "Carbon neutrality target formally set for 2030 across all directly controlled operations; Scope 1 and 2 emissions reduced by 12% in calendar year 2024.", impact: 15, date: "Jun 2025", type: "ESG Disclosure" },
    { source: "MSCI ESG Ratings Report", excerpt: "Tencent rated BBB by MSCI ESG research; governance score continues to be constrained by dual-class share structure and board independence concerns.", impact: -8, date: "Apr 2025", type: "Third-Party Research" },
    { source: "Annual Report 2025 — Tencent Holdings", excerpt: "Social responsibility expenditure totalled HK$2.8 billion, including rural education digitalisation and inclusive finance initiatives.", impact: 10, date: "31 Mar 2025", type: "Annual Report" },
    { source: "CDP Climate Change Disclosure", excerpt: "Scope 3 supply chain emissions disclosure rated C; full value chain emissions reporting not yet mandated under current governance framework.", impact: -5, date: "Jan 2025", type: "Regulatory Filing" },
  ],
};

const typeColors: Record<string, string> = {
  "Annual Report": "#4F8CFF",
  "Earnings Disclosure": "#22C55E",
  "Recruitment Signal": "#A78BFA",
  "Patent Filing": "#38BDF8",
  "Product Disclosure": "#94A3B8",
  "Third-Party Research": "#F59E0B",
  "ESG Disclosure": "#22C55E",
  "Regulatory Filing": "#EF4444",
  "Market Data": "#38BDF8",
  "Corporate Disclosure": "#94A3B8",
};

interface EvidenceDrawerProps {
  open: boolean;
  onClose: () => void;
  theme: ThemeData;
}

export function EvidenceDrawer({ open, onClose, theme }: EvidenceDrawerProps) {
  if (!open) return null;
  const items = evidenceByTheme[theme.id] ?? [];
  const totalImpact = items.reduce((sum, i) => sum + i.impact, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-lg h-full flex flex-col overflow-hidden"
        style={{ background: "#0F1929", borderLeft: "1px solid #2B3648" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: "1px solid #2B3648" }}>
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
              Supporting Evidence
            </div>
            <h3 className="text-base font-semibold text-slate-100">
              {theme.label} Exposure — Basis of Assessment
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <span className="text-xs text-slate-500 font-mono">Net Score Contribution</span>
                <span
                  className="text-xs font-mono font-semibold ml-2"
                  style={{ color: totalImpact > 0 ? "#10B981" : "#EF4444" }}
                >
                  {totalImpact > 0 ? "+" : ""}{totalImpact} pts
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-mono">Source Validation</span>
                <span className="text-xs font-mono font-semibold text-slate-300 ml-2">92%</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Evidence Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded p-4 space-y-3"
              style={{ background: "#131C2E", border: "1px solid #2B3648" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-sm font-medium"
                    style={{
                      background: (typeColors[item.type] || "#94A3B8") + "18",
                      color: typeColors[item.type] || "#94A3B8",
                      border: `1px solid ${(typeColors[item.type] || "#94A3B8")}30`,
                    }}
                  >
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{item.date}</span>
                </div>
                <span
                  className="font-mono text-xs font-semibold shrink-0 tabular-nums"
                  style={{ color: item.impact > 0 ? "#10B981" : "#EF4444" }}
                >
                  {item.impact > 0 ? "+" : ""}{item.impact}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{item.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FileText size={10} />
                <span>{item.source}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 text-xs text-slate-600 font-mono" style={{ borderTop: "1px solid #2B3648" }}>
          Evidence collected from {items.length} primary and secondary sources. Source validation performed against original documents.
        </div>
      </div>
    </div>
  );
}
