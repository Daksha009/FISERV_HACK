import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle2, XCircle } from "lucide-react";
import type { EvaluationRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EvaluationHistoryProps {
  history: EvaluationRecord[];
}

export function EvaluationHistory({ history }: EvaluationHistoryProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <History className="w-4 h-4 text-primary" />
          </div>
          Recent Evaluations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {history.map((record) => (
            <div 
              key={record.id}
              className={cn(
                "rounded-xl p-4 border transition-all hover:shadow-md",
                record.result.isApproved 
                  ? "bg-green-50/50 border-green-200 hover:border-green-300" 
                  : "bg-red-50/50 border-red-200 hover:border-red-300"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                {record.result.isApproved ? (
                  <Badge className="bg-green-500 text-green-50 text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                    Approved
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-red-50 text-[10px]">
                    <XCircle className="w-2.5 h-2.5 mr-1" />
                    Rejected
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] px-1.5">
                  Grade {record.result.riskGrade}
                </Badge>
              </div>
              
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
              
              <div className="mt-3 pt-2 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground">
                  {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
