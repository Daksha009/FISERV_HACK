import { NextRequest, NextResponse } from "next/server";
import { evaluateBnplEligibility } from "@/lib/engine/bnplEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Map frontend field names → engine field names
    const enginePayload = {
      monthly_income: body.monthlyIncome,
      credit_history: body.creditHistoryMonths,
      defaults: body.numberOfDefaults,
      product_price: body.productPrice,
    };

    const backendData = evaluateBnplEligibility(enginePayload);

    // If engine returned a validation error, pass it through
    if (backendData.status === "INVALID_INPUT") {
      return NextResponse.json(backendData, { status: 400 });
    }

    // Transform engine response → frontend BNPLResult shape
    const emiSchedule = backendData.options.map((opt) => {
      return {
        tenure: opt.months,
        emi: opt.emi,
        annualRate: opt.annualRate,
        interest: opt.totalInterest,
        totalPayable: Math.round(opt.totalPayable),
        totalCostOfCredit: opt.totalCostOfCredit,
        emiToIncomeRatio:
          Math.round(opt.emiToIncomeRatio * 100 * 10) / 10,
        isAffordable: opt.affordable,
      };
    });

    // Find recommended tenure's EMI ratio for the summary
    const recommendedOption = emiSchedule.find(
      (s) => s.tenure === backendData.recommendedTenure
    );
    const bestEMIToIncomeRatio = recommendedOption
      ? recommendedOption.emiToIncomeRatio
      : emiSchedule[emiSchedule.length - 1]?.emiToIncomeRatio || 0;

    const result = {
      status: backendData.status,
      isApproved: backendData.decision.approved,
      eligibleLimit: backendData.eligibility.eligibleLimit,
      productPrice: backendData.eligibility.productPrice,
      riskGrade: backendData.decision.riskGrade,
      recommendedTenure: backendData.recommendedTenure,
      bestEMIToIncomeRatio,
      creditScore: backendData.creditScore,
      processingFee: backendData.financials.processingFee,
      effectiveAnnualRate: backendData.financials.effectiveAnnualRate,
      emiSchedule,
      reasonCodes: backendData.decision.reasonCodes,
      suggestions: backendData.suggestions || [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("BNPL evaluate error:", error);
    return NextResponse.json(
      {
        error: "Failed to evaluate BNPL eligibility. Please try again.",
      },
      { status: 500 }
    );
  }
}
