import { LoanInput, CalculationMetrics, CreditRating, RiskLevel, LoanType } from '../types';

export const INTEREST_RATES: Record<LoanType, number> = {
  home: 8.5,       // 8.5%
  personal: 12.0,  // 12.0%
  car: 9.5,        // 9.5%
  education: 7.0,  // 7.0%
  business: 14.5,  // 14.5%
};

/**
 * Calculates the Equated Monthly Installment (EMI) using standard amortisation math.
 */
export function calculateEmi(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  const monthlyRate = (annualRate / 12) / 100;
  const numMonths = years * 12;

  if (monthlyRate === 0) {
    return principal / numMonths;
  }

  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / 
              (Math.pow(1 + monthlyRate, numMonths) - 1);
  
  return Number(emi.toFixed(2));
}

/**
 * Calculates the maximum loan principal a user can afford based on standard debt ratio restrictions.
 */
export function calculateMaxAffordableLoan(monthlyIncome: number, existingEmi: number, annualRate: number, years: number): number {
  const maxAllowableDti = 0.45; // 45% maximum total debt-to-income ratio limit
  const maxAllowableEmi = Math.max(0, (monthlyIncome * maxAllowableDti) - existingEmi);
  
  if (maxAllowableEmi <= 0 || years <= 0) return 0;
  
  const monthlyRate = (annualRate / 12) / 100;
  const numMonths = years * 12;
  
  if (monthlyRate === 0) {
    return maxAllowableEmi * numMonths;
  }
  
  // P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
  const maxPrincipal = maxAllowableEmi * (Math.pow(1 + monthlyRate, numMonths) - 1) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, numMonths));
                       
  return Math.round(maxPrincipal);
}

/**
 * Performs full evaluation of the user's loan request.
 */
export function evaluateLoanAssessment(input: LoanInput): CalculationMetrics {
  const interestRate = INTEREST_RATES[input.loanType] || 10.0;
  const proposedEmi = calculateEmi(input.loanAmount, interestRate, input.loanTenure);
  
  // Ratios
  const totalMonthlyDebt = input.existingEmi + proposedEmi;
  const dtiRatio = Number(((totalMonthlyDebt / input.monthlyIncome) * 100).toFixed(2));
  const emiToIncomeRatio = Number(((proposedEmi / input.monthlyIncome) * 100).toFixed(2));
  const savingsRatio = Number(((input.savings / input.monthlyIncome) * 100).toFixed(2));
  
  const disposableIncome = Math.max(0, input.monthlyIncome - input.existingEmi - input.monthlyExpenses);
  const maxAffordableLoan = calculateMaxAffordableLoan(input.monthlyIncome, input.existingEmi, interestRate, input.loanTenure);
  
  // Ratings
  let creditRating: CreditRating = 'Poor';
  if (input.creditScore >= 750) creditRating = 'Excellent';
  else if (input.creditScore >= 700) creditRating = 'Good';
  else if (input.creditScore >= 650) creditRating = 'Fair';
  
  // Scoring points for weights
  
  // 1. Credit Score Points (40% Weight)
  let creditPoints = 10;
  if (input.creditScore >= 780) creditPoints = 100;
  else if (input.creditScore >= 740) creditPoints = 90;
  else if (input.creditScore >= 700) creditPoints = 75;
  else if (input.creditScore >= 650) creditPoints = 50;
  else if (input.creditScore >= 600) creditPoints = 30;
  
  // 2. DTI Ratio Points (30% Weight)
  let debtPoints = 10;
  if (dtiRatio <= 25) debtPoints = 100;
  else if (dtiRatio <= 35) debtPoints = 85;
  else if (dtiRatio <= 45) debtPoints = 65;
  else if (dtiRatio <= 55) debtPoints = 40;
  else if (dtiRatio <= 65) debtPoints = 15;
  else debtPoints = 0;
  
  // 3. Savings Health Points (15% Weight)
  let savingsPoints = 10;
  if (savingsRatio >= 30) savingsPoints = 100;
  else if (savingsRatio >= 20) savingsPoints = 85;
  else if (savingsRatio >= 10) savingsPoints = 60;
  else if (savingsRatio >= 5) savingsPoints = 35;
  
  // 4. Stability Points (15% Weight) - Job Stability & Income source
  let stabilityPoints = 40;
  if (input.employmentType === 'unemployed') {
    stabilityPoints = 5;
  } else {
    // base points on experience and age
    const experienceFactor = Math.min(100, input.experience * 15);
    const ageFactor = input.age >= 23 && input.age <= 55 ? 100 : (input.age > 55 ? 70 : 50);
    const jobMultiplier = input.employmentType === 'salaried' ? 1.0 : 0.85;
    
    stabilityPoints = Math.round(((experienceFactor * 0.6) + (ageFactor * 0.4)) * jobMultiplier);
  }
  
  // Combine weighted scoring
  let score = (creditPoints * 0.40) + (debtPoints * 0.30) + (savingsPoints * 0.15) + (stabilityPoints * 0.15);
  
  // Add quick modifiers & sanity checks
  if (input.employmentType === 'unemployed') {
    score = score * 0.2; // Unemployed individuals have extremely low approval rates
  }
  
  if (input.creditScore < 500) {
    score = Math.min(score, 15); // Critical sub-prime credit
  }
  
  if (dtiRatio > 70) {
    score = Math.min(score, 20); // Debt distress
  }
  
  const approvalProbability = Math.min(100, Math.max(0, Math.round(score)));
  
  // Determine Risk Category
  let riskLevel: RiskLevel = 'Critical';
  if (approvalProbability >= 75) riskLevel = 'Low';
  else if (approvalProbability >= 55) riskLevel = 'Moderate';
  else if (approvalProbability >= 35) riskLevel = 'High';
  
  return {
    proposedEmi,
    interestRate,
    dtiRatio,
    emiToIncomeRatio,
    savingsRatio,
    disposableIncome,
    maxAffordableLoan,
    creditRating,
    approvalProbability,
    riskLevel,
    debtPoints,
    creditPoints,
    savingsPoints,
    stabilityPoints,
  };
}
