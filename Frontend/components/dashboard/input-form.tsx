"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  ShoppingCart, 
  Zap,
  TrendingUp,
  TrendingDown,
  XCircle,
  Loader2,
  HelpCircle
} from "lucide-react";
import type { BNPLInput } from "@/lib/types";
import { useState } from "react";

interface InputFormProps {
  formData: BNPLInput;
  setFormData: (data: BNPLInput) => void;
  onEvaluate: () => void;
  onPreset: (preset: "strongApproval" | "productExceedsLimit" | "lowIncomeRejection" | "defaultsRejection") => void;
  isLoading?: boolean;
}

const fieldConfigs = [
  {
    key: "monthlyIncome" as const,
    label: "Monthly Income (₹)",
    icon: DollarSign,
    placeholder: "40000",
    min: 0,
    max: 500000,
    step: 1000,
    tooltip: "Your gross monthly income. Minimum ₹15,000 required for eligibility.",
    format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
  },
  {
    key: "creditHistoryMonths" as const,
    label: "Credit History (Months)",
    icon: Calendar,
    placeholder: "12",
    min: 0,
    max: 120,
    step: 1,
    tooltip: "Number of months you've had an active credit account. 24+ months for best rates.",
    format: (v: number) => `${v} mo`,
  },
  {
    key: "numberOfDefaults" as const,
    label: "Number of Defaults",
    icon: AlertTriangle,
    placeholder: "0",
    min: 0,
    max: 10,
    step: 1,
    tooltip: "Count of past loan defaults or missed payments. 0 defaults for best rates.",
    format: (v: number) => `${v}`,
  },
  {
    key: "productPrice" as const,
    label: "Product Price (₹)",
    icon: ShoppingCart,
    placeholder: "12000",
    min: 0,
    max: 500000,
    step: 500,
    tooltip: "Price of the product you want to purchase using BNPL financing.",
    format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
  },
];

const presets = [
  {
    key: "strongApproval" as const,
    label: "Strong Approval",
    icon: TrendingUp,
    color: "text-green-600",
    bgHover: "hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/20",
    description: "High income, clean history",
  },
  {
    key: "productExceedsLimit" as const,
    label: "Exceeds Limit",
    icon: ShoppingCart,
    color: "text-amber-600",
    bgHover: "hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
    description: "Product price > eligible limit",
  },
  {
    key: "lowIncomeRejection" as const,
    label: "Low Income",
    icon: TrendingDown,
    color: "text-red-600",
    bgHover: "hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20",
    description: "Below minimum threshold",
  },
  {
    key: "defaultsRejection" as const,
    label: "Defaults Rejection",
    icon: XCircle,
    color: "text-red-600",
    bgHover: "hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20",
    description: "Too many past defaults",
  },
];

export function InputForm({ formData, setFormData, onEvaluate, onPreset, isLoading = false }: InputFormProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const updateField = (field: keyof BNPLInput, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  // Calculate form completeness
  const filledFields = Object.values(formData).filter((v) => v > 0).length;
  const completeness = (filledFields / 4) * 100;

  return (
    <Card className="shadow-lg border-border/50 glass-card interactive-card animate-fade-in-up">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          BNPL Eligibility Input
        </CardTitle>
        {/* Completion Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Form Progress
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {filledFields}/4 fields
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full gradient-orange transition-all duration-500 ease-out"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Input Fields with Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fieldConfigs.map((config) => {
            const Icon = config.icon;
            const value = formData[config.key];
            return (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={config.key} className="text-sm font-medium flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    {config.label}
                  </Label>
                  <button
                    type="button"
                    className="relative"
                    onMouseEnter={() => setActiveTooltip(config.key)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(activeTooltip === config.key ? null : config.key)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                    {activeTooltip === config.key && (
                      <div className="absolute bottom-full right-0 mb-2 w-52 px-3 py-2 text-xs text-foreground bg-card border border-border rounded-lg shadow-lg z-10 text-left">
                        {config.tooltip}
                      </div>
                    )}
                  </button>
                </div>
                <Input
                  id={config.key}
                  type="number"
                  value={value}
                  onChange={(e) => updateField(config.key, Number(e.target.value))}
                  placeholder={config.placeholder}
                  min={config.min}
                  className="h-10"
                  disabled={isLoading}
                />
                {/* Slider */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value}
                    onChange={(e) => updateField(config.key, Number(e.target.value))}
                    className="flex-1 bg-muted cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-xs font-semibold text-primary tabular-nums min-w-[60px] text-right">
                    {config.format(value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground border border-border/50">
          <strong className="text-foreground">ℹ️ How it works:</strong>{" "}
          Your inputs are scored across 4 weighted factors (Income Stability, Credit Depth, Default Record, Debt Burden) 
          to produce a composite credit score (0-100). Interest rate is auto-assigned by risk grade (A=0%, B=10%, C=14%, D=18%).
        </div>
        
        {/* Preset Buttons */}
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Quick Scenarios
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => onPreset(preset.key)}
                  disabled={isLoading}
                  className={`flex flex-col items-start gap-0.5 p-2.5 rounded-xl border border-border bg-card text-left text-xs transition-all duration-200 hover:shadow-md disabled:opacity-50 ${preset.bgHover}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${preset.color}`} />
                    <span className="font-semibold text-foreground">{preset.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Evaluate Button */}
        <Button 
          type="button"
          onClick={onEvaluate} 
          className="w-full h-12 text-sm font-semibold gradient-orange border-0 text-white hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#FF6600]/20 hover:shadow-xl hover:shadow-[#FF6600]/30"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Evaluate BNPL Eligibility
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
