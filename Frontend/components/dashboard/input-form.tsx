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
  Loader2
} from "lucide-react";
import type { BNPLInput } from "@/lib/types";

interface InputFormProps {
  formData: BNPLInput;
  setFormData: (data: BNPLInput) => void;
  onEvaluate: () => void;
  onPreset: (preset: "strongApproval" | "productExceedsLimit" | "lowIncomeRejection" | "defaultsRejection") => void;
  isLoading?: boolean;
}

export function InputForm({ formData, setFormData, onEvaluate, onPreset, isLoading = false }: InputFormProps) {
  const updateField = (field: keyof BNPLInput, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          BNPL Eligibility Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              Monthly Income (₹)
            </Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => updateField("monthlyIncome", Number(e.target.value))}
              placeholder="40000"
              className="h-10"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="creditHistory" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              Credit History (Months)
            </Label>
            <Input
              id="creditHistory"
              type="number"
              value={formData.creditHistoryMonths}
              onChange={(e) => updateField("creditHistoryMonths", Number(e.target.value))}
              placeholder="12"
              className="h-10"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaults" className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
              Number of Defaults
            </Label>
            <Input
              id="defaults"
              type="number"
              value={formData.numberOfDefaults}
              onChange={(e) => updateField("numberOfDefaults", Number(e.target.value))}
              placeholder="0"
              min="0"
              className="h-10"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productPrice" className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" />
              Product Price (₹)
            </Label>
            <Input
              id="productPrice"
              type="number"
              value={formData.productPrice}
              onChange={(e) => updateField("productPrice", Number(e.target.value))}
              placeholder="12000"
              className="h-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <strong>Note:</strong> Interest rate is determined automatically based on your risk profile (Grade A = 0%, B = 10%, C = 14%, D = 18%).
        </div>
        
        {/* Preset Buttons */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
            Quick Scenarios
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => onPreset("strongApproval")}
              className="justify-start text-xs h-9"
              disabled={isLoading}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-green-600" />
              Strong Approval
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => onPreset("productExceedsLimit")}
              className="justify-start text-xs h-9"
              disabled={isLoading}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Exceeds Limit
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => onPreset("lowIncomeRejection")}
              className="justify-start text-xs h-9"
              disabled={isLoading}
            >
              <TrendingDown className="w-3.5 h-3.5 mr-1.5 text-red-600" />
              Low Income
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => onPreset("defaultsRejection")}
              className="justify-start text-xs h-9"
              disabled={isLoading}
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5 text-red-600" />
              Defaults Rejection
            </Button>
          </div>
        </div>
        
        {/* Evaluate Button */}
        <Button 
          type="button"
          onClick={onEvaluate} 
          className="w-full h-11 text-sm font-semibold"
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
