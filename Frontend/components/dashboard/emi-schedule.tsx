import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, CheckCircle2, XCircle, Star } from "lucide-react";
import type { EMIScheduleItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EMIScheduleProps {
  schedule: EMIScheduleItem[];
  recommendedTenure: number;
}

export function EMISchedule({ schedule, recommendedTenure }: EMIScheduleProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          EMI Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">Tenure</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Monthly EMI</TableHead>
                <TableHead className="font-semibold text-foreground text-right hidden sm:table-cell">Interest</TableHead>
                <TableHead className="font-semibold text-foreground text-right hidden md:table-cell">Total Payable</TableHead>
                <TableHead className="font-semibold text-foreground text-right">EMI/Income %</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((item) => {
                const isRecommended = item.tenure === recommendedTenure;
                return (
                  <TableRow 
                    key={item.tenure}
                    className={cn(
                      "transition-colors",
                      isRecommended && "bg-accent/10 hover:bg-accent/20"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.tenure} Months
                        {isRecommended && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent text-accent-foreground">
                            <Star className="w-2.5 h-2.5 mr-0.5" />
                            Best
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{item.emi.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                      ₹{item.interest.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      ₹{item.totalPayable.toLocaleString()}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-semibold",
                      item.isAffordable ? "text-green-600" : "text-red-600"
                    )}>
                      {item.emiToIncomeRatio}%
                    </TableCell>
                    <TableCell className="text-center">
                      {item.isAffordable ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Affordable
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Stretched
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
