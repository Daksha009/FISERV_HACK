"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import { FinanceWidgets } from "@/components/dashboard/finance-widgets";
import type { BNPLInput, BNPLResult, EvaluationRecord } from "@/lib/types";
import { computeLiveEMI } from "@/lib/emi-calculator";
import { Shield, BarChart3, Zap, CreditCard, BookOpen, ArrowRight, TrendingUp } from "lucide-react";

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

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const isGuest = searchParams.get("guest") === "true";

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
  const [resultKey, setResultKey] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth + load history from database
  const loadHistory = useCallback(async () => {
    if (isGuest) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setIsLoggedIn(true);

    try {
      const res = await fetch("/api/evaluations");
      if (res.ok) {
        const data = await res.json();
        const records: EvaluationRecord[] = data.map((row: { id: string; created_at: string; input: BNPLInput; result: BNPLResult }) => ({
          id: row.id,
          timestamp: new Date(row.created_at),
          input: row.input,
          result: row.result,
        }));
        setHistory(records);
      }
    } catch {
      // silently fail — history just won't load
    }
  }, [isGuest]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Real-time EMI preview — recalculates on every input change
  const liveEmiData = useMemo(() => {
    return computeLiveEMI(
      formData.monthlyIncome,
      formData.creditHistoryMonths,
      formData.numberOfDefaults,
      formData.productPrice
    );
  }, [formData.monthlyIncome, formData.creditHistoryMonths, formData.numberOfDefaults, formData.productPrice]);

  // Use backend result if available, otherwise live preview
  const chartData = result ? result.emiSchedule : liveEmiData;
  
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
      setResultKey((k) => k + 1); // force re-render for animations
      
      // Save to database if logged in, otherwise in-memory
      if (isLoggedIn) {
        try {
          const saveRes = await fetch("/api/evaluations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: formData, result: data }),
          });
          if (saveRes.ok) {
            const saved = await saveRes.json();
            const record: EvaluationRecord = {
              id: saved.id,
              timestamp: new Date(saved.created_at),
              input: saved.input,
              result: saved.result,
            };
            setHistory(prev => [record, ...prev].slice(0, 20));
          }
        } catch {
          // Save failed silently — evaluation result still shows
        }
      } else {
        const record: EvaluationRecord = {
          id: Date.now().toString(),
          timestamp: new Date(),
          input: { ...formData },
          result: data as BNPLResult,
        };
        setHistory(prev => [record, ...prev].slice(0, 5));
      }
    } catch {
      setError(
        "Something went wrong. Please try again."
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

  const handleHistoryReload = (record: EvaluationRecord) => {
    setFormData(record.input);
    setResult(record.result);
    setResultKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHistoryDelete = async (id: string) => {
    if (!isLoggedIn) {
      setHistory(prev => prev.filter(r => r.id !== id));
      return;
    }
    try {
      const res = await fetch(`/api/evaluations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory(prev => prev.filter(r => r.id !== id));
      }
    } catch {
      // silently fail
    }
  };
  
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white animate-fade-in-up max-w-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Trusted BNPL Engine
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                  Smart BNPL
                  <br />
                  Eligibility Engine
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  AI-powered credit scoring with a transparent 4-factor weighted model. 
                  Get instant approvals, detailed EMI schedules, and actionable suggestions.
                </p>
              </div>
              <div className="flex items-center gap-4 animate-fade-in-up delay-300">
                {[
                  { icon: Shield, label: "Credit Score", value: "0-100" },
                  { icon: BarChart3, label: "Risk Bands", value: "A to D" },
                  { icon: Zap, label: "Tenures", value: "3-12 mo" },
                  { icon: CreditCard, label: "Instant", value: "Decision" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 min-w-[80px]"
                  >
                    <stat.icon className="w-5 h-5 text-white/90" />
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                    <span className="text-[10px] text-white/70 font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 50L48 45C96 40 192 30 288 27.5C384 25 480 30 576 32.5C672 35 768 35 864 30C960 25 1056 15 1152 12.5C1248 10 1344 15 1392 17.5L1440 20V50H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-3 animate-fade-in-up">
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
          <div className="space-y-6" key={resultKey}>
            {/* 3D Credit Card Visualization */}
            {result && (
              <div className="rounded-2xl border border-border overflow-hidden glass-card animate-fade-in-scale">
                <CreditCard3D approved={result.isApproved} />
              </div>
            )}
            <DecisionSummary result={result} />
          </div>
        </div>

        {/* Live EMI Breakdown — always visible, updates in real-time */}
        {chartData.length > 0 && (
          <div className="mb-8 animate-fade-in-up delay-200">
            <EMIChart schedule={chartData} />
          </div>
        )}
        
        {/* EMI Schedule & Details — only after evaluation */}
        {result && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="animate-fade-in-up delay-300">
                <EMISchedule 
                  schedule={result.emiSchedule} 
                  recommendedTenure={result.recommendedTenure}
                  processingFee={result.processingFee}
                />
              </div>
            </div>
            
            {/* Reason Codes & Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="animate-fade-in-up delay-500">
                <ReasonCodes codes={result.reasonCodes} isApproved={result.isApproved} />
              </div>
              <div className="animate-fade-in-up delay-600">
                <Suggestions suggestions={result.suggestions} />
              </div>
            </div>
          </>
        )}
        
        {/* History */}
        {history.length > 0 && (
          <div className="animate-fade-in-up delay-700">
            <EvaluationHistory history={history} onReload={handleHistoryReload} onDelete={handleHistoryDelete} isLoggedIn={isLoggedIn} />
          </div>
        )}

        {/* Finance Widgets — always visible, real-time */}
        <FinanceWidgets formData={formData} />

        {/* Financial Education & Blogs */}
        <section id="resources" className="mt-12 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Financial Education & Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "How to Build Your Credit Score",
                desc: "Learn the fundamentals of credit scoring, why payment history matters, and practical steps to improve your creditworthiness over time.",
                category: "Credit Health",
                readTime: "5 min read",
                icon: TrendingUp,
                color: "text-green-500",
                bg: "bg-green-50 dark:bg-green-950/30"
              },
              {
                title: "Understanding EMI vs Flat Interest",
                desc: "A deep dive into how reducing balance EMI calculation works and why it saves you money compared to flat interest rate loans.",
                category: "Finance 101",
                readTime: "7 min read",
                icon: BarChart3,
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-950/30"
              },
              {
                title: "Smart Debt Management",
                desc: "Strategies to keep your EMI-to-income ratio in check, avoiding the debt trap, and making BNPL work safely for your lifestyle.",
                category: "Budgeting",
                readTime: "4 min read",
                icon: Shield,
                color: "text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-950/30"
              }
            ].map((blog, i) => (
              <div 
                key={i} 
                className="group relative overflow-hidden rounded-2xl border border-border glass-card hover:shadow-xl transition-all duration-300 animate-fade-in-up interactive-card"
                style={{ animationDelay: `${(i + 8) * 100}ms` }}
              >
                <div className="p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {blog.category}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      {blog.readTime}
                    </span>
                  </div>
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${blog.bg}`}>
                    <blog.icon className={`w-5 h-5 ${blog.color}`} />
                  </div>
                  
                  <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {blog.desc}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <a href="#" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* AI Assistant Chatbot */}
      <AIAssistant />
    </div>
  );
}
