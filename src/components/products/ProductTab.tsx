"use client"

import { useMemo } from "react"
import { getSubCategories } from "@/lib/api"
import { DanhMuc} from "@/types"
import { useQuery } from "@tanstack/react-query"
import ProductTabSub from "./ProductTabSub"

export function ProductTab({category}:{category:DanhMuc}) {


  // Fetch sub-categories based on selected category
  const { data: subCategoriesData, isLoading } = useQuery({
    queryKey: ['sub-categories', category?.ma],
    queryFn: () => getSubCategories({ 
      page: 1, 
      limit: 100,
      madanhmuc: category?.ma 
    }),
    enabled: !!category?.ma,
  })
  const subcategories = useMemo(() =>subCategoriesData?.data || [] , [subCategoriesData?.data])
  return (
    <section className="py-8 md:py-10 bg-white">
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
        {
          !isLoading && (
            <ProductTabSub subcategories={subcategories} />
          )
        }
      </div>
    </section>
  )
}
