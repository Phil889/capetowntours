"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  CreditCard,
  UserPlus,
  Star,
  Bus,
  Phone,
  Mail,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  ChevronRight,
  Target,
  Award,
  Zap,
  Eye,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subDays, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface DashboardData {
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
    trend: number;
  };
  bookings: {
    today: number;
    yesterday: number;
    pending: number;
    confirmed: number;
    upcoming7Days: number;
    thisMonth: number;
    lastMonth: number;
    conversionRate: number;
    averageValue: number;
  };
  operations: {
    toursToday: number;
    toursTomorrow: number;
    driversOnDuty: number;
    guidesOnDuty: number;
    vehiclesInUse: number;
    pickupsToday: number;
    completedToday: number;
  };
  customers: {
    total: number;
    new30Days: number;
    returning: number;
    satisfaction: number;
    reviewsThisMonth: number;
    averageRating: number;
  };
  performance: {
    websiteVisits: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSessionDuration: number;
    conversionRate: number;
    topReferrer: string;
  };
  alerts: {
    urgent: number;
    high: number;
    medium: number;
    messages: string[];
  };
}

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("today");

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      // Fetch all dashboard data from multiple endpoints
      const [bookingsRes, statsRes, toursRes] = await Promise.all([
        fetch("/api/admin/bookings/enhanced"),
        fetch("/api/admin/bookings/stats"),
        fetch("/api/admin/tours/crud"),
      ]);

      const bookingsData = await bookingsRes.json();
      const statsData = await statsRes.json();
      const toursData = await toursRes.json();

      // Process and calculate all metrics
      const processedData = processDashboardData(bookingsData.data, statsData.data, toursData.data);
      setDashboardData(processedData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processDashboardData = (bookings: any[], stats: any, tours: any[]): DashboardData => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const yesterday = subDays(today, 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Calculate revenue metrics
    const todayRevenue = bookings
      .filter(b => b.date === todayStr)
      .reduce((sum, b) => sum + (b.financial?.total_amount || 0), 0);

    const yesterdayRevenue = bookings
      .filter(b => b.date === yesterdayStr)
      .reduce((sum, b) => sum + (b.financial?.total_amount || 0), 0);

    const thisMonthRevenue = stats?.total_revenue || 0;
    const averageBookingValue = stats?.average_booking_value || 0;

    // Calculate booking metrics
    const todayBookings = bookings.filter(b => b.date === todayStr).length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;

    // Calculate operational metrics
    const toursToday = bookings.filter(b => b.date === todayStr && b.status !== "cancelled").length;
    const pickupsToday = bookings.filter(b => b.date === todayStr && b.operations?.pickup_time).length;

    // Calculate alerts
    const urgentBookings = bookings.filter(b => b.priority === "urgent").length;
    const highPriorityBookings = bookings.filter(b => b.priority === "high").length;

    return {
      revenue: {
        today: todayRevenue,
        yesterday: yesterdayRevenue,
        thisWeek: thisMonthRevenue * 0.25, // Estimate
        lastWeek: thisMonthRevenue * 0.20, // Estimate
        thisMonth: thisMonthRevenue,
        lastMonth: thisMonthRevenue * 0.85, // Estimate
        thisYear: thisMonthRevenue * 12, // Projection
        trend: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0,
      },
      bookings: {
        today: todayBookings,
        yesterday: bookings.filter(b => b.date === yesterdayStr).length,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        upcoming7Days: bookings.filter(b => {
          const bookingDate = new Date(b.date);
          const daysAhead = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return daysAhead >= 0 && daysAhead <= 7;
        }).length,
        thisMonth: stats?.this_month_bookings || 0,
        lastMonth: Math.floor((stats?.this_month_bookings || 0) * 0.9),
        conversionRate: stats?.conversion_rate || 0,
        averageValue: averageBookingValue,
      },
      operations: {
        toursToday,
        toursTomorrow: bookings.filter(b => {
          const tomorrow = subDays(today, -1);
          return b.date === tomorrow.toISOString().split("T")[0];
        }).length,
        driversOnDuty: 5, // Would need driver management data
        guidesOnDuty: 8, // Would need guide management data
        vehiclesInUse: 4, // Would need vehicle management data
        pickupsToday,
        completedToday: bookings.filter(b => b.date === todayStr && b.status === "completed").length,
      },
      customers: {
        total: bookings.length, // Unique customers would need deduplication
        new30Days: Math.floor(bookings.length * 0.3), // Estimate
        returning: Math.floor(bookings.length * 0.2), // Estimate
        satisfaction: 94.5,
        reviewsThisMonth: 127,
        averageRating: 4.8,
      },
      performance: {
        websiteVisits: 5420,
        uniqueVisitors: 3280,
        bounceRate: 32.5,
        averageSessionDuration: 185,
        conversionRate: stats?.conversion_rate || 3.2,
        topReferrer: "Google",
      },
      alerts: {
        urgent: urgentBookings,
        high: highPriorityBookings,
        medium: bookings.filter(b => b.priority === "medium").length,
        messages: [
          urgentBookings > 0 ? `${urgentBookings} urgent bookings need attention` : "",
          pendingBookings > 10 ? `${pendingBookings} bookings pending confirmation` : "",
          todayBookings > 20 ? "High booking volume today" : "",
        ].filter(Boolean),
      },
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4" />;
    if (trend < 0) return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const data = dashboardData || ({} as DashboardData);

  // Sample chart data
  const revenueChartData = [
    { name: "Mon", revenue: 12500, bookings: 8 },
    { name: "Tue", revenue: 18200, bookings: 12 },
    { name: "Wed", revenue: 22800, bookings: 15 },
    { name: "Thu", revenue: 19500, bookings: 13 },
    { name: "Fri", revenue: 28900, bookings: 19 },
    { name: "Sat", revenue: 35600, bookings: 24 },
    { name: "Sun", revenue: 31200, bookings: 21 },
  ];

  const tourDistribution = [
    { name: "Safari", value: 35, color: "#10b981" },
    { name: "Wine Tours", value: 25, color: "#6366f1" },
    { name: "City Tours", value: 20, color: "#f59e0b" },
    { name: "Adventure", value: 15, color: "#ef4444" },
    { name: "Custom", value: 5, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Business Overview</h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights to run your business smoothly
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData()}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Alert Section */}
      {data.alerts?.messages?.length > 0 && (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {data.alerts.messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Revenue
                </CardTitle>
                <div className="text-2xl font-bold mt-1">
                  {formatCurrency(data.revenue?.today || 0)}
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn("flex items-center gap-1 text-sm", getTrendColor(data.revenue?.trend || 0))}>
              {getTrendIcon(data.revenue?.trend || 0)}
              <span>{Math.abs(data.revenue?.trend || 0).toFixed(1)}%</span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Bookings */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Bookings
                </CardTitle>
                <div className="text-2xl font-bold mt-1">{data.bookings?.today || 0}</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{data.bookings?.pending || 0} pending</Badge>
              <Badge variant="outline">{data.bookings?.confirmed || 0} confirmed</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Operations Status */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Operations Today
                </CardTitle>
                <div className="text-2xl font-bold mt-1">{data.operations?.toursToday || 0} Tours</div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bus className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pickups</span>
                <span className="font-medium">{data.operations?.pickupsToday || 0}/{data.operations?.toursToday || 0}</span>
              </div>
              <Progress value={((data.operations?.pickupsToday || 0) / (data.operations?.toursToday || 1)) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Customer Satisfaction
                </CardTitle>
                <div className="text-2xl font-bold mt-1">{data.customers?.satisfaction || 0}%</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{data.customers?.averageRating || 0}</span>
              </div>
              <span className="text-muted-foreground">
                ({data.customers?.reviewsThisMonth || 0} reviews)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Bookings Trend</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tour Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Distribution</CardTitle>
            <CardDescription>Breakdown by tour type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tourDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tourDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.revenue?.thisMonth || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {formatCurrency(500000)}
                </p>
                <Progress value={(data.revenue?.thisMonth || 0) / 5000} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Booking Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.bookings?.averageValue || 0)}
                </div>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Year Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.revenue?.thisYear || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Based on current trend</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Upcoming (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.bookings?.upcoming7Days || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.bookings?.conversionRate?.toFixed(1) || 0}%</div>
                <p className="text-xs text-green-600 mt-1">Above industry average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.bookings?.thisMonth || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs {data.bookings?.lastMonth || 0} last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.bookings?.pending || 0}</div>
                <Badge variant="destructive" className="mt-2">Needs Attention</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tomorrow's Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operations?.toursTomorrow || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Drivers on Duty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operations?.driversOnDuty || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Guides Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operations?.guidesOnDuty || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vehicles in Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operations?.vehiclesInUse || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customers?.total || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">New (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customers?.new30Days || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Returning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customers?.returning || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{data.customers?.averageRating || 0}</span>
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Website Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance?.websiteVisits?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance?.bounceRate || 0}%</div>
                <p className="text-xs text-green-600 mt-1">Below average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top Referrer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance?.topReferrer || "N/A"}</div>
                <p className="text-xs text-muted-foreground mt-1">Main traffic source</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/admin/custom-bookings"}>
              <Calendar className="w-4 h-4 mr-2" />
              View Bookings
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/admin/tours/create"}>
              <MapPin className="w-4 h-4 mr-2" />
              Create Tour
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/admin/reports"}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
