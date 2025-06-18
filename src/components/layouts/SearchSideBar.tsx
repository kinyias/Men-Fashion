'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, SearchIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency } from '@/utils/currency';
import { advancedSearchProducts } from '@/lib/api/api-products';
import { useQuery } from '@tanstack/react-query';
import { toSlug } from '@/utils/slug';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Use our custom hook for searching
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', 'search', debouncedSearchQuery],
    queryFn: () =>
      advancedSearchProducts({
        page: 1,
        limit: 5, // Limit to 5 results for quick search
        search: debouncedSearchQuery,
        sortBy: 'ma',
        sortOrder: 'desc',
        trangthai: true, // Only show active products
      }),
    enabled: debouncedSearchQuery.length >= 1, // Only search when query is at least 2 characters
  });
  const searchResults = data?.data || [];
  const isSearching = isLoading || isFetching;

  // Focus the input when the sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close the sidebar
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle Enter key press to navigate to search page
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  // Function to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded-sm">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

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
        className={`fixed top-0 left-0 right-0 bg-background z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Tìm kiếm sản phẩm</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng</span>
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Tìm kiếm sản phẩm, danh mục..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <Link
                    key={product.ma}
                    href={`/san-pham/${toSlug(product.ten)}-${product.ma}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={onClose}
                  >
                    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.hinhanh || '/placeholder.svg'}
                        alt={product.ten}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">
                        {highlightText(product.ten, debouncedSearchQuery)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.danhMuc?.ten &&
                          highlightText(
                            product.danhMuc.ten,
                            debouncedSearchQuery
                          )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-bold text-sm">
                          {formatCurrency(product.giaban)}
                        </p>
                        {product.giagiam && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.giagiam)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/san-pham?search=${encodeURIComponent(
                    debouncedSearchQuery
                  )}`}
                  className="block text-center py-3 text-sm text-primary hover:text-primary/80 font-medium"
                  onClick={onClose}
                >
                  Xem tất cả kết quả
                </Link>
              </div>
            )}

            {/* Popular Searches - shown when no query */}
            {!debouncedSearchQuery.trim() && (
              <div>
                <h3 className="font-medium mb-3">Tìm kiếm phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Áo sơ mi',
                    'Áo polo',
                    'Quần âu',
                    'Áo thun',
                    'Giày',
                    'Phụ kiện',
                  ].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
