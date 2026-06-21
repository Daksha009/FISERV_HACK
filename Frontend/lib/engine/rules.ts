// ─── Type Definitions ────────────────────────────────────────────────────────

export interface RiskBand {
  grade: "A" | "B" | "C" | "D";
  maxDefaults: number;
  minCreditHistory: number;
  limitMultiplier: number;
  annualRate: number;
  processingFeeRate: number;
  maxProductPrice: number;
}

export interface ScoringWeights {
  incomeStability: number;
  creditDepth: number;
  defaultRecord: number;
  debtBurden: number;
}

export interface RulesConfig {
  affordability: {
    maxEmiToIncomeRatio: number;
  };
  eligibility: {
    baseLimitPercent: number;
    minIncome: number;
    minCreditHistoryMonths: number;
  };
  scoring: {
    weights: ScoringWeights;
    thresholds: {
      approved: number;
      conditional: number;
    };
    incomeStability: {
      idealIncomeToProductRatio: number;
      minIncomeThreshold: number;
    };
    creditDepth: {
      maxMonths: number;
    };
    defaultRecord: {
      baseScore: number;
      penaltyPerDefault: number;
    };
    debtBurden: {
      idealRatio: number;
      maxRatio: number;
    };
  };
  riskBands: RiskBand[];
  tenuresInMonths: number[];
  conditional: {
    rateIncrease: number;
    limitReduction: number;
  };
}

// ─── Rules Configuration ────────────────────────────────────────────────────

const rules: RulesConfig = {
  // ─── Affordability ──────────────────────────────────────────────────────────
  affordability: {
    maxEmiToIncomeRatio: 0.3, // 30% cap
  },

  // ─── Eligibility Thresholds ─────────────────────────────────────────────────
  eligibility: {
    baseLimitPercent: 1.5, // eligible_limit = income × 150% × multiplier
    minIncome: 15000, // ₹15,000 minimum monthly income
    minCreditHistoryMonths: 6, // at least 6 months of credit history
  },

  // ─── Weighted Credit Scoring Model (0-100) ─────────────────────────────────
  // The composite score is a weighted sum of four sub-scores.
  // Each sub-score is normalised to 0-100 before weighting.
  scoring: {
    weights: {
      incomeStability: 0.25, // 25% — income relative to product price & threshold
      creditDepth: 0.25, // 25% — months of credit history (capped at 36)
      defaultRecord: 0.3, // 30% — penalise defaults heavily
      debtBurden: 0.2, // 20% — product_price / annual_income ratio
    },
    // Score-to-decision thresholds
    thresholds: {
      approved: 70, // score ≥ 70 → APPROVED
      conditional: 50, // score 50-69 → CONDITIONAL (higher rate, reduced limit)
      // score < 50 → REJECTED
    },
    // Sub-score parameters
    incomeStability: {
      idealIncomeToProductRatio: 1.5, // income ≥ 1.5× product price → perfect score
      minIncomeThreshold: 15000, // below this gets a penalty
    },
    creditDepth: {
      maxMonths: 36, // 36+ months → full score
    },
    defaultRecord: {
      baseScore: 100, // start at 100
      penaltyPerDefault: 35, // lose 35 points per default
    },
    debtBurden: {
      idealRatio: 0.05, // product_price / annual_income ≤ 5% → perfect
      maxRatio: 0.5, // product_price / annual_income ≥ 50% → zero
    },
  },

  // ─── Risk Bands ─────────────────────────────────────────────────────────────
  riskBands: [
    {
      grade: "A",
      maxDefaults: 0,
      minCreditHistory: 24,
      limitMultiplier: 1.2,
      annualRate: 0.0,
      processingFeeRate: 0.01, // 1%
      maxProductPrice: 500000,
    },
    {
      grade: "B",
      maxDefaults: 0,
      minCreditHistory: 12,
      limitMultiplier: 1.0,
      annualRate: 0.1,
      processingFeeRate: 0.015, // 1.5%
      maxProductPrice: 200000,
    },
    {
      grade: "C",
      maxDefaults: 1,
      minCreditHistory: 6,
      limitMultiplier: 0.85,
      annualRate: 0.14,
      processingFeeRate: 0.02, // 2%
      maxProductPrice: 100000,
    },
    {
      grade: "D",
      maxDefaults: 2,
      minCreditHistory: 0,
      limitMultiplier: 0.7,
      annualRate: 0.18,
      processingFeeRate: 0.025, // 2.5%
      maxProductPrice: 50000,
    },
  ],

  // ─── Available Tenures ──────────────────────────────────────────────────────
  tenuresInMonths: [3, 6, 9, 12],

  // ─── Conditional Approval Adjustments ───────────────────────────────────────
  conditional: {
    rateIncrease: 0.04, // +4% annual rate added for conditional approvals
    limitReduction: 0.8, // limit reduced to 80% of calculated value
  },
};

export default rules;
