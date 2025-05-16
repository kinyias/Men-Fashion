import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function OrderConfirmationPage() {
  // Trong ứng dụng thực tế, mã đơn hàng sẽ đến từ hệ thống xử lý đơn hàng
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000)
  const orderDate = new Date().toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container px-4 py-12 md:py-24 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">Đơn hàng đã được xác nhận!</h1>
        <p className="text-muted-foreground mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
        </p>

        <div className="bg-muted/30 rounded-lg p-6 text-left mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Mã đơn hàng</h3>
              <p className="font-medium">{orderNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ngày đặt</h3>
              <p>{orderDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>customer@example.com</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tổng cộng</h3>
              <p className="font-medium">$372.97</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 bg-primary/5 p-4 rounded-lg border border-primary/20">
          <Package className="h-5 w-5 text-primary" />
          <p>Chúng tôi sẽ gửi email xác nhận khi đơn hàng của bạn được giao.</p>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Tiếp tục mua sắm</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">
              Xem đơn hàng <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
