    "use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Package, Truck, CreditCard, MapPin, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import type { Order } from "@/components/orders/OrderManagement"
import Image from "next/image"

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [status, setStatus] = useState<string>(order.status)
  const [notes, setNotes] = useState(order.notes || "")

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount * 23000) // Chuyển đổi USD sang VND với tỷ giá ước tính
  }


  // Biểu tượng trạng thái
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "processing":
        return <Package className="h-4 w-4 text-secondary-foreground" />
      case "shipped":
        return <Truck className="h-4 w-4 text-primary" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn Hàng {order.orderNumber}</CardTitle>
        <CardDescription>Đặt vào ngày {formatDate(order.date)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="items">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="items">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="shipping">Vận Chuyển</TabsTrigger>
            <TabsTrigger value="payment">Thanh Toán</TabsTrigger>
            <TabsTrigger value="notes">Ghi Chú</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4 pt-4">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(order.total * 0.85)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thuế</span>
                <span>{formatCurrency(order.total * 0.15)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa Chỉ Giao Hàng
              </h3>
              <div className="text-sm">
                <p>{order.customer.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Trạng Thái Vận Chuyển
              </h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(status)}
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ Xử Lý</SelectItem>
                    <SelectItem value="processing">Đang Xử Lý</SelectItem>
                    <SelectItem value="shipped">Đã Gửi</SelectItem>
                    <SelectItem value="delivered">Đã Giao</SelectItem>
                    <SelectItem value="cancelled">Đã Hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full">Cập Nhật Trạng Thái Vận Chuyển</Button>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Phương Thức Thanh Toán
              </h3>
              <p className="text-sm">
                {order.paymentMethod === "Credit Card"
                  ? "Thẻ Tín Dụng"
                  : order.paymentMethod === "PayPal"
                    ? "PayPal"
                    : order.paymentMethod}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa Chỉ Thanh Toán
              </h3>
              <div className="text-sm">
                <p>{order.customer.name}</p>
                <p>{order.billingAddress.line1}</p>
                {order.billingAddress.line2 && <p>{order.billingAddress.line2}</p>}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tạo Hóa Đơn
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Ghi Chú Đơn Hàng</h3>
              <Textarea
                placeholder="Thêm ghi chú về đơn hàng này..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
              />
            </div>

            <div className="pt-2">
              <Button className="w-full">Lưu Ghi Chú</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">In Đơn Hàng</Button>
        <Button>Gửi Email Cho Khách Hàng</Button>
      </CardFooter>
    </Card>
  )
}
