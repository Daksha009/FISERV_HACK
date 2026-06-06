"use client";

import { useEffect, useState } from "react";
import type { CreditScoreResult } from "@/lib/types";

interface CreditScoreGaugeProps {
  creditScore: CreditScoreResult;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#22C55E"; // green
  if (score >= 50) return "#F59E0B"; // amber
  return "#EF4444"; // red
}

function getScoreLabel(tier: string): string {
  switch (tier) {
    case "APPROVED": return "Excellent";
    case "CONDITIONAL": return "Fair";
    case "REJECTED": return "Poor";
    default: return "";
  }
}

export function CreditScoreGauge({ creditScore, size = 180 }: CreditScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(283);

  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~283
  const scorePercent = creditScore.composite / 100;
  const targetOffset = circumference * (1 - scorePercent);
  const color = getScoreColor(creditScore.composite);

  useEffect(() => {
    // Animate score number
    const duration = 1500;
    const startTime = Date.now();
    const targetScore = creditScore.composite;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * targetScore));
      setAnimatedOffset(circumference - eased * scorePercent * circumference);

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [creditScore.composite, circumference, scorePercent]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/40"
          />
          {/* Animated score arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            style={{
              transition: "stroke 0.3s ease",
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
          {/* Glow effect */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            opacity={0.3}
            style={{
              filter: `blur(4px)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <span
          className="text-sm font-semibold px-3 py-1 rounded-full"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          {getScoreLabel(creditScore.tier)}
        </span>
      </div>
    </div>
  );
}

interface ScoreBreakdownBarsProps {
  creditScore: CreditScoreResult;
}

const factorLabels: Record<string, { label: string; icon: string }> = {
  incomeStability: { label: "Income Stability", icon: "💰" },
  creditDepth: { label: "Credit Depth", icon: "📊" },
  defaultRecord: { label: "Default Record", icon: "🛡️" },
  debtBurden: { label: "Debt Burden", icon: "⚖️" },
};

export function ScoreBreakdownBars({ creditScore }: ScoreBreakdownBarsProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const breakdown = creditScore.breakdown;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Score Breakdown
      </h4>
      {Object.entries(breakdown).map(([key, value], index) => {
        const config = factorLabels[key] || { label: key, icon: "📌" };
        const barColor = getScoreColor(value.score);

        return (
          <div
            key={key}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100 + 200}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{config.icon}</span>
                <span className="text-xs font-medium text-foreground">
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {Math.round(value.weight * 100)}%
                </span>
                <span className="text-xs font-semibold tabular-nums" style={{ color: barColor }}>
                  {value.score}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${value.score}%` : "0%",
                  backgroundColor: barColor,
                  transitionDelay: `${index * 100 + 400}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
