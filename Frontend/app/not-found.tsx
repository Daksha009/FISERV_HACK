import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <span className="text-[120px] md:text-[160px] font-extrabold leading-none bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent select-none">
            404
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-3xl blur-3xl -z-10" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
