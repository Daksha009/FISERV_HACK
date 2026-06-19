export default function DashboardLoading() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header skeleton */}
      <div className="h-16 border-b border-border/50 glass animate-pulse" />

      {/* Hero skeleton */}
      <div className="gradient-hero py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <div className="h-6 w-40 bg-white/20 rounded-full" />
              <div className="h-10 w-80 bg-white/20 rounded-xl" />
              <div className="h-4 w-96 bg-white/15 rounded-lg" />
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-24 bg-white/10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Form skeleton */}
          <div className="glass-card rounded-2xl border border-border/50 p-6 space-y-4">
            <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-12 bg-primary/20 rounded-xl animate-pulse" />
          </div>
          
          {/* Decision skeleton */}
          <div className="glass-card rounded-2xl border border-border/50 p-6 space-y-4">
            <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-40 bg-muted rounded-xl animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${80 - i * 15}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Chart skeleton */}
        <div className="glass-card rounded-2xl border border-border/50 p-6 mb-8">
          <div className="h-6 w-48 bg-muted rounded-lg animate-pulse mb-4" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
