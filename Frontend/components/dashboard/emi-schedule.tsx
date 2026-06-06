"use client";

import { useState, Fragment } from "react";
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
import { CalendarDays, CheckCircle2, XCircle, Star, ChevronDown, ChevronUp, Receipt } from "lucide-react";
import type { EMIScheduleItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EMIScheduleProps {
  schedule: EMIScheduleItem[];
  recommendedTenure: number;
  processingFee?: number;
}

export function EMISchedule({ schedule, recommendedTenure, processingFee = 0 }: EMIScheduleProps) {
  const [expandedTenure, setExpandedTenure] = useState<number | null>(null);

  return (
    <Card className="shadow-lg border-border/50 glass-card interactive-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
            <CalendarDays className="w-4 h-4 text-white" />
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
                <TableHead className="font-semibold text-foreground text-right hidden md:table-cell">Total Cost</TableHead>
                <TableHead className="font-semibold text-foreground text-right">EMI/Income %</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((item, index) => {
                const isRecommended = item.tenure === recommendedTenure;
                const isExpanded = expandedTenure === item.tenure;
                return (
                  <Fragment key={item.tenure}>
                    <TableRow 
                      className={cn(
                        "transition-all duration-200 cursor-pointer group",
                        isRecommended && "bg-[#FF6600]/5 hover:bg-[#FF6600]/10",
                        !isRecommended && "hover:bg-muted/30",
                        "animate-fade-in-up"
                      )}
                      style={{ animationDelay: `${index * 80}ms` }}
                      onClick={() => setExpandedTenure(isExpanded ? null : item.tenure)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.tenure} Months
                          {isRecommended && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-[#FF6600] text-white border-0 animate-pulse">
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
                      <TableCell className="text-right hidden md:table-cell font-medium">
                        ₹{item.totalCostOfCredit.toLocaleString()}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-semibold",
                        item.isAffordable ? "text-green-600" : "text-red-600"
                      )}>
                        {item.emiToIncomeRatio}%
                      </TableCell>
                      <TableCell className="text-center">
                        {item.isAffordable ? (
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Affordable
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Stretched
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Expanded Details */}
                    {isExpanded && (
                      <TableRow key={`${item.tenure}-details`}>
                        <TableCell colSpan={7} className="bg-muted/20 p-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm animate-fade-in-up">
                            <div>
                              <span className="text-xs text-muted-foreground block mb-0.5">Annual Rate</span>
                              <span className="font-semibold">{(item.annualRate * 100).toFixed(0)}%</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block mb-0.5">Total Payable</span>
                              <span className="font-semibold">₹{item.totalPayable.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block mb-0.5">Total Interest</span>
                              <span className="font-semibold text-amber-600">₹{item.interest.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block mb-0.5">Processing Fee</span>
                              <span className="font-semibold">₹{processingFee.toLocaleString()}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
              {/* Processing Fee Summary Row */}
              {processingFee > 0 && (
                <TableRow className="bg-muted/30 border-t-2 border-border">
                  <TableCell className="font-medium" colSpan={3}>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        One-time processing fee (added to total cost)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold hidden md:table-cell">
                    ₹{processingFee.toLocaleString()}
                  </TableCell>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
