"use client";

import { useState, useEffect } from "react";
import { Shield, Zap, Moon, Sun } from "lucide-react";

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("payflex-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("payflex-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("payflex-theme", "light");
    }
  };

  return (
    <header className="glass sticky top-0 z-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Fiserv Logo Mark */}
            <div className="flex items-center justify-center w-11 h-11 rounded-xl gradient-orange shadow-lg shadow-[#FF6600]/20 animate-glow-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  PayFlex
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF6600]/10 text-[#FF6600] font-semibold uppercase tracking-wider">
                  BNPL
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Smart Credit Eligibility Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="relative">
                  <Shield className="w-4 h-4 text-[#FF6600]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-900" />
                </div>
                <span className="text-xs font-medium">AI-Driven Risk Assessment</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <a href="#resources" className="text-[10px] font-semibold text-primary hover:text-primary/80 uppercase tracking-wider transition-colors">
                Financial Education
              </a>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
