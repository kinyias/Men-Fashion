'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getHotBlogs } from '@/lib/api/api-blogs';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogSection() {
  const { data: blogResponse, isLoading } = useQuery({
    queryKey: ['hot-blogs'],
    queryFn: getHotBlogs,
  });

  const blogs = blogResponse?.data || [];

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="space-y-2">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-6 w-[400px]" />
            </div>
            <Skeleton className="h-6 w-[100px]" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="overflow-hidden transition-all duration-200 hover:shadow-md pt-0"
              >
                <Skeleton className="aspect-[16/9] w-full" />
                <CardHeader className="p-4 pb-0">
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%] mt-2" />
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[100px]" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Tin tức thời trang
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Mẹo vặt về styles, hướng dẫn và hiểu biết về thời trang
            </p>
          </div>
          <Link
            href="/tin-tuc"
            className="group flex items-center gap-1 text-sm font-medium"
          >
            Xem tất cả{' '}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.slice(0, 3).map((post) => (
            <Card
              key={post.ma}
              className="overflow-hidden transition-all duration-200 hover:shadow-md pt-0"
            >
              <Link href={`/tin-tuc/${post.ma}`}>
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={post.hinhdaidien || '/placeholder.svg'}
                  alt={post.tieude}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              </Link>
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>
                    {format(new Date(post.ngaydang), 'dd MMMM, yyyy', {
                      locale: vi,
                    })}
                  </span>
                  <span>•</span>
                  <span>{post.loaitin?.tenloaitin}</span>
                </div>
                <Link href={`/tin-tuc/${post.ma}`} className="hover:underline">
                  <h3 className="text-xl font-bold leading-tight">
                    {post.tieude}
                  </h3>
                </Link>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-muted-foreground line-clamp-2">
                  {post.noidung}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="text-sm">
                  By{' '}
                  {post.nguoiDung
                    ? `${post.nguoiDung.ho} ${post.nguoiDung.ten}`
                    : 'Admin'}
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={`/tin-tuc/${post.ma}`}>
                    Đọc thêm <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
