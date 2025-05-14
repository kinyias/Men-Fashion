'use client'
import ProductForm from '@/components/products/ProductForm'
import { getProductById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react'

export default function ProductEditPage() {
  const params = useParams();
  const productId = params.id !== 'create' ? Number(params.id) : undefined;
  const isEditMode = !!productId;
  
  // Fetch color data if in edit mode
  // Fetch product data if in edit mode
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId!),
    enabled: isEditMode,
  })
  return (
    <div className="container mx-auto py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Sửa thông tin sản phẩm' : 'Tạo sản phẩm'}</h1>
              <p className="text-muted-foreground">{isEditMode ? 'Sửa thông tin sản phẩm cho cửa hàng' : 'Tạo sản phẩm mới cho cửa hàng'}</p>
            </div>
          </div>
          <div className="mt-8">
          {isLoadingProduct ? (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Đang tải dữ liệu sản phẩm...</span>
      </div>
    ) : (
            <ProductForm product={product!} />
    )}
          </div>
        </div>
  )
}
