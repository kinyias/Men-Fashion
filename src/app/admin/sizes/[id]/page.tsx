'use client';

import SizeForm from "@/components/products/sizes/SizeForm"
import { use } from "react";

export default function SizesEditPage({ params }: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const isNewSize = id === "create";
  
  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewSize ? "Tạo kích cỡ" : "Chỉnh sửa kích cỡ"}
          </h1>
          <p className="text-muted-foreground">
            {isNewSize ? "Tạo kích cỡ cho website." : "Chỉnh sửa thông tin kích cỡ."}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <SizeForm />
      </div>
    </div>
  )
}