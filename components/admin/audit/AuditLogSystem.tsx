"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  User,
  UserPlus,
  UserMinus,
  Edit,
  Trash,
  Eye,
  Lock,
  Unlock,
  DollarSign,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Database,
  Server,
  Wifi,
  WifiOff,
  Settings,
  LogIn,
  LogOut,
  Key,
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { format, formatDistanceToNow, subDays, subHours } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { logError } from "@/lib/error-logger";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  action: string;
  category: "auth" | "booking" | "tour" | "customer" | "system" | "security" | "financial";
  severity: "info" | "warning" | "error" | "critical";
  target?: {
    type: string;
    id: string;
    name: string;
  };
  details: {
    ip_address?: string;
    user_agent?: string;
    location?: string;
    device?: string;
    changes?: any;
    error?: string;
    duration?: number;
  };
  status: "success" | "failed" | "pending";
}

interface AuditStats {
  total_events: number;
  success_rate: number;
  failed_events: number;
  critical_events: number;
  active_users: number;
  suspicious_activities: number;
}

export default function AuditLogSystem() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [view, setView] = useState<"timeline" | "table" | "analytics">("timeline");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    fetchAuditData();
    const interval = setInterval(fetchAuditData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAuditData = async () => {
    try {
      setRefreshing(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (dateRange?.from) params.append("from", dateRange.from.toISOString());
      if (dateRange?.to) params.append("to", dateRange.to.toISOString());
      
      // Fetch real audit log data from API
      const response = await fetch(`/api/admin/audit-log?${params.toString()}`);
      const data = await response.json();
      
      if (data.entries) {
        // Transform API response to match component format
        const transformedEntries = transformAuditEntries(data.entries);
        setEntries(transformedEntries);
        
        // Calculate stats
        const calculatedStats = calculateStats(transformedEntries);
        setStats(calculatedStats);
      }
    } catch (error) {
      logError('Failed to fetch audit data', error as Error, {
        component: 'AuditLogSystem',
        function: 'fetchAuditData',
        dateRange
      });
      // If API fails, use some fallback data or leave empty
      setEntries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const transformAuditEntries = (rawEntries: any[]): AuditLogEntry[] => {
    return rawEntries.map((entry: any) => {
      // Parse action to determine category and severity
      const category = getActionCategory(entry.action);
      const severity = getActionSeverity(entry.action, entry.status);
      
      // Extract user info from entry or details
      const userInfo = entry.details?.user || {
        id: entry.user_id || "system",
        name: entry.details?.user_name || "System",
        email: entry.details?.user_email || "system@auto.com",
        role: entry.details?.user_role || "system"
      };
      
      return {
        id: entry.id,
        timestamp: entry.timestamp,
        user: userInfo,
        action: entry.action,
        category,
        severity,
        target: entry.target ? {
          type: entry.target.split("-")[0] || category,
          id: entry.target,
          name: entry.details?.target_name || entry.target
        } : undefined,
        details: {
          ip_address: entry.details?.ip_address,
          user_agent: entry.details?.user_agent,
          location: entry.details?.location || "Cape Town",
          device: parseDevice(entry.details?.user_agent),
          changes: entry.details?.changes,
          error: entry.details?.error,
          duration: entry.details?.duration
        },
        status: entry.status || "success"
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getActionCategory = (action: string): AuditLogEntry["category"] => {
    if (action.includes("login") || action.includes("logout") || action.includes("auth")) return "auth";
    if (action.includes("booking")) return "booking";
    if (action.includes("tour")) return "tour";
    if (action.includes("customer") || action.includes("user")) return "customer";
    if (action.includes("payment") || action.includes("financial")) return "financial";
    if (action.includes("security")) return "security";
    return "system";
  };

  const getActionSeverity = (action: string, status: string): AuditLogEntry["severity"] => {
    if (status === "failed") return "error";
    if (action.includes("delete") || action.includes("remove")) return "warning";
    if (action.includes("security") || action.includes("suspicious")) return "critical";
    if (action.includes("error") || action.includes("fail")) return "error";
    if (action.includes("warning") || action.includes("cancel")) return "warning";
    return "info";
  };

  const parseDevice = (userAgent?: string): string => {
    if (!userAgent) return "Desktop";
    if (userAgent.includes("Mobile") || userAgent.includes("Android") || userAgent.includes("iPhone")) return "Mobile";
    if (userAgent.includes("Tablet") || userAgent.includes("iPad")) return "Tablet";
    return "Desktop";
  };

  const calculateStats = (entries: AuditLogEntry[]): AuditStats => {
    const successCount = entries.filter(e => e.status === "success").length;
    const failedCount = entries.filter(e => e.status === "failed").length;
    const criticalCount = entries.filter(e => e.severity === "critical").length;
    const uniqueUsers = new Set(entries.map(e => e.user.id)).size;
    const suspiciousCount = entries.filter(e => e.category === "security").length;

    return {
      total_events: entries.length,
      success_rate: entries.length > 0 ? (successCount / entries.length) * 100 : 0,
      failed_events: failedCount,
      critical_events: criticalCount,
      active_users: uniqueUsers,
      suspicious_activities: suspiciousCount,
    };
  };

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.action.toLowerCase().includes(term) ||
        e.user.name.toLowerCase().includes(term) ||
        e.user.email.toLowerCase().includes(term) ||
        e.target?.name.toLowerCase().includes(term) ||
        e.details.location?.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(e => e.category === filterCategory);
    }
    
    // Apply severity filter
    if (filterSeverity !== "all") {
      filtered = filtered.filter(e => e.severity === filterSeverity);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(e => e.status === filterStatus);
    }
    
    return filtered;
  }, [entries, searchTerm, filterCategory, filterSeverity, filterStatus]);

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <LogIn className="w-4 h-4" />;
    if (action.includes("logout")) return <LogOut className="w-4 h-4" />;
    if (action.includes("password")) return <Key className="w-4 h-4" />;
    if (action.includes("booking")) return <Calendar className="w-4 h-4" />;
    if (action.includes("payment")) return <CreditCard className="w-4 h-4" />;
    if (action.includes("tour")) return <MapPin className="w-4 h-4" />;
    if (action.includes("customer")) return <User className="w-4 h-4" />;
    if (action.includes("security")) return <Shield className="w-4 h-4" />;
    if (action.includes("system")) return <Server className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-100";
      case "error": return "text-orange-600 bg-orange-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getDeviceIcon = (device?: string) => {
    switch (device) {
      case "Mobile": return <Smartphone className="w-4 h-4" />;
      case "Tablet": return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  // Analytics data
  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: format(subDays(new Date(), 6 - i), "EEE"),
    events: Math.floor(Math.random() * 50) + 10,
    errors: Math.floor(Math.random() * 5),
  }));

  const categoryDistribution = Object.entries(
    filteredEntries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({ category, count }));

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Audit Log & Security</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system activity, security events, and user actions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAuditData()}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Alerts */}
      {stats && stats.critical_events && stats.critical_events > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            {stats.critical_events} critical events detected in the last 7 days.
            {stats.suspicious_activities > 0 && ` ${stats.suspicious_activities} suspicious activities require review.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_events || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.success_rate.toFixed(1) || 0}%</div>
            <Progress value={stats?.success_rate || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.failed_events || 0}</div>
            <Badge variant="destructive" className="mt-1">Needs Review</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.critical_events || 0}</div>
            {stats && stats.critical_events > 0 && <AlertCircle className="w-4 h-4 text-orange-600 mt-1" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_users || 0}</div>
            <p className="text-xs text-muted-foreground">Unique users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.suspicious_activities || 0}</div>
            <Shield className="w-4 h-4 text-purple-600 mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Filters */}
        <div className="lg:w-64 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        "Pick a date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-xs">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="auth">Authentication</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="tour">Tours</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Severity</Label>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="events" stroke="#10b981" fillOpacity={1} fill="url(#colorEvents)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Event Timeline/Table */}
        <div className="flex-1">
          {/* View Selector */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={view === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={view === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("table")}
              >
                Table
              </Button>
              <Button
                variant={view === "analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("analytics")}
              >
                Analytics
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredEntries.length} events found
            </p>
          </div>

          {/* Timeline View */}
          {view === "timeline" && (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-4">
                    {filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className={cn("p-2 rounded-lg", getSeverityColor(entry.severity))}>
                          {getActionIcon(entry.action)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{entry.action.replace(".", " ").replace("_", " ")}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={entry.user.avatar} />
                                  <AvatarFallback>
                                    {entry.user.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{entry.user.name}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(entry.status)}
                              <Badge variant="outline" className="text-xs">
                                {entry.category}
                              </Badge>
                            </div>
                          </div>
                          {entry.target && (
                            <p className="text-sm text-muted-foreground">
                              Target: {entry.target.name}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {entry.details.ip_address}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {entry.details.location}
                            </span>
                            <span className="flex items-center gap-1">
                              {getDeviceIcon(entry.details.device)}
                              {entry.details.device}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Table View */}
          {view === "table" && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow
                          key={entry.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <TableCell className="text-xs">
                            {format(new Date(entry.timestamp), "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={entry.user.avatar} />
                                <AvatarFallback>
                                  {entry.user.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{entry.user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {entry.action.replace(".", " ").replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {entry.target?.name || "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {entry.details.location}
                          </TableCell>
                          <TableCell>{getStatusIcon(entry.status)}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", getSeverityColor(entry.severity))}>
                              {entry.severity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics View */}
          {view === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Event Analytics</CardTitle>
                <CardDescription>Category distribution and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Events by Category</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={categoryDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Activity Timeline</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} />
                        <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
