'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Heart, ShoppingBag, Star } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import toast from 'react-hot-toast';

interface Color {
  id: string;
  name: string;
  hex: string;
}
interface Size {
  id: string
  name: string
  available: boolean
}
interface Product {
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  isNew?: boolean;
  colors: Color[];
  sizes?: Size[]
}
const defaultSizes: Size[] = [
  { id: "xs", name: "XS", available: true },
  { id: "s", name: "S", available: true },
  { id: "m", name: "M", available: true },
  { id: "l", name: "L", available: true },
  { id: "xl", name: "XL", available: true },
  { id: "xxl", name: "XXL", available: false },
]
export default function ProductCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const sizes = product.sizes || defaultSizes

  const handleAddToCart = () => {
    if (!selectedSize) {
     toast.error("Vui lòng chọn kích thước")
      return
    }

    toast.success(`Đã thêm ${product.name} (${selectedColor.name}, ${selectedSize}) vào giỏ hàng`)

    setShowQuickAdd(false)
  }
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square relative overflow-hidden bg-muted/30">
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <Image
          src={`${product.image.split('.')[0]}_${selectedColor.id}.${
            product.image.split('.')[1]
          }`}
          alt={`${product.name} in ${selectedColor.name}`}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

      <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 transition-all duration-300 ${
            showQuickAdd ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Button className="w-full mb-2" size="sm" onClick={() => setShowQuickAdd(!showQuickAdd)}>
            Thêm nhanh vào giỏ hàng
          </Button>

          {showQuickAdd && (
            <div className="bg-white rounded-md p-3 mt-2 space-y-3 animate-in fade-in-50 slide-in-from-bottom-5">
              {/* Size Selection */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-900">Chọn kích cỡ</p>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      className={`min-w-[2.5rem] h-8 px-2 rounded-md text-xs font-medium transition-colors
                        ${
                          !size.available
                            ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                            : selectedSize === size.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                        }`}
                      disabled={!size.available}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-900">Chọn màu sắc</p>
                <div className="flex gap-1.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`h-8 w-8 rounded-full border flex items-center justify-center ${
                        selectedColor.id === color.id ? "ring-2 ring-primary ring-offset-2" : "ring-0"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name} color`}
                      title={color.name}
                    >
                      {selectedColor.id === color.id && <Check className="h-3 w-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full" size="sm" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
            </div>
          )}
          </div>
          
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex gap-1">
            {product.colors.map((color) => (
              <button
                key={color.id}
                className={`h-5 w-5 rounded-full border cursor-pointer ${
                  selectedColor.id === color.id
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'ring-0'
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color.name} color`}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              <span className="ml-1 text-xs font-medium">{product.rating}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{product.category}</p>

          <div className="flex items-center justify-start pt-1">
            <p className="font-bold">{formatCurrency(product.price)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
