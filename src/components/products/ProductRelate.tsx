"use client"
import { useQuery } from "@tanstack/react-query"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ProductCard from "./ProductCard"
import { getProductsWithVariant } from "@/lib/api/api-products"
import { SanPhamQueryParams, SanPhamWithRating } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductRelate({product}: {product: SanPhamWithRating}) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['product-relate'],
    queryFn: () => {
      const params: SanPhamQueryParams = {
        page: 1,
        limit: 6,
        trangthai: true,
        maloaisanpham: product.maloaisanpham
      }
      return getProductsWithVariant(params)
    }
  })
  if(isLoading) {
    return (
          // Skeleton loading placeholders
          Array.from({ length: 4 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="space-y-2">
                <Skeleton className="aspect-square w-full h-64" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))
        )
      }
  const productList = products?.data.filter(p => p.ma !== product.ma) || []
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {isLoading ? (
          // Skeleton loading placeholders
          Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem key={`skeleton-${index}`} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="space-y-2">
                <Skeleton className="aspect-square w-full h-64" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CarouselItem>
          ))
        ) : (
            productList?.map((product) => (
            <CarouselItem key={product.ma} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))
        )}
      </CarouselContent>

      {/* Navigation controls - styled differently for mobile and desktop */}
      {(!isLoading && productList && productList.length > 4) &&
        (<div className="hidden md:block">
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </div>)}

      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <CarouselPrevious className="static translate-y-1 translate-x-0 transform-none mx-1" />
        <CarouselNext className="static translate-y-1 translate-x-0 transform-none mx-1" />
      </div>
    </Carousel>
  )
}
