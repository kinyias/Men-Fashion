"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

// Update the type to accept string instead of a union type
interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  resultCount: number
  sortBy: string
  onSortChange: (sort: string) => void
}

export function SearchHeader({ onSearchChange, resultCount, sortBy, onSortChange }: SearchHeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const sortOptions = [
    { value: "ten-asc", label: "Tên: A-Z" },
    { value: "ten-desc", label: "Tên: Z-A" },
    { value: "giaban-asc", label: "Giá: Thấp đến Cao" },
    { value: "giaban-desc", label: "Giá: Cao đến Thấp" },
    { value: "danhgia-desc", label: "Đánh giá cao nhất" }
  ]
 // Debounce effect
 useEffect(() => {
  const timer = setTimeout(() => {
    onSearchChange(localSearchQuery)
  }, 800) // 800ms delay

  return () => {
    clearTimeout(timer)
  }
}, [localSearchQuery])

// // Sync with parent when searchQuery changes externally
// useEffect(() => {
//   setLocalSearchQuery(searchQuery)
// }, [searchQuery])
  return (
    <div className="mb-6 space-y-4">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm sản phẩm..."
          className="pl-10 py-6 text-lg"
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
          {localSearchQuery ? `Kết quả tìm kiếm cho "${localSearchQuery}"` : "Tất cả sản phẩm"}
          </h1>
          <p className="text-muted-foreground">
            {resultCount} {resultCount === 1 ? "sản phẩm" : "sản phẩm"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp theo:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
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
