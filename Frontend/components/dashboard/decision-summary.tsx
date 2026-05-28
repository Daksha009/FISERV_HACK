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
  Shield
} from "lucide-react";
import type { BNPLResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DecisionSummaryProps {
  result: BNPLResult | null;
}

const riskGradeConfig = {
  A: { label: "Grade A", color: "bg-green-500 text-green-50", description: "Excellent" },
  B: { label: "Grade B", color: "bg-blue-500 text-blue-50", description: "Good" },
  C: { label: "Grade C", color: "bg-amber-500 text-amber-50", description: "Fair" },
  D: { label: "Grade D", color: "bg-red-500 text-red-50", description: "High Risk" },
};

export function DecisionSummary({ result }: DecisionSummaryProps) {
  if (!result) {
    return (
      <Card className="shadow-lg border-border/50 flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
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
  const emiRatioColor = result.bestEMIToIncomeRatio <= 20 
    ? "text-green-600" 
    : result.bestEMIToIncomeRatio <= 30 
      ? "text-amber-600" 
      : "text-red-600";

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          Decision Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Status Card */}
        <div className={cn(
          "rounded-xl p-4 flex items-center gap-4",
          result.isApproved 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        )}>
          {result.isApproved ? (
            <CheckCircle2 className="w-10 h-10 text-green-600 shrink-0" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600 shrink-0" />
          )}
          <div>
            <h3 className={cn(
              "text-xl font-bold",
              result.isApproved ? "text-green-700" : "text-red-700"
            )}>
              {result.isApproved ? "APPROVED" : "REJECTED"}
            </h3>
            <p className={cn(
              "text-sm",
              result.isApproved ? "text-green-600" : "text-red-600"
            )}>
              {result.isApproved 
                ? "Eligible for BNPL financing" 
                : "Does not meet eligibility criteria"}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Eligible Limit</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              ₹{result.eligibleLimit.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Product Price</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              ₹{result.productPrice.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Risk Grade</span>
            </div>
            <Badge className={cn("font-semibold", gradeConfig.color)}>
              {gradeConfig.label} - {gradeConfig.description}
            </Badge>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Recommended Tenure</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {result.recommendedTenure} Months
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
      </CardContent>
    </Card>
  );
}
