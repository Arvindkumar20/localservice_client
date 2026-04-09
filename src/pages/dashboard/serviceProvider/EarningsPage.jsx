// app/earnings/page.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EarningsCard from "./earnings/EarningsCard";
import EarningsChart from "./earnings/EarningsChart";
import RecentHistory from "./earnings/RecentHistory";
import { getEarningsChart, getEarningsOverview, getEarningsSummary, getRecentEarnings } from "@/services/api/earnings.service";
// import { 
//   getEarningsOverview, 
//   getEarningsChart, 
//   getRecentEarnings,
//   getEarningsSummary 
// } from "@/services/earnings.service";
// import { toast } from "react-hot-toast";

const EarningsPage = () => {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    withdrawnEarnings: 0,
    monthlyEarnings: 0,
    totalBookings: 0,
    averageEarning: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("month");
  const [summary, setSummary] = useState({
    weekly: 0,
    monthly: 0,
    yearly: 0,
    growth: 0
  });

  const fetchEarningsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [overviewRes, chartRes, recentRes, summaryRes] = await Promise.all([
        getEarningsOverview(),
        getEarningsChart(chartPeriod),
        getRecentEarnings(10, 1),
        getEarningsSummary()
      ]);
      
      console.log("Overview:", overviewRes);
      console.log("Chart:", chartRes);
      console.log("Recent:", recentRes);
      console.log("Summary:", summaryRes);
      
      if (overviewRes.success) {
        setEarningsData(overviewRes.data);
      }
      
      if (chartRes.success) {
        setChartData(chartRes.data);
      }
      
      if (recentRes.success) {
        setRecentHistory(recentRes.data);
      }
      
      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
      
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      // toast.error(error.response?.data?.message || "Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  }, [chartPeriod]);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
  };

  const handleRefresh = async () => {
    await fetchEarningsData();
    // toast.success("Earnings data refreshed");
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    // toast.success("Link copied to clipboard");
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-muted-foreground">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-6xl px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h1 className="text-2xl font-semibold">Earnings</h1>

          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Earnings Card */}
        <EarningsCard earningsData={earningsData} summary={summary} />

        {/* Chart Section */}
        <div className="mt-10">
          <EarningsChart 
            chartData={chartData} 
            period={chartPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>

        {/* History */}
        <div className="mt-12">
          <RecentHistory 
            history={recentHistory} 
            onRefresh={handleRefresh}
          />
        </div>

      </div>
    </div>
  );
};

export default EarningsPage;