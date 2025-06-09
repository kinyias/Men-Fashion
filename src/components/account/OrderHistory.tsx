"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Filter, Eye, Download, RefreshCw, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import Image from "next/image"

// Mock order data
const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 189.99,
    items: 3,
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18",
    products: [
      {
        name: "Classic Oxford Shirt",
        image: "/placeholder.svg?height=60&width=60",
        price: 89.99,
        quantity: 1,
        size: "L",
        color: "Blue",
      },
      {
        name: "Slim Fit Chinos",
        image: "/placeholder.svg?height=60&width=60",
        price: 69.99,
        quantity: 1,
        size: "34",
        color: "Khaki",
      },
      {
        name: "Leather Belt",
        image: "/placeholder.svg?height=60&width=60",
        price: 30.01,
        quantity: 1,
        size: "L",
        color: "Brown",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "shipped",
    total: 299.99,
    items: 2,
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-16",
    products: [
      {
        name: "Premium Wool Coat",
        image: "/placeholder.svg?height=60&width=60",
        price: 249.99,
        quantity: 1,
        size: "L",
        color: "Charcoal",
      },
      {
        name: "Designer Watch",
        image: "/placeholder.svg?height=60&width=60",
        price: 50.0,
        quantity: 1,
        size: "One Size",
        color: "Silver",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "processing",
    total: 79.99,
    items: 1,
    trackingNumber: null,
    estimatedDelivery: "2024-01-12",
    products: [
      {
        name: "Casual Linen Shirt",
        image: "/placeholder.svg?height=60&width=60",
        price: 79.99,
        quantity: 1,
        size: "M",
        color: "White",
      },
    ],
  },
  {
    id: "ORD-2023-045",
    date: "2023-12-20",
    status: "cancelled",
    total: 159.99,
    items: 2,
    trackingNumber: null,
    estimatedDelivery: null,
    products: [
      {
        name: "Merino Wool Sweater",
        image: "/placeholder.svg?height=60&width=60",
        price: 129.99,
        quantity: 1,
        size: "L",
        color: "Navy",
      },
      {
        name: "Cotton T-Shirt",
        image: "/placeholder.svg?height=60&width=60",
        price: 30.0,
        quantity: 1,
        size: "L",
        color: "Black",
      },
    ],
  },
]

const statusConfig = {
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
}

export function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>Track and manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "shipped").length}
              </div>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't placed any orders yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
            const isExpanded = expandedOrder === order.id

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>

                      <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} item{order.items > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleOrderExpansion(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {isExpanded ? "Hide" : "View"} Details
                        </Button>

                        {order.status === "shipped" && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Track
                          </Button>
                        )}

                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="border-t pt-4 space-y-4">
                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Tracking Number</p>
                              <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                            </div>
                            {order.estimatedDelivery && (
                              <div>
                                <p className="text-sm font-medium">Estimated Delivery</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Products */}
                      <div>
                        <h4 className="font-medium mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                              />

                              <div className="flex-1">
                                <h5 className="font-medium">{product.name}</h5>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Size: {product.size}</span>
                                  <span>Color: {product.color}</span>
                                  <span>Qty: {product.quantity}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="font-medium">${product.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>

                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Write Review
                          </Button>
                        )}

                        {order.status === "processing" && (
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
