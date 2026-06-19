import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { 
  Shield, 
  BarChart3, 
  Zap, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  Clock,
  Lock,
  Sparkles,
  ChevronRight,
  Star,
  Users,
  Activity,
  Globe
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 landing-hero-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,102,0,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_50%)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow-reverse" />

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left — Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in-up">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide">AI-Powered Credit Engine</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-in-up delay-100">
                <span className="text-foreground">Smart BNPL</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Eligibility Engine
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up delay-200">
                A transparent, rule-based credit scoring platform with a{" "}
                <span className="text-foreground font-semibold">4-factor weighted model</span>,{" "}
                real-time EMI calculations, and instant eligibility decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Try the Engine
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-background/50 backdrop-blur-sm text-foreground font-semibold text-base hover:bg-muted/50 transition-all duration-300"
                >
                  How It Works
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start animate-fade-in-up delay-400">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No sign-up required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>100% private</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>

            {/* Right — Interactive Credit Score Preview */}
            <div className="flex-1 max-w-lg w-full animate-fade-in-up delay-300">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-orange-500/10 to-indigo-500/20 rounded-3xl blur-2xl" />
                
                <div className="relative glass-card rounded-3xl border border-border/50 p-8 shadow-2xl">
                  {/* Mini score gauge */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credit Score</p>
                      <p className="text-4xl font-extrabold text-foreground mt-1">85.5</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  {/* Score breakdown bars */}
                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Income Stability", value: 100, color: "bg-emerald-500" },
                      { label: "Credit Depth", value: 67, color: "bg-blue-500" },
                      { label: "Default Record", value: 100, color: "bg-violet-500" },
                      { label: "Debt Burden", value: 95, color: "bg-amber-500" },
                    ].map((factor) => (
                      <div key={factor.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-medium">{factor.label}</span>
                          <span className="text-foreground font-bold">{factor.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${factor.color} transition-all duration-1000 ease-out`}
                            style={{ width: `${factor.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Result badge */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">APPROVED</p>
                        <p className="text-xs text-muted-foreground">Risk Grade A · 0% Interest</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
                      Grade A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 40C840 48 960 64 1080 68C1200 72 1320 64 1380 60L1440 56V80H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* ─── Stats Section ─────────────────────────────────────────────── */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10,000+", label: "Evaluations Run", color: "text-primary" },
              { icon: Activity, value: "99.9%", label: "Uptime", color: "text-green-500" },
              { icon: Clock, value: "<100ms", label: "Response Time", color: "text-blue-500" },
              { icon: Globe, value: "4", label: "Risk Bands", color: "text-violet-500" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-extrabold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section className="py-24" id="how-it-works">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
              <Zap className="w-3.5 h-3.5" />
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your BNPL eligibility decision in seconds with our transparent scoring engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Enter Details",
                desc: "Input your monthly income, credit history, defaults, and product price.",
                icon: CreditCard,
                color: "from-primary to-orange-500",
              },
              {
                step: "02",
                title: "Credit Scoring",
                desc: "Our 4-factor weighted model calculates your composite credit score (0-100).",
                icon: Shield,
                color: "from-blue-500 to-indigo-500",
              },
              {
                step: "03",
                title: "Risk Assessment",
                desc: "Automatic risk band assignment (A-D) determines your interest rate and limits.",
                icon: BarChart3,
                color: "from-violet-500 to-purple-500",
              },
              {
                step: "04",
                title: "Instant Decision",
                desc: "Get approved, conditional, or rejected with detailed EMI schedules and suggestions.",
                icon: Zap,
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative group">
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="relative glass-card rounded-2xl border border-border/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Step {item.step}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30" id="features">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-4">
              <Star className="w-3.5 h-3.5" />
              Feature-Rich
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive BNPL eligibility platform with enterprise-grade features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "4-Factor Credit Scoring",
                desc: "Weighted model evaluating income stability, credit depth, default record, and debt burden ratio.",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: BarChart3,
                title: "Reducing Balance EMI",
                desc: "Bank-standard EMI calculation with complete amortisation schedules for 3, 6, 9, and 12-month tenures.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Preview",
                desc: "Live EMI charts and financial widgets update instantly as you adjust input parameters.",
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Assistant",
                desc: "Gemini 2.0 Flash powered chatbot for financial guidance and BNPL queries.",
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                icon: CreditCard,
                title: "3D Credit Card",
                desc: "Interactive Three.js credit card visualization reflecting your approval status.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                icon: Lock,
                title: "Transparent Rules",
                desc: "Every threshold, weight, and formula is documented. No black-box decisions.",
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group glass-card rounded-2xl border border-border/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Scoring Model Preview ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-4">
                <BarChart3 className="w-3.5 h-3.5" />
                Under The Hood
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                Transparent Credit Scoring
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Unlike black-box credit scoring, our model shows you exactly how every factor contributes to your final score. Each sub-score is normalized to 0-100 and combined with configurable weights.
              </p>
              
              <div className="space-y-4">
                {[
                  "Income Stability — 25% weight, penalizes below ₹15,000",
                  "Credit History Depth — 25% weight, 36+ months = full score",
                  "Default Track Record — 30% weight, -35 points per default",
                  "Debt Burden Ratio — 20% weight, product vs annual income",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-primary font-semibold hover:gap-3 transition-all"
              >
                Learn more about the scoring model
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex-1 max-w-md w-full">
              <div className="glass-card rounded-3xl border border-border/50 p-8 shadow-xl">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Risk Band Matrix</h3>
                <div className="space-y-3">
                  {[
                    { grade: "A", rate: "0%", multiplier: "1.20×", color: "bg-green-500", maxPrice: "₹5,00,000" },
                    { grade: "B", rate: "10%", multiplier: "1.00×", color: "bg-blue-500", maxPrice: "₹2,00,000" },
                    { grade: "C", rate: "14%", multiplier: "0.85×", color: "bg-amber-500", maxPrice: "₹1,00,000" },
                    { grade: "D", rate: "18%", multiplier: "0.70×", color: "bg-red-500", maxPrice: "₹50,000" },
                  ].map((band) => (
                    <div key={band.grade} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className={`w-10 h-10 rounded-xl ${band.color} flex items-center justify-center`}>
                        <span className="text-white font-extrabold text-sm">{band.grade}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">Grade {band.grade}</span>
                          <span className="text-xs font-semibold text-muted-foreground">{band.rate} p.a.</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs text-muted-foreground">Multiplier: {band.multiplier}</span>
                          <span className="text-xs text-muted-foreground">Max: {band.maxPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
            
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Ready to Check Your Eligibility?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Get instant BNPL approval decisions with detailed EMI schedules. No sign-up required.
              </p>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
