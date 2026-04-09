// app/earnings/components/EarningsChart.jsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid
} from "recharts";

const EarningsChart = ({ chartData, period, onPeriodChange }) => {
  const periods = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "quarter", label: "Quarter" },
    { key: "year", label: "Year" }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-teal-600 font-bold">
            ₹{payload[0]?.value?.toLocaleString() || 0}
          </p>
          {payload[0]?.payload?.bookings && (
            <p className="text-sm text-muted-foreground mt-1">
              Bookings: {payload[0].payload.bookings}
            </p>
          )}
          {payload[0]?.payload?.average && (
            <p className="text-sm text-muted-foreground">
              Average: ₹{payload[0].payload.average.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold">Earnings Overview</h3>
            <p className="text-sm text-muted-foreground">
              Track your earnings over time
            </p>
          </div>
          <div className="flex gap-2">
            {periods.map((p) => (
              <Button
                key={p.key}
                variant={period === p.key ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(p.key)}
                className="rounded-lg"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-80">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="_id" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                />
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No earnings data available for this period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;