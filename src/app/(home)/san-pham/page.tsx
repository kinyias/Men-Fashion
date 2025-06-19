'use client';

import SearchProducts from '@/components/search/SearchProducts';
import { SearchProductsSkeleton } from '@/components/skeleton/SearchProductsSkeleton';
import { Suspense } from 'react';

export default function SanPhamPage() {

  return (
    <Suspense fallback={<SearchProductsSkeleton />}>
      <SearchProducts />
    </Suspense>
  );
}
