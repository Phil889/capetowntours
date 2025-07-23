import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Users, DollarSign, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  const summaryData = [
    { title: "Total Tours", value: "12", icon: Map },
    { title: "Total Bookings", value: "152", icon: Users },
    { title: "Total Revenue", value: "$82,450", icon: DollarSign },
    { title: "Site Activity", value: "2,350", icon: Activity },
  ]

  return (
    <div>
      <h1 className="font-montserrat mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
