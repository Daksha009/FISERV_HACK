"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle2, XCircle, AlertTriangle, RotateCcw } from "lucide-react";
import type { EvaluationRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EvaluationHistoryProps {
  history: EvaluationRecord[];
  onReload?: (record: EvaluationRecord) => void;
}

const statusConfig = {
  APPROVED: { icon: CheckCircle2, bg: "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800", badge: "bg-green-500 text-green-50", label: "Approved" },
  CONDITIONAL: { icon: AlertTriangle, bg: "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800", badge: "bg-amber-500 text-amber-50", label: "Conditional" },
  REJECTED: { icon: XCircle, bg: "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-800", badge: "bg-red-500 text-red-50", label: "Rejected" },
};

export function EvaluationHistory({ history, onReload }: EvaluationHistoryProps) {
  return (
    <Card className="shadow-lg border-border/50 glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
            <History className="w-4 h-4 text-white" />
          </div>
          Recent Evaluations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {history.map((record, index) => {
            const status = statusConfig[record.result.status] || statusConfig.REJECTED;
            const StatusIcon = status.icon;
            return (
              <div 
                key={record.id}
                className={cn(
                  "rounded-xl p-4 border transition-all duration-200 interactive-card cursor-pointer group animate-fade-in-up relative",
                  status.bg
                )}
                style={{ animationDelay: `${index * 80}ms` }}
                onClick={() => onReload?.(record)}
              >
                {/* Reload indicator */}
                {onReload && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <Badge className={cn("text-[10px]", status.badge)}>
                    <StatusIcon className="w-2.5 h-2.5 mr-1" />
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    Grade {record.result.riskGrade}
                  </Badge>
                </div>

                {/* Credit Score Mini */}
                {record.result.creditScore && (
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${record.result.creditScore.composite}%`,
                          backgroundColor: record.result.creditScore.composite >= 70 ? '#22C55E' : record.result.creditScore.composite >= 50 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums">{record.result.creditScore.composite}</span>
                  </div>
                )}
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">₹{record.input.productPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Limit</span>
                    <span className="font-medium">₹{record.result.eligibleLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income</span>
                    <span className="font-medium">₹{record.input.monthlyIncome.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {onReload && (
                    <span className="text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to reload →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
