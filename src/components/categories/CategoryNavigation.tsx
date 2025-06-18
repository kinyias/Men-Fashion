"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ArrowRight } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { LoaiSanPham } from "@/types/sub-category"
import { useQuery } from "@tanstack/react-query"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getCategoryById,getSubCategoriesByCategory } from "@/lib/api"
import { toSlug } from "@/utils/slug"

export function CategoryNavigation() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const subcategoryId = params.subcategoryId as string | undefined

  // Fetch category data
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => getCategoryById(Number(categoryId)),
    enabled: !!categoryId
  })

  // Fetch subcategories for the selected category
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => getSubCategoriesByCategory(Number(categoryId)),
    enabled: !!categoryId
  })


  const handleSubcategorySelect = (subcategoryId: number) => {
    router.push(`/danh-muc/${categoryId}/${toSlug(subcategories?.find(sub => sub.ma === subcategoryId)?.ten || '')}-${subcategoryId}`)
  }

  // If loading, show a loading state
  if (categoryLoading || subcategoriesLoading) {
    return <div className="p-8 text-center">Loading categories...</div>
  }

  // If category is selected but no subcategory, show subcategories
  if (category && !subcategoryId && subcategories && subcategories.length > 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{category.ten}</h1>
            <p className="text-muted-foreground mt-1">{category.mota}</p>
          </div>
        </div>

        {/* Desktop View (Carousel/Grid) - Hidden on mobile */}
        <div className="hidden md:block">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {subcategories?.map((subcategory: LoaiSanPham) => (
                <CarouselItem key={subcategory.ma} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div 
                    className="group cursor-pointer overflow-hidden rounded-xl relative block"
                    onClick={() => handleSubcategorySelect(subcategory.ma)}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl relative">
                      <Image
                        src={subcategory.hinhanh || "/placeholder.svg"}
                        alt={subcategory.ten}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="text-lg font-bold text-white mb-1">{subcategory.ten}</h3>
                        <p className="text-xs text-white/90 mb-2">{subcategory.mota}</p>
                        <div className="flex items-center text-white">
                          <span className="text-xs font-medium">Xem ngay</span>
                          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation controls for desktop */}
            {subcategories?.length > 4 && (
              <div className="hidden md:block">
                <CarouselPrevious className="left-0 -translate-x-1/2" />
                <CarouselNext className="right-0 translate-x-1/2" />
              </div>
            )}
          </Carousel>
        </div>

        {/* Mobile View (List) - Hidden on desktop */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-4">
            {subcategories?.map((subcategory: LoaiSanPham) => (
              <Card
                key={subcategory.ma}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md py-0"
                onClick={() => handleSubcategorySelect(subcategory.ma)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={subcategory.hinhanh || "/placeholder.svg"}
                        alt={subcategory.ten}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{subcategory.ten}</h3>
                      <p className="text-sm text-muted-foreground">{subcategory.mota}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }


  return null
}
