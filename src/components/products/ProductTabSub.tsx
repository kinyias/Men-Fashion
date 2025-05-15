"use client"
import React, { useMemo, useState } from 'react'
import { LoaiSanPham, SanPhamWithRating } from '@/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProductCard from './ProductCard'
import { useQuery } from '@tanstack/react-query'
import { getProductsWithVariant } from '@/lib/api'
import { Skeleton } from '../ui/skeleton'
interface ProductTabSubProps {
  subcategories: LoaiSanPham[]
}

export default function ProductTabSub({
  subcategories, 
}: ProductTabSubProps) {
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(subcategories[0]?.ma || null)
     // Fetch products based on selected sub-category
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', selectedSubCategory],
    queryFn: () => getProductsWithVariant({ 
      page: 1, 
      limit: 6,
      maloaisanpham: selectedSubCategory || undefined 
    }),
    enabled: !!selectedSubCategory,
  })
  const products = useMemo(() =>productsData?.data || [] , [productsData?.data]) 

  return (
    <>
     {subcategories.length > 0 && (
    <Tabs 
    defaultValue={selectedSubCategory?.toString()} 
    onValueChange={(value) => setSelectedSubCategory(Number(value))} 
    className="w-full"
  >
    <div className="flex justify-center mb-10">
      <TabsList className="h-auto bg-stone-100 p-1.5 rounded-full shadow-inner">
        {subcategories.map((subcategory) => (
          <TabsTrigger
            key={subcategory.ma}
            value={subcategory.ma.toString()}
            className="px-5 py-2.5 sm:px-6 sm:py-2.5 text-sm sm:text-base font-medium cursor-pointer text-stone-500 rounded-full hover:text-stone-800 hover:bg-stone-50/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-400 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm transition-all duration-300 ease-in-out"
          >
            {subcategory.ten}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>

    {subcategories.map((subcategory) => (
    <TabsContent key={subcategory.ma} value={subcategory.ma.toString()} className="mt-0">
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 6 }).map((_,index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-2">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_,i) => (
                  <Skeleton key={i} className="h-5 w-5 rounded-full" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="ml-1 h-4 w-8" />
                </div>
              </div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    ) : products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard key={`${subcategory.ma}-${product.ma}`} product={product} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-lg text-slate-500">Hiện tại chưa có sản phẩm</p>
      </div>
    )}
  </TabsContent>
    ))}
  </Tabs>
     )}
      {(!subcategories || subcategories.length === 0) && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-500">Hiện tại chưa có sản phẩm.</p>
          </div>
        )}
    </>
  )
}
