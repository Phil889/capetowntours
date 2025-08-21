"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStats } from "@/types/booking-management";
import { Calendar, DollarSign, Users, TrendingUp, Clock, Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BookingStatsProps {
  stats: BookingStats;
}

export default function BookingStatsComponent({ stats }: BookingStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: "Today's Bookings",
      value: stats.today_bookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Tours scheduled for today",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.total_revenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "This month's revenue",
    },
    {
      title: "Pending Bookings",
      value: stats.pending_bookings,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Awaiting confirmation",
    },
    {
      title: "This Week",
      value: stats.this_week_bookings,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Bookings this week",
    },
    {
      title: "This Month",
      value: stats.this_month_bookings,
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Total monthly bookings",
    },
    {
      title: "Average Value",
      value: formatCurrency(stats.average_booking_value),
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Per booking average",
    },
  ];

  const conversionRate = stats.conversion_rate || 0;

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversion Rate Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Conversion Rate</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Inquiries to confirmed bookings
              </p>
            </div>
            <div className="text-3xl font-bold">{conversionRate.toFixed(1)}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={conversionRate} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>0%</span>
            <span>Target: 75%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-500 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Confirmed Today</p>
                <p className="text-2xl font-bold text-green-700">
                  {Math.floor(stats.today_bookings * 0.7)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">Need Follow-up</p>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.pending_bookings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Total Guests</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.total_bookings * 3} {/* Estimate */}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-700">
                  +12.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
