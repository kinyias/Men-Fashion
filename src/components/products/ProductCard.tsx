'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Star } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import toast from 'react-hot-toast';
import { BienThe, MauSac, SanPhamWithRating } from '@/types';
import { useCartStore } from '@/lib/store/cart-store';
import Link from 'next/link';
import { toSlug } from '@/utils/slug';

interface SizeWithAvailability{ ma: number; ten: string, available: boolean }
export default function ProductCard({ product }: { product: SanPhamWithRating }) {
  // Get unique colors from variants
  const uniqueColors = product.bienThes.reduce((acc, variant) => {
    if (variant.mauSac?.ma !== undefined && !acc.some(c => c.ma === variant.mauSac!.ma)) {
      acc.push(variant.mauSac);
    }
    return acc;
  }, [] as MauSac[]);

  // Get unique sizes from variants
  const uniqueSizes =product.bienThes.reduce((acc, variant) => {
    if (variant.kichCo && !acc.some(s => s.ma === variant.kichCo!.ma)) {
      acc.push({
        ma: variant.kichCo.ma,
        ten: variant.kichCo.ten,
        available: variant.soluong > 0
      });
    }
    return acc;
  }, [] as SizeWithAvailability[]);

  const [selectedColor, setSelectedColor] = useState(uniqueColors[0]);
  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { addItem } = useCartStore()
  const getSelectedVariant = ():BienThe => {
    if (!selectedColor || !selectedSize) return product.bienThes[0];
    
    return product.bienThes.find(
      (variant) => 
        variant.mauSac?.ma === selectedColor.ma && 
        variant.kichCo?.ma === selectedSize.ma
    ) || product.bienThes[0];
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    addItem({
      ma: product.ma,
      ten: product.ten,
      gia: product.giagiam || product.giaban,
      bienThe: getSelectedVariant(),
      soLuong: 1,
      hinhAnh: getMainImage() || "/placeholder.svg",
    })
    toast.success(`Đã thêm ${product.ten} vào giỏ hàng`);
    setShowQuickAdd(false);
  };
  // Get the main image for the selected color or fallback to product image
  const getMainImage = () => {
    if (product.hinhAnhMauSacs && selectedColor) {
      const colorImage = Object.values(product.hinhAnhMauSacs).flat().find(img => img.anhChinh && img.mamausac ==  selectedColor.ma);
      if (colorImage) {
        return colorImage.hinhAnh;
      }
    }
    return product.hinhanh || "/placeholder.svg";
  };
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg pt-0">
      <div className="aspect-square relative overflow-hidden bg-muted/30">
      <Link
      href={`/san-pham/${toSlug(product.ten)}-${product.ma}`}>
     
        <Image
          src={getMainImage()}
          alt={`${product.ten}`}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 transition-all duration-300 ${
           "opacity-0 group-hover:opacity-100"
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
                  {uniqueSizes.map((size) => (
                    <button
                      key={size.ma}
                      className={`min-w-[2.5rem] h-8 px-2 rounded-md text-xs font-medium transition-colors relative group/size
                        ${
                          !size.available
                            ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                            : selectedSize.ma === size.ma
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80 cursor-pointer"
                        }`}
                      disabled={!size.available}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.ten}
                      {!size.available && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/size:opacity-100 transition-opacity whitespace-nowrap">
                          Hết hàng
                        </span>
                      )}
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

      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {uniqueColors.length > 0 && (
            <div className="flex gap-1">
              {uniqueColors.map((color) => (
                <button
                  key={color.ma}
                  className={`h-5 w-5 rounded-full border cursor-pointer ${
                    selectedColor?.ma === color.ma
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'ring-0'
                  }`}
                  style={{ backgroundColor: color.ma_mau }}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedSize(uniqueSizes[0]); // Reset size when color changes
                  }}
                  aria-label={`Select ${color.ten} color`}
                  title={color.ten}
                />
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Link
            href={`/san-pham/${product.ma}`}
            >
            <h3 className="font-medium line-clamp-1 hover:text-primary transition duration-300">{product.ten}</h3>
            </Link>
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              <span className="ml-1 text-xs font-medium">
                {product.danhGia_trungbinh || 0}
              </span>
            </div>
          </div>


          <div className="flex items-center justify-start pt-1">
            {product.giagiam && product.giagiam < product.giaban ? (
              <>
                <p className="font-bold text-primary">{formatCurrency(product.giagiam)}</p>
                <p className="ml-2 text-sm text-muted-foreground line-through">
                  {formatCurrency(product.giaban)}
                </p>
              </>
            ) : (
              <p className="font-bold">{formatCurrency(product.giaban)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}