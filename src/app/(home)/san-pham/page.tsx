'use client';

import SearchProducts from '@/components/search/SearchProducts';
import { Suspense } from 'react';

export default function SanPhamPage() {

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <SearchProducts />
    </Suspense>
  );
}
