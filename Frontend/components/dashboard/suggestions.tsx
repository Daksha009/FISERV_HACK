"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";

interface SuggestionsProps {
  suggestions: string[];
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <Card className="shadow-lg border-border/50 glass-card interactive-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          Actionable Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No suggestions at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all duration-200 animate-slide-in-left group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {suggestion}
                </p>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
