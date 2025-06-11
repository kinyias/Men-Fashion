"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Crown, Gift } from "lucide-react"
import { useAuth } from "@/context/auth-provider"
import { formatDate } from "@/utils/formatTime"
import { formatCurrency } from "@/utils/currency"

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  memberSince: "March 2022",
  avatar: "/placeholder.svg?height=80&width=80",
  loyaltyTier: "Gold",
  loyaltyPoints: 2450,
  totalOrders: 24,
  totalSpent: 324000,
}

export function AccountHeader() {
  const { user } = useAuth();
  if(!user) return null;
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4">
            
              <div>
                <h1 className="text-2xl font-bold">{user.ten}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">Gia nhập từ {formatDate(user.ngay_tao)}</p>
              </div>
            </div>

            {/* Stats and Loyalty Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 md:ml-auto">
              {/* Loyalty Status */}
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {userData.loyaltyTier}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{userData.loyaltyPoints} Điểm</p>
                <p className="text-xs text-muted-foreground">Chương trình thành viên</p>
              </div>

              {/* Total Orders */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Gift className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-800">{userData.totalOrders}</span>
                </div>
                <p className="text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
              </div>

              {/* Total Spent */}
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-800">{formatCurrency(userData.totalSpent)}</span>
                </div>
                <p className="text-sm font-medium">Tổng tiền</p>
                <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
