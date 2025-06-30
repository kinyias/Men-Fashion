'use client';
// import type { Metadata } from "next"
import ProductDetail from '@/components/products/detail/ProductDetail';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import '@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/components/tiptap/tiptap-node/table-node/table-node.scss';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { ProductRelate } from '@/components/products/ProductRelate';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailClient({productId}: {productId: number}) {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId!),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/san-pham">Sản phẩm</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Đang tải...</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Image Gallery Skeleton - Left Side */}
          <div className="md:col-span-1 lg:col-span-7">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>

          {/* Product Info Skeleton - Right Side */}
          <div className="md:col-span-1 lg:col-span-5">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </div>

              <Skeleton className="h-8 w-1/3" />

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-md" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isError || !product) {
    return (
      <div className="container px-4 py-16 mx-auto">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/san-pham">Sản phẩm</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Không tìm thấy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-4xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </div>
          <p className="text-lg text-gray-600">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/san-pham">Sản phẩm</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.ten}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ProductDetail product={product} />
      <Separator className="my-6" />
      <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
      <ProductRelate product={product} />
    </div>
  );
}
