import BrandForm from "@/components/brands/BrandForm"

export default function BrandsEditPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo thương hiệu</h1>
          <p className="text-muted-foreground">Tạo thương hiệu mới cho cửa hàng</p>
        </div>
      </div>
      <div className="mt-8">
        <BrandForm />
      </div>
    </div>
  )
}
