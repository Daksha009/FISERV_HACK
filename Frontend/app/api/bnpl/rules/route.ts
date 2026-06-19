import { NextResponse } from "next/server";
import rules from "@/lib/engine/rules";

export async function GET() {
  return NextResponse.json({
    riskBands: rules.riskBands.map((b) => ({
      grade: b.grade,
      annualRate: b.annualRate,
      limitMultiplier: b.limitMultiplier,
      processingFeeRate: b.processingFeeRate,
      maxProductPrice: b.maxProductPrice,
    })),
    tenures: rules.tenuresInMonths,
    maxEmiToIncomeRatio: rules.affordability.maxEmiToIncomeRatio,
    baseLimitPercent: rules.eligibility.baseLimitPercent,
    minIncome: rules.eligibility.minIncome,
    minCreditHistoryMonths: rules.eligibility.minCreditHistoryMonths,
  });
}
