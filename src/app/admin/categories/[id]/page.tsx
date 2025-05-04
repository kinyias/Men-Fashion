import CategoryForm from "@/components/categories/CategoryForm"

export default function CategoriesEditPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo danh mục</h1>
          <p className="text-muted-foreground">Tạo danh mục mới cho cửa hàng</p>
        </div>
      </div>
      <div className="mt-8">
        <CategoryForm />
      </div>
    </div>
  )
}
