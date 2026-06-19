import { NextResponse } from "next/server";
import rules from "@/lib/engine/rules";

export async function GET() {
  return NextResponse.json({
    model: "Weighted Credit Scoring Model (0-100)",
    factors: [
      {
        name: "Income Stability",
        weight: rules.scoring.weights.incomeStability,
        description:
          "Score based on income relative to product price. Penalised if below minimum threshold.",
      },
      {
        name: "Credit History Depth",
        weight: rules.scoring.weights.creditDepth,
        description: `Score based on months of credit history, capped at ${rules.scoring.creditDepth.maxMonths} months for maximum.`,
      },
      {
        name: "Default Track Record",
        weight: rules.scoring.weights.defaultRecord,
        description: `Starts at ${rules.scoring.defaultRecord.baseScore}, loses ${rules.scoring.defaultRecord.penaltyPerDefault} points per default.`,
      },
      {
        name: "Debt Burden Ratio",
        weight: rules.scoring.weights.debtBurden,
        description:
          "Based on product_price / annual_income ratio. Lower ratio = higher score.",
      },
    ],
    thresholds: rules.scoring.thresholds,
    conditionalAdjustments: rules.conditional,
  });
}
