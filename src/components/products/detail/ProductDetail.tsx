"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart,  Star,  StarHalf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ImageGallery } from "./ImageGallery"
import { SizeGuide } from "./SizeGuide"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency } from "@/utils/currency"
import toast from "react-hot-toast"
import { BienThe, MauSac, SanPhamWithRating } from "@/types"
import { ReviewsSection } from "../../reviews/ReviewSection"
import { MySizeAssistSidebar } from "./MySizeAssistSideBar"
interface SizeWithAvailability{ ma: number; ten: string, available: boolean }
interface MauSacWithAvailability extends MauSac{ available: boolean }
export default function ProductDetail({product}:{product: SanPhamWithRating}) {
    // Get unique colors from variants
  const uniqueColors = (product.bienThes || []).reduce((acc, variant) => {
    if (variant.mauSac?.ma !== undefined && !acc.some(c => c.ma === variant.mauSac!.ma)) {
      acc.push({
        ...variant.mauSac,
        available: variant.soluong > 0
      });
    }
    return acc;
  }, [] as MauSacWithAvailability[]);
  
  // Get unique sizes from variants
  const uniqueSizes =(product.bienThes || []).reduce((acc, variant) => {
    if (variant.kichCo && !acc.some(s => s.ma === variant.kichCo!.ma)) {
      acc.push({
        ma: variant.kichCo.ma,
        ten: variant.kichCo.ten,
        available: variant.soluong > 0
      });
    }
    return acc;
  }, [] as SizeWithAvailability[]);
  const [selectedColor, setSelectedColor] = useState(uniqueColors[0])
  const [selectedSize, setSelectedSize] = useState<SizeWithAvailability | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showMySizeAssist, setShowMySizeAssist] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const getSelectedVariant = ():BienThe => {
    if (!selectedColor || !selectedSize) return product.bienThes[0];
    
    return product.bienThes.find(
      (variant) => 
        variant.mauSac.ma === selectedColor.ma && 
        variant.kichCo.ma === selectedSize.ma
    ) || product.bienThes[0];
  }
  const handleAddToCart = () => {
    if (!selectedSize) {
        toast.error("Vui lòng chọn kích thước");
        return;
      }
      if (!selectedColor) {
        toast.error("Vui lòng chọn màu sắc")
        return
      }
    addItem({
        ma: product.ma,
        ten: product.ten,
        gia: product.giagiam || product.giaban,
        bienThe: getSelectedVariant(),
        soLuong: quantity,
        hinhAnh: getMainImage() || "/placeholder.svg",
      })
      toast.success(`Đã thêm ${product.ten} vào giỏ hàng`)
  }
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }
// Get the main image for the selected color or fallback to product image
const getMainImage = () => {
    if (product?.hinhAnhMauSacs && selectedColor) {
      const colorImage = Object.values(product?.hinhAnhMauSacs).flat().find(img => img.anhChinh && img.mamausac ==  selectedColor.ma);
      if (colorImage) {
        return colorImage.hinhAnh;
      }
    }
    return product.hinhanh || "/placeholder.svg";
  };
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
        {/* Image Gallery - Left Side */}
        <div className="md:col-span-1 lg:col-span-7">
          <ImageGallery
            images={product?.hinhAnhMauSacs?.[selectedColor?.ma] || []}
          />
        </div>

        {/* Product Info - Right Side */}
        <div className="md:col-span-1 lg:col-span-5">
          <div className="sticky top-8 space-y-6">
            {/* Product Title and Badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
               
                {product?.noibat && (
                  <Badge variant="outline" className="bg-amber-500 text-white hover:bg-amber-600">
                    Nổi bật
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{product.ten}</h1>

              {/* Ratings */}
              <div className="flex items-center mt-2 space-x-1">
                {product._count?.danhGias > 0 ? 
               (<>
                <div className="flex text-amber-400">
                  {[...Array(Math.floor(product.danhGia_trungbinh))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  {product.danhGia_trungbinh % 1 !== 0 && <StarHalf className="w-4 h-4 fill-current" />}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.danhGia_trungbinh} ({product._count.danhGias} đánh giá)
                </span>
                </>) : (
                 <>
                  <div className="flex text-gray-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.danhGia_trungbinh} ({product._count.danhGias} đánh giá)
                </span>
                </>
                )
                }
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              {product.giagiam && product.giagiam < product.giaban ? (
                <>
                  <span className="text-2xl font-bold">{formatCurrency(product.giagiam)}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.giaban)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">{formatCurrency(product.giaban)}</span>
              )}
            </div>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Màu sắc: {selectedColor?.ten}</h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.ma}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor?.ma === color.ma
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.ma_mau }}
                      onClick={() => setSelectedColor(color)}
                      title={color.ten}
                    />
                  ))}
                </div>
              </div>
            )}


            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Kích thước</h3>
                  <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setShowMySizeAssist(true)}
                  >
                    MySize Assist
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline cursor-pointer"
                    onClick={() => setShowSizeGuide(true)}
                  >
                    Hướng dẫn chọn size
                  </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size.ma}
                      className={`flex items-center justify-center h-12 border rounded-md transition-all ${
                        selectedSize?.ma === size.ma
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-gray-300 hover:border-primary"
                      } ${!size.available && "opacity-50 cursor-not-allowed"}`}
                      onClick={() => size.available && setSelectedSize(size)}
                      disabled={!size.available}
                    >
                      {size.ten}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Số lượng</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 mx-2 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="secondary" size="lg">
                  Mua ngay
                </Button>
               
              </div>
            </div>


            {/* Share */}
            {/* <div className="flex items-center pt-2">
              <span className="mr-2 text-sm text-muted-foreground">Share:</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá ({product._count.danhGias})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="space-y-4">
              <div dangerouslySetInnerHTML={{ __html: product.mota! }}></div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <ReviewsSection
              productId={product.ma}
              averageRating={product.danhGia_trungbinh}
              totalReviews={product._count?.danhGias || 0}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Complete the Look / Related Products */}
      {/* <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Complete the Look</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {product.relatedProducts.map((item: any) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                <p className="mt-1 font-medium">{formatCurrency(item.price)}</p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}
      {/* MySize Assist Sidebar */}
      <MySizeAssistSidebar
              isOpen={showMySizeAssist}
              onClose={() => setShowMySizeAssist(false)}
            />
      {/* Size Guide Modal */}
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </div>
  )
}
