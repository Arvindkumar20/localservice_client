// import React, { useEffect, useState } from "react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const daily = [
//   { day: "M", value: 40 },
//   { day: "T", value: 70 },
//   { day: "W", value: 120 },
//   { day: "T", value: 80 },
//   { day: "F", value: 90 },
//   { day: "S", value: 30 },
//   { day: "S", value: 85 },
// ];
// const monthly = [
//   { day: "M", value: 40 },
//   { day: "T", value: 70 },
//   { day: "W", value: 20 },
//   { day: "T", value: 40 },
//   { day: "F", value: 0 },
//   { day: "S", value: 30 },
//   { day: "S", value: 85 },
// ];
// const yearly = [
//   { day: "M", value: 10 },
//   { day: "T", value: 70 },
//   { day: "W", value: 20 },
//   { day: "T", value: 80 },
//   { day: "F", value: 1000 },
//   { day: "S", value: 30 },
//   { day: "S", value: 85 },
// ];

// const EarningsChart = () => {
//   const [chartData, setChartData] = useState(daily);
//   //   const maxValue = Math.max(...data.map((item) => item.value));
//   useEffect;
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-8">
//       <Tabs defaultValue="weekly" className="mb-8">
//         <TabsList className="grid grid-cols-3 w-full max-w-md">
//           <TabsTrigger value="weekly" onClick={() => setChartData(daily)}>
//             Weekly
//           </TabsTrigger>
//           <TabsTrigger value="monthly" onClick={() => setChartData(monthly)}>
//             Monthly
//           </TabsTrigger>
//           <TabsTrigger value="yearly" onClick={() => setChartData(yearly)}>
//             Yearly
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <div className="flex items-end justify-between sm:gap-6 gap-2 ">
//         {chartData.map((item, index) => {
//           return (
//             <div key={index} className="flex flex-col items-center h-64 w-full">
//               <div className="relative w-8 md:w-10 bg-slate-200 rounded-full h-full flex items-end overflow-hidden">
//                 <div
//                   style={{ height: `${item.value}px` }}
//                   className={`w-full bg-teal-600 rounded-full transition-all duration-500 `}
//                 />
//               </div>

//               <span className="mt-3 text-sm text-slate-500">{item.day}</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default EarningsChart;



// app/earnings/earnings/EarningsChart.js
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
          <p className="text-teal-600">
            ₹{payload[0].value?.toLocaleString() || 0}
          </p>
          {payload[0].payload.bookings && (
            <p className="text-sm text-muted-foreground">
              Bookings: {payload[0].payload.bookings}
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
        <div className="flex justify-between items-center mb-6">
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
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
              />
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <Tooltip content={()=><CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#0f766e"
                strokeWidth={2}
                fill="url(#colorEarnings)"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {chartData?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No earnings data available for this period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsChart;