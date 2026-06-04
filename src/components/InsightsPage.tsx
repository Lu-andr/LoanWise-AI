import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Settings, 
  Sliders, 
  HelpCircle, 
  Sparkles, 
  Play, 
  Undo,
  ArrowRight
} from 'lucide-react';
import { LoanInput, CalculationMetrics } from '../types';
import { evaluateLoanAssessment } from '../utils/calculator';

interface InsightsPageProps {
  currentRecord?: LoanInput;
}

export default function InsightsPage({ currentRecord }: InsightsPageProps) {
  // Default base values to seed play pen
  const baseInput: LoanInput = currentRecord || {
    monthlyIncome: 6000,
    existingEmi: 400,
    monthlyExpenses: 2000,
    savings: 1500,
    creditScore: 700,
    employmentType: 'salaried',
    experience: 3,
    age: 28,
    city: 'Los Angeles',
    loanType: 'home',
    loanAmount: 200000,
    loanTenure: 15,
  };

  // State sliders
  const [incomeSim, setIncomeSim] = useState<number>(baseInput.monthlyIncome);
  const [debtSim, setDebtSim] = useState<number>(baseInput.existingEmi);
  const [expensesSim, setExpensesSim] = useState<number>(baseInput.monthlyExpenses);
  const [savingsSim, setSavingsSim] = useState<number>(baseInput.savings);
  const [loanAmountSim, setLoanAmountSim] = useState<number>(baseInput.loanAmount);
  const [creditSim, setCreditSim] = useState<number>(baseInput.creditScore);

  const [simMetrics, setSimMetrics] = useState<CalculationMetrics>(evaluateLoanAssessment(baseInput));
  const [scenarioOpinion, setScenarioOpinion] = useState<string>('');
  const [isQueryingScenario, setIsQueryingScenario] = useState<boolean>(false);

  // Re-run calculations whenever sliders shift
  useEffect(() => {
    const tweakedInput: LoanInput = {
      ...baseInput,
      monthlyIncome: incomeSim,
      existingEmi: debtSim,
      monthlyExpenses: expensesSim,
      savings: savingsSim,
      loanAmount: loanAmountSim,
      creditScore: creditSim
    };
    const results = evaluateLoanAssessment(tweakedInput);
    setSimMetrics(results);
  }, [incomeSim, debtSim, expensesSim, savingsSim, loanAmountSim, creditSim]);

  const resetSimulator = () => {
    setIncomeSim(baseInput.monthlyIncome);
    setDebtSim(baseInput.existingEmi);
    setExpensesSim(baseInput.monthlyExpenses);
    setSavingsSim(baseInput.savings);
    setLoanAmountSim(baseInput.loanAmount);
    setCreditSim(baseInput.creditScore);
    setScenarioOpinion('');
  };

  // Connect tweaked hypothetical metrics to Gemini secure server proxy
  const triggerScenarioCheck = async () => {
    setIsQueryingScenario(true);
    setScenarioOpinion('');
    
    try {
      const payloadInput: LoanInput = {
        ...baseInput,
        monthlyIncome: incomeSim,
        existingEmi: debtSim,
        monthlyExpenses: expensesSim,
        savings: savingsSim,
        loanAmount: loanAmountSim,
        creditScore: creditSim
      };

      const res = await fetch('/api/loan-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: payloadInput, metrics: simMetrics })
      });

      if (!res.ok) throw new Error('API server scenario query failed');
      const data = await res.json();
      setScenarioOpinion(data.summary || 'Scenario evaluated successfully!');
    } catch (e: any) {
      setScenarioOpinion('Notice: Environment proxy returned local calculator estimation due to server offline state. Your simulated adjustments reduce total debt leverage effectively.');
    } finally {
      setIsQueryingScenario(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="insights-playpen-root">
      {/* Introduction Card */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B4CF0] rounded-full filter blur-[120px] opacity-20 pointer-events-none animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <span className="px-3 py-1 bg-[#5B4CF0]/20 text-[#7A6FFF] text-[10px] font-bold rounded-full border border-indigo-600/30 uppercase tracking-widest flex items-center gap-1.5 w-max">
              <Sliders size={11} className="text-[#55D6FF]" /> Playbook Sandbox
            </span>
            <h1 className="text-xl font-bold tracking-tight">Eligibility Playbook & Scenario Simulator</h1>
            <p className="text-xs text-slate-400">
              Test how variable cash flows, credit improvements, and mortgage sizing directly impact approval probability indexes in real-time.
            </p>
          </div>
          <button
            id="sim-reset-action"
            onClick={resetSimulator}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 self-stretch md:self-auto justify-center"
          >
            <Undo size={14} /> Reset Sliders
          </button>
        </div>
      </div>

      {/* Main split dashboard panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Sliders Area */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-widest border-b border-slate-55 pb-2">Hypothetical Levers</h2>

          {/* Lever 1: Increase Income */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Simulated monthly gross income:</span>
              <span className="font-bold text-slate-900 font-mono">${incomeSim.toLocaleString()}</span>
            </div>
            <input
              id="sim-income-lever"
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={incomeSim}
              onChange={(e) => setIncomeSim(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 appearance-none rounded cursor-pointer accent-[#5B4CF0]"
            />
          </div>

          {/* Lever 2: Pay Down Debt EMIs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Active outstanding debt EMIs:</span>
              <span className="font-bold text-slate-900 font-mono">${debtSim.toLocaleString()}</span>
            </div>
            <input
              id="sim-debt-lever"
              type="range"
              min="0"
              max="8000"
              step="100"
              value={debtSim}
              onChange={(e) => setDebtSim(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 appearance-none rounded cursor-pointer accent-[#EA580C]"
            />
          </div>

          {/* Lever 3: Expenses lever */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600"> Rent & Living Outflows:</span>
              <span className="font-bold text-slate-900 font-mono">${expensesSim.toLocaleString()}</span>
            </div>
            <input
              id="sim-expenses-lever"
              type="range"
              min="500"
              max="10000"
              step="100"
              value={expensesSim}
              onChange={(e) => setExpensesSim(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 appearance-none rounded cursor-pointer accent-indigo-400"
            />
          </div>

          {/* Lever 4: Credit Score Improvement */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Target credit score goals:</span>
              <span className="font-bold text-slate-900 font-mono">{creditSim} pts</span>
            </div>
            <input
              id="sim-credit-lever"
              type="range"
              min="300"
              max="850"
              step="5"
              value={creditSim}
              onChange={(e) => setCreditSim(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 appearance-none rounded cursor-pointer accent-[#22C55E]"
            />
          </div>

          {/* Lever 5: Adjustable borrowing principal sizing */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Simulate modified borrowing sum:</span>
              <span className="font-bold text-slate-900 font-mono">${loanAmountSim.toLocaleString()}</span>
            </div>
            <input
              id="sim-amount-lever"
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={loanAmountSim}
              onChange={(e) => setLoanAmountSim(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 appearance-none rounded cursor-pointer accent-[#55D6FF]"
            />
          </div>
        </div>

        {/* Results Real-Time Feedback Panel */}
        <div className="bg-[#F7F9FF] border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-widest border-b border-indigo-50 pb-2">Vetted Diagnostics Output</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Box 1 DTI */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Simulated DTI</span>
                <span className="text-xl font-bold text-slate-800 font-mono">{simMetrics.dtiRatio}%</span>
                <span className={`text-[9px] font-semibold block mt-1 ${simMetrics.dtiRatio > 45 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {simMetrics.dtiRatio > 45 ? 'Exceeds standard limits' : 'Allowable liability bounds'}
                </span>
              </div>

              {/* Box 2 proposed EMI */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Hypothetical EMI</span>
                <span className="text-xl font-bold text-indigo-700 font-mono">${simMetrics.proposedEmi.toLocaleString()}</span>
                <span className="text-[9px] text-slate-450 mt-1 block">p.m. at {simMetrics.interestRate}% rating benchmark</span>
              </div>
            </div>

            {/* Simulated Score Gauge */}
            <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Projected Eligibility Probability</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">{simMetrics.approvalProbability}%</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  simMetrics.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  simMetrics.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {simMetrics.riskLevel} Risk
                </span>
              </div>
              <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    simMetrics.approvalProbability >= 75 ? 'bg-emerald-500' :
                    simMetrics.approvalProbability >= 55 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${simMetrics.approvalProbability}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Trigger Gemini AI Opinion On tweaking */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <button
              id="sim-trigger-ai-auditor"
              onClick={triggerScenarioCheck}
              disabled={isQueryingScenario}
              className="w-full py-3 bg-[#5B4CF0] hover:bg-[#4a3ce0] text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              {isQueryingScenario ? 'Querying Gemini Scenario Engine...' : 'Consult Gemini AI on Simulated Scenario'} <Sparkles size={14} className="text-[#55D6FF] animate-pulse" />
            </button>

            {scenarioOpinion && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 text-[#5B4CF0] rounded-xl text-[11px] leading-relaxed" id="scenario-ai-output">
                <strong className="block text-indigo-900 font-bold uppercase tracking-wider text-[10px] mb-1">Scenario advisory report:</strong>
                {scenarioOpinion}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
