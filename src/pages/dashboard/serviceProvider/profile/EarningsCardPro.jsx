import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Wallet } from "lucide-react";

export default function EarningsCardPro({ bookings = [] }) {

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  // ✅ Current Month Earnings
  const currentMonthEarnings = bookings
    .filter(
      (b) =>
        b.paymentStatus === "paid" &&
        new Date(b.createdAt).getMonth() === currentMonth &&
        new Date(b.createdAt).getFullYear() === currentYear
    )
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // ✅ Last Month Earnings
  const lastMonthEarnings = bookings
    .filter(
      (b) =>
        b.paymentStatus === "paid" &&
        new Date(b.createdAt).getMonth() === lastMonth &&
        new Date(b.createdAt).getFullYear() === lastMonthYear
    )
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // ✅ Growth %
  let growth = 0;

  if (lastMonthEarnings > 0) {
    growth =
      ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
  }

  const isPositive = growth >= 0;

  return (
    <Card className="rounded-2xl bg-teal-700 text-white shadow-lg">
      <CardContent className="p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg">Monthly Earnings</p>
          <Wallet className="w-6 h-6 opacity-70" />
        </div>

        {/* Amount */}
        <h2 className="text-4xl font-bold">
          ₹{currentMonthEarnings.toLocaleString()}
        </h2>

        {/* Growth */}
        <div className="inline-flex items-center gap-2 bg-teal-600/70 px-4 py-2 rounded-full text-sm">
          <ArrowUpRight
            className={`w-4 h-4 ${
              isPositive ? "rotate-0" : "rotate-180"
            }`}
          />
          {Math.abs(growth).toFixed(1)}% from last month
        </div>

      </CardContent>
    </Card>
  );
}