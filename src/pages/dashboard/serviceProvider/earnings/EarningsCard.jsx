// app/earnings/earnings/EarningsCard.js
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";

const EarningsCard = ({ earningsData, summary }) => {
  // console.log(earningsData)
  console.log(summary)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Earnings */}
      <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Total Earnings</p>
              <h3 className="text-3xl font-bold mt-2">
                ₹{summary?.yearly?.toLocaleString() || 0}
              </h3>
              <p className="text-xs mt-2 opacity-80">
                Lifetime earnings
              </p>
            </div>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Earnings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <h3 className="text-2xl font-bold mt-2">
                ₹{summary?.monthly?.toLocaleString() || 0}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${summary?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm ${summary?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary?.growth}% from last month
                </span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Earnings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <h3 className="text-2xl font-bold mt-2">
                ₹{earningsData?.pendingEarnings?.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Ready for withdrawal
              </p>
            </div>
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Withdrawn Earnings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Withdrawn</p>
              <h3 className="text-2xl font-bold mt-2">
                ₹{earningsData?.withdrawnEarnings?.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Total withdrawn amount
              </p>
            </div>
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsCard;