'use client';

import CategoryForm from "@/components/categories/CategoryForm"
import { use } from "react";

export default function CategoriesEditPage({ params }: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const isNewCategory = id === "create";
  
  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewCategory ? "Tạo danh mục" : "Chỉnh sửa danh mục"}
          </h1>
          <p className="text-muted-foreground">
            {isNewCategory ? "Tạo danh mục cho website." : "Chỉnh sửa thông tin danh mục."}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <CategoryForm />
      </div>
    </div>
  )
}
