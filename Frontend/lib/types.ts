export interface BNPLInput {
  monthlyIncome: number;
  creditHistoryMonths: number;
  numberOfDefaults: number;
  productPrice: number;
}

export interface CreditScoreBreakdownItem {
  score: number;
  weight: number;
  weighted: number;
}

export interface CreditScoreBreakdown {
  incomeStability: CreditScoreBreakdownItem;
  creditDepth: CreditScoreBreakdownItem;
  defaultRecord: CreditScoreBreakdownItem;
  debtBurden: CreditScoreBreakdownItem;
}

export interface CreditScoreResult {
  composite: number;
  tier: "APPROVED" | "CONDITIONAL" | "REJECTED";
  breakdown: CreditScoreBreakdown;
}

export interface EMIScheduleItem {
  tenure: number;
  emi: number;
  annualRate: number;
  interest: number;
  totalPayable: number;
  totalCostOfCredit: number;
  emiToIncomeRatio: number;
  isAffordable: boolean;
}

export interface BNPLResult {
  status: "APPROVED" | "CONDITIONAL" | "REJECTED";
  isApproved: boolean;
  eligibleLimit: number;
  productPrice: number;
  riskGrade: "A" | "B" | "C" | "D";
  recommendedTenure: number;
  bestEMIToIncomeRatio: number;
  creditScore: CreditScoreResult;
  processingFee: number;
  effectiveAnnualRate: number;
  emiSchedule: EMIScheduleItem[];
  reasonCodes: string[];
  suggestions: string[];
}

export interface EvaluationRecord {
  id: string;
  timestamp: Date;
  input: BNPLInput;
  result: BNPLResult;
}
