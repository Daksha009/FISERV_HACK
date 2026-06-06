"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Wallet,
  Calendar,
  Gauge,
  Shield,
  AlertTriangle,
  CreditCard,
  Receipt
} from "lucide-react";
import type { BNPLResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CreditScoreGauge, ScoreBreakdownBars } from "./credit-score-gauge";

interface DecisionSummaryProps {
  result: BNPLResult | null;
}

const riskGradeConfig = {
  A: { label: "Grade A", color: "bg-green-500 text-green-50", description: "Excellent", textColor: "text-green-600" },
  B: { label: "Grade B", color: "bg-blue-500 text-blue-50", description: "Good", textColor: "text-blue-600" },
  C: { label: "Grade C", color: "bg-amber-500 text-amber-50", description: "Fair", textColor: "text-amber-600" },
  D: { label: "Grade D", color: "bg-red-500 text-red-50", description: "High Risk", textColor: "text-red-600" },
};

const statusConfig = {
  APPROVED: {
    icon: CheckCircle2,
    bg: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
    iconColor: "text-green-600",
    titleColor: "text-green-700 dark:text-green-400",
    subtitle: "Eligible for BNPL financing",
    animation: "animate-fade-in-scale",
  },
  CONDITIONAL: {
    icon: AlertTriangle,
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
    iconColor: "text-amber-600",
    titleColor: "text-amber-700 dark:text-amber-400",
    subtitle: "Approved with conditions — higher rate applied",
    animation: "animate-fade-in-scale",
  },
  REJECTED: {
    icon: XCircle,
    bg: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
    iconColor: "text-red-600",
    titleColor: "text-red-700 dark:text-red-400",
    subtitle: "Does not meet eligibility criteria",
    animation: "animate-shake",
  },
};

export function DecisionSummary({ result }: DecisionSummaryProps) {
  if (!result) {
    return (
      <Card className="shadow-lg border-border/50 glass-card flex items-center justify-center min-h-[400px] animate-fade-in-up delay-200">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 animate-float">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready to Evaluate
          </h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            Enter applicant details and click evaluate to see the BNPL decision
          </p>
        </div>
      </Card>
    );
  }

  const gradeConfig = riskGradeConfig[result.riskGrade];
  const status = statusConfig[result.status] || statusConfig.REJECTED;
  const StatusIcon = status.icon;
  const emiRatioColor = result.bestEMIToIncomeRatio <= 20 
    ? "text-green-600" 
    : result.bestEMIToIncomeRatio <= 30 
      ? "text-amber-600" 
      : "text-red-600";

  return (
    <Card className="shadow-lg border-border/50 glass-card animate-fade-in-up delay-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          Decision Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Status Card */}
        <div className={cn(
          "rounded-xl p-4 flex items-center gap-4 border transition-all duration-300",
          status.bg,
          status.animation
        )}>
          <StatusIcon className={cn("w-10 h-10 shrink-0", status.iconColor)} />
          <div>
            <h3 className={cn("text-xl font-bold", status.titleColor)}>
              {result.status}
            </h3>
            <p className={cn("text-sm", status.titleColor, "opacity-80")}>
              {status.subtitle}
            </p>
          </div>
        </div>

        {/* Credit Score Gauge */}
        <div className="flex flex-col items-center py-2">
          <CreditScoreGauge creditScore={result.creditScore} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-xl p-3 interactive-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Eligible Limit</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              ₹{result.eligibleLimit.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-3 interactive-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Product Price</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              ₹{result.productPrice.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-3 interactive-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Risk Grade</span>
            </div>
            <Badge className={cn("font-semibold", gradeConfig.color)}>
              {gradeConfig.label} - {gradeConfig.description}
            </Badge>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-3 interactive-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Recommended Tenure</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {result.recommendedTenure} Months
            </p>
          </div>
        </div>

        {/* Processing Fee & Rate */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Receipt className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Processing Fee</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              ₹{result.processingFee.toLocaleString()}
            </p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Effective Rate</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {(result.effectiveAnnualRate * 100).toFixed(0)}% p.a.
            </p>
          </div>
        </div>

        {/* EMI to Income Ratio */}
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Best EMI-to-Income Ratio</span>
            </div>
            <span className={cn("text-lg font-bold", emiRatioColor)}>
              {result.bestEMIToIncomeRatio}%
            </span>
          </div>
          <Progress 
            value={Math.min(result.bestEMIToIncomeRatio, 100)} 
            className="h-2.5"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0%</span>
            <span className="text-green-600">Affordable {"<"}30%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <ScoreBreakdownBars creditScore={result.creditScore} />
      </CardContent>
    </Card>
  );
}
