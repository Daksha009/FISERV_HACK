"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import type { EMIScheduleItem } from "@/lib/types";

interface EMIChartProps {
  schedule: EMIScheduleItem[];
}

export function EMIChart({ schedule }: EMIChartProps) {
  const chartData = schedule.map((item) => {
    const principalPerMonth = item.totalPayable > 0
      ? Math.round((item.totalPayable - item.interest) / item.tenure)
      : item.emi;
    const interestPerMonth = Math.round(item.interest / item.tenure);

    return {
      tenure: `${item.tenure}M`,
      principal: principalPerMonth,
      interest: interestPerMonth,
      emi: item.emi,
      isAffordable: item.isAffordable,
      totalPayable: item.totalPayable,
    };
  });

  return (
    <Card className="shadow-lg border-border/50 glass-card interactive-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow-sm">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          EMI Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6600" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#FF6600" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#374151" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#374151" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="tenure" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString()}`,
                  name === 'principal' ? 'Principal/mo' : 'Interest/mo'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700, marginBottom: '4px' }}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px', fontWeight: 500 }}>
                    {value === 'principal' ? 'Principal' : 'Interest'}
                  </span>
                )}
              />
              <Bar 
                dataKey="principal" 
                stackId="emi" 
                fill="url(#principalGradient)" 
                radius={[0, 0, 0, 0]}
                maxBarSize={45}
                animationBegin={200}
                animationDuration={800}
              />
              <Bar 
                dataKey="interest" 
                stackId="emi" 
                fill="url(#interestGradient)" 
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
                animationBegin={400}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg, #FF6600 0%, #FF660099 100%)' }} />
            <span className="text-muted-foreground font-medium">Principal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg, #374151cc 0%, #37415166 100%)' }} />
            <span className="text-muted-foreground font-medium">Interest</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
