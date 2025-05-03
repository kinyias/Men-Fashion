import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/utils/currency"

const popularProducts = [
  {
    id: 1,
    name: "SP1",
    category: "Danh muc",
    image: "/placeholder.svg?height=80&width=80",
    price: 500000,
    stock: 24,
    stockPercentage: 80,
    sales: 142,
  },
  {
    id: 2,
    name: "SP2",
    category: "Danh muc",
    image: "/placeholder.svg?height=80&width=80",
    price: 500000,
    stock: 56,
    stockPercentage: 70,
    sales: 98,
  },
  {
    id: 3,
    name: "SP3",
    category: "Danh muc",
    image: "/placeholder.svg?height=80&width=80",
    price: 500000,
    stock: 12,
    stockPercentage: 40,
    sales: 87,
  },
  {
    id: 4,
    name: "SP4",
    category: "Danh muc",
    image: "/placeholder.svg?height=80&width=80",
    price: 500000,
    stock: 32,
    stockPercentage: 90,
    sales: 76,
  },
]

export function FeatureProducts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {popularProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <div className="relative h-[140px] w-full overflow-hidden">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black/60 text-white hover:bg-black/70">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
                  <span className="text-sm text-muted-foreground">Đã bán {product.sales} </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Số lượng</span>
                    <span>{product.stock}</span>
                  </div>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
