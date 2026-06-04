export type EmploymentType = 'salaried' | 'self_employed' | 'business_owner' | 'unemployed';
export type LoanType = 'home' | 'personal' | 'car' | 'education' | 'business';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type CreditRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface LoanInput {
  monthlyIncome: number;
  existingEmi: number;
  monthlyExpenses: number;
  savings: number;
  creditScore: number;
  employmentType: EmploymentType;
  experience: number;
  age: number;
  city: string;
  loanType: LoanType;
  loanAmount: number;
  loanTenure: number; // in years
}

export interface CalculationMetrics {
  proposedEmi: number;
  interestRate: number;
  dtiRatio: number; // Debt-to-income (including proposed)
  emiToIncomeRatio: number; // Proposed EMI as % of income
  savingsRatio: number; // savings as % of income
  disposableIncome: number;
  maxAffordableLoan: number;
  creditRating: CreditRating;
  approvalProbability: number; // 0 to 100
  riskLevel: RiskLevel;
  debtPoints: number;
  creditPoints: number;
  savingsPoints: number;
  stabilityPoints: number;
}

export interface AssessmentRecord {
  id: string;
  date: string;
  input: LoanInput;
  metrics: CalculationMetrics;
  aiAdvice?: {
    summary: string;
    reasons: string[];
    recommendations: string[];
    improvements: string[];
    alternatives: string[];
  };
}

export interface UserProfile {
  name: string;
  city: string;
  currency: string;
  themeMode: 'futuristic-glass' | 'midnight-gold' | 'neon-slate';
}
