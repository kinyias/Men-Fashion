"use client"
import { useQuery } from "@tanstack/react-query"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ProductCard from "./ProductCard"
import { getProductsWithVariant } from "@/lib/api/api-products"
import { SanPhamQueryParams } from "@/types"

export function FeatureProduct() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => {
      const params: SanPhamQueryParams = {
        page: 1,
        limit: 10,
        noibat: true,
        trangthai: true
      }
      return getProductsWithVariant(params)
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {featuredProducts?.data.map((product) => (
          <CarouselItem key={product.ma} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation controls - styled differently for mobile and desktop */}
      <div className="hidden md:block">
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </div>

      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <CarouselPrevious className="static translate-x-0 transform-none mx-1" />
        <CarouselNext className="static translate-x-0 transform-none mx-1" />
      </div>
    </Carousel>
  )
}
