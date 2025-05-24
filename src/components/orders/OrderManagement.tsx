"use client"

import { useState } from "react"
import { OrdersTable } from "@/components/orders/OrderTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"
import { ExportDialog } from "./ExportDialog"
import { useQuery } from "@tanstack/react-query"
import { getOrders } from "@/lib/api"
import { TrangThaiDonHang } from "@/types"

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  
  // Fetch all orders for export
  const { data } = useQuery({
    queryKey: ['orders-export'],
    queryFn: () => getOrders({ 
      page: 1, 
      limit: 1000, // Get a large number of orders for export
    }),
    enabled: exportDialogOpen, // Only fetch when dialog is open
    staleTime: 5 * 60 * 1000,
  });
  
  const allOrders = data?.data || []

  return (
    <div className="space-x-4">
        <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-5">
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Đơn Hàng</h1>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả</SelectItem>
              <SelectItem value={TrangThaiDonHang.DA_DAT}>Đã Đặt</SelectItem>
              <SelectItem value={TrangThaiDonHang.DANG_XU_LY}>Đang Xử Lý</SelectItem>
              <SelectItem value={TrangThaiDonHang.DANG_GIAO_HANG}>Đang Giao Hàng</SelectItem>
              <SelectItem value={TrangThaiDonHang.DA_GIAO_HANG}>Đã Giao</SelectItem>
              <SelectItem value={TrangThaiDonHang.DA_HUY}>Đã Hủy</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            Xuất Dữ Liệu
          </Button>
        </div>
        </div>
      <div className="w-full">
        <OrdersTable searchQuery={searchQuery} statusFilter={statusFilter} />
      </div>
      </div>
      
      {/* Export Dialog */}
      <ExportDialog 
        isOpen={exportDialogOpen} 
        onClose={() => setExportDialogOpen(false)} 
        orders={allOrders}
      />
    </div>
  )
}

// Types
export interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  notes?: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}
