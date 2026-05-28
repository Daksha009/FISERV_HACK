import { Shield, Zap } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Fiserv Logo Mark */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6600] text-white">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  PayFlex
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF6600]/10 text-[#FF6600] font-medium">
                  BNPL
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Smart Credit Eligibility Platform
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-[#FF6600]" />
              <span>Powered by AI-Driven Risk Assessment</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              Hackathon 2024
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
