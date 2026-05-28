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
      limitMultiplier: b.limitMultiplier
    })),
    tenures: rules.tenuresInMonths,
    maxEmiToIncomeRatio: rules.affordability.maxEmiToIncomeRatio,
    baseLimitPercent: rules.eligibility.baseLimitPercent,
    minIncome: rules.eligibility.minIncome,
    minCreditHistoryMonths: rules.eligibility.minCreditHistoryMonths
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
