"use client"

import ProductCard  from "./ProductCard"
import { Button } from "@/components/ui/button"
import { SanPhamWithRating } from "@/types"
import { Search } from "lucide-react"

export function ProductGrid({ products }: { products: SanPhamWithRating[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
        </p>
        <Button variant="outline">Xóa bộ lọc</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.ma}
          product={product}
        />
      ))}
    </div>
  )
}
