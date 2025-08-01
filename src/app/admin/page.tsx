"use client"
import { BarChart3 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { FeatureProducts } from "@/components/dashboard/FeatureProducts"
import { SalesChart } from "@/components/dashboard/SalesChart"
import DashboardStats from "@/components/dashboard/DashboardStats"
export default function DashboardPage() {
    return(
        <div className="p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="overview">Tổng quan</TabsTrigger>
              {/* <TabsTrigger className="cursor-pointer" value="analytics">Phân tích</TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Tổng quan đơn hàng</CardTitle>
                  <CardDescription>Doanh thu</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SalesChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Đơn hàng gần đây</CardTitle>
                  <CardDescription>Đơn hàng trong gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentOrders />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm nổi bật</CardTitle>
                  <CardDescription>Sản phẩm nổi bật trong tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <FeatureProducts />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích</CardTitle>
                <CardDescription>Phân tích chi tiêt về cửa hàng của bạn</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Tổng quan phân tích</h3>
                  <p className="text-sm text-muted-foreground">Chi tiêt phân tích ở đây</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
}
