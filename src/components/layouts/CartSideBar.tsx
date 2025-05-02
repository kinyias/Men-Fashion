"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  color: string
  size: string
  image: string
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export  function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  // Sample cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Classic Oxford Shirt",
      price: 89.99,
      quantity: 1,
      color: "Blue",
      size: "M",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Slim Fit Chinos",
      price: 69.99,
      quantity: 1,
      color: "Khaki",
      size: "32",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "Leather Weekender Bag",
      price: 199.99,
      quantity: 1,
      color: "Brown",
      size: "One Size",
      image: "/placeholder.svg?height=200&width=200",
    },
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
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
              <h2 className="font-semibold text-lg">Giỏ hàng ({cartItems.length})</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng</span>
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">Giỏ hàng của bạn đang trống</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                    Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy bắt đầu mua sắm ngay bây giờ!
                </p>
                <Button onClick={onClose}>Tiếp tục mua sắm</Button>
              </div>
            ) : (
              <div className="space-y-4 px-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b">
                    <div className="h-24 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full -mr-2"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground mt-1">
                        <p>Màu: {item.color}</p>
                        <p>Kích cỡ: {item.size}</p>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Giảm</span>
                          </Button>

                          <span className="w-8 text-center text-sm">{item.quantity}</span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Tăng</span>
                          </Button>
                        </div>

                        <p className="font-medium">{(item.price * item.quantity).toFixed(3)}đ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">${subtotal.toFixed(3)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full rounded-full">Thanh toán</Button>
                <Button variant="outline" className="w-full rounded-full" onClick={onClose}>
                  Tiếp tục mua sắm
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
