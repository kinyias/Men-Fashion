"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Grid3X3, List } from "lucide-react"

interface CategoryData {
  [key: string]: {
    id: string
    name: string
    description: string
    image: string
    subcategories?: CategoryData
  }
}

interface CategoryNavigationProps {
  categoryData: CategoryData
  selectedCategory: string
  selectedSubcategory: string
  selectedSubSubcategory: string
  onCategorySelect: (category: string, subcategory?: string, subSubcategory?: string) => void
}

export function CategoryNavigation({
  categoryData,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  onCategorySelect,
}: CategoryNavigationProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // If no category is selected, show main categories
  if (!selectedCategory) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shop by Category</h1>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(categoryData).map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg"
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-white/90 mb-3">{category.description}</p>
                    <div className="flex items-center text-white">
                      <span className="text-sm font-medium">Explore</span>
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(categoryData).map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => onCategorySelect(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // If category is selected but no subcategory, show subcategories
  const currentCategory = categoryData[selectedCategory]
  if (currentCategory && !selectedSubcategory && currentCategory.subcategories) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
            <p className="text-muted-foreground mt-1">{currentCategory.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.values(currentCategory.subcategories).map((subcategory) => (
              <Card
                key={subcategory.id}
                className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg"
                onClick={() => onCategorySelect(selectedCategory, subcategory.id)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={subcategory.image || "/placeholder.svg"}
                    alt={subcategory.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{subcategory.name}</h3>
                    <p className="text-xs text-white/90 mb-2">{subcategory.description}</p>
                    <div className="flex items-center text-white">
                      <span className="text-xs font-medium">Shop Now</span>
                      <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(currentCategory.subcategories).map((subcategory) => (
              <Card
                key={subcategory.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => onCategorySelect(selectedCategory, subcategory.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={subcategory.image || "/placeholder.svg"}
                        alt={subcategory.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{subcategory.name}</h3>
                      <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // If subcategory is selected but no sub-subcategory, show sub-subcategories
  const currentSubcategory = currentCategory?.subcategories?.[selectedSubcategory]
  if (currentSubcategory && !selectedSubSubcategory && currentSubcategory.subcategories) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{currentSubcategory.name}</h1>
            <p className="text-muted-foreground mt-1">{currentSubcategory.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.values(currentSubcategory.subcategories).map((subSubcategory) => (
            <Card
              key={subSubcategory.id}
              className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg"
              onClick={() => onCategorySelect(selectedCategory, selectedSubcategory, subSubcategory.id)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={subSubcategory.image || "/placeholder.svg"}
                  alt={subSubcategory.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{subSubcategory.name}</h3>
                  <p className="text-xs text-white/90 mb-2">{subSubcategory.description}</p>
                  <div className="flex items-center text-white">
                    <span className="text-xs font-medium">Shop Now</span>
                    <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return null
}
