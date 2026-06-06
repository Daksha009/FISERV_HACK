"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, AlertCircle, XCircle, TrendingUp, Shield, Wallet, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasonCodesProps {
  codes: string[];
  isApproved: boolean;
}

const codeConfig: Record<string, { label: string; description: string; icon: React.ReactNode; variant: "success" | "warning" | "destructive" }> = {
  // Backend reason codes
  LOW_INCOME: {
    label: "Low Income",
    description: "Monthly income is below the minimum ₹15,000 threshold required for BNPL eligibility.",
    icon: <AlertCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  THIN_CREDIT_HISTORY: {
    label: "Thin Credit History",
    description: "Less than 6 months of credit history. Build more credit track record.",
    icon: <Clock className="w-3 h-3" />,
    variant: "warning"
  },
  EXCESSIVE_DEFAULTS: {
    label: "Excessive Defaults",
    description: "More than 2 past defaults detected. Clear defaults to improve eligibility.",
    icon: <XCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  PRODUCT_PRICE_EXCEEDS_ELIGIBLE_LIMIT: {
    label: "Product Exceeds Limit",
    description: "The product price exceeds your calculated eligible limit based on income and risk profile.",
    icon: <Wallet className="w-3 h-3" />,
    variant: "destructive"
  },
  EMI_NOT_AFFORDABLE_FOR_ANY_TENURE: {
    label: "EMI Not Affordable",
    description: "EMI-to-Income ratio exceeds 30% for all available tenures.",
    icon: <AlertCircle className="w-3 h-3" />,
    variant: "destructive"
  },
  PRODUCT_EXCEEDS_BAND_CAP: {
    label: "Exceeds Band Cap",
    description: "Product price exceeds the maximum allowed for your risk band.",
    icon: <Wallet className="w-3 h-3" />,
    variant: "destructive"
  },
  // Frontend-only reason codes (for approved cases)
  EXCELLENT_CREDIT_PROFILE: { 
    label: "Excellent Credit Profile", 
    description: "Top-tier credit profile with strong history and no defaults.",
    icon: <Shield className="w-3 h-3" />,
    variant: "success"
  },
  HIGH_CREDIT_HEADROOM: { 
    label: "High Credit Headroom", 
    description: "Eligible limit is significantly above the product price.",
    icon: <TrendingUp className="w-3 h-3" />,
    variant: "success"
  },
  STRONG_AFFORDABILITY: { 
    label: "Strong Affordability", 
    description: "EMI payments are well within comfortable range of your income.",
    icon: <CheckCircle2 className="w-3 h-3" />,
    variant: "success"
  },
};

const variantStyles = {
  success: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  destructive: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
};

export function ReasonCodes({ codes, isApproved }: ReasonCodesProps) {
  return (
    <Card className="shadow-lg border-border/50 glass-card interactive-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Reason Codes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-80" />
            <p className="text-sm font-medium">All criteria met — no rejection flags</p>
          </div>
        ) : (
          <div className="space-y-2">
            {codes.map((code, index) => {
              const config = codeConfig[code] || { 
                label: code.replace(/_/g, " "), 
                description: "",
                icon: <AlertCircle className="w-3 h-3" />,
                variant: isApproved ? "success" as const : "destructive" as const
              };
              return (
                <div
                  key={code}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 animate-fade-in-up",
                    variantStyles[config.variant]
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="mt-0.5 shrink-0">{config.icon}</div>
                  <div>
                    <span className="text-xs font-semibold block">{config.label}</span>
                    {config.description && (
                      <span className="text-[10px] opacity-75 block mt-0.5">{config.description}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
