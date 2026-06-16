import { useState } from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { ThemeExposureBar } from "./components/ThemeExposureBar";
import { MomentumChart, themeLines } from "./components/MomentumChart";
import { ThemeAssignment } from "./components/ThemeAssignment";

const ASSIGNMENTS: Record<string, {
  primaryTheme: string; secondaryThemes: string[];
  hsicsSubsector: string; hsicsSector: string;
  evidenceCoverage: number; assignmentConfidence: "High" | "Moderate" | "Low";
  status: "Pending Review" | "Analyst Reviewed" | "Final";
  reviewedBy?: string; reviewDate?: string; overrideAvailable: boolean;
  rationale: { label: string; detail: string }[];
}> = {
  Tencent: {
    primaryTheme: "Artificial Intelligence",
    secondaryThemes: ["Cloud Computing", "Interactive Entertainment"],
    hsicsSubsector: "Application Software",
    hsicsSector: "Information Technology",
    evidenceCoverage: 92,
    assignmentConfidence: "High",
    status: "Pending Review",
    overrideAvailable: true,
    rationale: [
      { label: "Filing Analysis", detail: "18% of recent annual report filings and regulatory disclosures reference AI initiatives, strategies, or expenditure" },
      { label: "Patent Activity", detail: "AI-related patent filings increased 42% year-on-year, covering foundation models, recommendation systems and AI safety" },
      { label: "Capital Deployment", detail: "HK$15 billion invested in AI infrastructure in FY2025, representing a 2.3× increase over the prior period" },
      { label: "Talent Acquisition", detail: "3,200 employees hired for AI-specific roles across model development, inference infrastructure and AI product teams" },
      { label: "Revenue Attribution", detail: "AI-linked products and services estimated to contribute approximately 15% of total group revenue in FY2025" },
    ],
  },
  Baidu: {
    primaryTheme: "Artificial Intelligence",
    secondaryThemes: ["Cloud Computing", "Autonomous Vehicles"],
    hsicsSubsector: "Internet Services & Infrastructure",
    hsicsSector: "Communication Services",
    evidenceCoverage: 97,
    assignmentConfidence: "High",
    status: "Analyst Reviewed",
    reviewedBy: "K. Wong, CFA",
    reviewDate: "12 Jun 2026",
    overrideAvailable: false,
    rationale: [
      { label: "Model Deployment", detail: "ERNIE foundation model commercially deployed across search, cloud and enterprise products; rated top-3 in APAC benchmarks" },
      { label: "Revenue Attribution", detail: "82% of Baidu Cloud revenue is now AI-driven; AI Cloud segment growing at 41% year-on-year" },
      { label: "Strategic Guidance", detail: "Management described AI as 'the primary growth vector for FY2025 and beyond' across all earnings communications" },
      { label: "Operational Evidence", detail: "Autonomous driving division Apollo surpassed 100 million cumulative miles; commercialisation progressing in 10 cities" },
      { label: "Filing Analysis", detail: "31% of all regulatory filings and disclosures reference AI, the highest rate among Greater China internet peers" },
    ],
  },
  Alibaba: {
    primaryTheme: "Cloud Computing",
    secondaryThemes: ["Artificial Intelligence", "ESG & Sustainability"],
    hsicsSubsector: "IT Infrastructure & Services",
    hsicsSector: "Information Technology",
    evidenceCoverage: 88,
    assignmentConfidence: "Moderate",
    status: "Pending Review",
    overrideAvailable: true,
    rationale: [
      { label: "Revenue Attribution", detail: "Aliyun Cloud revenue grew 66% year-on-year; cloud segment now represents the highest-growth business unit" },
      { label: "Market Position", detail: "Ranked third in APAC public cloud market share at 11.2%, with enterprise segment accounting for 71% of cloud revenue" },
      { label: "Capital Deployment", detail: "HK$22 billion committed to cloud infrastructure expansion across Southeast Asia and Middle East in FY2025" },
      { label: "AI Integration", detail: "Tongyi Qianwen model embedded in cloud PaaS layer; AI-enhanced services priced at premium to standard cloud offerings" },
      { label: "ESG Commitment", detail: "Net-zero target formalised for 2030; carbon intensity of cloud services reduced 14% year-on-year" },
    ],
  },
};

const COMPANIES: Record<string, {
  name: string; ticker: string; exchange: string; sector: string; region: string;
  overallScore: number; coverage: string; marketCap: string; description: string;
  themes: { id: string; label: string; score: number; color: string; delta: number }[];
  drivers: { label: string; contribution: number; category: string }[];
  peers: { name: string; ticker: string; score: number; region: string }[];
}> = {
  Tencent: {
    name: "Tencent Holdings Ltd.",
    ticker: "0700.HK", exchange: "HKEX", sector: "Interactive Media & Services",
    region: "Greater China", overallScore: 82, coverage: "High",
    marketCap: "HK$3.24T",
    description: "Internet and technology conglomerate with operations across social media, interactive entertainment, cloud infrastructure, fintech, and enterprise software services.",
    themes: [
      { id: "ai", label: "Artificial Intelligence", score: 85, color: "#4F8CFF", delta: 14 },
      { id: "gaming", label: "Interactive Entertainment", score: 90, color: "#22C55E", delta: 8 },
      { id: "cloud", label: "Cloud Computing", score: 75, color: "#A78BFA", delta: 12 },
      { id: "esg", label: "ESG & Sustainability", score: 45, color: "#94A3B8", delta: 3 },
    ],
    drivers: [
      { label: "R&D Capital Expenditure", contribution: 25, category: "Financial" },
      { label: "AI Talent Acquisition", contribution: 18, category: "Human Capital" },
      { label: "Product & Platform Announcements", contribution: 20, category: "Strategic" },
      { label: "Patent Filing Activity", contribution: 12, category: "Intellectual Property" },
      { label: "Management Guidance & Disclosure", contribution: 10, category: "Governance" },
    ],
    peers: [
      { name: "Baidu Inc.", ticker: "BIDU", score: 95, region: "Greater China" },
      { name: "Tencent Holdings", ticker: "0700.HK", score: 82, region: "Greater China" },
      { name: "Alibaba Group", ticker: "BABA", score: 72, region: "Greater China" },
      { name: "JD.com Inc.", ticker: "JD", score: 61, region: "Greater China" },
      { name: "Meituan", ticker: "3690.HK", score: 54, region: "Greater China" },
      { name: "NetEase Inc.", ticker: "NTES", score: 48, region: "Greater China" },
    ],
  },
  Baidu: {
    name: "Baidu Inc.",
    ticker: "BIDU", exchange: "NASDAQ", sector: "Interactive Media & Services",
    region: "Greater China", overallScore: 95, coverage: "High",
    marketCap: "HK$287B",
    description: "Dominant search and information services company, operating China's leading foundation model platform and autonomous driving technology division.",
    themes: [
      { id: "ai", label: "Artificial Intelligence", score: 98, color: "#4F8CFF", delta: 22 },
      { id: "cloud", label: "Cloud Computing", score: 82, color: "#A78BFA", delta: 18 },
      { id: "gaming", label: "Interactive Entertainment", score: 12, color: "#22C55E", delta: 0 },
      { id: "esg", label: "ESG & Sustainability", score: 51, color: "#94A3B8", delta: 5 },
    ],
    drivers: [
      { label: "Foundation Model Benchmarks (ERNIE)", contribution: 35, category: "Technology" },
      { label: "Autonomous Driving Operations (Apollo)", contribution: 28, category: "Strategic" },
      { label: "Cloud Revenue Growth (41% YoY)", contribution: 22, category: "Financial" },
      { label: "AI-Driven Search Deployment", contribution: 18, category: "Product" },
    ],
    peers: [
      { name: "Baidu Inc.", ticker: "BIDU", score: 95, region: "Greater China" },
      { name: "Tencent Holdings", ticker: "0700.HK", score: 82, region: "Greater China" },
      { name: "Alibaba Group", ticker: "BABA", score: 72, region: "Greater China" },
      { name: "JD.com Inc.", ticker: "JD", score: 61, region: "Greater China" },
      { name: "Meituan", ticker: "3690.HK", score: 54, region: "Greater China" },
      { name: "NetEase Inc.", ticker: "NTES", score: 48, region: "Greater China" },
    ],
  },
  Alibaba: {
    name: "Alibaba Group Holding Ltd.",
    ticker: "BABA", exchange: "NYSE", sector: "Broadline Retail / Cloud",
    region: "Greater China", overallScore: 72, coverage: "High",
    marketCap: "HK$1.82T",
    description: "Leading e-commerce and cloud infrastructure conglomerate, operating Taobao, Tmall, Aliyun Cloud, and the Tongyi Qianwen foundation model platform.",
    themes: [
      { id: "ai", label: "Artificial Intelligence", score: 74, color: "#4F8CFF", delta: 11 },
      { id: "cloud", label: "Cloud Computing", score: 88, color: "#A78BFA", delta: 16 },
      { id: "gaming", label: "Interactive Entertainment", score: 22, color: "#22C55E", delta: 1 },
      { id: "esg", label: "ESG & Sustainability", score: 58, color: "#94A3B8", delta: 7 },
    ],
    drivers: [
      { label: "Aliyun AI PaaS Revenue (66% YoY)", contribution: 30, category: "Financial" },
      { label: "Tongyi Qianwen Model Performance", contribution: 24, category: "Technology" },
      { label: "Logistics AI Optimisation", contribution: 14, category: "Operational" },
      { label: "ESG Commitment & Net-Zero Target", contribution: 12, category: "Governance" },
    ],
    peers: [
      { name: "Baidu Inc.", ticker: "BIDU", score: 95, region: "Greater China" },
      { name: "Tencent Holdings", ticker: "0700.HK", score: 82, region: "Greater China" },
      { name: "Alibaba Group", ticker: "BABA", score: 72, region: "Greater China" },
      { name: "JD.com Inc.", ticker: "JD", score: 61, region: "Greater China" },
      { name: "Meituan", ticker: "3690.HK", score: 54, region: "Greater China" },
      { name: "NetEase Inc.", ticker: "NTES", score: 48, region: "Greater China" },
    ],
  },
};

const OPPORTUNITY_THEMES = [
  { label: "Autonomous AI Agents", growth: 340, description: "Multi-step autonomous workflow systems. Driven by improvements in instruction-following and tool-use capabilities.", suggestedIndex: "AI Autonomy Leaders Index", topExposures: ["Baidu", "Tencent", "Microsoft"], color: "#4F8CFF" },
  { label: "Humanoid Robotics", growth: 210, description: "Physical embodied intelligence for industrial and service applications. Convergence of vision models, locomotion and manipulation.", suggestedIndex: "Physical AI Innovators Index", topExposures: ["Tesla", "CATL", "Foxconn"], color: "#A78BFA" },
  { label: "Quantum Computing", growth: 90, description: "Error-corrected qubit systems approaching fault-tolerant computation. Exposure primarily through semiconductor and cloud providers.", suggestedIndex: "Quantum Advantage Basket", topExposures: ["IBM", "Google", "IonQ"], color: "#38BDF8" },
  { label: "AI Infrastructure", growth: 180, description: "Data centre build-out, GPU/NPU supply chains and power infrastructure supporting AI training and inference at scale.", suggestedIndex: "AI Infrastructure Index", topExposures: ["NVIDIA", "TSMC", "Schneider"], color: "#22C55E" },
  { label: "Synthetic Biology", growth: 72, description: "Computationally-designed biological systems for pharmaceutical discovery. Increasing capital inflows from sovereign funds.", suggestedIndex: "DeepBio Leaders Index", topExposures: ["Ginkgo", "Alnylam", "BioNTech"], color: "#94A3B8" },
];

const SOURCE_TABS = ["Annual Report", "Earnings Disclosure", "News & Media", "Regulatory Filing", "ESG Report"];

const evidenceExcerpts: Record<string, { text: string; source: string }> = {
  "Annual Report": { text: "The Group increased investment in foundation model development, allocating HK$15B toward proprietary large language model capabilities, representing a 2.3x increase over the prior fiscal year. AI infrastructure capital expenditure is expected to constitute approximately 30% of total capex in FY2025.", source: "Tencent Holdings Annual Report 2025, p.42 — Strategic Review: Technology Infrastructure" },
  "Earnings Disclosure": { text: "Management guided that AI-related revenue contribution across cloud, advertising and enterprise segments will reach approximately 35% of total revenue by year-end FY2025, compared to 21% in FY2024. AI product margins are currently accretive to group margin.", source: "Tencent Holdings Q1 2025 Earnings Call Transcript, 15 May 2025" },
  "News & Media": { text: "Tencent announced the commercial deployment of Hunyuan foundation model across WeChat Search, Tencent Meeting and enterprise cloud products. Third-party benchmarks rank Hunyuan in the top three for Mandarin-language instruction-following tasks.", source: "Reuters, 14 Feb 2025 — 'Tencent Launches Foundation Model Across Consumer and Enterprise Products'" },
  "Regulatory Filing": { text: "Pursuant to Chapter 13 disclosure requirements, the Company confirms that AI-related research and development expenditure totalled HK$12.4B in the reporting period, classified under 'Technology and Content' in the income statement.", source: "HKEX Form H-Share Annual Filing, 31 March 2025 — Note 14: Research & Development Expenditure" },
  "ESG Report": { text: "The Group has established a governance framework for responsible AI development, including bias testing protocols, transparency reporting, and an independent AI Ethics Advisory Board. Carbon footprint attributable to AI compute was disclosed for the first time in this report period.", source: "Tencent Holdings ESG Report 2024, p.78 — Responsible Technology Governance" },
};

export default function App() {
  const [searchInput, setSearchInput] = useState("Tencent");
  const [activeCompanyKey, setActiveCompanyKey] = useState("Tencent");
  const [activeThemeId, setActiveThemeId] = useState("ai");
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [activeSourceTab, setActiveSourceTab] = useState("Annual Report");

  const company = COMPANIES[activeCompanyKey] ?? COMPANIES["Tencent"];
  const assignment = ASSIGNMENTS[activeCompanyKey] ?? ASSIGNMENTS["Tencent"];
  const activeTheme = company.themes.find((t) => t.id === activeThemeId) ?? company.themes[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = Object.keys(COMPANIES).find(
      (k) =>
        k.toLowerCase() === searchInput.toLowerCase() ||
        COMPANIES[k].ticker.toLowerCase() === searchInput.toLowerCase()
    );
    if (match) { setActiveCompanyKey(match); setActiveThemeId("ai"); }
  };

  const scoreColor =
    company.overallScore >= 80 ? "#10B981" :
    company.overallScore >= 60 ? "#4F8CFF" : "#94A3B8";

  return (
    <div className="min-h-screen" style={{ background: "#0B1220", fontFamily: "Inter, sans-serif", color: "#F3F4F6" }}>

      {/* Header */}
      <header style={{ background: "#080E1A", borderBottom: "1px solid #1E2A3A" }}>
        <div className="max-w-screen-xl mx-auto px-6 py-0 flex items-stretch flex-wrap">
          <div className="flex items-center gap-4 pr-8 py-4" style={{ borderRight: "1px solid #1E2A3A" }}>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-mono font-semibold tracking-widest text-slate-200 uppercase">
                Theme Exposure Analytics
              </span>
              <span className="text-xs text-slate-600 font-mono mt-0.5">
                HSIL Thematic Classification Platform
              </span>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex items-center flex-1 px-6 min-w-0" style={{ borderRight: "1px solid #1E2A3A" }}>
            <Search size={13} className="text-slate-600 shrink-0 mr-3" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by company name, ticker, or HSICS code... (try Baidu, Alibaba)"
              className="bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none w-full"
            />
            <button type="submit" className="text-xs font-mono px-3 py-1 rounded-sm ml-2 shrink-0 transition-colors" style={{ background: "#4F8CFF18", color: "#4F8CFF", border: "1px solid #4F8CFF30" }}>
              Search
            </button>
          </form>
          <div className="flex items-center gap-5 px-6 py-4 text-xs font-mono text-slate-600">
            <span className="text-slate-500">Data as of <span className="text-slate-400 ml-1">15 Jun 2026</span></span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-5 space-y-4">

        {/* Company Overview */}
        <div className="rounded p-5" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap text-xs font-mono">
                <span className="px-2 py-0.5 rounded-sm" style={{ background: "#4F8CFF15", color: "#4F8CFF", border: "1px solid #4F8CFF25" }}>{company.exchange}</span>
                <span className="text-slate-500">{company.ticker}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">{company.sector}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">{company.region}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">Mkt Cap {company.marketCap}</span>
              </div>
              <h1 className="text-lg font-semibold text-slate-100 tracking-tight mb-1.5">{company.name}</h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{company.description}</p>

              {/* Inline classification summary */}
              <div className="flex items-center gap-6 mt-4 pt-4 flex-wrap" style={{ borderTop: "1px solid #1E2A3A" }}>
                <div>
                  <div className="text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5">Theme Assignments</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono px-2 py-1 rounded-sm font-medium" style={{ background: "#4F8CFF18", color: "#4F8CFF", border: "1px solid #4F8CFF30" }}>
                      {assignment.primaryTheme}
                    </span>
                    {assignment.secondaryThemes.map((t) => (
                      <span key={t} className="text-xs font-mono px-2 py-1 rounded-sm" style={{ background: "#2B364840", color: "#94A3B8", border: "1px solid #2B3648" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid #1E2A3A", paddingLeft: "1.5rem" }}>
                  <div className="text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5">HSICS Classification</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded-sm font-medium" style={{ background: "#A78BFA18", color: "#A78BFA", border: "1px solid #A78BFA30" }}>
                      {assignment.hsicsSubsector}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">{assignment.hsicsSector}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-stretch gap-0 rounded shrink-0" style={{ border: "1px solid #2B3648", overflow: "hidden" }}>
              <div className="px-6 py-4 flex flex-col items-center justify-center" style={{ borderRight: "1px solid #2B3648" }}>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Exposure Score</div>
                <div className="text-4xl font-mono font-bold tabular-nums leading-none" style={{ color: scoreColor }}>{company.overallScore}</div>
                <div className="text-xs font-mono text-slate-600 mt-1">/ 100</div>
              </div>
              <div className="px-6 py-4 flex flex-col items-center justify-center">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Evidence Coverage</div>
                <div className="text-xl font-mono font-semibold text-slate-200">{company.coverage}</div>
                <div className="text-xs font-mono mt-1" style={{ color: "#10B981" }}>Source Validation: {assignment.evidenceCoverage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── THEME ASSIGNMENT MODULE ── */}
        <ThemeAssignment data={assignment} companyName={company.name} />

        {/* Theme Exposure + Exposure Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded p-5" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">Theme Exposure Summary</h2>
              <span className="text-xs font-mono text-slate-600">Score 0–100</span>
            </div>
            <div className="flex items-center justify-between py-2 mb-1" style={{ borderBottom: "1px solid #1E2A3A" }}>
              <span className="text-xs font-mono text-slate-600 w-44">Theme</span>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                <span className="w-16 text-right">YoY Chg.</span>
                <span className="w-8 text-right">Score</span>
                <span className="w-24 text-right" />
              </div>
            </div>
            {company.themes.map((theme) => (
              <ThemeExposureBar key={theme.id} theme={theme} isActive={activeThemeId === theme.id} onClick={() => setActiveThemeId(theme.id)} />
            ))}
            <div className="mt-4 text-xs font-mono text-slate-600 pt-3" style={{ borderTop: "1px solid #1E2A3A" }}>
              Scores calculated from R&D disclosure, talent signals, patent activity, product announcements and earnings guidance. Click any row to inspect evidence.
            </div>
          </div>

          <div className="rounded p-5" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">Exposure Drivers</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ background: activeTheme.color + "18", color: activeTheme.color, border: `1px solid ${activeTheme.color}30` }}>
                {activeTheme.label}
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between py-2 text-xs font-mono text-slate-600" style={{ borderBottom: "1px solid #1E2A3A" }}>
                <span className="flex-1">Factor</span>
                <span className="w-24 text-right">Category</span>
                <span className="w-20 text-right">Contribution</span>
              </div>
              {company.drivers.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3 hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #1A2336" }}>
                  <span className="text-sm text-slate-300 flex-1 pr-4">{d.label}</span>
                  <span className="text-xs font-mono text-slate-500 w-24 text-right">{d.category}</span>
                  <span className="text-sm font-mono font-semibold tabular-nums w-20 text-right" style={{ color: "#10B981" }}>+{d.contribution}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 text-xs font-mono" style={{ borderTop: "1px solid #2B3648" }}>
              <span className="text-slate-500">Net score contribution (selected theme)</span>
              <span className="font-semibold tabular-nums" style={{ color: "#10B981" }}>+{company.drivers.reduce((s, d) => s + d.contribution, 0)}</span>
            </div>
          </div>
        </div>

        {/* Supporting Evidence */}
        <div className="rounded overflow-hidden" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
          <button onClick={() => setEvidenceOpen(!evidenceOpen)} className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">Supporting Evidence</h2>
              <span className="text-xs font-mono text-slate-600">12 signals across 5 source types</span>
            </div>
            {evidenceOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
          </button>
          {evidenceOpen && (
            <div style={{ borderTop: "1px solid #1E2A3A" }}>
              <div className="flex items-center gap-0 px-5 pt-4" style={{ borderBottom: "1px solid #1E2A3A" }}>
                {SOURCE_TABS.map((tab) => (
                  <button key={tab} onClick={() => setActiveSourceTab(tab)} className="text-xs font-mono px-4 py-2.5 transition-colors whitespace-nowrap"
                    style={activeSourceTab === tab ? { color: "#4F8CFF", borderBottom: "2px solid #4F8CFF", marginBottom: "-1px" } : { color: "#64748B", borderBottom: "2px solid transparent", marginBottom: "-1px" }}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                <div className="rounded p-4" style={{ background: "#0B1220", border: "1px solid #2B3648" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{activeSourceTab}</span>
                    <button className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#4F8CFF" }}>
                      View Source Document <ExternalLink size={10} />
                    </button>
                  </div>
                  <blockquote className="text-sm text-slate-300 leading-relaxed mb-4" style={{ borderLeft: "2px solid #2B3648", paddingLeft: "1rem" }}>
                    {evidenceExcerpts[activeSourceTab]?.text}
                  </blockquote>
                  <div className="text-xs font-mono text-slate-600">{evidenceExcerpts[activeSourceTab]?.source}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Peer Benchmark + Theme Opportunity Monitor */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 lg:col-span-2 rounded p-5" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">Peer Benchmark</h2>
              <span className="text-xs font-mono text-slate-600">Composite Exposure</span>
            </div>
            <div>
              <div className="flex items-center justify-between py-2 text-xs font-mono text-slate-600" style={{ borderBottom: "1px solid #1E2A3A" }}>
                <span>Company</span>
                <div className="flex items-center gap-6"><span>Region</span><span className="w-12 text-right">Score</span></div>
              </div>
              {company.peers.map((peer, i) => {
                const isSelf = peer.ticker === company.ticker;
                const barColor = peer.score >= 90 ? "#4F8CFF" : peer.score >= 75 ? "#22C55E" : peer.score >= 55 ? "#A78BFA" : "#94A3B8";
                return (
                  <div key={peer.ticker} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #1A2336", background: isSelf ? "#4F8CFF06" : "transparent" }}>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
                      <span className="text-xs font-mono text-slate-600 w-4 tabular-nums shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm truncate ${isSelf ? "text-slate-100 font-medium" : "text-slate-400"}`}>{peer.name}</span>
                          {isSelf && <span className="text-xs font-mono px-1.5 py-0.5 rounded-sm shrink-0" style={{ background: "#4F8CFF18", color: "#4F8CFF", border: "1px solid #4F8CFF25" }}>Selected</span>}
                        </div>
                        <div className="h-1 mt-1.5 rounded-full" style={{ background: "#2B3648" }}>
                          <div className="h-full rounded-full" style={{ width: `${peer.score}%`, background: barColor + "80" }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-xs font-mono text-slate-600 w-20 text-right">{peer.region}</span>
                      <span className="font-mono text-sm font-semibold tabular-nums w-8 text-right" style={{ color: barColor }}>{peer.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-5 lg:col-span-3 rounded p-5" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">Theme Opportunity Monitor</h2>
              <span className="text-xs font-mono text-slate-600">12-Month Signal Growth</span>
            </div>
            <div>
              <div className="grid grid-cols-12 py-2 text-xs font-mono text-slate-600" style={{ borderBottom: "1px solid #1E2A3A" }}>
                <span className="col-span-4">Theme</span>
                <span className="col-span-2 text-right">Growth</span>
                <span className="col-span-3 text-right hidden sm:block">Suggested Index</span>
                <span className="col-span-3 text-right hidden md:block">Top Exposures</span>
              </div>
              {OPPORTUNITY_THEMES.map((theme) => (
                <div key={theme.label} className="grid grid-cols-12 items-start py-3.5 hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #1A2336" }}>
                  <div className="col-span-4 pr-4">
                    <div className="text-sm text-slate-200 font-medium mb-0.5">{theme.label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed line-clamp-2">{theme.description}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: theme.color }}>+{theme.growth}%</span>
                  </div>
                  <div className="col-span-3 text-right hidden sm:block pr-4">
                    <span className="text-xs text-slate-400 font-mono">{theme.suggestedIndex}</span>
                  </div>
                  <div className="col-span-3 text-right hidden md:flex flex-col items-end gap-0.5">
                    {theme.topExposures.map((name) => <span key={name} className="text-xs text-slate-500 font-mono">{name}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exposure Trend Analysis */}
        <div className="rounded p-5" style={{ background: "#131C2E", border: "1px solid #1E2A3A" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Exposure Trend Analysis</h2>
              <div className="text-xs font-mono text-slate-600">{company.name} · Quarterly exposure scores Q1 2023 – Q1 2025</div>
            </div>
            <div className="flex items-center gap-5">
              {themeLines.map((t) => (
                <div key={t.key} className="flex items-center gap-1.5">
                  <div className="w-3 h-px" style={{ borderTop: `2px solid ${t.color}` }} />
                  <span className="text-xs text-slate-500 font-mono">{t.key}</span>
                </div>
              ))}
            </div>
          </div>
          <MomentumChart />
          <div className="mt-4 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono" style={{ borderTop: "1px solid #1E2A3A" }}>
            {[
              { label: "Artificial Intelligence", from: 35, to: 85, color: "#4F8CFF" },
              { label: "Interactive Entertainment", from: 72, to: 90, color: "#22C55E" },
              { label: "Cloud Computing", from: 48, to: 75, color: "#A78BFA" },
              { label: "ESG & Sustainability", from: 30, to: 45, color: "#94A3B8" },
            ].map((t) => (
              <div key={t.label}>
                <div className="text-slate-600 mb-1">{t.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 tabular-nums">{t.from}</span>
                  <span className="text-slate-700">→</span>
                  <span className="font-semibold tabular-nums" style={{ color: t.color }}>{t.to}</span>
                  <span style={{ color: "#10B981" }}>+{Math.round(((t.to - t.from) / t.from) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-screen-xl mx-auto px-6 py-4 mt-2 flex items-center justify-between text-xs font-mono flex-wrap gap-2" style={{ borderTop: "1px solid #1E2A3A", color: "#475569" }}>
        <span>Theme Exposure Analytics · An explainable thematic classification platform for mapping listed companies to investment themes and HSICS subsectors through multi-source evidence.</span>
        <span className="shrink-0">Data: Annual Reports, Earnings, News, ESG Filings, Patent Records</span>
      </footer>
    </div>
  );
}
