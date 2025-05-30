"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getFeaturedSubCategories } from "@/lib/api/api-sub-categories"
import { Skeleton } from "@/components/ui/skeleton"
import { toSlug } from "@/utils/slug"

export default function SubCategoryFeature() {
  const { data: featuredCategories, isLoading } = useQuery({
    queryKey: ['featuredSubCategories'],
    queryFn: getFeaturedSubCategories
  })

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
              <div className="group relative overflow-hidden rounded-xl block">
                <Skeleton className="aspect-square w-full h-full" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </CarouselItem>
          ))
        ) : (
          featuredCategories?.data.map((category) => (
            <CarouselItem key={category.ma} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link href={`/danh-muc/${toSlug(category?.danhMuc?.ten || "")}-${category?.danhMuc?.ma}/${toSlug(category.ten)}-${category.ma}`} className="group relative overflow-hidden rounded-xl block">
                <div className="w-full overflow-hidden rounded-xl">
                  <Image
                    src={category.hinhanh || "/placeholder.svg"}
                    alt={category.ten}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white">{category.ten}</h3>
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-white">
                      Xem ngay
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))
        )}
      </CarouselContent>

      {/* Navigation controls - styled differently for mobile and desktop */}
      {(!isLoading && featuredCategories?.data && featuredCategories.data.length > 4) &&
        (<div className="hidden md:block">
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </div>)
      }

      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <CarouselPrevious className="static translate-x-0 transform-none mx-1" />
        <CarouselNext className="static translate-x-0 transform-none mx-1" />
      </div>
    </Carousel>
  )
}
