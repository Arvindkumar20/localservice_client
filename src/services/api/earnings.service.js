// services/earnings.service.js

import API from ".";


// ✅ Get earnings overview
export const getEarningsOverview = async () => {
  try {
    const res = await API.get("/earnings/overview");
    return res.data;
  } catch (error) {
    console.error("Error in getEarningsOverview:", error);
    throw error;
  }
};

// ✅ Get earnings chart data
export const getEarningsChart = async (period = "week") => {
  try {
    const res = await API.get("/earnings/chart", {
      params: { period }
    });
    return res.data;
  } catch (error) {
    console.error("Error in getEarningsChart:", error);
    throw error;
  }
};

// ✅ Get recent earnings
export const getRecentEarnings = async (limit = 10, page = 1) => {
  try {
    const res = await API.get("/earnings/recent", {
      params: { limit, page }
    });
    return res.data;
  } catch (error) {
    console.error("Error in getRecentEarnings:", error);
    throw error;
  }
};

// ✅ Get earnings by category
export const getEarningsByCategory = async () => {
  try {
    const res = await API.get("/earnings/by-category");
    return res.data;
  } catch (error) {
    console.error("Error in getEarningsByCategory:", error);
    throw error;
  }
};

// ✅ Get earnings summary
export const getEarningsSummary = async () => {
  try {
    const res = await API.get("/earnings/summary");
    return res.data;
  } catch (error) {
    console.error("Error in getEarningsSummary:", error);
    throw error;
  }
};

// ✅ Withdraw earnings
export const withdrawEarnings = async (withdrawalData) => {
  try {
    const res = await API.post("/earnings/withdraw", withdrawalData);
    return res.data;
  } catch (error) {
    console.error("Error in withdrawEarnings:", error);
    throw error;
  }
};