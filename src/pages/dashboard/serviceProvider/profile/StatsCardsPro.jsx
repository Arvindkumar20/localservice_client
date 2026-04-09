import { Card, CardContent } from "@/components/ui/card";
import { Clock, Briefcase } from "lucide-react";

export default function StatsCardsPro({ services = [], bookings = [] }) {
  
  // ✅ Calculations
  const totalServices = services.length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  const today = new Date().toDateString();

  const todaysJobs = bookings.filter(
    (b) =>
      new Date(b.serviceDate).toDateString() === today &&
      b.status === "confirmed"
  ).length;

  const newBookings = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 🔹 Pending Requests Card */}
      <Card className="group rounded-3xl bg-gradient-to-br from-teal-700 to-teal-800 text-white shadow-md hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm uppercase tracking-wide opacity-80">
                Pending
              </p>
            </div>
            <span className="text-2xl font-semibold">
              {pendingBookings}
            </span>
          </div>

          {/* Main Value */}
          <h2 className="text-4xl font-bold">
            {totalServices} Services
          </h2>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 text-sm font-medium backdrop-blur-sm">
            {pendingBookings} New Requests
          </div>

        </CardContent>
      </Card>


      {/* 🔹 Today's Jobs Card */}
      <Card className="group rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="text-sm uppercase tracking-wide opacity-80">
                Today's Jobs
              </p>
            </div>
            <span className="text-2xl font-semibold">
              {todaysJobs}
            </span>
          </div>

          {/* Main Value */}
          <h2 className="text-4xl font-bold">
            {todaysJobs > 0 ? "Active" : "No Jobs"}
          </h2>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 text-sm font-medium backdrop-blur-sm">
            {newBookings} Pending Approvals
          </div>

        </CardContent>
      </Card>

    </div>
  );
}