import SubCategoryForm from "@/components/sub-category/SubCategoryForm"

export default function TypesProductEditPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo loại sản phẩm</h1>
          <p className="text-muted-foreground">Tạo loại sản phẩm mới cho cửa hàng</p>
        </div>
      </div>
      <div className="mt-8">
        <SubCategoryForm />
      </div>
    </div>
  )
}
