import { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  DollarSign, 
  Percent, 
  Clock, 
  Sparkles, 
  Briefcase, 
  Home, 
  MapPin, 
  ChevronRight, 
  ArrowRight,
  Calculator
} from 'lucide-react';
import { INTEREST_RATES } from '../utils/calculator';
import { LoanType } from '../types';

interface LandingPageProps {
  onStartAssessment: (prefillAmounts?: { income: number; emi: number }) => void;
  onNavigateToPRD: () => void;
}

export default function LandingPage({ onStartAssessment, onNavigateToPRD }: LandingPageProps) {
  // Quick pre-estimator state
  const [quickIncome, setQuickIncome] = useState<number>(5000);
  const [quickEmi, setQuickEmi] = useState<number>(500);

  // Quick estimation logic
  const quickDti = quickIncome > 0 ? Math.round((quickEmi / quickIncome) * 100) : 0;
  let quickHealth = { text: 'Healthy', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Sufficient headroom for future borrowings.' };
  if (quickDti > 45) {
    quickHealth = { text: 'Critical Burden', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', desc: 'Exceeds standard underwriting bounds.' };
  } else if (quickDti > 35) {
    quickHealth = { text: 'Warning Zone', color: 'text-amber-500 bg-[#F59E0B]/10 border-[#F59E0B]/20', desc: 'Consider paying off outstanding lines before applying.' };
  }

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Deterministic Engine First',
      desc: 'Our calculations comply strictly with standard consumer underwriting limits (e.g., debt-to-income limits and stress rate tests).'
    },
    {
      icon: Sparkles,
      title: 'AI Smart Advisory Vetting',
      desc: 'Connect metrics securely to Gemini 3.5 Flash server proxies for 90-day action plans, customized rates, and eligibility hacks.'
    },
    {
      icon: ShieldCheck,
      title: 'Safe Local Storage Persistence',
      desc: 'Your critical assets and numbers never exit your sandbox registry. Safe, fast, and completely confidential.'
    }
  ];

  const categories: { type: LoanType; label: string; icon: any; minEmi: string; limit: string }[] = [
    { type: 'home', label: 'Mortgage & Home Loans', icon: Home, minEmi: 'Starts at 8.5% p.a.', limit: 'Up to $1.5M capital limit' },
    { type: 'personal', label: 'Unsecured Personal Credit', icon: DollarSign, minEmi: 'Starts at 12.0% p.a.', limit: 'Up to $50k signature limits' },
    { type: 'business', label: 'SaaS & Enterprise Funding', icon: Briefcase, minEmi: 'Starts at 14.5% p.a.', limit: 'Up to $2.0M working capital' },
    { type: 'car', label: 'Secured Automobile Financing', icon: TrendingUp, minEmi: 'Starts at 9.5% p.a.', limit: 'Up to $120k limits' }
  ];

  return (
    <div className="space-y-16 py-12" id="landing-page-root">
      {/* Hero section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#5B4CF0]/20 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#5B4CF0]/10 text-[#7A6FFF] text-xs font-semibold rounded-full border border-[#5b4cf0]/20 backdrop-blur-md animate-fade-in">
          <Sparkles size={12} className="text-[#55D6FF] animate-pulse" />
          Intellectual Underwriting Intelligence
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Evaluate Loan Eligibility at <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B4CF0] to-[#7A6FFF]">
            Investment-Grade Precision
          </span>
        </h1>

        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Unveil underwriting approvals before submitting official applications. Synthesize cashflow indicators, estimate DTI scores, and consult our virtual credit advisory powered by Gemini AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            id="cta-start-assessment"
            onClick={() => onStartAssessment()}
            className="w-full sm:w-auto px-8 py-4 bg-[#5B4CF0] hover:bg-[#4a3ce0] text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Run Free Credit Diagnostic <ArrowRight size={16} />
          </button>
          <button
            id="cta-view-prd"
            onClick={onNavigateToPRD}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            Review Technical Spec & PRD
          </button>
        </div>
      </div>

      {/* Quick Interactive Estimator */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden" id="quick-estimator-section">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#55D6FF]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calculator size={13} className="text-[#5B4CF0]" /> Dynamic Underwriting Sandbox
            </span>
            <h2 className="text-xl font-bold text-slate-900">Pre-Check Debt Thresholds</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Adjust your monthly figures below. Modern bank underwriters evaluate your fixed liabilities against income pools. Keeping this under 35% is critical.
            </p>

            <div className="bg-slate-50/70 border border-slate-100 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Estimator Debt Index (DTI)</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${quickHealth.color}`}>
                  {quickHealth.text}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">{quickDti}%</span>
                <span className="text-xs text-slate-400 font-medium">gross committed</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-tight pt-1">
                {quickHealth.desc}
              </p>
            </div>
          </div>

          <div className="space-y-5 bg-[#F7F9FF] p-6 rounded-2xl border border-slate-100">
            {/* Slider 1: Gross Monthly Income */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">Monthly gross income:</span>
                <span className="font-bold text-slate-900 font-mono">${quickIncome.toLocaleString()}</span>
              </div>
              <input
                id="quick-income-range"
                type="range"
                min="1000"
                max="30000"
                step="500"
                value={quickIncome}
                onChange={(e) => setQuickIncome(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B4CF0]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$1k</span>
                <span>$15k</span>
                <span>$30k</span>
              </div>
            </div>

            {/* Slider 2: Outstanding EMI Liabilities */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">Current Outstanding EMIs:</span>
                <span className="font-bold text-slate-900 font-mono">${quickEmi.toLocaleString()}</span>
              </div>
              <input
                id="quick-emi-range"
                type="range"
                min="0"
                max="10000"
                step="100"
                value={quickEmi}
                onChange={(e) => setQuickEmi(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7A6FFF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$0</span>
                <span>$5k</span>
                <span>$10k</span>
              </div>
            </div>

            {/* CTA inside widget */}
            <button
              id="quick-prefill-apply-action"
              onClick={() => onStartAssessment({ income: quickIncome, emi: quickEmi })}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
            >
              Transfer Figures to Comprehensive Assessment Form <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div className="max-w-5xl mx-auto px-4 space-y-8" id="benefits-section">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Constructed for Informed Strategic Decisions</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Traditional credit applications run hard credit file checks. We evaluate your stats locally, preserving eligibility ratings safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="p-6 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#5B4CF0]/10 text-[#5B4CF0] flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-2">{benefit.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loan Interest Rate Ranges Banner */}
      <div className="max-w-5xl mx-auto px-4 space-y-6" id="loan-types-section">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Configured Retail Lending Reference Benchmarks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-5 bg-white border border-slate-50 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center mb-3">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">{cat.label}</h4>
                  <p className="text-[10px] text-indigo-600 font-mono font-bold bg-[#5B4CF0]/5 py-0.5 px-2 rounded-full inline-block">
                    {cat.minEmi}
                  </p>
                </div>
                <p className="text-[10px] text-slate-450 mt-3 border-t border-slate-50 pt-2 font-medium">
                  {cat.limit}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
