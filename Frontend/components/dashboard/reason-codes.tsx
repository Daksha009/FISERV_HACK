import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, AlertCircle, XCircle, TrendingUp, Shield, Wallet, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasonCodesProps {
  codes: string[];
  isApproved: boolean;
}

const codeConfig: Record<string, { label: string; icon: React.ReactNode; variant: "success" | "warning" | "destructive" }> = {
  // Backend reason codes
  LOW_INCOME: {
    label: "Low Income",
    icon: <AlertCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  THIN_CREDIT_HISTORY: {
    label: "Thin Credit History",
    icon: <Clock className="w-3 h-3" />,
    variant: "warning"
  },
  EXCESSIVE_DEFAULTS: {
    label: "Excessive Defaults",
    icon: <XCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT: {
    label: "Product Exceeds Eligible Limit",
    icon: <Wallet className="w-3 h-3" />,
    variant: "destructive"
  },
  EMI_NOT_AFFORDABLE_FOR_ANY_TENURE: {
    label: "EMI Not Affordable",
    icon: <AlertCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  // Frontend-only reason codes (for approved cases)
  PRODUCT_EXCEEDS_LIMIT: { 
    label: "Product Exceeds Limit", 
    icon: <Wallet className="w-3 h-3" />,
    variant: "destructive"
  },
  TOO_MANY_DEFAULTS: { 
    label: "Too Many Defaults", 
    icon: <XCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  INSUFFICIENT_INCOME: { 
    label: "Insufficient Income", 
    icon: <AlertCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  LIMITED_CREDIT_HISTORY: { 
    label: "Limited Credit History", 
    icon: <Clock className="w-3 h-3" />,
    variant: "warning"
  },
  EXCELLENT_CREDIT_PROFILE: { 
    label: "Excellent Credit Profile", 
    icon: <Shield className="w-3 h-3" />,
    variant: "success"
  },
  HIGH_CREDIT_HEADROOM: { 
    label: "High Credit Headroom", 
    icon: <TrendingUp className="w-3 h-3" />,
    variant: "success"
  },
  STRONG_AFFORDABILITY: { 
    label: "Strong Affordability", 
    icon: <CheckCircle2 className="w-3 h-3" />,
    variant: "success"
  },
};

const variantStyles = {
  success: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  destructive: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
};

export function ReasonCodes({ codes, isApproved }: ReasonCodesProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          Reason Codes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No specific reason codes</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {codes.map((code) => {
              const config = codeConfig[code] || { 
                label: code.replace(/_/g, " "), 
                icon: <AlertCircle className="w-3 h-3" />,
                variant: isApproved ? "success" as const : "destructive" as const
              };
              return (
                <Badge 
                  key={code} 
                  variant="outline"
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    variantStyles[config.variant]
                  )}
                >
                  {config.icon}
                  <span className="ml-1.5">{config.label}</span>
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
