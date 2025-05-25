"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SanPham } from "@/types"
import { getBrands } from "@/lib/api/api-brands"
import { getColors } from "@/lib/api/api-colors"
import { getSizes } from "@/lib/api/api-sizes"
import { useQuery } from "@tanstack/react-query"
import { formatCurrency } from "@/utils/currency"

interface FilterState {
  searchQuery: string
  priceRange: [number, number]
  selectedColors: string[]
  selectedSizes: string[]
  selectedBrands: string[]
  selectedCategories: string[]
}


interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  products: SanPham[]
  onFilterApply?: () => void
}

export function ProductFilters({
  filters,
  onFiltersChange,
  onClearAll,
  hasActiveFilters,
  products,
  onFilterApply,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    price: true,
    categories: true,
    brands: true,
    colors: true,
    sizes: true,
    special: true,
  })

  // Fetch brands using react-query
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands({ page: 1, limit: 100 }),
  })
  const brands = brandsData?.data || []

  // Fetch colors using react-query
  const { data: colorsData, isLoading: colorsLoading } = useQuery({
    queryKey: ['colors'],
    queryFn: () => getColors({ page: 1, limit: 100 }),
  })
  const colors = colorsData?.data || []

  // Fetch sizes using react-query
  const { data: sizesData, isLoading: sizesLoading } = useQuery({
    queryKey: ['sizes'],
    queryFn: () => getSizes({ page: 1, limit: 100 }),
  })
  const sizes = sizesData?.data || []

  // Extract unique categories from products with null check
  const uniqueCategories = Array.from(
    new Set(
      products
        .map((p) => p.danhMuc?.ten)
        .filter((category): category is string => category !== undefined && category !== null)
    )
  ).sort()

  // Sort sizes with custom logic
  const sortedSizes = [...sizes].sort((a, b) => {
    const aNum = Number.parseInt(a.ten)
    const bNum = Number.parseInt(b.ten)
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
    if (!isNaN(aNum)) return -1
    if (!isNaN(bNum)) return 1
    return a.ten.localeCompare(b.ten)
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.selectedColors, colorId]
      : filters.selectedColors.filter((id) => id !== colorId)
    onFiltersChange({ selectedColors: newColors })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...filters.selectedSizes, size] : filters.selectedSizes.filter((s) => s !== size)
    onFiltersChange({ selectedSizes: newSizes })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.selectedBrands, brand] : filters.selectedBrands.filter((b) => b !== brand)
    onFiltersChange({ selectedBrands: newBrands })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.selectedCategories, category]
      : filters.selectedCategories.filter((c) => c !== category)
    onFiltersChange({ selectedCategories: newCategories })
  }

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "color":
        handleColorChange(value, false)
        break
      case "size":
        handleSizeChange(value, false)
        break
      case "brand":
        handleBrandChange(value, false)
        break
      case "category":
        handleCategoryChange(value, false)
        break
    }
  }

  const activeFilters = [
    ...filters.selectedColors.map((colorId) => ({
      type: "color",
      value: colorId,
      label: colors.find((c) => c.ma.toString() === colorId)?.ten || colorId,
    })),
    ...filters.selectedSizes.map((sizeId) => ({
      type: "size",
      value: sizeId,
      label: sizes.find((s) => s.ma.toString() === sizeId)?.ten || sizeId,
    })),
    ...filters.selectedBrands.map((brandId) => ({
      type: "brand",
      value: brandId,
      label: brands.find((b) => b.ma.toString() === brandId)?.ten || brandId,
    })),
    ...filters.selectedCategories.map((category) => ({
      type: "category",
      value: category,
      label: category,
    })),
  ]

  // Rest of the component remains the same
  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Bộ lọc</h3>
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Xóa tất cả
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={`${filter.type}-${filter.value}`} variant="secondary" className="gap-1">
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filter.type, filter.value)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Separator />
        </div>
      )}

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">Giá</h3>
          {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
              max={10000000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Categories */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection("categories")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">Loại sản phẩm</h3>
          {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          {uniqueCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Brands */}
      <Collapsible open={openSections.brands} onOpenChange={() => toggleSection("brands")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">Thương hiệu</h3>
          {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          {brandsLoading ? (
            <div className="text-sm text-muted-foreground">Loading brands...</div>
          ) : (
            brands.map((brand) => (
              <div key={brand.ma} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.ma}`}
                  checked={filters.selectedBrands.includes(brand.ma.toString())}
                  onCheckedChange={(checked) => handleBrandChange(brand.ma.toString(), checked as boolean)}
                />
                <Label htmlFor={`brand-${brand.ma}`} className="text-sm cursor-pointer">
                  {brand.ten}
                </Label>
              </div>
            ))
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Colors */}
      <Collapsible open={openSections.colors} onOpenChange={() => toggleSection("colors")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">Màu sắc</h3>
          {openSections.colors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {colorsLoading ? (
              <div className="text-sm text-muted-foreground">Loading colors...</div>
            ) : (
              colors.map((color) => (
                <div key={color.ma} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color.ma}`}
                    checked={filters.selectedColors.includes(color.ma.toString())}
                    onCheckedChange={(checked) => handleColorChange(color.ma.toString(), checked as boolean)}
                  />
                  <Label htmlFor={`color-${color.ma}`} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300" 
                      style={{ backgroundColor: color.ma_mau }} 
                    />
                    <span>{color.ten}</span>
                  </Label>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Sizes */}
      <Collapsible open={openSections.sizes} onOpenChange={() => toggleSection("sizes")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">Kích cỡ</h3>
          {openSections.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          <div className="grid grid-cols-3 gap-2">
            {sizesLoading ? (
              <div className="text-sm text-muted-foreground">Loading sizes...</div>
            ) : (
              sortedSizes.map((size) => (
                <div key={size.ma} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size.ma}`}
                    checked={filters.selectedSizes.includes(size.ma.toString())}
                    onCheckedChange={(checked) => handleSizeChange(size.ma.toString(), checked as boolean)}
                  />
                  <Label htmlFor={`size-${size.ma}`} className="text-sm cursor-pointer">
                    {size.ten}
                  </Label>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Special Offers and Mobile Apply Button remain the same */}
      {onFilterApply && (
        <Button onClick={onFilterApply} className="w-full lg:hidden">
          Apply Filters
        </Button>
      )}
    </div>
  )
}
