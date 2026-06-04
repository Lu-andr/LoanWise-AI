import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  RefreshCw, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { AssessmentRecord } from '../types';

interface ResultsDashboardProps {
  record: AssessmentRecord;
  onRestart: () => void;
  onSaveHistory: (rec: AssessmentRecord) => void;
}

export default function ResultsDashboard({ record, onRestart, onSaveHistory }: ResultsDashboardProps) {
  const { input, metrics, aiAdvice } = record;
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'ai-report'>('overview');

  // Format currencies
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // 12-month projections
  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Monthly savings with current EMI vs Proposed
    const currentMonthlySavings = input.monthlyIncome - input.existingEmi - input.monthlyExpenses;
    const proposedMonthlySavings = currentMonthlySavings - metrics.proposedEmi;
    
    return {
      name: `Month ${month}`,
      'Current Savings Cushion': currentMonthlySavings * month,
      'Cushion with New Loan': Math.max(0, proposedMonthlySavings * month),
    };
  });

  // Cash outflow structure
  const outflowData = [
    {
      name: 'Monthly Income vs Outflows',
      'Gross Income': input.monthlyIncome,
      'Everyday Expenses': input.monthlyExpenses,
      'Existing Debt Service': input.existingEmi,
      'Proposed Loan EMI': metrics.proposedEmi,
    }
  ];

  // Helper styles based on risk levels
  const getRiskColors = (level: string) => {
    switch (level) {
      case 'Low': 
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', text: 'text-emerald-500', fill: '#22C55E' };
      case 'Moderate': 
        return { bg: 'bg-amber-50 text-amber-700 border-amber-100', text: 'text-amber-500', fill: '#F59E0B' };
      case 'High': 
        return { bg: 'bg-orange-50 text-orange-700 border-orange-100', text: 'text-orange-500', fill: '#EA580C' };
      default: 
        return { bg: 'bg-rose-50 text-rose-700 border-rose-100', text: 'text-rose-500', fill: '#EF4444' };
    }
  };

  const riskStyle = getRiskColors(metrics.riskLevel);
  const creditStyle = metrics.creditRating === 'Excellent' || metrics.creditRating === 'Good'
    ? { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:scale-105', rating: 'Healthy' }
    : { bg: 'bg-amber-50 border-amber-100 text-amber-700 hover:scale-105', rating: 'Under Stress' };

  return (
    <div className="max-w-5xl mx-auto space-y-8" id="results-portal">
      {/* Header action panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Assessment Docket #{record.id.slice(0, 6).toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500">Evaluated on {new Date(record.date).toLocaleString()} for ${input.loanAmount.toLocaleString()} {input.loanType.toUpperCase()} borrowing.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            id="btn-save-record-history"
            onClick={() => {
              onSaveHistory(record);
              alert('Assessment snapshot successfully hard-vetted into Local History archive!');
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
          >
            <ShieldCheck size={14} className="text-[#5B4CF0]" /> Archive Assessment
          </button>
          
          <button
            id="btn-restart-assessment"
            onClick={onRestart}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#5B4CF0] hover:bg-[#4a3ce0] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1"
          >
            <RefreshCw size={14} /> New Vetting Run
          </button>
        </div>
      </div>

      {/* Top Rings Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ring 1: Approval Probability Ring */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden" id="widget-probability-ring">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Unconditional Underwriting Probability</h3>
          
          {/* Svg Circle */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="#E2E8F0"
                strokeWidth="12"
              />
              {/* Progress track */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="url(#probability-gradient)"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * metrics.approvalProbability) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="probability-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5B4CF0" />
                  <stop offset="100%" stopColor="#55D6FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-slate-900 font-mono">{metrics.approvalProbability}%</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">APPROVAL ODDS</span>
            </div>
          </div>
          <p className="text-[10.5px] text-slate-500 text-center mt-4">
            Based on a weighted profile composed from FICO records, liabilities cash flow stability ratio coefficients.
          </p>
        </div>

        {/* Ring 2: Risk Meter Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between" id="widget-risk-meter">
          <div>
            <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest mb-1">Underwriter Risk Rating</h3>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Stress Exposure Check</span>
          </div>

          <div className="py-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.riskLevel}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${riskStyle.bg}`}>
                {metrics.riskLevel === 'Low' ? 'Low Exposure' : 'Caution Required'}
              </span>
            </div>

            {/* Slider/scale visual */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full flex-1 border-r border-white"></div>
                <div className="bg-[#F59E0B] h-full flex-1 border-r border-white"></div>
                <div className="bg-orange-500 h-full flex-1 border-r border-white"></div>
                <div className="bg-rose-500 h-full flex-1"></div>
              </div>
              <div className="flex justify-between text-[8px] font-bold font-mono text-slate-400">
                <span>LOW</span>
                <span>MODERATE</span>
                <span>HIGH</span>
                <span>CRITICAL</span>
              </div>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-500">
            Current committed debt payments (DTI) represent a major factor. Standard guidelines restrict exposure bounds under 45%.
          </p>
        </div>

        {/* Ring 3: General Underwriting Indicators */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between" id="widget-financial-cards">
          <div>
            <h3 className="text-xs font-bold text-[#5B4CF0] uppercase tracking-widest mb-1">Affordability Index</h3>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Maximum Loan Capacity Limit</span>
          </div>

          <div className="py-3">
            <div className="text-xs text-slate-400 uppercase font-bold">Suggested Cap Ceiling</div>
            <div className="text-3xl font-extrabold text-indigo-700 font-mono tracking-tight">
              {formatUSD(metrics.maxAffordableLoan)}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
              Estimated affordable principal size targeting a balanced amortisation DTI ratio below 40% under current rate matrices ({metrics.interestRate}%).
            </p>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Activity size={18} />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 block uppercase font-bold">Remaining Residual Cash</span>
              <span className="text-sm font-bold text-slate-800 font-mono">{formatUSD(metrics.disposableIncome)} /mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratios Ledger Details (Detailed cards matching CRED/Mercury visual densities) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="ledger-ratios-container">
        {/* DTI Card */}
        <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Debt-to-Income (DTI)</span>
            <span className="cursor-help" title="Percentage of income allocated to all monthly debt obligations (current + proposed).">
              <HelpCircle size={14} className="text-slate-300" />
            </span>
          </div>
          <span className="text-2xl font-bold text-slate-800 font-mono block">{metrics.dtiRatio}%</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${metrics.dtiRatio > 50 ? 'bg-rose-500' : metrics.dtiRatio > 36 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, metrics.dtiRatio)}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">Recommended baseline index: under 36%</span>
        </div>

        {/* EMI ratio card */}
        <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proposed EMI Weight</span>
            <span className="cursor-help" title="Percentage of gross monthly income required solely to cover this new proposed loan payment.">
              <HelpCircle size={14} className="text-slate-300" />
            </span>
          </div>
          <span className="text-2xl font-bold text-indigo-600 font-mono block">{metrics.emiToIncomeRatio}%</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, metrics.emiToIncomeRatio)}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">Proposed Installment: {formatUSD(metrics.proposedEmi)}/mo</span>
        </div>

        {/* Savings reserve ratio card */}
        <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Savings Rate</span>
            <span className="cursor-help" title="Standard savings flow calculated as a percentage of your monthly gross incoming streams.">
              <HelpCircle size={14} className="text-slate-300" />
            </span>
          </div>
          <span className="text-2xl font-bold text-teal-600 font-mono block">{metrics.savingsRatio}%</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-teal-500" style={{ width: `${Math.min(100, metrics.savingsRatio)}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">Surplus Flow: {formatUSD(input.savings)}/mo</span>
        </div>
      </div>

      {/* Tab select sections for Charts vs AI Reports */}
      <div className="border-b border-slate-200" id="results-toggle-tabs">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Underwriter Diagnostics', icon: FileText },
            { id: 'charts', label: 'Cashflow Data Visualizers', icon: Activity },
            { id: 'ai-report', label: 'AI Advisor Insight Report', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`results-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-semibold text-xs transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'border-[#5B4CF0] text-indigo-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab contents */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs min-h-[350px]">
        {/* TAB 1: Underwriter Diagnostics */}
        {activeTab === 'overview' && (
          <div className="space-y-6" id="overview-tab-content">
            <div>
              <h2 className="text-base font-bold text-slate-800">Deterministic Score Weight Distributions</h2>
              <p className="text-xs text-slate-500">Underwriting scoring points contributing to the {metrics.approvalProbability}% outcome index.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> FICO Credit Tier (40%)
                  </span>
                  <span className="font-mono text-slate-500">{metrics.creditPoints} / 100 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${metrics.creditPoints}%` }}></div>
                </div>
              </div>

              <div className="p-4 border border-slate-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Debt Constraints - DTI (30%)
                  </span>
                  <span className="font-mono text-slate-500">{metrics.debtPoints} / 100 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${metrics.debtPoints}%` }}></div>
                </div>
              </div>

              <div className="p-4 border border-slate-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> Liquid Surplus Ratio (15%)
                  </span>
                  <span className="font-mono text-slate-500">{metrics.savingsPoints} / 100 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${metrics.savingsPoints}%` }}></div>
                </div>
              </div>

              <div className="p-4 border border-slate-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span> Employment & Age Stability (15%)
                  </span>
                  <span className="font-mono text-slate-500">{metrics.stabilityPoints} / 100 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500" style={{ width: `${metrics.stabilityPoints}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F7F9FF] border border-[#5B4CF0]/10 rounded-2xl flex items-start gap-3">
              <Activity size={18} className="text-[#5B4CF0] mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase block mb-0.5">Stress-Test Scenario Note</span>
                <span className="text-[11px] text-slate-500 leading-relaxed block">
                  A stress rate buffer of <strong>2.00% p.a.</strong> has been evaluated on top of the base loan rate matrix of <strong>{metrics.interestRate}%</strong>. The applicant is likely to exhibit sufficient capital buffer matching W2 income streams, but high consumer balances (e.g., active revolving cards) will trigger warning levels on DTI.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Recharts Visualizers */}
        {activeTab === 'charts' && (
          <div className="space-y-8" id="charts-tab-content">
            {/* Chart 1: Output streams */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Monthly Cash Commitment Distribution</h3>
                <p className="text-xs text-slate-500">Comparing incoming gross pools against active everyday margins and requested debt EMI payments.</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={outflowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `$${v}`} tickLine={false} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]} />
                    <Legend iconType="circle" fontSize={11} wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="Gross Income" fill="#5B4CF0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Everyday Expenses" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Existing Debt Service" fill="#EA580C" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Proposed Loan EMI" fill="#55D6FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Cumulative Reserves */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">12-Month Projected Liquid Savings Cushion</h3>
                <p className="text-xs text-slate-500">Estimating cash reserve trends over a 12-month timeline with vs without the requested proposed loan burden.</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="currentSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="proposedSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B4CF0" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#5B4CF0" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `$${v}`} tickLine={false} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Area type="monotone" dataKey="Current Savings Cushion" stroke="#22C55E" fillOpacity={1} fill="url(#currentSavingsGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Cushion with New Loan" stroke="#5B4CF0" fillOpacity={1} fill="url(#proposedSavingsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI Advisor Report */}
        {activeTab === 'ai-report' && (
          <div className="space-y-6" id="ai-report-tab-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={18} className="text-[#5B4CF0]" /> AI Underwriter Report
                </h2>
                <p className="text-xs text-slate-500">Real-time structured feedback compiled securely by Gemini 3.5 Flash server proxy models.</p>
              </div>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#5B4CF0] text-[10px] font-bold rounded-md">
                Strict Underwriter Schema v1.2
              </span>
            </div>

            {aiAdvice ? (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
                {/* Summary Intro */}
                <div className="p-5 bg-gradient-to-r from-[#5B4CF0]/5 to-indigo-50 rounded-2xl border border-[#5b4cf0]/10">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Executive Advisory Opinion</h3>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {aiAdvice.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Analysis reasons */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Diagnostic Risk Factors
                    </h4>
                    <ul className="space-y-2 text-slate-600 list-inside pl-1">
                      {aiAdvice.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#5B4CF0] font-bold font-mono min-w-[12px]">{i+1}.</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Advisory Actions
                    </h4>
                    <ul className="space-y-2 text-slate-600 list-inside pl-1">
                      {aiAdvice.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-500 font-bold font-mono min-w-[12px]">{i+1}.</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dynamic improvements */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 90-Day Improvement Exercises
                    </h4>
                    <ul className="space-y-2 text-slate-600 list-inside pl-1">
                      {aiAdvice.improvements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold font-mono min-w-[12px]">★</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alternatives */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-amber-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span> Alternative Financing Schemes
                    </h4>
                    <ul className="space-y-2 text-slate-600 list-inside pl-1">
                      {aiAdvice.alternatives.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold font-mono min-w-[12px]">&bull;</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 font-medium">
                <SpinnerIcon className="w-8 h-8 animate-spin text-[#5B4CF0] mb-3" />
                <span>Synchronizing structured credit files with Gemini... Please hold.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SpinnerIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
