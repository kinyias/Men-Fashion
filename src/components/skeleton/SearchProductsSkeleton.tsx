// components/search/SearchProductsSkeleton.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function SearchProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Skeleton className="h-4 w-20" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Search Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      {/* Mobile Filter Button Skeleton */}
      <div className="lg:hidden mb-4">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Skeleton - Hidden on Mobile */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Skeleton className="h-9 w-full" />
        </aside>

        <main className="flex-1">
          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-9" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}