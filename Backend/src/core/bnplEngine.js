const rules = require("../config/rules");

// ─── Utilities ──────────────────────────────────────────────────────────────────

function round2(n) {
  return Math.round(n * 100) / 100;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ─── Risk Band Selection ────────────────────────────────────────────────────────

function pickRiskBand({ creditHistory, defaults }) {
  for (const band of rules.riskBands) {
    if (defaults <= band.maxDefaults && creditHistory >= band.minCreditHistory) {
      return band;
    }
  }
  return rules.riskBands[rules.riskBands.length - 1];
}

// ─── EMI Calculation (Reducing Balance Method) ──────────────────────────────────
//
// Formula:  EMI = P × r × (1+r)^n / ((1+r)^n − 1)
//   P = principal, r = monthly rate, n = number of months
// When r = 0:  EMI = P / n  (simple flat split)

function monthlyRateFromAnnual(annualRate) {
  return annualRate / 12;
}

function reducingBalanceEmi(principal, months, annualRate) {
  const monthlyRate = monthlyRateFromAnnual(annualRate);
  if (monthlyRate === 0) {
    return round2(principal / months);
  }
  const factor = Math.pow(1 + monthlyRate, months);
  return round2((principal * monthlyRate * factor) / (factor - 1));
}

// ─── Amortisation Schedule ──────────────────────────────────────────────────────
//
// For each month:
//   interest_i  = balance_{i-1} × monthly_rate
//   principal_i = EMI − interest_i
//   balance_i   = balance_{i-1} − principal_i
// Last month adjusts principal to clear remaining balance exactly.

function generateSchedule(principal, months, annualRate) {
  const emi = reducingBalanceEmi(principal, months, annualRate);
  let balance = round2(principal);
  const monthlyRate = monthlyRateFromAnnual(annualRate);
  const rows = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = round2(balance * monthlyRate);
    let principalPaid = round2(emi - interest);

    if (month === months) {
      principalPaid = balance; // clear exact remaining balance
    }

    balance = round2(balance - principalPaid);
    rows.push({
      month,
      emi,
      principal: principalPaid,
      interest,
      balance: balance < 0 ? 0 : balance
    });
  }

  return rows;
}

// ─── Input Validation ───────────────────────────────────────────────────────────

function validateInput(input) {
  const errors = [];
  const fields = ["monthly_income", "credit_history", "defaults", "product_price"];

  for (const field of fields) {
    if (input[field] === undefined || input[field] === null || input[field] === "") {
      errors.push(`${field} is required`);
    }
  }

  if (Number(input.monthly_income) <= 0) errors.push("monthly_income must be > 0");
  if (Number(input.product_price) <= 0) errors.push("product_price must be > 0");
  if (Number(input.credit_history) < 0) errors.push("credit_history must be >= 0");
  if (Number(input.defaults) < 0) errors.push("defaults must be >= 0");

  return errors;
}

// ─── Weighted Credit Scoring Model (0-100) ──────────────────────────────────────
//
// Composite Score = Σ (weight_i × sub_score_i)
//
// Sub-scores (each 0-100):
//
// 1. Income Stability (25%)
//    ratio = monthly_income / product_price
//    score = clamp((ratio / idealRatio) × 100, 0, 100)
//    Penalty: if income < minThreshold → score × 0.5
//
// 2. Credit History Depth (25%)
//    score = clamp((credit_months / maxMonths) × 100, 0, 100)
//
// 3. Default Track Record (30%)
//    score = clamp(baseScore − (defaults × penaltyPerDefault), 0, 100)
//
// 4. Debt Burden Ratio (20%)
//    ratio = product_price / (monthly_income × 12)
//    score = clamp((1 − ratio / maxRatio) × 100, 0, 100)

function calculateCreditScore(input) {
  const { weights, incomeStability, creditDepth, defaultRecord, debtBurden } = rules.scoring;

  // 1. Income Stability Score
  const incomeToProductRatio = input.monthly_income / Math.max(input.product_price, 1);
  let incomeScore = clamp(
    (incomeToProductRatio / incomeStability.idealIncomeToProductRatio) * 100,
    0,
    100
  );
  if (input.monthly_income < incomeStability.minIncomeThreshold) {
    incomeScore *= 0.5; // heavy penalty for below-threshold income
  }
  incomeScore = round2(incomeScore);

  // 2. Credit History Depth Score
  const creditScore = round2(
    clamp((input.credit_history / creditDepth.maxMonths) * 100, 0, 100)
  );

  // 3. Default Track Record Score
  const defaultScore = round2(
    clamp(defaultRecord.baseScore - input.defaults * defaultRecord.penaltyPerDefault, 0, 100)
  );

  // 4. Debt Burden Ratio Score
  const annualIncome = input.monthly_income * 12;
  const debtRatio = input.product_price / Math.max(annualIncome, 1);
  const burdenScore = round2(
    clamp((1 - debtRatio / debtBurden.maxRatio) * 100, 0, 100)
  );

  // Composite weighted score
  const compositeScore = round2(
    incomeScore * weights.incomeStability +
    creditScore * weights.creditDepth +
    defaultScore * weights.defaultRecord +
    burdenScore * weights.debtBurden
  );

  return {
    composite: clamp(compositeScore, 0, 100),
    breakdown: {
      incomeStability: { score: incomeScore, weight: weights.incomeStability, weighted: round2(incomeScore * weights.incomeStability) },
      creditDepth: { score: creditScore, weight: weights.creditDepth, weighted: round2(creditScore * weights.creditDepth) },
      defaultRecord: { score: defaultScore, weight: weights.defaultRecord, weighted: round2(defaultScore * weights.defaultRecord) },
      debtBurden: { score: burdenScore, weight: weights.debtBurden, weighted: round2(burdenScore * weights.debtBurden) }
    }
  };
}

// ─── Determine Approval Tier ────────────────────────────────────────────────────

function getApprovalTier(compositeScore) {
  const { thresholds } = rules.scoring;
  if (compositeScore >= thresholds.approved) return "APPROVED";
  if (compositeScore >= thresholds.conditional) return "CONDITIONAL";
  return "REJECTED";
}

// ─── Processing Fee ─────────────────────────────────────────────────────────────
//
// processingFee = product_price × feeRate (based on risk band)

function calculateProcessingFee(productPrice, riskBand) {
  return round2(productPrice * riskBand.processingFeeRate);
}

// ─── Main Evaluation Function ───────────────────────────────────────────────────

function evaluateBnplEligibility(rawInput) {
  const input = {
    monthly_income: Number(rawInput.monthly_income),
    credit_history: Number(rawInput.credit_history),
    defaults: Number(rawInput.defaults),
    product_price: Number(rawInput.product_price)
  };

  const validationErrors = validateInput(input);
  if (validationErrors.length) {
    return {
      status: "INVALID_INPUT",
      errors: validationErrors
    };
  }

  // ── Step 1: Calculate Credit Score ──
  const creditScoreResult = calculateCreditScore(input);
  const approvalTier = getApprovalTier(creditScoreResult.composite);

  // ── Step 2: Determine Risk Band ──
  const riskBand = pickRiskBand({
    creditHistory: input.credit_history,
    defaults: input.defaults
  });

  // ── Step 3: Collect Reason Codes ──
  const reasonCodes = [];
  if (input.monthly_income < rules.eligibility.minIncome) {
    reasonCodes.push("LOW_INCOME");
  }
  if (input.credit_history < rules.eligibility.minCreditHistoryMonths) {
    reasonCodes.push("THIN_CREDIT_HISTORY");
  }
  if (input.defaults > 2) {
    reasonCodes.push("EXCESSIVE_DEFAULTS");
  }

  // ── Step 4: Calculate Eligible Limit ──
  let baseLimit = input.monthly_income * rules.eligibility.baseLimitPercent;
  let eligibleLimit = round2(baseLimit * riskBand.limitMultiplier);

  // For CONDITIONAL tier, reduce the limit
  let effectiveRate = riskBand.annualRate;
  if (approvalTier === "CONDITIONAL") {
    eligibleLimit = round2(eligibleLimit * rules.conditional.limitReduction);
    effectiveRate = round2(riskBand.annualRate + rules.conditional.rateIncrease);
  }

  // ── Step 5: Product Price Checks ──
  const approvedByLimit = input.product_price <= eligibleLimit;
  if (!approvedByLimit) {
    reasonCodes.push("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT");
  }

  if (input.product_price > riskBand.maxProductPrice) {
    reasonCodes.push("PRODUCT_EXCEEDS_BAND_CAP");
  }

  // ── Step 6: Processing Fee ──
  const processingFee = calculateProcessingFee(input.product_price, riskBand);

  // ── Step 7: Generate EMI Options ──
  const options = rules.tenuresInMonths.map((months) => {
    const schedule = generateSchedule(input.product_price, months, effectiveRate);
    const emi = schedule[0].emi;
    const emiToIncomeRatio = round2(emi / input.monthly_income);
    const affordable = emiToIncomeRatio <= rules.affordability.maxEmiToIncomeRatio;
    const totalPayable = round2(emi * months);
    const totalInterest = round2(totalPayable - input.product_price);
    const totalCostOfCredit = round2(totalPayable + processingFee);

    return {
      months,
      annualRate: effectiveRate,
      emi,
      emiToIncomeRatio,
      affordable,
      totalPayable,
      totalInterest,
      totalCostOfCredit,
      schedule
    };
  });

  // ── Step 8: Affordability Check ──
  const hasAffordableOption = options.some((o) => o.affordable);
  if (!hasAffordableOption) {
    reasonCodes.push("EMI_NOT_AFFORDABLE_FOR_ANY_TENURE");
  }

  // ── Step 9: Final Decision ──
  // APPROVED tier: pass if no rejection reason codes
  // CONDITIONAL tier: pass if no hard rejection codes (low income, excessive defaults still block)
  // REJECTED tier: always reject
  const hardRejectCodes = ["LOW_INCOME", "EXCESSIVE_DEFAULTS", "EMI_NOT_AFFORDABLE_FOR_ANY_TENURE"];
  const hasHardReject = reasonCodes.some((c) => hardRejectCodes.includes(c));

  let finalStatus;
  if (approvalTier === "REJECTED" || hasHardReject) {
    finalStatus = "REJECTED";
  } else if (approvalTier === "CONDITIONAL") {
    // Conditional can still be blocked by product exceeding limit
    finalStatus = reasonCodes.includes("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT")
      ? "REJECTED"
      : "CONDITIONAL";
  } else {
    // APPROVED tier
    finalStatus = reasonCodes.length === 0 ? "APPROVED" : "REJECTED";
  }

  const approved = finalStatus === "APPROVED" || finalStatus === "CONDITIONAL";

  // ── Step 10: Recommended Tenure ──
  const affordableOptions = options.filter((o) => o.affordable);
  const recommendedTenure = affordableOptions.length > 0
    ? affordableOptions[0].months // shortest affordable = least interest
    : options[options.length - 1].months;

  // ── Step 11: Suggestions ──
  const suggestions = [];
  if (!approved) {
    if (reasonCodes.includes("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT")) {
      const downPayment = round2(input.product_price - eligibleLimit);
      suggestions.push(
        `Consider a down payment of ₹${downPayment.toLocaleString("en-IN")} to bring the financed amount within your eligible limit of ₹${eligibleLimit.toLocaleString("en-IN")}.`
      );
    }
    if (reasonCodes.includes("LOW_INCOME")) {
      suggestions.push(
        `Your income of ₹${input.monthly_income.toLocaleString("en-IN")} is below the minimum threshold of ₹${rules.eligibility.minIncome.toLocaleString("en-IN")}. Consider applying after an income increase.`
      );
    }
    if (reasonCodes.includes("THIN_CREDIT_HISTORY")) {
      suggestions.push(
        `Build at least ${rules.eligibility.minCreditHistoryMonths} months of credit history to improve your eligibility.`
      );
    }
    if (reasonCodes.includes("EXCESSIVE_DEFAULTS")) {
      suggestions.push(
        "Clear existing defaults and maintain a clean repayment record to improve your credit profile."
      );
    }
    if (reasonCodes.includes("EMI_NOT_AFFORDABLE_FOR_ANY_TENURE")) {
      suggestions.push(
        `Choose a lower-priced product or wait until your income supports the EMI-to-income ratio cap of ${(rules.affordability.maxEmiToIncomeRatio * 100)}%.`
      );
    }
  } else {
    if (finalStatus === "CONDITIONAL") {
      suggestions.push(
        `Your application is conditionally approved. A rate increase of ${(rules.conditional.rateIncrease * 100)}% has been applied. Improve your credit score to unlock better rates.`
      );
    }
    if (affordableOptions.length > 0 && affordableOptions.length < options.length) {
      suggestions.push(
        `Choose the ${recommendedTenure}-month tenure to keep your EMI affordable while minimizing interest.`
      );
    }
    if (riskBand.grade !== "A") {
      suggestions.push(
        "Maintain timely payments to improve your risk grade and unlock lower interest rates."
      );
    }
    if (effectiveRate === 0) {
      suggestions.push(
        "You qualify for 0% interest — a no-cost EMI! Take advantage of this offer."
      );
    }
    if (eligibleLimit > input.product_price * 1.5) {
      suggestions.push(
        "You have significant credit headroom. Your eligible limit is well above the product price."
      );
    }
  }

  // ── Build Response ──
  return {
    status: finalStatus,
    decision: {
      approved,
      riskGrade: riskBand.grade,
      reasonCodes
    },
    creditScore: {
      composite: creditScoreResult.composite,
      tier: approvalTier,
      breakdown: creditScoreResult.breakdown
    },
    eligibility: {
      eligibleLimit,
      productPrice: input.product_price
    },
    financials: {
      processingFee,
      effectiveAnnualRate: effectiveRate
    },
    constraints: {
      maxEmiToIncomeRatio: rules.affordability.maxEmiToIncomeRatio
    },
    recommendedTenure,
    suggestions,
    options
  };
}

module.exports = {
  evaluateBnplEligibility,
  reducingBalanceEmi,
  generateSchedule,
  calculateCreditScore
};
