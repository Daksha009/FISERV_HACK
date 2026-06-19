"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, Github, Loader2, ArrowRight, Shield, Sparkles } from "lucide-react";

export function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const authError = searchParams.get("error");

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(provider);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 landing-hero-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,102,0,0.12),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow-reverse" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-foreground leading-none">PayFlex</span>
            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.15em] leading-none mt-0.5">BNPL Engine</span>
          </div>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-3xl border border-border/50 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to save your evaluations and track your credit history.
            </p>
          </div>

          {/* Error messages */}
          {(error || authError) && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm animate-fade-in-up">
              {error || "Authentication failed. Please try again."}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white dark:bg-white/10 border border-border hover:bg-gray-50 dark:hover:bg-white/15 text-foreground font-semibold text-sm transition-all duration-200 disabled:opacity-50 hover:shadow-md hover:-translate-y-0.5"
            >
              {loading === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleOAuthLogin("github")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm transition-all duration-200 disabled:opacity-50 hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {loading === "github" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-card text-muted-foreground font-medium">or</span>
            </div>
          </div>

          {/* Guest Mode */}
          <Link
            href="/dashboard?guest=true"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            Continue without account
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span>Secure OAuth</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>No data shared</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
