const assert = require("node:assert/strict");
const { evaluateBnplEligibility, reducingBalanceEmi, generateSchedule } = require("../src/core/bnplEngine");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

function suite(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// ─── RISK BAND A: Grade A (0 defaults, 24+ months credit, 0% rate) ──────────

suite("Risk Band A — Excellent Profile", () => {
  test("should APPROVE with Grade A for strong profile and eligible product", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    assert.equal(result.status, "APPROVED");
    assert.equal(result.decision.approved, true);
    assert.equal(result.decision.riskGrade, "A");
    // Eligible limit: 80000 * 0.25 * 1.2 = 24000
    assert.equal(result.eligibility.eligibleLimit, 24000);
    assert.equal(result.decision.reasonCodes.length, 0);
  });

  test("should have 0% annual rate for Grade A", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    result.options.forEach((option) => {
      assert.equal(option.annualRate, 0.0);
    });
  });

  test("should suggest no-cost EMI for Grade A", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    assert.ok(result.suggestions.some((s) => s.includes("0% interest")));
  });
});

// ─── RISK BAND B: Grade B (0 defaults, 12-23 months credit, 10% rate) ───────

suite("Risk Band B — Good Profile", () => {
  test("should REJECT when product exceeds eligible limit for Grade B", () => {
    // Eligible limit: 40000 * 0.25 * 1.0 = 10000, product = 12000 > 10000
    const result = evaluateBnplEligibility({
      monthly_income: 40000,
      credit_history: 18,
      defaults: 0,
      product_price: 12000
    });
    assert.equal(result.status, "REJECTED");
    assert.equal(result.decision.approved, false);
    assert.equal(result.decision.riskGrade, "B");
    assert.ok(result.decision.reasonCodes.includes("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT"));
  });

  test("should APPROVE Grade B when product is within limit", () => {
    // Eligible limit: 40000 * 0.25 * 1.0 = 10000, product = 8000 <= 10000
    const result = evaluateBnplEligibility({
      monthly_income: 40000,
      credit_history: 18,
      defaults: 0,
      product_price: 8000
    });
    assert.equal(result.status, "APPROVED");
    assert.equal(result.decision.riskGrade, "B");
    assert.equal(result.decision.reasonCodes.length, 0);
  });

  test("should have 10% annual rate for Grade B", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 40000,
      credit_history: 18,
      defaults: 0,
      product_price: 8000
    });
    result.options.forEach((option) => {
      assert.equal(option.annualRate, 0.1);
    });
  });
});

// ─── RISK BAND C: Grade C (1 default, 6+ months credit, 14% rate) ───────────

suite("Risk Band C — Fair Profile", () => {
  test("should APPROVE Grade C when within limit and affordable", () => {
    // Eligible limit: 50000 * 0.25 * 0.85 = 10625, product = 8000
    const result = evaluateBnplEligibility({
      monthly_income: 50000,
      credit_history: 10,
      defaults: 1,
      product_price: 8000
    });
    assert.equal(result.status, "APPROVED");
    assert.equal(result.decision.riskGrade, "C");
  });

  test("should have 14% annual rate for Grade C", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 50000,
      credit_history: 10,
      defaults: 1,
      product_price: 8000
    });
    result.options.forEach((option) => {
      assert.equal(option.annualRate, 0.14);
    });
  });
});

// ─── RISK BAND D: Grade D (2 defaults, any credit history, 18% rate) ────────

suite("Risk Band D — High Risk Profile", () => {
  test("should assign Grade D for 2 defaults", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 30000,
      credit_history: 6,
      defaults: 2,
      product_price: 3000
    });
    assert.equal(result.decision.riskGrade, "D");
    // Eligible limit: 30000 * 0.25 * 0.7 = 5250, product = 3000
    assert.equal(result.eligibility.eligibleLimit, 5250);
  });

  test("should have 18% annual rate for Grade D", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 30000,
      credit_history: 6,
      defaults: 2,
      product_price: 3000
    });
    result.options.forEach((option) => {
      assert.equal(option.annualRate, 0.18);
    });
  });
});

// ─── REJECTION SCENARIOS ─────────────────────────────────────────────────────

suite("Rejection Scenarios", () => {
  test("should reject for LOW_INCOME when income < 15000", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 10000,
      credit_history: 24,
      defaults: 0,
      product_price: 2000
    });
    assert.equal(result.status, "REJECTED");
    assert.ok(result.decision.reasonCodes.includes("LOW_INCOME"));
  });

  test("should reject for THIN_CREDIT_HISTORY when credit < 6 months", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 50000,
      credit_history: 3,
      defaults: 0,
      product_price: 5000
    });
    assert.equal(result.status, "REJECTED");
    assert.ok(result.decision.reasonCodes.includes("THIN_CREDIT_HISTORY"));
  });

  test("should reject for EXCESSIVE_DEFAULTS when defaults > 2", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 50000,
      credit_history: 24,
      defaults: 3,
      product_price: 5000
    });
    assert.equal(result.status, "REJECTED");
    assert.ok(result.decision.reasonCodes.includes("EXCESSIVE_DEFAULTS"));
  });

  test("should accumulate multiple reason codes", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 10000,
      credit_history: 3,
      defaults: 5,
      product_price: 50000
    });
    assert.equal(result.status, "REJECTED");
    assert.ok(result.decision.reasonCodes.includes("LOW_INCOME"));
    assert.ok(result.decision.reasonCodes.includes("THIN_CREDIT_HISTORY"));
    assert.ok(result.decision.reasonCodes.includes("EXCESSIVE_DEFAULTS"));
    assert.ok(result.decision.reasonCodes.includes("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT"));
  });
});

// ─── INVALID INPUT ───────────────────────────────────────────────────────────

suite("Invalid Input Handling", () => {
  test("should return INVALID_INPUT for zero/negative values", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 0,
      credit_history: -2,
      defaults: -1,
      product_price: 0
    });
    assert.equal(result.status, "INVALID_INPUT");
    assert.ok(result.errors.length >= 3);
  });

  test("should return INVALID_INPUT for empty string fields", () => {
    const result = evaluateBnplEligibility({
      monthly_income: "",
      credit_history: "",
      defaults: "",
      product_price: ""
    });
    assert.equal(result.status, "INVALID_INPUT");
    assert.ok(result.errors.length >= 2);
    assert.ok(result.errors.some((e) => e.includes("monthly_income")));
    assert.ok(result.errors.some((e) => e.includes("product_price")));
  });
});

// ─── EMI SCHEDULE & AFFORDABILITY ────────────────────────────────────────────

suite("EMI Schedule & Affordability", () => {
  test("should generate 4 tenure options (3, 6, 9, 12 months)", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    assert.equal(result.options.length, 4);
    assert.deepEqual(result.options.map((o) => o.months), [3, 6, 9, 12]);
  });

  test("should mark options as affordable when EMI/income <= 30%", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    // With 80k income and 12k product at 0%, all should be affordable
    result.options.forEach((option) => {
      assert.equal(option.affordable, true);
    });
  });

  test("should have correct EMI for 0% interest (flat split)", () => {
    const emi = reducingBalanceEmi(12000, 3, 0);
    assert.equal(emi, 4000); // 12000 / 3
  });

  test("should include per-month schedule with principal/interest breakdown", () => {
    const schedule = generateSchedule(12000, 3, 0.12);
    assert.equal(schedule.length, 3);
    schedule.forEach((row) => {
      assert.ok(row.month);
      assert.ok(row.emi > 0);
      assert.ok(row.principal !== undefined);
      assert.ok(row.interest !== undefined);
      assert.ok(row.balance !== undefined);
    });
    // Final balance should be 0
    assert.equal(schedule[2].balance, 0);
  });

  test("should set recommendedTenure to shortest affordable option", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    // All options affordable at 0% rate with 80k income → shortest = 3 months
    assert.equal(result.recommendedTenure, 3);
  });
});

// ─── SUGGESTIONS ─────────────────────────────────────────────────────────────

suite("Suggestions Generation", () => {
  test("should suggest down payment when product exceeds limit", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 40000,
      credit_history: 18,
      defaults: 0,
      product_price: 12000
    });
    assert.ok(result.suggestions.some((s) => s.includes("down payment")));
  });

  test("should suggest credit building for thin history", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 50000,
      credit_history: 3,
      defaults: 0,
      product_price: 5000
    });
    assert.ok(result.suggestions.some((s) => s.includes("credit history")));
  });

  test("should suggest maintaining payments for non-A grades", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 40000,
      credit_history: 18,
      defaults: 0,
      product_price: 8000
    });
    assert.equal(result.decision.riskGrade, "B");
    assert.ok(result.suggestions.some((s) => s.includes("timely payments")));
  });

  test("should return suggestions array (possibly empty)", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 80000,
      credit_history: 30,
      defaults: 0,
      product_price: 12000
    });
    assert.ok(Array.isArray(result.suggestions));
  });
});

// ─── SAMPLE INPUT FROM PROBLEM STATEMENT ─────────────────────────────────────

suite("Problem Statement Sample Input", () => {
  test("should evaluate the exact sample input correctly", () => {
    const result = evaluateBnplEligibility({
      monthly_income: 40000,
      credit_history: 12,
      defaults: 0,
      product_price: 12000
    });
    // Risk Band B: credit_history=12, defaults=0 → Grade B, multiplier=1.0, rate=10%
    // Eligible limit: 40000 * 0.25 * 1.0 = 10000
    // Product price 12000 > 10000 → REJECTED
    assert.equal(result.status, "REJECTED");
    assert.equal(result.decision.riskGrade, "B");
    assert.equal(result.eligibility.eligibleLimit, 10000);
    assert.ok(result.decision.reasonCodes.includes("PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT"));
    assert.ok(result.options.length === 4);
    assert.ok(result.suggestions.length > 0);
    assert.ok(typeof result.recommendedTenure === "number");
  });
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);

if (failed > 0) {
  process.exit(1);
}

console.log("All tests passed! ✓\n");
