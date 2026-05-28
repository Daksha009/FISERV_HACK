"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { InputForm } from "@/components/dashboard/input-form";
import { DecisionSummary } from "@/components/dashboard/decision-summary";
import { EMISchedule } from "@/components/dashboard/emi-schedule";
import { EMIChart } from "@/components/dashboard/emi-chart";
import { ReasonCodes } from "@/components/dashboard/reason-codes";
import { Suggestions } from "@/components/dashboard/suggestions";
import { EvaluationHistory } from "@/components/dashboard/evaluation-history";
import { CreditCard3D } from "@/components/dashboard/credit-card-3d";
import { AIAssistant } from "@/components/dashboard/ai-assistant";
import type { BNPLInput, BNPLResult, EvaluationRecord } from "@/lib/types";

// Preset scenarios for demo — aligned with the backend's actual rules
const presets = {
  strongApproval: {
    monthlyIncome: 80000,
    creditHistoryMonths: 30,
    numberOfDefaults: 0,
    productPrice: 12000,
  },
  productExceedsLimit: {
    monthlyIncome: 40000,
    creditHistoryMonths: 18,
    numberOfDefaults: 0,
    productPrice: 12000,
  },
  lowIncomeRejection: {
    monthlyIncome: 10000,
    creditHistoryMonths: 12,
    numberOfDefaults: 1,
    productPrice: 5000,
  },
  defaultsRejection: {
    monthlyIncome: 60000,
    creditHistoryMonths: 24,
    numberOfDefaults: 4,
    productPrice: 10000,
  },
};

export default function DashboardPage() {
  const [formData, setFormData] = useState<BNPLInput>({
    monthlyIncome: 40000,
    creditHistoryMonths: 12,
    numberOfDefaults: 0,
    productPrice: 12000,
  });
  
  const [result, setResult] = useState<BNPLResult | null>(null);
  const [history, setHistory] = useState<EvaluationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleEvaluate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/bnpl/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.errors) {
          setError(data.errors.join(", "));
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Evaluation failed. Please check your inputs.");
        }
        setResult(null);
        return;
      }
      
      setResult(data as BNPLResult);
      
      // Add to history
      const record: EvaluationRecord = {
        id: Date.now().toString(),
        timestamp: new Date(),
        input: { ...formData },
        result: data as BNPLResult,
      };
      setHistory(prev => [record, ...prev].slice(0, 5));
    } catch {
      setError(
        "Could not connect to the backend server. Please ensure the backend is running on port 4000."
      );
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreset = (preset: keyof typeof presets) => {
    setFormData(presets[preset]);
    setError(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Evaluation Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Main Grid - Form + Decision Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <InputForm 
            formData={formData}
            setFormData={setFormData}
            onEvaluate={handleEvaluate}
            onPreset={handlePreset}
            isLoading={isLoading}
          />
          <div className="space-y-6">
            {/* 3D Credit Card Visualization */}
            {result && (
              <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl border border-border overflow-hidden">
                <CreditCard3D approved={result.isApproved} />
              </div>
            )}
            <DecisionSummary result={result} />
          </div>
        </div>
        
        {/* EMI Schedule & Chart */}
        {result && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2">
                <EMISchedule 
                  schedule={result.emiSchedule} 
                  recommendedTenure={result.recommendedTenure} 
                />
              </div>
              <div>
                <EMIChart schedule={result.emiSchedule} />
              </div>
            </div>
            
            {/* Reason Codes & Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ReasonCodes codes={result.reasonCodes} isApproved={result.isApproved} />
              <Suggestions suggestions={result.suggestions} />
            </div>
          </>
        )}
        
        {/* History */}
        {history.length > 0 && (
          <EvaluationHistory history={history} />
        )}
      </main>

      {/* AI Assistant Chatbot */}
      <AIAssistant />
    </div>
  );
}
