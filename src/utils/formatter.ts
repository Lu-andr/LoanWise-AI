/**
 * Centralised utility for localized Indian Rupee formatting
 * and financial terminology translations to non-jargon, clean terms.
 */

// Formats as Indian Rupee (₹) with Indian digit grouping format
export function formatCurrency(value: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  });
  return '₹' + formatter.format(Math.round(value));
}

// Map of complex financial jargon to simple plain language
export const GLOSSARY = {
  debtToIncome: "Monthly Debt vs Monthly Income",
  emiBurden: "Monthly Loan Payment Load",
  creditUtilization: "Credit Card Usage",
  loanAffordability: "How Much You Can Comfortably Borrow",
  riskAssessment: "Approval Risk",
  liquidity: "Available Savings",
};
