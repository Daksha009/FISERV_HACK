const express = require("express");
const cors = require("cors");
const { evaluateBnplEligibility } = require("./core/bnplEngine");
const rules = require("./config/rules");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bnpl-eligibility-simulator" });
});

app.get("/api/bnpl/rules", (_req, res) => {
  res.json({
    riskBands: rules.riskBands.map((b) => ({
      grade: b.grade,
      annualRate: b.annualRate,
      limitMultiplier: b.limitMultiplier,
      processingFeeRate: b.processingFeeRate,
      maxProductPrice: b.maxProductPrice
    })),
    tenures: rules.tenuresInMonths,
    maxEmiToIncomeRatio: rules.affordability.maxEmiToIncomeRatio,
    baseLimitPercent: rules.eligibility.baseLimitPercent,
    minIncome: rules.eligibility.minIncome,
    minCreditHistoryMonths: rules.eligibility.minCreditHistoryMonths
  });
});

// New: Explain the scoring model
app.get("/api/bnpl/score-breakdown", (_req, res) => {
  res.json({
    model: "Weighted Credit Scoring Model (0-100)",
    factors: [
      {
        name: "Income Stability",
        weight: rules.scoring.weights.incomeStability,
        description: "Score based on income relative to product price. Penalised if below minimum threshold."
      },
      {
        name: "Credit History Depth",
        weight: rules.scoring.weights.creditDepth,
        description: `Score based on months of credit history, capped at ${rules.scoring.creditDepth.maxMonths} months for maximum.`
      },
      {
        name: "Default Track Record",
        weight: rules.scoring.weights.defaultRecord,
        description: `Starts at ${rules.scoring.defaultRecord.baseScore}, loses ${rules.scoring.defaultRecord.penaltyPerDefault} points per default.`
      },
      {
        name: "Debt Burden Ratio",
        weight: rules.scoring.weights.debtBurden,
        description: "Based on product_price / annual_income ratio. Lower ratio = higher score."
      }
    ],
    thresholds: rules.scoring.thresholds,
    conditionalAdjustments: rules.conditional
  });
});

app.post("/api/bnpl/evaluate", (req, res) => {
  const result = evaluateBnplEligibility(req.body || {});

  if (result.status === "INVALID_INPUT") {
    return res.status(400).json(result);
  }
  return res.json(result);
});

// Only start the server if this file is run directly (not imported for tests)
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`BNPL API running on http://localhost:${port}`);
  });
}

module.exports = app;
