'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getHotBlogs } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from './BlogCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

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

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full mt-10"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className="pl-2 md:pl-4 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
                  >
                    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md pt-0">
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
                  </CarouselItem>
                ))
              : blogs.map((post) => (
                  <CarouselItem
                    key={post.ma}
                    className="pl-2 md:pl-4 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
                  >
                    <BlogCard post={post} />
                  </CarouselItem>
                ))}
          </CarouselContent>

          {/* Navigation controls */}
          {(!isLoading && blogs.length > 3) &&
            (<div className="hidden md:block">
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </div>)}

          {(!isLoading && blogs.length > 1) &&
            (<div className="flex justify-center gap-2 mt-4 md:hidden">
              <CarouselPrevious className="static translate-y-1 translate-x-0 transform-none mx-1" />
              <CarouselNext className="static translate-y-1 translate-x-0 transform-none mx-1" />
            </div>)}
        </Carousel>
      </div>
    </section>
  );
}
