"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductGrid } from "@/components/products/ProductGrid"
import { SearchHeader } from "@/components/layouts/SearchHeader"
import { advancedSearchProducts } from "@/lib/api/api-products"
import { useQuery } from "@tanstack/react-query"
import EllipsisPagination from "@/components/ui/EllipsisPagination"
import { CategoryNavigation } from "@/components/categories/CategoryNavigation"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface FilterState {
  searchQuery: string
  priceRange: [number, number]
  selectedColors: string[]
  selectedSizes: string[]
  selectedBrands: string[]
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = params.categoryId;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initialize state from URL parameters
  const initializeFiltersFromURL = () => {
    return {
      searchQuery: searchParams.get('search') || "",
      selectedColors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
      selectedSizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      selectedBrands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      priceRange: [
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '10000000')
      ] as [number, number],
    }
  }
  
  const [filters, setFilters] = useState<FilterState>(initializeFiltersFromURL);
  const hasActiveFilters =
    filters.selectedColors.length > 0 ||
    filters.selectedSizes.length > 0 ||
    filters.selectedBrands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000000
  
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || "ten-asc");
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12')
  });

  // Extract sort field and order from sortBy string
  const [sortField, sortOrder] = sortBy.split("-");
  
  // Update URL when filters or pagination change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add search query
    if (filters.searchQuery) params.set('search', filters.searchQuery);
    
    // Add filter arrays
    if (filters.selectedColors.length > 0) params.set('colors', filters.selectedColors.join(','));
    if (filters.selectedSizes.length > 0) params.set('sizes', filters.selectedSizes.join(','));
    if (filters.selectedBrands.length > 0) params.set('brands', filters.selectedBrands.join(','));
    
    // Add price range if not default
    if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 10000000) params.set('maxPrice', filters.priceRange[1].toString());
    
    // Add sort and pagination
    params.set('sort', sortBy);
    params.set('page', pagination.page.toString());
    params.set('limit', pagination.limit.toString());
    
    // Update URL without refreshing the page
    router.push(`/danh-muc/${categoryId}?${params.toString()}`, { scroll: false });
  }, [filters, sortBy, pagination, categoryId, router]);
  
  // Use React Query to fetch products with advanced search
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', categoryId, filters, sortBy, pagination],
    queryFn: async () => {
      // Convert string IDs to numbers for the API
      const numericCategoryId = Number(categoryId);
      
      return advancedSearchProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.searchQuery,
        // Use arrays for multiple filters
        madanhmuc: [numericCategoryId], // Start with the current category
        mathuonghieu: filters.selectedBrands.length > 0 
          ? filters.selectedBrands.map(id => Number(id)) 
          : undefined,
        mamausac: filters.selectedColors.length > 0 
          ? filters.selectedColors.map(id => Number(id)) 
          : undefined,
        makichco: filters.selectedSizes.length > 0 
          ? filters.selectedSizes.map(id => Number(id)) 
          : undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: sortField,
        sortOrder: sortOrder as 'asc' | 'desc',
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
  
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterApply = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryNavigation />
      <SearchHeader
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        resultCount={paginationData.totalItems}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              Lọc sản phẩm {hasActiveFilters && "(Đã áp dụng)"}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-10rem)] overflow-y-auto py-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={(filters) => setFilters(prev => ({ ...prev, ...filters }))}
                onClearAll={() => {
                  setFilters({
                    searchQuery: "",
                    selectedColors: [],
                    selectedSizes: [],
                    selectedBrands: [],
                    priceRange: [0, 10000000],
                  });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                hasActiveFilters={hasActiveFilters}
                onFilterApply={handleFilterApply}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters - Hidden on Mobile */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFiltersChange={(filters) => setFilters(prev => ({ ...prev, ...filters }))}
            onClearAll={() => {
              setFilters({
                searchQuery: "",
                selectedColors: [],
                selectedSizes: [],
                selectedBrands: [],
                priceRange: [0, 10000000],
              });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error loading products. Please try again.</div>
          ) : (
            <>
              <ProductGrid products={products} />
              
              {/* Pagination */}
              {paginationData.totalPages > 1 && (
                <div className="mt-8">
                  <EllipsisPagination
                    currentPage={pagination.page}
                    totalPages={paginationData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
