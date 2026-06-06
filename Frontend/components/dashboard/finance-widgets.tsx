"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PiggyBank, 
  Scale, 
  Percent, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Calculator
} from "lucide-react";
import type { BNPLInput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FinanceWidgetsProps {
  formData: BNPLInput;
}

// ─── DTI Ratio Meter ──────────────────────────────────────────────────────────
function DTIRatioMeter({ formData }: { formData: BNPLInput }) {
  const annualIncome = formData.monthlyIncome * 12;
  const dtiRatio = annualIncome > 0 
    ? Math.round((formData.productPrice / annualIncome) * 100 * 10) / 10
    : 0;

  const getStatus = (ratio: number) => {
    if (ratio <= 10) return { label: "Excellent", color: "#22C55E", bg: "bg-green-50 dark:bg-green-950/30" };
    if (ratio <= 25) return { label: "Good", color: "#3B82F6", bg: "bg-blue-50 dark:bg-blue-950/30" };
    if (ratio <= 40) return { label: "Caution", color: "#F59E0B", bg: "bg-amber-50 dark:bg-amber-950/30" };
    return { label: "High Risk", color: "#EF4444", bg: "bg-red-50 dark:bg-red-950/30" };
  };

  const status = getStatus(dtiRatio);

  return (
    <Card className="glass-card interactive-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
            <Scale className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Debt-to-Income Ratio</h4>
            <p className="text-[10px] text-muted-foreground">Product price vs annual income</p>
          </div>
        </div>

        <div className="flex items-end justify-between mb-3">
          <span className="text-3xl font-bold tabular-nums" style={{ color: status.color }}>
            {dtiRatio}%
          </span>
          <span 
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${status.color}15`, color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {/* Visual bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(dtiRatio * 2, 100)}%`, 
              backgroundColor: status.color 
            }} 
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0%</span>
          <span>Safe &lt;25%</span>
          <span>50%</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Savings Comparison (BNPL vs Credit Card) ─────────────────────────────────
function SavingsComparison({ formData }: { formData: BNPLInput }) {
  const [tenure] = useState(6);
  const productPrice = formData.productPrice;

  // BNPL at Grade B rate (10%)
  const bnplRate = 0.10;
  const bnplMonthly = bnplRate / 12;
  const bnplFactor = Math.pow(1 + bnplMonthly, tenure);
  const bnplEmi = bnplMonthly === 0 
    ? productPrice / tenure 
    : (productPrice * bnplMonthly * bnplFactor) / (bnplFactor - 1);
  const bnplTotal = Math.round(bnplEmi * tenure);
  const bnplInterest = bnplTotal - productPrice;

  // Credit Card at 36% p.a.
  const ccRate = 0.36;
  const ccMonthly = ccRate / 12;
  const ccFactor = Math.pow(1 + ccMonthly, tenure);
  const ccEmi = (productPrice * ccMonthly * ccFactor) / (ccFactor - 1);
  const ccTotal = Math.round(ccEmi * tenure);
  const ccInterest = ccTotal - productPrice;

  const savings = ccInterest - bnplInterest;
  const savingsPercent = ccInterest > 0 ? Math.round((savings / ccInterest) * 100) : 0;

  return (
    <Card className="glass-card interactive-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
            <PiggyBank className="w-4.5 h-4.5 text-green-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">BNPL vs Credit Card</h4>
            <p className="text-[10px] text-muted-foreground">Interest savings over {tenure} months</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* BNPL */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-green-600" />
              <div>
                <span className="text-xs font-semibold text-foreground">BNPL (10% p.a.)</span>
                <p className="text-[10px] text-muted-foreground">Interest: ₹{bnplInterest.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">₹{bnplTotal.toLocaleString()}</span>
          </div>

          {/* Credit Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
              <div>
                <span className="text-xs font-semibold text-foreground">Credit Card (36% p.a.)</span>
                <p className="text-[10px] text-muted-foreground">Interest: ₹{ccInterest.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">₹{ccTotal.toLocaleString()}</span>
          </div>

          {/* Savings */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground">You save with BNPL</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">₹{savings.toLocaleString()}</span>
              <span className="text-[10px] font-semibold text-green-600 bg-green-100 dark:bg-green-950/40 px-1.5 py-0.5 rounded">
                {savingsPercent}% less
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Monthly Budget Impact ────────────────────────────────────────────────────
function BudgetImpact({ formData }: { formData: BNPLInput }) {
  const monthlyIncome = formData.monthlyIncome || 1;
  const productPrice = formData.productPrice;

  // Simulate 6-month EMI at 10%
  const rate = 0.10 / 12;
  const months = 6;
  const factor = Math.pow(1 + rate, months);
  const emi = rate === 0 
    ? productPrice / months 
    : Math.round((productPrice * rate * factor) / (factor - 1));

  const emiPercent = Math.round((emi / monthlyIncome) * 100);
  const essentials = 50; // 50% for essentials
  const savings = Math.max(0, 100 - essentials - emiPercent);

  const segments = [
    { label: "Essentials", percent: essentials, color: "#6366F1" },
    { label: "BNPL EMI", percent: Math.min(emiPercent, 50), color: "#FF6600" },
    { label: "Savings", percent: savings, color: "#22C55E" },
  ];

  return (
    <Card className="glass-card interactive-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
            <IndianRupee className="w-4.5 h-4.5 text-purple-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Monthly Budget Impact</h4>
            <p className="text-[10px] text-muted-foreground">How BNPL EMI fits your monthly budget</p>
          </div>
        </div>

        {/* Stacked bar */}
        <div className="flex h-4 rounded-full overflow-hidden mb-3">
          {segments.map((seg) => (
            <div 
              key={seg.label}
              className="transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full"
              style={{ width: `${seg.percent}%`, backgroundColor: seg.color }} 
              title={`${seg.label}: ${seg.percent}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2">
          {segments.map((seg) => (
            <div key={seg.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                <span className="text-[10px] text-muted-foreground font-medium">{seg.label}</span>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: seg.color }}>
                {seg.percent}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Estimated EMI (6 months)</span>
          <span className="text-sm font-bold text-foreground">₹{emi.toLocaleString()}/mo</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Quick EMI Calculator ─────────────────────────────────────────────────────
function QuickEmiCalc() {
  const [amount, setAmount] = useState(25000);
  const [months, setMonths] = useState(6);
  const [rate, setRate] = useState(12);

  const monthlyRate = rate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = monthlyRate === 0 
    ? Math.round(amount / months) 
    : Math.round((amount * monthlyRate * factor) / (factor - 1));
  const total = emi * months;
  const interest = total - amount;

  return (
    <Card className="glass-card interactive-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <Calculator className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Quick EMI Calculator</h4>
            <p className="text-[10px] text-muted-foreground">Plan any purchase instantly</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Amount */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Loan Amount</span>
              <span className="text-xs font-semibold text-foreground">₹{amount.toLocaleString()}</span>
            </div>
            <input
              type="range" min={5000} max={500000} step={1000} value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-muted cursor-pointer"
            />
          </div>

          {/* Months */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Tenure</span>
              <span className="text-xs font-semibold text-foreground">{months} months</span>
            </div>
            <input
              type="range" min={3} max={36} step={3} value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full bg-muted cursor-pointer"
            />
          </div>

          {/* Rate */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Interest Rate</span>
              <span className="text-xs font-semibold text-foreground">{rate}% p.a.</span>
            </div>
            <input
              type="range" min={0} max={36} step={1} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-muted cursor-pointer"
            />
          </div>

          {/* Result */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Monthly EMI</p>
              <p className="text-sm font-bold text-primary">₹{emi.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Total Interest</p>
              <p className="text-sm font-bold text-amber-600">₹{interest.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Total Payable</p>
              <p className="text-sm font-bold text-foreground">₹{total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export function FinanceWidgets({ formData }: FinanceWidgetsProps) {
  return (
    <section className="mt-8 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Financial Insights</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider ml-1">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="animate-fade-in-up delay-100">
          <DTIRatioMeter formData={formData} />
        </div>
        <div className="animate-fade-in-up delay-200">
          <SavingsComparison formData={formData} />
        </div>
        <div className="animate-fade-in-up delay-300">
          <BudgetImpact formData={formData} />
        </div>
        <div className="animate-fade-in-up delay-400">
          <QuickEmiCalc />
        </div>
      </div>
    </section>
  );
}
