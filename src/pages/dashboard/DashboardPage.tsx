import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  CreditCard,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import RecentBookingsTable from "../../components/dashboard/RecentBookingsTable";
import BookingCalendar from "../../components/dashboard/BookingCalendar";
import RevenueChart from "../../components/dashboard/RevenueChart";
import BookingsChart from "../../components/dashboard/BookingsChart";
import { getProviderMandaps } from "../../services/mandapApi";
import { getBookingsByProvider } from "../../services/bookingApi";
import { getDashboardAnalytics, getMonthlyChartData } from "../../services/dashboardApi";

const DashboardPage: React.FC = () => {
  const [mandaps, setMandaps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [mandapsData, bookingsData, analyticsData, chartData] = await Promise.all([
        getProviderMandaps(),
        getBookingsByProvider(1, 10), // Get recent 10 bookings
        
       
      ]);

      setMandaps(mandapsData);
      setBookings(bookingsData);
      setAnalytics(analyticsData);
      setMonthlyData(chartData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentBookings = bookings.slice(0, 5);
  const blockedDates = []; // This would come from API if implemented

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={analytics.totalBookings}
          icon={<BookOpen className="h-6 w-6" />}
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          icon={<CreditCard className="h-6 w-6" />}
          change={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Pending Bookings"
          value={analytics.pendingBookings}
          icon={<CalendarIcon className="h-6 w-6" />}
          change={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Completed Bookings"
          value={analytics.completedBookings}
          icon={<TrendingUp className="h-6 w-6" />}
          change={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={monthlyData} />
        <BookingsChart data={monthlyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={recentBookings} />
        </div>
        <div>
          <BookingCalendar bookings={bookings} blockedDates={blockedDates} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
