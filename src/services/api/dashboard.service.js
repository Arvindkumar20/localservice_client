// services/dashboard.service.js
import API from ".";

// ✅ Get Dashboard Statistics
export const getDashboardStats = async (timeRange = "30days") => {
  const res = await API.get("/dashboard/stats", {
    params: { timeRange },
  });
  return res.data;
};

// ✅ Get Pending Verifications
export const getPendingVerifications = async () => {
  const res = await API.get("/dashboard/pending-verifications");
  return res.data;
};

// ✅ Approve Professional
export const approveProfessional = async (professionalId) => {
  const res = await API.put(`/dashboard/approve-professional/${professionalId}`);
  return res.data;
};

// ✅ Reject Professional
export const rejectProfessional = async (professionalId, reason = "") => {
  const res = await API.put(`/dashboard/reject-professional/${professionalId}`, { reason });
  return res.data;
};

// ✅ Get Recent Activity
export const getRecentActivity = async (limit = 10) => {
  const res = await API.get("/dashboard/recent-activity", {
    params: { limit },
  });
  return res.data;
};

// ✅ Get Revenue Chart Data
export const getRevenueChart = async (period = "week") => {
  const res = await API.get("/dashboard/revenue-chart", {
    params: { period },
  });
  return res.data;
};

// ✅ Get Top Performing Services
export const getTopServices = async (limit = 5) => {
  const res = await API.get("/dashboard/top-services", {
    params: { limit },
  });
  return res.data;
};

// ✅ Get Revenue by Category
export const getRevenueByCategory = async () => {
  const res = await API.get("/dashboard/revenue-by-category");
  return res.data;
};

// ✅ Export Dashboard Report
export const exportDashboardReport = async (format = "pdf", timeRange = "30days") => {
  const res = await API.get("/dashboard/export-report", {
    params: { format, timeRange },
    responseType: "blob",
  });
  return res.data;
};