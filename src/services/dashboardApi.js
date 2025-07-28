import axios from "axios";
import toast from "react-hot-toast";
import { getProviderToken } from "../utils/providerCookieUtils";

const BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const providerToken = getProviderToken();
  if (providerToken) {
    config.headers.Authorization = `Bearer ${providerToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Dashboard API Error:", error.response || error.message);
    // Don't show toast for network errors as requested
    return Promise.reject(error);
  }
);

// Dashboard Analytics APIs
export const getDashboardAnalytics = async () => {
  try {
    const response = await api.get("/provider/dashboard-analytics");
    return response.data.data;
  } catch (error) {
    // Return mock data on error
    return {
      totalBookings: 0,
      totalRevenue: 0,
      pendingBookings: 0,
      completedBookings: 0,
      monthlyData: []
    };
  }
};

export const getMonthlyChartData = async () => {
  try {
    const response = await api.get("/provider/monthly-chart-data");
    return response.data.data;
  } catch (error) {
    // Return mock data on error
    return [];
  }
};