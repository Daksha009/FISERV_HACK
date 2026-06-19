import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { 
  Shield, 
  BarChart3, 
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Scale,
  Calculator
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Scoring Model | PayFlex BNPL",
  description: "Learn how PayFlex BNPL's transparent 4-factor weighted credit scoring model works — income stability, credit depth, default record, and debt burden ratio.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
            <Shield className="w-3.5 h-3.5" />
            Transparent by Design
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            How Our Credit Scoring Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlike black-box credit systems, every formula, weight, and threshold in PayFlex is fully documented and deterministic.
          </p>
        </div>
      </section>

      {/* Scoring Model */}
      <section className="py-16 px-4" id="scoring">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold text-foreground mb-8">Weighted Credit Scoring Model (0-100)</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The composite credit score is calculated as the weighted sum of four sub-scores, each normalized to a 0-100 range. 
            The formula is: <code className="px-2 py-1 rounded-md bg-muted text-sm font-mono">Composite = Σ (weight_i × sub_score_i)</code>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Income Stability",
                weight: "25%",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                formula: "score = clamp((income / product_price) / 5 × 100, 0, 100)",
                penalty: "If income < ₹15,000: score × 0.5",
                description: "Measures how comfortably your income covers the purchase. An income-to-product ratio of 5× or higher gives a perfect 100.",
              },
              {
                icon: BarChart3,
                title: "Credit History Depth",
                weight: "25%",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                formula: "score = clamp((credit_months / 36) × 100, 0, 100)",
                penalty: null,
                description: "Linear scaling — 36+ months of credit history = full score. New credit users (0 months) score 0.",
              },
              {
                icon: AlertTriangle,
                title: "Default Track Record",
                weight: "30% (Highest)",
                color: "text-violet-500",
                bg: "bg-violet-500/10",
                formula: "score = clamp(100 − (defaults × 35), 0, 100)",
                penalty: "After 3 defaults the score hits 0",
                description: "The heaviest weighted factor. Defaults are the strongest predictor of future repayment risk.",
              },
              {
                icon: Scale,
                title: "Debt Burden Ratio",
                weight: "20%",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
                formula: "score = clamp((1 − (price / annual_income) / 0.5) × 100, 0, 100)",
                penalty: null,
                description: "Measures product price relative to annual income. A ratio of 5% or less = near-perfect. 50% or higher = zero.",
              },
            ].map((factor) => (
              <div key={factor.title} className="glass-card rounded-2xl border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${factor.bg} flex items-center justify-center`}>
                    <factor.icon className={`w-5 h-5 ${factor.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{factor.title}</h3>
                    <span className="text-xs font-semibold text-muted-foreground">Weight: {factor.weight}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{factor.description}</p>
                <code className="block text-xs font-mono bg-muted/50 p-3 rounded-xl text-muted-foreground mb-2 overflow-x-auto">
                  {factor.formula}
                </code>
                {factor.penalty && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    {factor.penalty}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Thresholds */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold text-foreground mb-8">Decision Thresholds</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { range: "70-100", status: "APPROVED", color: "bg-green-500", desc: "Full approval at base risk band rate", icon: "✅" },
              { range: "50-69", status: "CONDITIONAL", color: "bg-amber-500", desc: "Approved with +4% rate increase & 80% limit reduction", icon: "⚠️" },
              { range: "0-49", status: "REJECTED", color: "bg-red-500", desc: "Does not meet minimum scoring threshold", icon: "❌" },
            ].map((tier) => (
              <div key={tier.status} className="glass-card rounded-2xl border border-border/50 p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{tier.icon}</span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1">{tier.status}</h3>
                <p className="text-2xl font-extrabold text-foreground mb-2">{tier.range}</p>
                <p className="text-sm text-muted-foreground">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Bands */}
      <section className="py-16 px-4" id="risk-bands">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold text-foreground mb-8">Risk Band Matrix</h2>
          <p className="text-muted-foreground mb-8">
            Risk bands are determined by defaults count and credit history length. Each band sets interest rates, limit multipliers, and processing fees.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-bold text-foreground">Grade</th>
                  <th className="py-3 px-4 text-left font-bold text-foreground">Max Defaults</th>
                  <th className="py-3 px-4 text-left font-bold text-foreground">Min Credit History</th>
                  <th className="py-3 px-4 text-left font-bold text-foreground">Multiplier</th>
                  <th className="py-3 px-4 text-left font-bold text-foreground">Annual Rate</th>
                  <th className="py-3 px-4 text-left font-bold text-foreground">Fee</th>
                  <th className="py-3 px-4 text-left font-bold text-foreground">Max Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { grade: "A", defaults: "0", history: "24 months", mult: "1.20×", rate: "0%", fee: "1.0%", max: "₹5,00,000", color: "bg-green-500" },
                  { grade: "B", defaults: "0", history: "12 months", mult: "1.00×", rate: "10%", fee: "1.5%", max: "₹2,00,000", color: "bg-blue-500" },
                  { grade: "C", defaults: "1", history: "6 months", mult: "0.85×", rate: "14%", fee: "2.0%", max: "₹1,00,000", color: "bg-amber-500" },
                  { grade: "D", defaults: "2", history: "0 months", mult: "0.70×", rate: "18%", fee: "2.5%", max: "₹50,000", color: "bg-red-500" },
                ].map((band) => (
                  <tr key={band.grade} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex w-8 h-8 rounded-lg ${band.color} text-white font-bold text-sm items-center justify-center`}>
                        {band.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{band.defaults}</td>
                    <td className="py-3 px-4 text-muted-foreground">{band.history}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{band.mult}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{band.rate}</td>
                    <td className="py-3 px-4 text-muted-foreground">{band.fee}</td>
                    <td className="py-3 px-4 text-muted-foreground">{band.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* EMI Formula */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">EMI Calculation</h2>
          </div>
          
          <div className="glass-card rounded-2xl border border-border/50 p-8">
            <h3 className="font-bold text-foreground mb-4">Reducing Balance Method (Bank Standard)</h3>
            <code className="block text-base font-mono bg-muted/50 p-6 rounded-xl text-foreground mb-6 text-center">
              EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)
            </code>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-muted-foreground"><strong className="text-foreground">P</strong> = Principal (product price)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-muted-foreground"><strong className="text-foreground">r</strong> = Monthly rate (Annual ÷ 12)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-muted-foreground"><strong className="text-foreground">n</strong> = Tenure in months</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Special case: When rate = 0% (Grade A), EMI = P / n (flat split). Available tenures: 3, 6, 9, 12 months.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-foreground mb-4">Try It Yourself</h2>
          <p className="text-muted-foreground mb-8">
            See how these formulas work in real-time with our interactive dashboard.
          </p>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Launch Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
