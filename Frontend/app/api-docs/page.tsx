"use client";

import { useState } from "react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { 
  Code2, 
  Send, 
  Copy, 
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Zap
} from "lucide-react";

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="bg-muted/50 rounded-xl p-4 overflow-x-auto text-sm font-mono text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function EndpointSection({
  method,
  path,
  description,
  requestBody,
  responseBody,
}: {
  method: "GET" | "POST";
  path: string;
  description: string;
  requestBody?: string;
  responseBody: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-muted/30 transition-colors"
      >
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold ${
            method === "GET"
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          }`}
        >
          {method}
        </span>
        <code className="text-sm font-mono font-semibold text-foreground">{path}</code>
        <span className="flex-1 text-sm text-muted-foreground hidden sm:block">{description}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-4 animate-fade-in-up border-t border-border/50 pt-4">
          <p className="text-sm text-muted-foreground sm:hidden">{description}</p>
          
          {requestBody && (
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Request Body</h4>
              <CodeBlock code={requestBody} />
            </div>
          )}
          
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Response</h4>
            <CodeBlock code={responseBody} />
          </div>
        </div>
      )}
    </div>
  );
}

function LiveTester() {
  const [income, setIncome] = useState("80000");
  const [history, setHistory] = useState("30");
  const [defaults, setDefaults] = useState("0");
  const [price, setPrice] = useState("12000");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bnpl/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome: Number(income),
          creditHistoryMonths: Number(history),
          numberOfDefaults: Number(defaults),
          productPrice: Number(price),
        }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch {
      setResponse('{ "error": "Request failed" }');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Live API Tester</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Monthly Income", value: income, setter: setIncome },
          { label: "Credit History (months)", value: history, setter: setHistory },
          { label: "Defaults", value: defaults, setter: setDefaults },
          { label: "Product Price", value: price, setter: setPrice },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">{field.label}</label>
            <input
              type="number"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {loading ? "Sending..." : "Send Request"}
      </button>

      {response && (
        <div className="mt-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Response</h4>
          <pre className="bg-muted/50 rounded-xl p-4 overflow-x-auto text-xs font-mono text-foreground max-h-96 overflow-y-auto custom-scrollbar">
            <code>{response}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
            <Code2 className="w-3.5 h-3.5" />
            REST API
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            API Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integrate PayFlex BNPL eligibility checks into your application with our simple REST API.
          </p>
        </div>
      </section>

      {/* Base URL */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Base URL:</span>
            <code className="text-sm font-mono font-semibold text-foreground">/api</code>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-5xl space-y-4">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Endpoints</h2>

          <EndpointSection
            method="POST"
            path="/api/bnpl/evaluate"
            description="Evaluate BNPL eligibility for an applicant"
            requestBody={`{
  "monthlyIncome": 80000,
  "creditHistoryMonths": 30,
  "numberOfDefaults": 0,
  "productPrice": 12000
}`}
            responseBody={`{
  "status": "APPROVED",
  "isApproved": true,
  "eligibleLimit": 24000,
  "riskGrade": "A",
  "creditScore": {
    "composite": 85.5,
    "tier": "APPROVED",
    "breakdown": {
      "incomeStability": { "score": 100, "weight": 0.25, "weighted": 25 },
      "creditDepth": { "score": 83.33, "weight": 0.25, "weighted": 20.83 },
      "defaultRecord": { "score": 100, "weight": 0.30, "weighted": 30 },
      "debtBurden": { "score": 95, "weight": 0.20, "weighted": 19 }
    }
  },
  "recommendedTenure": 3,
  "emiSchedule": [ ... ],
  "suggestions": [ ... ]
}`}
          />

          <EndpointSection
            method="GET"
            path="/api/bnpl/rules"
            description="Get current rule configuration"
            responseBody={`{
  "riskBands": [
    { "grade": "A", "annualRate": 0, "limitMultiplier": 1.2, ... },
    { "grade": "B", "annualRate": 0.10, "limitMultiplier": 1.0, ... },
    ...
  ],
  "tenures": [3, 6, 9, 12],
  "maxEmiToIncomeRatio": 0.3,
  "baseLimitPercent": 0.25,
  "minIncome": 15000
}`}
          />

          <EndpointSection
            method="GET"
            path="/api/bnpl/score-breakdown"
            description="Get scoring model documentation"
            responseBody={`{
  "model": "Weighted Credit Scoring Model (0-100)",
  "factors": [
    { "name": "Income Stability", "weight": 0.25, "description": "..." },
    { "name": "Credit History Depth", "weight": 0.25, "description": "..." },
    { "name": "Default Track Record", "weight": 0.30, "description": "..." },
    { "name": "Debt Burden Ratio", "weight": 0.20, "description": "..." }
  ],
  "thresholds": { "approved": 70, "conditional": 50 }
}`}
          />

          <EndpointSection
            method="GET"
            path="/api/health"
            description="Health check endpoint"
            responseBody={`{
  "ok": true,
  "service": "payflex-bnpl",
  "version": "2.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}`}
          />
        </div>
      </section>

      {/* Live Tester */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <LiveTester />
        </div>
      </section>

      <Footer />
    </div>
  );
}
