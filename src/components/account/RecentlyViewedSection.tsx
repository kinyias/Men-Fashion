"use client"
import { Button } from "@/components/ui/button"
import ProductCard from "../products/ProductCard"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProductSeenStore } from "@/lib/store/product-seen-store"


export function RecentlyViewedSection() {
  const { clearSeenProducts, getRecentProducts } = useProductSeenStore()
  const items = getRecentProducts()
  if (items.length === 0) {
    return (
      <section>
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sản phẩm đã xem gần đây</h2>
        </header>
        <p className="text-muted-foreground">
          Bạn chưa xem bất kỳ sản phẩm nào. Các sản phẩm đã xem gần đây sẽ xuất hiện ở đây.
        </p>
      </section>
    )
  }

  return (
    <section>
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Sản phẩm đã xem gần đây
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2"
          onClick={clearSeenProducts}
          aria-label="Clear recently viewed products"
        >
          <Trash2 className="h-4 w-4" />
          Xóa tất cả
        </Button>
      </header>

      <ul
        className={cn(
          "grid gap-4",
          // responsive column count
          "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
        )}
      >
        {items.map((product) => (
          <li key={product.ma} className="relative group">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}
