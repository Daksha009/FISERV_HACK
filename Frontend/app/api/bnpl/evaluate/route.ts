import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Map frontend field names → backend field names
    const backendPayload = {
      monthly_income: body.monthlyIncome,
      credit_history: body.creditHistoryMonths,
      defaults: body.numberOfDefaults,
      product_price: body.productPrice,
    };

    const backendRes = await fetch(`${BACKEND_URL}/api/bnpl/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    const backendData = await backendRes.json();

    // If backend returned a validation error, pass it through
    if (backendData.status === "INVALID_INPUT") {
      return NextResponse.json(backendData, { status: 400 });
    }

    // Transform backend response → frontend BNPLResult shape
    const emiSchedule = backendData.options.map(
      (opt: {
        months: number;
        annualRate: number;
        emi: number;
        emiToIncomeRatio: number;
        affordable: boolean;
        totalPayable: number;
        totalInterest: number;
        totalCostOfCredit: number;
        schedule: Array<{ interest: number }>;
      }) => {
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
      }
    );

    // Find recommended tenure's EMI ratio for the summary
    const recommendedOption = emiSchedule.find(
      (s: { tenure: number }) => s.tenure === backendData.recommendedTenure
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
    console.error("BNPL evaluate proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to connect to BNPL backend. Make sure the backend server is running on port 4000.",
      },
      { status: 502 }
    );
  }
}
