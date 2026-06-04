import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  User, 
  MapPin, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  History, 
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { LoanInput, EmploymentType, LoanType } from '../types';

interface AssessmentFormProps {
  initialValues?: Partial<LoanInput>;
  onSubmitAssessment: (values: LoanInput) => void;
}

export default function AssessmentForm({ initialValues, onSubmitAssessment }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [form, setForm] = useState<LoanInput>({
    monthlyIncome: initialValues?.monthlyIncome || 6000,
    existingEmi: initialValues?.existingEmi || 0,
    monthlyExpenses: 2000,
    savings: 1500,
    creditScore: 720,
    employmentType: 'salaried',
    experience: 3,
    age: 28,
    city: 'New York',
    loanType: 'home',
    loanAmount: 180000,
    loanTenure: 15,
  });

  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);

  // Check for auto-saved draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('loanwise_form_draft');
    if (savedDraft && !initialValues) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setForm(parsedDraft);
        setHasRestoredDraft(true);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, [initialValues]);

  // Auto-save form changes to local storage
  useEffect(() => {
    localStorage.setItem('loanwise_form_draft', JSON.stringify(form));
  }, [form]);

  // Handle value modifications
  const updateField = (key: keyof LoanInput, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear errors for this key
    if (errors[key]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('loanwise_form_draft');
    setHasRestoredDraft(false);
    // set to default values
    setForm({
      monthlyIncome: 6000,
      existingEmi: 0,
      monthlyExpenses: 2000,
      savings: 1500,
      creditScore: 720,
      employmentType: 'salaried',
      experience: 3,
      age: 28,
      city: 'New York',
      loanType: 'home',
      loanAmount: 180000,
      loanTenure: 15,
    });
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (form.monthlyIncome <= 0) stepErrors.monthlyIncome = 'Income must be greater than zero.';
      if (form.existingEmi < 0) stepErrors.existingEmi = 'EMI cannot be negative.';
      if (form.monthlyExpenses < 0) stepErrors.monthlyExpenses = 'Expenses cannot be negative.';
      if (form.savings < 0) stepErrors.savings = 'Savings cannot be negative.';
      
      const totalCashflowCommit = form.existingEmi + form.monthlyExpenses;
      if (totalCashflowCommit > form.monthlyIncome) {
        stepErrors.monthlyExpenses = 'Warning: Combined expenses and EMIs exceed monthly gross income.';
      }
    }

    if (step === 2) {
      if (form.creditScore < 300 || form.creditScore > 850) {
        stepErrors.creditScore = 'Credit score must fall between the standard 300 to 850 scale bounds.';
      }
      if (form.age < 18 || form.age > 80) {
        stepErrors.age = 'Applicant age must lie strictly between 18 and 80.';
      }
      if (form.experience < 0) {
        stepErrors.experience = 'Job experience tenure cannot be negative.';
      }
      if (!form.city.trim()) {
        stepErrors.city = 'Please state your metropolitan area/residential city.';
      }
    }

    if (step === 3) {
      if (form.loanAmount <= 0) {
        stepErrors.loanAmount = 'Requested loan principal size must be greater than $0.';
      }
      if (form.loanTenure <= 0 || form.loanTenure > 40) {
        stepErrors.loanTenure = 'Loan amortisation tenure must fit between 1 and 40 years.';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      // Clear draft on successful evaluation
      localStorage.removeItem('loanwise_form_draft');
      onSubmitAssessment(form);
    }
  };

  return (
    <div className="max-w-xl mx-auto" id="assessment-panel">
      {/* Restore Banner */}
      {hasRestoredDraft && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between shadow-xs" id="restore-draft-alert">
          <div className="flex items-center gap-2.5">
            <History size={16} className="text-[#5B4CF0]" />
            <span className="text-xs text-indigo-900 font-medium">Auto-saved draft retrieved automatically from your local browser.</span>
          </div>
          <button 
            id="discard-draft-action"
            onClick={clearDraft}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            Discard Auto-save & Reset
          </button>
        </div>
      )}

      {/* Multi-step progressive indicator */}
      <div className="mb-8" id="form-progress-indicator">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span>STEP {currentStep} OF 3</span>
          <span className="text-[#5B4CF0]">
            {currentStep === 1 && 'Capital Reserves & Margins'}
            {currentStep === 2 && 'Personal Risk Metrics'}
            {currentStep === 3 && 'Borrowing Request Specs'}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-0.5">
          <div className={`h-full transition-all duration-300 rounded-l-full ${currentStep >= 1 ? 'bg-[#5B4CF0] flex-1' : 'bg-slate-200 w-0'}`}></div>
          <div className={`h-full transition-all duration-300 ${currentStep >= 2 ? 'bg-[#5B4CF0] flex-1' : 'bg-slate-200 w-0'}`}></div>
          <div className={`h-full transition-all duration-300 rounded-r-full ${currentStep >= 3 ? 'bg-[#5B4CF0] flex-1' : 'bg-slate-200 w-0'}`}></div>
        </div>
      </div>

      {/* Structured Card */}
      <form onSubmit={handleFormSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">

        {/* STEP 1: CAPITAL RESERVES & INCOME */}
        {currentStep === 1 && (
          <div className="space-y-5" id="step-1-elements">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign size={18} className="text-[#5B4CF0]" /> Income & Liabilities
              </h2>
              <p className="text-xs text-slate-500">Provide monthly money flows for basic liquid calculations.</p>
            </div>

            {/* Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="monthlyIncome">
                <span>Monthly Gross Income (USD)</span>
                {errors.monthlyIncome && <span className="text-rose-500 text-[10px] normal-case">{errors.monthlyIncome}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  $
                </span>
                <input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  placeholder="e.g. 5000"
                  value={form.monthlyIncome || ''}
                  onChange={(e) => updateField('monthlyIncome', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>

            {/* Existing EMIs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="existingEmi">
                <span>Existing EMIs / Active Debt Service</span>
                {errors.existingEmi && <span className="text-rose-500 text-[10px] normal-case">{errors.existingEmi}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  $
                </span>
                <input
                  id="existingEmi"
                  type="number"
                  min="0"
                  placeholder="Enter 0 if none"
                  value={form.existingEmi || ''}
                  onChange={(e) => updateField('existingEmi', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-relaxed">Car loans, active credit cards, student financing burden.</p>
            </div>

            {/* Monthly Living Expenses */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="monthlyExpenses">
                <span>Rent & Everyday Expenses</span>
                {errors.monthlyExpenses && <span className="text-rose-500 text-[10px] normal-case">{errors.monthlyExpenses}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  $
                </span>
                <input
                  id="monthlyExpenses"
                  type="number"
                  min="0"
                  placeholder="e.g. 2000"
                  value={form.monthlyExpenses || ''}
                  onChange={(e) => updateField('monthlyExpenses', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>

            {/* Monthly Liquid Savings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="savings">
                <span>Liquid Cash Savings (Monthly Surplus)</span>
                {errors.savings && <span className="text-rose-500 text-[10px] normal-case">{errors.savings}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  $
                </span>
                <input
                  id="savings"
                  type="number"
                  min="0"
                  placeholder="Monthly savings or cash cushion flow"
                  value={form.savings || ''}
                  onChange={(e) => updateField('savings', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL RISK METRICS */}
        {currentStep === 2 && (
          <div className="space-y-5" id="step-2-elements">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <User size={18} className="text-[#5B4CF0]" /> Profile & Credit Score
              </h2>
              <p className="text-xs text-slate-500">Provide employment and standard financial stability indicators.</p>
            </div>

            {/* Credit Score Rating Slider / input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Equifax/FICO Credit Score</span>
                <span className="px-2.5 py-1 bg-slate-105 rounded-lg text-xs font-mono font-bold text-indigo-700">
                  {form.creditScore} 
                  {form.creditScore >= 750 ? ' (Excellent)' : form.creditScore >= 700 ? ' (Good)' : form.creditScore >= 650 ? ' (Fair)' : ' (Poor)'}
                </span>
              </div>
              <input
                id="creditScore-range"
                type="range"
                min="300"
                max="850"
                step="5"
                value={form.creditScore}
                onChange={(e) => updateField('creditScore', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#5B4CF0]"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                <span>300 (Subprime)</span>
                <span>650 (Prime Entry)</span>
                <span>850 (Superprime)</span>
              </div>
            </div>

            {/* Employment dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="employmentType">
                <span>Employment Type</span>
              </label>
              <select
                id="employmentType"
                value={form.employmentType}
                onChange={(e) => updateField('employmentType', e.target.value as EmploymentType)}
                className="w-full px-3 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
              >
                <option value="salaried">W2 Monthly Salaried</option>
                <option value="self_employed">Independent Self-Employed</option>
                <option value="business_owner">C-Corp/LLC Business Owner</option>
                <option value="unemployed">Unemployed/Retired Surplus</option>
              </select>
            </div>

            {/* Years of Experience / stability */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="experience">
                <span>Professional Tenure (Years of Experience)</span>
                {errors.experience && <span className="text-rose-500 text-[10px] normal-case">{errors.experience}</span>}
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Years of active career tenure"
                value={form.experience || ''}
                onChange={(e) => updateField('experience', Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
              />
            </div>

            {/* Age & City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="age">
                  <span>Age (Years)</span>
                  {errors.age && <span className="text-rose-500 text-[10px] normal-case">{errors.age}</span>}
                </label>
                <input
                  id="age"
                  type="number"
                  min="18"
                  max="85"
                  value={form.age || ''}
                  onChange={(e) => updateField('age', Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="city">
                  <span>Residential City</span>
                  {errors.city && <span className="text-rose-500 text-[10px] normal-case">{errors.city}</span>}
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. San Francisco"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-5 font-medium text-xs rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BORROWING REQUEST SPECS */}
        {currentStep === 3 && (
          <div className="space-y-5" id="step-3-elements">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase size={18} className="text-[#5B4CF0]" /> Core Request Specifications
              </h2>
              <p className="text-xs text-slate-500">Input your requested capital configurations.</p>
            </div>

            {/* Loan Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="loanType">
                Loan Category type
              </label>
              <select
                id="loanType"
                value={form.loanType}
                onChange={(e) => updateField('loanType', e.target.value as LoanType)}
                className="w-full px-3 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
              >
                <option value="home">Real Estate Mortgage (~8.5%)</option>
                <option value="personal">Unsecured Signature Personal Line (~12.0%)</option>
                <option value="car">Automobile Assets Secured (~9.5%)</option>
                <option value="education">Student Professional Tuition (~7.0%)</option>
                <option value="business">Commercial working capital (~14.5%)</option>
              </select>
            </div>

            {/* Loan Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="loanAmount">
                <span>Requested Capital Sum ($ USD)</span>
                {errors.loanAmount && <span className="text-rose-500 text-[10px] normal-case">{errors.loanAmount}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  $
                </span>
                <input
                  id="loanAmount"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="e.g. 150000"
                  value={form.loanAmount || ''}
                  onChange={(e) => updateField('loanAmount', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>

            {/* Tenure in Years */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="loanTenure">
                <span>Tenure Duration (Years)</span>
                {errors.loanTenure && <span className="text-rose-500 text-[10px] normal-case">{errors.loanTenure}</span>}
              </label>
              <input
                id="loanTenure"
                type="number"
                min="1"
                max="40"
                value={form.loanTenure || ''}
                onChange={(e) => updateField('loanTenure', Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
              />
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Usually 15-30 years for mortgages, and 3-5 years for personal debts.</p>
            </div>
          </div>
        )}

        {/* Buttons / Progression Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-50" id="form-actions-container">
          {currentStep > 1 && (
            <button
              type="button"
              id="btn-step-back"
              onClick={handlePrev}
              className="flex-1 py-3 text-slate-600 hover:bg-slate-105 border border-slate-200 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              id="btn-step-next"
              onClick={handleNext}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              Next Step <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              id="btn-step-submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#5B4CF0] to-[#7A6FFF] hover:from-[#493cd8] hover:to-[#695deb] text-white text-xs font-extrabold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
            >
              Analyze Loan Eligibility <Sparkles size={14} className="text-[#55D6FF] animate-pulse" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
