const rules = require("../config/rules");

function round2(n) {
  return Math.round(n * 100) / 100;
}

function pickRiskBand({ creditHistory, defaults }) {
  for (const band of rules.riskBands) {
    if (defaults <= band.maxDefaults && creditHistory >= band.minCreditHistory) {
      return band;
    }
  }
  return rules.riskBands[rules.riskBands.length - 1];
}

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

function generateSchedule(principal, months, annualRate) {
  const emi = reducingBalanceEmi(principal, months, annualRate);
  let balance = round2(principal);
  const monthlyRate = monthlyRateFromAnnual(annualRate);
  const rows = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = round2(balance * monthlyRate);
    let principalPaid = round2(emi - interest);

    if (month === months) {
      principalPaid = balance;
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

  const riskBand = pickRiskBand({
    creditHistory: input.credit_history,
    defaults: input.defaults
  });

  const baseLimit = input.monthly_income * rules.eligibility.baseLimitPercent;
  const eligibleLimit = round2(baseLimit * riskBand.limitMultiplier);

  const approvedByLimit = input.product_price <= eligibleLimit;
  if (!approvedByLimit) {
    reasonCodes.push("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT");
  }

  const options = rules.tenuresInMonths.map((months) => {
    const schedule = generateSchedule(input.product_price, months, riskBand.annualRate);
    const emi = schedule[0].emi;
    const emiToIncomeRatio = round2(emi / input.monthly_income);
    const affordable = emiToIncomeRatio <= rules.affordability.maxEmiToIncomeRatio;

    return {
      months,
      annualRate: riskBand.annualRate,
      emi,
      emiToIncomeRatio,
      affordable,
      schedule
    };
  });

  const hasAffordableOption = options.some((o) => o.affordable);
  if (!hasAffordableOption) {
    reasonCodes.push("EMI_NOT_AFFORDABLE_FOR_ANY_TENURE");
  }

  const approved = reasonCodes.length === 0;

  // Determine recommended tenure (shortest affordable option = lowest total interest)
  const affordableOptions = options.filter((o) => o.affordable);
  const recommendedTenure = affordableOptions.length > 0
    ? affordableOptions[0].months
    : options[options.length - 1].months;

  // Generate actionable suggestions
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
    if (riskBand.annualRate === 0) {
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

  return {
    status: approved ? "APPROVED" : "REJECTED",
    decision: {
      approved,
      riskGrade: riskBand.grade,
      reasonCodes
    },
    eligibility: {
      eligibleLimit,
      productPrice: input.product_price
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
  generateSchedule
};
