"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, SearchIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

interface Color {
  id: string
  name: string
  hex: string
}

interface Product {
  name: string
  category: string
  subcategory?: string
  price: number
  image: string
  rating?: number
  colors: Color[]
}

interface SearchSidebarProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
}

export function SearchSidebar({ isOpen, onClose, products }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Use our debounce hook to delay the search
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Focus the input when the sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Search products when the debounced query changes
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simulate a slight delay as if we're fetching data
    const timer = setTimeout(() => {
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase())),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, products])

  // Handle escape key to close the sidebar
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Search Sidebar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-background z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Search Products</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search for products, categories..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {debouncedSearchQuery.trim() !== "" && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {isSearching
                    ? "Searching..."
                    : searchResults.length === 0
                      ? "No results found"
                      : `Found ${searchResults.length} results for "${debouncedSearchQuery}"`}
                </p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((product, index) => (
                  <Link
                    key={`${product.name}-${index}`}
                    href="#"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={onClose}
                  >
                    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Popular Searches - shown when no query */}
            {!debouncedSearchQuery.trim() && (
              <div>
                <h3 className="font-medium mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Shirts", "Casual", "Dress Shirts", "T-Shirts", "Accessories", "Shoes", "Outerwear", "Sale"].map(
                    (term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => setSearchQuery(term)}
                      >
                        {term}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
