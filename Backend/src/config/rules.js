module.exports = {
  affordability: {
    maxEmiToIncomeRatio: 0.3
  },
  eligibility: {
    baseLimitPercent: 0.25,
    minIncome: 15000,
    minCreditHistoryMonths: 6
  },
  riskBands: [
    { grade: "A", maxDefaults: 0, minCreditHistory: 24, limitMultiplier: 1.2, annualRate: 0.0 },
    { grade: "B", maxDefaults: 0, minCreditHistory: 12, limitMultiplier: 1.0, annualRate: 0.1 },
    { grade: "C", maxDefaults: 1, minCreditHistory: 6, limitMultiplier: 0.85, annualRate: 0.14 },
    { grade: "D", maxDefaults: 2, minCreditHistory: 0, limitMultiplier: 0.7, annualRate: 0.18 }
  ],
  tenuresInMonths: [3, 6, 9, 12]
};
