import { useState } from 'react';
import { 
  IndianRupee, 
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

  // Form State with sensible Indian Rupee defaults
  const [form, setForm] = useState<LoanInput>({
    monthlyIncome: initialValues?.monthlyIncome || 150000,
    existingEmi: initialValues?.existingEmi || 15000,
    monthlyExpenses: initialValues?.monthlyExpenses || 45000,
    savings: initialValues?.savings || 30000,
    creditScore: initialValues?.creditScore || 720,
    employmentType: initialValues?.employmentType || 'salaried',
    experience: initialValues?.experience || 3,
    age: initialValues?.age || 28,
    city: initialValues?.city || 'Mumbai',
    loanType: initialValues?.loanType || 'home',
    loanAmount: initialValues?.loanAmount || 3000000,
    loanTenure: initialValues?.loanTenure || 15,
  });

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

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (form.monthlyIncome <= 0) stepErrors.monthlyIncome = 'Monthly income must be greater than zero.';
      if (form.existingEmi < 0) stepErrors.existingEmi = 'Monthly loan payments cannot be negative.';
      if (form.monthlyExpenses < 0) stepErrors.monthlyExpenses = 'Everyday expenses cannot be negative.';
      if (form.savings < 0) stepErrors.savings = 'Available savings cannot be negative.';
      
      const totalCashflowCommit = form.existingEmi + form.monthlyExpenses;
      if (totalCashflowCommit > form.monthlyIncome) {
        stepErrors.monthlyExpenses = 'Warning: Combined monthly obligations and everyday expenses exceed your incoming cashflow.';
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
        stepErrors.city = 'Please state your residential city.';
      }
    }

    if (step === 3) {
      if (form.loanAmount <= 0) {
        stepErrors.loanAmount = 'Requested loan amount must be greater than ₹0.';
      }
      if (form.loanTenure <= 0 || form.loanTenure > 40) {
        stepErrors.loanTenure = 'Loan payment tenure must fit between 1 and 40 years.';
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
      onSubmitAssessment(form);
    }
  };

  return (
    <div className="max-w-xl mx-auto" id="assessment-panel">

      {/* Multi-step progressive indicator */}
      <div className="mb-8" id="form-progress-indicator">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span>STEP {currentStep} OF 3</span>
          <span className="text-[#5B4CF0]">
            {currentStep === 1 && 'Income & Available Savings'}
            {currentStep === 2 && 'Personal Stability'}
            {currentStep === 3 && 'How Much You Can Comfortably Borrow Specs'}
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

        {/* STEP 1: INCOME & AVAILABLE SAVINGS */}
        {currentStep === 1 && (
          <div className="space-y-5" id="step-1-elements">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <IndianRupee size={18} className="text-[#5B4CF0]" /> Income & Everyday Obligations
              </h2>
              <p className="text-xs text-slate-500">Provide monthly money flows for basic financial health calculations.</p>
            </div>

            {/* Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="monthlyIncome">
                <span>Monthly Income (₹)</span>
                {errors.monthlyIncome && <span className="text-rose-500 text-[10px] normal-case">{errors.monthlyIncome}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  ₹
                </span>
                <input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  placeholder="e.g. 150000"
                  value={form.monthlyIncome || ''}
                  onChange={(e) => updateField('monthlyIncome', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>

            {/* Existing EMIs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="existingEmi">
                <span>Existing Monthly Loan Payments</span>
                {errors.existingEmi && <span className="text-rose-500 text-[10px] normal-case">{errors.existingEmi}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  ₹
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
              <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-relaxed">Car payments, active credit card bills, and other monthly debts.</p>
            </div>

            {/* Monthly Living Expenses */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="monthlyExpenses">
                <span>Rent & Everyday Expenses</span>
                {errors.monthlyExpenses && <span className="text-rose-500 text-[10px] normal-case">{errors.monthlyExpenses}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  ₹
                </span>
                <input
                  id="monthlyExpenses"
                  type="number"
                  min="0"
                  placeholder="e.g. 45000"
                  value={form.monthlyExpenses || ''}
                  onChange={(e) => updateField('monthlyExpenses', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>

            {/* Monthly Liquid Savings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-750 flex justify-between" htmlFor="savings">
                <span>Monthly Surplus / Savings Additions</span>
                {errors.savings && <span className="text-rose-500 text-[10px] normal-case">{errors.savings}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  ₹
                </span>
                <input
                  id="savings"
                  type="number"
                  min="0"
                  placeholder="Monthly savings or surplus cash"
                  value={form.savings || ''}
                  onChange={(e) => updateField('savings', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE & CREDITS */}
        {currentStep === 2 && (
          <div className="space-y-5" id="step-2-elements">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <User size={18} className="text-[#5B4CF0]" /> Profile & Credit Score
              </h2>
              <p className="text-xs text-slate-500">Provide employment details and standard stability indicators.</p>
            </div>

            {/* Credit Score Rating Slider / input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Credit Score</span>
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
                <option value="salaried">Monthly Salaried Professional</option>
                <option value="self_employed">Independent Self-Employed</option>
                <option value="business_owner">Business Owner</option>
                <option value="unemployed">Unemployed / Other</option>
              </select>
            </div>

            {/* Years of Experience / stability */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="experience">
                <span>Professional Work Experience (Years)</span>
                {errors.experience && <span className="text-rose-500 text-[10px] normal-case">{errors.experience}</span>}
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Years of active career"
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
                  placeholder="e.g. Mumbai"
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
                <Briefcase size={18} className="text-[#5B4CF0]" /> Core Loan Specifications
              </h2>
              <p className="text-xs text-slate-500">Input your requested capital configurations.</p>
            </div>

            {/* Loan Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="loanType">
                Loan Category Type
              </label>
              <select
                id="loanType"
                value={form.loanType}
                onChange={(e) => updateField('loanType', e.target.value as LoanType)}
                className="w-full px-3 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
              >
                <option value="home">Real Estate Mortgage (~8.5% interest)</option>
                <option value="personal">Unsecured Personal Loan (~12.0% interest)</option>
                <option value="car">Automobile Loan (~9.5% interest)</option>
                <option value="education">Student Education Loan (~7.0% interest)</option>
                <option value="business">Commercial Business Loan (~14.5% interest)</option>
              </select>
            </div>

            {/* Loan Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="loanAmount">
                <span>Requested Loan Amount (₹)</span>
                {errors.loanAmount && <span className="text-rose-500 text-[10px] normal-case">{errors.loanAmount}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                  ₹
                </span>
                <input
                  id="loanAmount"
                  type="number"
                  min="0"
                  step="50000"
                  placeholder="e.g. 3000000"
                  value={form.loanAmount || ''}
                  onChange={(e) => updateField('loanAmount', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0] transition-colors"
                />
              </div>
            </div>

            {/* Tenure in Years */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between" htmlFor="loanTenure">
                <span>Repayment Tenure (Years)</span>
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
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Usually 15-30 years for home mortgages, and 3-5 years for personal loans.</p>
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
