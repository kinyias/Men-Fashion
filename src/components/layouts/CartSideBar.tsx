"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import Link from "next/link"
import { formatCurrency } from "@/utils/currency"
import { ScrollArea } from "../ui/scroll-area"



export  function CartSidebar() {
  const { items, isOpen, closeCart, updateItemQuantity, removeItem, itemCount, subtotal } = useCartStore()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity" onClick={closeCart} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full xs:w-[90%] sm:w-96 bg-background z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="font-semibold text-lg">Giỏ hàng ({itemCount()})</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng</span>
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">Giỏ hàng của bạn đang trống</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                    Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy bắt đầu mua sắm ngay bây giờ!
                </p>
                <Button onClick={closeCart}>Tiếp tục mua sắm</Button>
              </div>
            ) : (
              <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.ma}-${item.mauSac.ma}-${item.kichCo.ma}`} className="flex gap-4">
                    <div className="relative h-24 w-20 overflow-hidden rounded-md bg-muted">
                      <Image src={item.hinhAnh || "/placeholder.svg"} alt={item.ten} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <Link
                            href={`/san-pham/${item.ma}`}
                            className="font-medium hover:underline"
                            onClick={closeCart}
                          >
                            {item.ten}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => removeItem(item.ma, item.mauSac.ma, item.kichCo.ma)}
                            aria-label={`Remove ${item.ten} from cart`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span>
                            {item.mauSac.ten} / {item.kichCo.ten}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              updateItemQuantity(item.ma, item.mauSac.ma, item.kichCo.ma, Math.max(1, item.soLuong - 1))
                            }
                            disabled={item.soLuong <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          {/* <span className="w-8 text-center text-sm">{item.soLuong}</span> */}
                          <input
                            type="number"
                            min="1"
                            value={item.soLuong}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              updateItemQuantity(item.ma, item.mauSac.ma, item.kichCo.ma, Math.max(1, value));
                            }}
                            className="w-12 text-center text-sm border-0 focus:ring-0 focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              updateItemQuantity(item.ma, item.mauSac.ma, item.kichCo.ma, item.soLuong + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium">{formatCurrency(item.gia * item.soLuong)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(subtotal())}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href={'/thanh-toan'}>
                <Button className="w-full rounded-full" onClick={closeCart}>Thanh toán</Button>
                </Link>
                <Button variant="outline" className="w-full rounded-full" onClick={closeCart}>
                  Tiếp tục mua sắm
                </Button>
              </div>
              <div className="text-xs text-center text-muted-foreground pt-2">
                <p>Phí giao hàng và nhập khuyễn mãi ở trang thanh toán</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
