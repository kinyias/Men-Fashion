"use client"

import { getCategories} from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { ProductTab } from "./ProductTab"

export function ProductTabSection() {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
  })
  const categories = categoriesData?.data || []
  return (
    <>
    {
      categories.map((category) => (
        <ProductTab key={category.ma} category={category} />
      ))
    }
    </>
  )
}
