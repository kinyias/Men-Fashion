'use client'
import SubCategoryForm from "@/components/sub-category/SubCategoryForm"
import { getSubCategoryById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";


export default function TypesProductEditPage() {
  const params = useParams();
  const subCategoryId = params.id !== 'create' ? Number(params.id) : undefined;
  const isEditMode = !!subCategoryId;
  
  // Fetch sub-category data if in edit mode
  const { data: subCategory, isLoading: isLoadingSubCategory } = useQuery({
    queryKey: ['sub-category', subCategoryId],
    queryFn: () => getSubCategoryById(subCategoryId!),
    enabled: isEditMode,
  })
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo loại sản phẩm</h1>
          <p className="text-muted-foreground">Tạo loại sản phẩm mới cho cửa hàng</p>
        </div>
      </div>
      <div className="mt-8">
      {isLoadingSubCategory ? (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Đang tải dữ liệu sản phẩm...</span>
      </div>
    ) : (
        <SubCategoryForm subCategory={subCategory!} />
    )}
      </div>
    </div>
  )
}
