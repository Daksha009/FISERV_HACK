import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";

interface SuggestionsProps {
  suggestions: string[];
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-accent" />
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
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-3 h-3 text-accent" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
