"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getSubCategories, getProducts } from "@/lib/api"
import { DanhMuc} from "@/types"
import { useQuery } from "@tanstack/react-query"

export function ProductTab({category}:{category:DanhMuc}) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null)

  // Fetch sub-categories based on selected category
  const { data: subCategoriesData } = useQuery({
    queryKey: ['sub-categories', category?.ma],
    queryFn: () => getSubCategories({ 
      page: 1, 
      limit: 100,
      madanhmuc: category?.ma 
    }),
    enabled: !!category?.ma,
  })

  // Fetch products based on selected sub-category
  const { data: productsData } = useQuery({
    queryKey: ['products', selectedSubCategory],
    queryFn: () => getProducts({ 
      page: 1, 
      limit: 100,
      maloaisanpham: selectedSubCategory || undefined 
    }),
    enabled: !!selectedSubCategory,
  })
  const subcategories = useMemo(() =>subCategoriesData?.data || [] , [subCategoriesData?.data])
  const products = useMemo(() =>productsData?.data || [] , [productsData?.data]) 

  useEffect(() => {
    if (subcategories.length > 0 && !selectedSubCategory) {
      setSelectedSubCategory(subcategories[0].ma)
    }
  }, [subcategories, selectedSubCategory])

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        {category && (
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800">
              {category.ten}
            </h2>
            {category.mota && (
              <p className="mt-3 text-slate-600 md:text-lg max-w-2xl">{category.mota}</p>
            )}
          </div>
        )}

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
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {/* {products.map((product) => (
                      <ProductCard key={`${subcategory.ma}-${product.ma}`} product={product} />
                    ))} */}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-slate-500">No products found in this category.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {(!subcategories || subcategories.length === 0) && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {/* {products.map((product) => (
              <ProductCard key={`all-${product.ma}`} product={product} />
            ))} */}
          </div>
        )}
        
        {(!subcategories || subcategories.length === 0) && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-500">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
