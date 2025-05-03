import { Badge } from "@/components/ui/badge"

const recentOrders = [
  {
    id: "ORD-7352",
    customer: {
      name: "Tên khách hàng",
      email: "email@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "Shipped",
    product: "Sản phẩm 1",
    amount: "$289.99",
    date: "2 hours ago",
  },
  {
    id: "ORD-7351",
    customer: {
      name: "Tên khách hàng",
      email: "email@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "Processing",
    product: "Sản phẩm 1",
    amount: "$129.50",
    date: "5 hours ago",
  },
  {
    id: "ORD-7350",
    customer: {
      name: "Tên khách hàng",
      email: "email@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "Delivered",
    product: "Sản phẩm 1",
    amount: "$175.00",
    date: "Yesterday",
  },
  {
    id: "ORD-7349",
    customer: {
      name: "Tên khách hàng",
      email: "email@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "Delivered",
    product: "Sản phẩm 1",
    amount: "$199.99",
    date: "Yesterday",
  },
  {
    id: "ORD-7348",
    customer: {
      name: "Tên khách hàng",
      email: "email@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "Cancelled",
    product: "Sản phẩm 1",
    amount: "$45.00",
    date: "2 days ago",
  },
]

export function RecentOrders() {
  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium leading-none">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">{order.product}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                order.status === "Delivered"
                  ? "default"
                  : order.status === "Shipped"
                    ? "secondary"
                    : order.status === "Processing"
                      ? "outline"
                      : "destructive"
              }
              className="text-xs"
            >
              {order.status}
            </Badge>
            <p className="text-sm font-medium">{order.amount}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
