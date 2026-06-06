// Client-side EMI calculator for real-time preview
// Mirrors the backend reducing-balance formula so the chart updates instantly

export interface LiveEMIOption {
  tenure: number;
  emi: number;
  annualRate: number;
  interest: number;
  totalPayable: number;
  totalCostOfCredit: number;
  emiToIncomeRatio: number;
  isAffordable: boolean;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Risk band lookup (same logic as backend)
function pickRiskBand(creditHistory: number, defaults: number) {
  const bands = [
    { grade: "A", maxDefaults: 0, minCreditHistory: 24, multiplier: 1.2, rate: 0.0, feeRate: 0.01 },
    { grade: "B", maxDefaults: 0, minCreditHistory: 12, multiplier: 1.0, rate: 0.10, feeRate: 0.015 },
    { grade: "C", maxDefaults: 1, minCreditHistory: 6, multiplier: 0.85, rate: 0.14, feeRate: 0.02 },
    { grade: "D", maxDefaults: 2, minCreditHistory: 0, multiplier: 0.70, rate: 0.18, feeRate: 0.025 },
  ];
  for (const band of bands) {
    if (defaults <= band.maxDefaults && creditHistory >= band.minCreditHistory) {
      return band;
    }
  }
  return bands[bands.length - 1];
}

// Reducing balance EMI formula:  EMI = P × r × (1+r)^n / ((1+r)^n − 1)
function calculateEMI(principal: number, months: number, annualRate: number): number {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return round2(principal / months);
  const factor = Math.pow(1 + monthlyRate, months);
  return round2((principal * monthlyRate * factor) / (factor - 1));
}

export function computeLiveEMI(
  monthlyIncome: number,
  creditHistoryMonths: number,
  numberOfDefaults: number,
  productPrice: number
): LiveEMIOption[] {
  if (monthlyIncome <= 0 || productPrice <= 0) return [];

  const band = pickRiskBand(creditHistoryMonths, numberOfDefaults);
  const tenures = [3, 6, 9, 12];
  const processingFee = round2(productPrice * band.feeRate);

  return tenures.map((months) => {
    const emi = calculateEMI(productPrice, months, band.rate);
    const totalPayable = round2(emi * months);
    const totalInterest = round2(totalPayable - productPrice);
    const emiToIncomeRatio = round2((emi / monthlyIncome) * 100 * 10) / 10;
    const isAffordable = emi / monthlyIncome <= 0.3;

    return {
      tenure: months,
      emi,
      annualRate: band.rate,
      interest: totalInterest,
      totalPayable: Math.round(totalPayable),
      totalCostOfCredit: round2(totalPayable + processingFee),
      emiToIncomeRatio,
      isAffordable,
    };
  });
}
