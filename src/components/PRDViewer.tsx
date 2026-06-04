import { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Map, 
  FolderTree, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Palette, 
  Workflow
} from 'lucide-react';

interface PRDViewerProps {
  onStartApp: () => void;
}

export default function PRDViewer({ onStartApp }: PRDViewerProps) {
  const [activeTab, setActiveTab] = useState<'prd' | 'design' | 'architecture' | 'folder' | 'roadmap'>('prd');

  const roadmapItems = [
    { id: 1, phase: 'Phase 1: PRD', task: 'Formulate Business Logic, deterministic formulas & financial indicators', status: 'completed' },
    { id: 2, phase: 'Phase 2: Design System', task: 'Build futuristic fintech layout, visual colors, and typography patterns', status: 'completed' },
    { id: 3, phase: 'Phase 3: Architecture', task: 'Establish express-vite server structure & secure server-side Gemini 3.5 API proxies', status: 'completed' },
    { id: 4, phase: 'Phase 4: Database Logic', task: 'Set up type definitions and LocalStorage history engines', status: 'completed' },
    { id: 5, phase: 'Phase 5: Page Layouts', task: 'Design slick multi-step application form with interactive progress bars', status: 'completed' },
    { id: 6, phase: 'Phase 6: Chart Visualizers', task: 'Implement D3/Recharts modules displaying loan and expense margins', status: 'completed' },
    { id: 7, phase: 'Phase 7: Simulator', task: 'Deploy dynamic simulation playground with recalculating What-If models', status: 'completed' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="prd-portal-root">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B4CF0] rounded-full filter blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#55D6FF] rounded-full filter blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[#5B4CF0]/20 text-[#7A6FFF] text-xs font-semibold rounded-full border border-[#5b4cf0]/30 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#55D6FF]" /> Architect Workspace
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                Ready to Review
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">LoanWise AI Portal</h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              You are viewing the interactive architectural manual, PRD definitions, and project blueprints. Execute the blueprint below or launch the fully-interactive web application directly.
            </p>
          </div>
          <button 
            id="launch-app-action"
            onClick={onStartApp}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-[#5B4CF0] to-[#7A6FFF] hover:from-[#4a3ce0] hover:to-[#6a5eeb] text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Launch Interactive Application <Workflow size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3" id="prd-tabs-container">
        {[
          { id: 'prd', label: 'Phase 1: PRD', icon: BookOpen },
          { id: 'design', label: 'Phase 2: Design System', icon: Palette },
          { id: 'architecture', label: 'Phase 3: Technical Spec', icon: Cpu },
          { id: 'folder', label: 'Phase 4: Directory Structure', icon: FolderTree },
          { id: 'roadmap', label: 'Phase 5: Implementation Roadmap', icon: Map },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`prd-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                isActive 
                  ? 'bg-[#5B4CF0] text-white shadow-soft' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm min-h-[480px]">
        {/* Tab 1: PRD */}
        {activeTab === 'prd' && (
          <div className="space-y-6" id="prd-document-content">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Product Requirements Document (PRD)</h2>
              <p className="text-slate-500 text-sm">Comprehensive specification for LoanWise AI Eligibility Advisor.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="p-5 bg-[#5B4CF0]/5 rounded-xl border border-[#5b4cf0]/10">
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B4CF0]"></span> The Problem Statement
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Most consumers apply for retail lending (mortgages, personal lines, business credit) blindly. Rejection harms credit standings, sets back financial timelines, and is highly stressful. Traditional banking calculators are too simple; they only count basic debt coefficients without looking at credit tiers, liquid reserves, or experience levels.
                  </p>
                </div>

                <div className="p-5 bg-teal-50 rounded-xl border border-teal-100">
                  <h3 className="text-sm font-bold text-teal-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> The Proposed Solution
                  </h3>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    A hybrid credit advisor. First, it runs <strong>underwriter evaluation algorithms</strong> locally to pinpoint score ratings, Debt-To-Income (DTI) margins, proposed EMI burdens, and savings balances. Secondly, it calls <strong>Gemini 3.5 Flash</strong> anonymously to produce readable, executive advisory summaries, improvements to qualify within 90 days, and lending restructures.
                  </p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-500" /> Core Functional Modules
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[130px]">Multi-Step Assessment:</strong>
                    <span>Validates monthly cashflow, credit score levels, experience and loan specifications with smart client-side caching.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[130px]">Diagnostic Analytics:</strong>
                    <span>Computes DTI, proposed EMI burdens, and visualizes cash outflow trends with professional fintech chart layouts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[130px]">AI-Powered Advisory:</strong>
                    <span>Leverages Gemini server-side parsing to draft improvements, diagnostic analysis reasons, and lender alternatives.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[130px]">What-If Simulation:</strong>
                    <span>Interactive sliders to test how reducing debts, increasing income, or adjusting tenures directly affects approval weights in real-time.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Design System */}
        {activeTab === 'design' && (
          <div className="space-y-6" id="design-system-content">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Design & Visual Identity</h2>
              <p className="text-slate-500 text-sm">Visual style keys following modern SaaS leaders such as Stripe, Brex, and Mercury.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 border border-slate-100 rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Color Spectrum</h3>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#5B4CF0]"></div>
                    <span>Primary<br/><b className="text-slate-400">#5B4CF0</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#7A6FFF]"></div>
                    <span>Secondary<br/><b className="text-slate-400">#7A6FFF</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#55D6FF]"></div>
                    <span>Accent<br/><b className="text-slate-400">#55D6FF</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#F7F9FF] border border-slate-200"></div>
                    <span>Background<br/><b className="text-slate-400">#F7F9FF</b></span>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-slate-100 rounded-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Glassmorphism Aesthetic</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The visual layout layers glossy containers on translucent background gradients. Cards use clean, subtle border highlights (`border-white/20` in dark mode) paired with refined box-shadow parameters to evoke pristine, luxury craftsmanship.
                </p>
                <div className="p-3 bg-gradient-to-r from-indigo-50/50 to-[#55D6FF]/5 border border-white rounded-lg text-[10px] text-indigo-700 font-mono">
                  background: rgba(255, 255, 255, 0.7);<br/>
                  backdrop-filter: blur(12px);
                </div>
              </div>

              <div className="p-5 border border-slate-100 rounded-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Typography & Hierarchy</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>
                    <strong className="text-slate-800">Space Grotesk / Inter:</strong> Primary display typography.
                  </li>
                  <li>
                    <strong className="text-slate-800">Financial Metrics:</strong> Rendered in large display weights with high contrast, enabling rapid cognitive scanning.
                  </li>
                  <li>
                    <strong className="text-slate-800">Sub-indicators:</strong> Rendered in small, elegant mono-weighted rows mimicking terminal ledger tables.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Technical Spec */}
        {activeTab === 'architecture' && (
          <div className="space-y-6" id="architecture-content">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Technical Architecture & Algorithms</h2>
              <p className="text-slate-500 text-sm">Deterministic formulas driving scoring weights combined with natural language generative advice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4 border border-slate-100 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded">Algorithms</span> Formula System
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="pb-2.5 border-b border-slate-100">
                    <p className="font-semibold text-slate-700">Equated Monthly Installment (Proposed EMI):</p>
                    <code className="block bg-slate-50 p-2 rounded text-[11px] font-mono whitespace-pre text-indigo-600">
                      EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
                    </code>
                    <p className="text-[10px] text-slate-400 mt-1">P = Loan Amount, r = Monthly Rate (Annual / 12), n = Loan Tenure, in months</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Underwriting Points Weights:</p>
                    <ul className="list-disc leading-relaxed list-inside pl-1 space-y-1 text-slate-500">
                      <li><strong>40% Credit Score rating:</strong> Up to 100 points for credit scores ≥780.</li>
                      <li><strong>30% DTI (Debt-To-Income):</strong> Up to 100 points if combined monthly debt EMIs ≤ 25%.</li>
                      <li><strong>15% Savings Ratio:</strong> Evaluates surplus capital flow against monthly gross levels.</li>
                      <li><strong>15% Employment Experience & Age Safety:</strong> Calibrates stability index benchmarks.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border border-slate-100 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] rounded">API</span> AI Interface & Prompt Modeling
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instead of passing arbitrary arrays or general prompts, our platform resolves deterministic mathematical ratios beforehand. The server routes are supplied with clean data models and queries the Google GenAI SDK using a custom JSON schema model template. This structure eliminates conversational hallucinations or bad advice formatting.
                </p>
                <div className="p-4 bg-slate-800 text-slate-200 rounded-xl space-y-2 text-xs font-mono">
                  <div className="text-teal-400">// Client (Browser) Payload Route:</div>
                  <div className="text-slate-400">POST /api/loan-advice</div>
                  <div className="text-slate-300">{"{ input: LoanInput, metrics: CalculationMetrics }"}</div>
                  <div className="text-emerald-400 mt-2">// Response payload returns fully vetted, structured JSON recommendations</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Directory Structure */}
        {activeTab === 'folder' && (
          <div className="space-y-6" id="folder-structure-content">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Workspace & Directory Layout</h2>
              <p className="text-slate-500 text-sm">Organized to prevent massive single-file merges and support smooth long-term scaling.</p>
            </div>

            <div className="border border-slate-100 rounded-xl p-6 bg-slate-50 font-mono text-xs text-slate-700 space-y-1">
              <div>📁 Root (Workspace)</div>
              <div className="pl-4">├── 📄 server.ts <span className="text-slate-400 font-sans text-[11px]">(Full-stack CJS esbuild proxy server + static router)</span></div>
              <div className="pl-4">├── 📄 package.json <span className="text-slate-400 font-sans text-[11px]">(Dependency list + full-stack startup scripts)</span></div>
              <div className="pl-4">├── 📄 vite.config.ts <span className="text-slate-400 font-sans text-[11px]">(React Vite configurations, disabling HMR for static agent building)</span></div>
              <div className="pl-4">📁 src/</div>
              <div className="pl-8">├── 📄 main.tsx <span className="text-slate-400 font-sans text-[11px]">(Primary React container setup)</span></div>
              <div className="pl-8">├── 📄 index.css <span className="text-slate-400 font-sans text-[11px]">(Custom Google Fonts import + Tailwind 4 structure)</span></div>
              <div className="pl-8">├── 📄 types.ts <span className="text-slate-400 font-sans text-[11px]">(All global TypeScript models and system interfaces)</span></div>
              <div className="pl-8">├── 📄 App.tsx <span className="text-slate-400 font-sans text-[11px]">(Active states sync + navigation screens resolver)</span></div>
              <div className="pl-8">📁 src/utils/</div>
              <div className="pl-12">├── 📄 calculator.ts <span className="text-slate-400 font-sans text-[11px]">(Underwriting mathematics, credit logic, point tiers, and maximum debt thresholds)</span></div>
              <div className="pl-8">📁 src/components/</div>
              <div className="pl-12">├── 📄 PRDViewer.tsx <span className="text-slate-400 font-sans text-[11px]">(Current technical specification panel)</span></div>
              <div className="pl-12">├── 📄 LandingPage.tsx <span className="text-slate-400 font-sans text-[11px]">(Fintech hero, dynamic rapid estimation tool, and testimonials)</span></div>
              <div className="pl-12">├── 📄 AssessmentForm.tsx <span className="text-slate-400 font-sans text-[11px]">(Multi-step loan assessment wizard with localStorage progress indicators)</span></div>
              <div className="pl-12">├── 📄 ResultsDashboard.tsx <span className="text-slate-400 font-sans text-[11px]">(Fintech visualizations, gauges, charts, and Gemini credit audit reviews)</span></div>
              <div className="pl-12">├── 📄 InsightsPage.tsx <span className="text-slate-400 font-sans text-[11px]">(Interactive scenario playpen with rapid DTI simulation sliders)</span></div>
              <div className="pl-12">├── 📄 HistoryPage.tsx <span className="text-slate-400 font-sans text-[11px]">(Past local storage assessments archive and view module)</span></div>
              <div className="pl-12">├── 📄 SettingsPage.tsx <span className="text-slate-400 font-sans text-[11px]">(Preferences, profiles, clear and reset history options)</span></div>
            </div>
          </div>
        )}

        {/* Tab 5: Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6" id="roadmap-content">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Interactive Implementation Roadmap</h2>
              <p className="text-slate-500 text-sm">Tracking the actual technical tasks, deliverables, and development phases.</p>
            </div>

            <div className="space-y-3 pt-2">
              {roadmapItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#5B4CF0]/10 text-[#5B4CF0] flex items-center justify-center text-xs font-bold font-mono">
                      {item.id}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{item.phase}</span>
                      <span className="text-xs font-semibold text-slate-700">{item.task}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Complete
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Launch CTA */}
      <div className="mt-8 text-center bg-slate-50 border border-slate-100 p-6 rounded-2xl">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">Architect Review Sign-Off</h3>
        <p className="text-xs text-slate-500 mb-4">All core calculations, full-stack endpoints, and design parameters are compiled.</p>
        <button
          onClick={onStartApp}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all"
        >
          Confirm & Open Main Advisory Workspace
        </button>
      </div>
    </div>
  );
}
