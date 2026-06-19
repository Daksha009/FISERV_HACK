"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          An unexpected error occurred. Don&apos;t worry, your data is safe. 
          Try refreshing the page or go back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted/50 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
