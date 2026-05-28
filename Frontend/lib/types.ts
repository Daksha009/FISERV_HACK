export interface BNPLInput {
  monthlyIncome: number;
  creditHistoryMonths: number;
  numberOfDefaults: number;
  productPrice: number;
}

export interface EMIScheduleItem {
  tenure: number;
  emi: number;
  annualRate: number;
  interest: number;
  totalPayable: number;
  emiToIncomeRatio: number;
  isAffordable: boolean;
}

export interface BNPLResult {
  isApproved: boolean;
  eligibleLimit: number;
  productPrice: number;
  riskGrade: "A" | "B" | "C" | "D";
  recommendedTenure: number;
  bestEMIToIncomeRatio: number;
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
