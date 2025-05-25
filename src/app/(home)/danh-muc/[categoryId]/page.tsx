"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductGrid } from "@/components/products/ProductGrid"
import { SearchHeader } from "@/components/layouts/SearchHeader"
import { getProductsWithVariant } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

interface FilterState {
  searchQuery: string
  priceRange: [number, number]
  selectedColors: string[]
  selectedSizes: string[]
  selectedBrands: string[]
  selectedCategories: string[]
  onSale: boolean
  newArrivals: boolean
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId;
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedColors: [],
    selectedSizes: [],
    selectedBrands: [],
    selectedCategories: [],
    priceRange: [0, 10000000],
    onSale: false,
    newArrivals: false
  });
  const hasActiveFilters =
  filters.selectedColors.length > 0 ||
  filters.selectedSizes.length > 0 ||
  filters.selectedBrands.length > 0 ||
  filters.selectedCategories.length > 0 ||
  filters.onSale ||
  filters.newArrivals ||
  filters.priceRange[0] > 0 ||
  filters.priceRange[1] < 10000000
  const [sortBy, setSortBy] = useState<string>("ten-asc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12
  });

  // Extract sort field and order from sortBy string
  const [sortField, sortOrder] = sortBy.split("-");
  // Use React Query to fetch products
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', categoryId, filters, sortBy, pagination],
    queryFn: async () => {
      return getProductsWithVariant({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.searchQuery,
        madanhmuc: Number(categoryId),
        sortBy: sortField,
        sortOrder: sortOrder as 'asc' | 'desc',
        // noibat: filters.newArrivals ? true : undefined,
        trangthai: true
      });
    }
  });

  // Extract products and pagination data from the query result
  const products = data?.data || [];
  const paginationData = data?.pagination || {
    totalItems: 0,
    totalPages: 0
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        resultCount={paginationData.totalItems}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFiltersChange={(filters) => setFilters(prev => ({ ...prev, ...filters }))}
            onClearAll={() => setFilters({
              searchQuery: "",
              selectedColors: [],
              selectedSizes: [],
              selectedBrands: [],
              selectedCategories: [],
              priceRange: [0, 10000000],
              onSale: false,
              newArrivals: false
            })}
            hasActiveFilters={hasActiveFilters}
            products={products}
          />
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error loading products. Please try again.</div>
          ) : (
            <ProductGrid products={products} />
          )}
        </main>
      </div>
    </div>
  );
}
