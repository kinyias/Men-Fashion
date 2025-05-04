import ProductForm from '@/components/products/ProductForm'
import React from 'react'

export default function page() {
  return (
    <div className="container mx-auto py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tạo sản phẩm</h1>
              <p className="text-muted-foreground">Tạo sản phẩm mới cho cửa hàng</p>
            </div>
          </div>
          <div className="mt-8">
            <ProductForm />
          </div>
        </div>
  )
}
