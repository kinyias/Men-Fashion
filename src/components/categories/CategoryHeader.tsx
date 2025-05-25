"use client"

import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SortOption = "featured" | "price-low" | "price-high" | "name-az" | "name-za" | "newest" | "rating"

interface CategoryHeaderProps {
  categoryData: any
  productCount: number
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
]

export function CategoryHeader({ categoryData, productCount, sortBy, onSortChange }: CategoryHeaderProps) {
  if (!categoryData) return null

  return (
    <div className="mb-8">
      {/* Category Hero */}
      {categoryData.image && (
        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
          <Image src={categoryData.image || "/placeholder.svg"} alt={categoryData.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{categoryData.name}</h1>
            <p className="text-lg text-white/90 max-w-2xl">{categoryData.description}</p>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {!categoryData.image && (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{categoryData.name}</h1>
              <p className="text-muted-foreground">{categoryData.description}</p>
            </>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {productCount} {productCount === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
