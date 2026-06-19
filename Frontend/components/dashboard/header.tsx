"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Zap, Moon, Sun, LogOut, User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("payflex-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <header className="glass sticky top-0 z-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo Mark */}
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
          </Link>
          
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

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl border border-border/50 shadow-xl py-2 animate-fade-in-up z-50">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
