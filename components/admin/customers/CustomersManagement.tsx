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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Award,
  Gift,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Eye,
  Trash,
  Send,
  History,
  MapPin,
  CreditCard,
  Shield,
  Crown,
  Zap,
  RefreshCw,
  ChevronRight,
  Globe,
  Activity,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  avatar?: string;
  joined_date: string;
  last_active: string;
  status: "active" | "inactive" | "vip" | "blacklisted";
  tier: "bronze" | "silver" | "gold" | "platinum";
  total_bookings: number;
  total_spent: number;
  average_rating: number;
  loyalty_points: number;
  preferred_language: string;
  country: string;
  city?: string;
  preferences: {
    tour_types: string[];
    dietary: string[];
    accessibility: string[];
    interests: string[];
  };
  booking_history: {
    id: string;
    tour_name: string;
    date: string;
    amount: number;
    status: string;
    rating?: number;
  }[];
  notes: string;
  tags: string[];
  marketing_consent: boolean;
  referral_source?: string;
  referred_customers: number;
  lifetime_value: number;
  churn_risk: "low" | "medium" | "high";
}

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState<"list" | "grid" | "segments">("list");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Fetch real customer data from the API
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterTier !== "all") params.append("tier", filterTier);
      if (filterStatus !== "all") params.append("status", filterStatus);
      
      const response = await fetch(`/api/admin/customers?${params.toString()}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform API response to match component format
        const transformedCustomers = data.data.map((customer: any) => ({
          ...customer,
          booking_history: customer.booking_history.map((booking: any) => ({
            ...booking,
            tour_name: booking.tour_name || `Tour #${booking.tour_id}`,
            rating: booking.rating || null
          }))
        }));
        setCustomers(transformedCustomers);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.city?.toLowerCase().includes(term)
      );
    }
    
    // Apply tier filter
    if (filterTier !== "all") {
      filtered = filtered.filter(c => c.tier === filterTier);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    
    return filtered;
  }, [customers, searchTerm, filterTier, filterStatus]);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.status === "active").length;
    const vip = customers.filter(c => c.tier === "platinum" || c.tier === "gold").length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
    const avgLifetimeValue = total > 0 ? totalRevenue / total : 0;
    const highRisk = customers.filter(c => c.churn_risk === "high").length;
    
    return { total, active, vip, totalRevenue, avgLifetimeValue, highRisk };
  }, [customers]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "platinum": return <Crown className="w-4 h-4 text-purple-600" />;
      case "gold": return <Award className="w-4 h-4 text-yellow-600" />;
      case "silver": return <Zap className="w-4 h-4 text-gray-600" />;
      default: return <Shield className="w-4 h-4 text-orange-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum": return "bg-purple-100 text-purple-800 border-purple-300";
      case "gold": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "silver": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "bg-orange-100 text-orange-800 border-orange-300";
    }
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      default: return "text-green-600";
    }
  };

  const segments = [
    {
      name: "VIP Customers",
      count: customers.filter(c => c.tier === "platinum" || c.tier === "gold").length,
      value: customers.filter(c => c.tier === "platinum" || c.tier === "gold").reduce((sum, c) => sum + c.total_spent, 0),
      growth: "+15%",
      icon: Crown,
      color: "purple",
    },
    {
      name: "Frequent Travelers",
      count: customers.filter(c => c.total_bookings >= 3).length,
      value: customers.filter(c => c.total_bookings >= 3).reduce((sum, c) => sum + c.total_spent, 0),
      growth: "+8%",
      icon: TrendingUp,
      color: "blue",
    },
    {
      name: "New Customers",
      count: customers.filter(c => {
        const days = Math.floor((Date.now() - new Date(c.joined_date).getTime()) / (1000 * 60 * 60 * 24));
        return days <= 30;
      }).length,
      value: customers.filter(c => {
        const days = Math.floor((Date.now() - new Date(c.joined_date).getTime()) / (1000 * 60 * 60 * 24));
        return days <= 30;
      }).reduce((sum, c) => sum + c.total_spent, 0),
      growth: "+22%",
      icon: UserPlus,
      color: "green",
    },
    {
      name: "At Risk",
      count: customers.filter(c => c.churn_risk === "high").length,
      value: customers.filter(c => c.churn_risk === "high").reduce((sum, c) => sum + c.total_spent, 0),
      growth: "-5%",
      icon: AlertCircle,
      color: "red",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} customers • {stats.active} active • {formatCurrency(stats.totalRevenue)} lifetime value
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowAddCustomer(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <Progress value={(stats.active / stats.total) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              VIP Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vip}</div>
            <Badge variant="secondary" className="mt-2">High Value</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgLifetimeValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">4.8</span>
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segments Overview */}
      {view === "segments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <Card key={segment.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm">{segment.name}</CardTitle>
                      <p className="text-2xl font-bold mt-2">{segment.count}</p>
                    </div>
                    <div className={cn(
                      "p-2 rounded-lg",
                      segment.color === "purple" && "bg-purple-100",
                      segment.color === "blue" && "bg-blue-100",
                      segment.color === "green" && "bg-green-100",
                      segment.color === "red" && "bg-red-100"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        segment.color === "purple" && "text-purple-600",
                        segment.color === "blue" && "text-blue-600",
                        segment.color === "green" && "text-green-600",
                        segment.color === "red" && "text-red-600"
                      )} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Value: {formatCurrency(segment.value)}
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    segment.growth.startsWith("+") ? "text-green-600" : "text-red-600"
                  )}>
                    {segment.growth} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="vip">VIP</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="atrisk">At Risk</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("list")}
              >
                List
              </Button>
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("grid")}
              >
                Grid
              </Button>
              <Button
                variant={view === "segments" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("segments")}
              >
                Segments
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* Quick Actions Bar */}
          {selectedCustomers.length > 0 && (
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  {selectedCustomers.length} customer{selectedCustomers.length > 1 ? "s" : ""} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowEmailComposer(true)}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button variant="outline" size="sm">
                    <Gift className="w-4 h-4 mr-2" />
                    Send Offer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Create Segment
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Customer List/Grid */}
          {view === "list" ? (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers(filteredCustomers.map(c => c.id));
                          } else {
                            setSelectedCustomers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Lifetime Value</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className={cn(
                        "cursor-pointer hover:bg-muted/50",
                        selectedCustomers.includes(customer.id) && "bg-muted/30"
                      )}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers([...selectedCustomers, customer.id]);
                            } else {
                              setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar} />
                            <AvatarFallback>
                              {customer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.country}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{customer.email}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1", getTierColor(customer.tier))}>
                          {getTierIcon(customer.tier)}
                          {customer.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{customer.total_bookings}</p>
                          <p className="text-xs text-muted-foreground">tours</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(customer.lifetime_value)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{format(new Date(customer.last_active), "MMM dd, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(customer.last_active), { addSuffix: true })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm">{customer.average_rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-sm font-medium", getChurnRiskColor(customer.churn_risk))}>
                          {customer.churn_risk}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Gift className="w-4 h-4 mr-2" />
                              Send Offer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>
                          {customer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className={cn("gap-1", getTierColor(customer.tier))}>
                        {getTierIcon(customer.tier)}
                        {customer.tier}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>{customer.email}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bookings</span>
                      <span className="font-medium">{customer.total_bookings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lifetime Value</span>
                      <span className="font-medium">{formatCurrency(customer.lifetime_value)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Active</span>
                      <span className="text-xs">{formatDistanceToNow(new Date(customer.last_active), { addSuffix: true })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{customer.average_rating.toFixed(1)}</span>
                      </div>
                      <span className={cn("text-xs font-medium", getChurnRiskColor(customer.churn_risk))}>
                        Risk: {customer.churn_risk}
                      </span>
                    </div>
                    <div className="pt-2 border-t flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
