import { BlogSection } from '@/components/blog/BlogSection';
import FeatureCategory from '@/components/categories/FeatureCategory';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import NewsletterSection from '@/components/home/NewsletterSection';
import { FeatureProduct } from '@/components/products/FeatureProduct';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <div className="container mx-auto">
        <section className="py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Danh mục nổi bật
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Hàng được tuyển chọn trang phục nam cao cấp
                </p>
              </div>
              <Link
                href="#"
                className="group flex items-center gap-1 text-sm font-medium"
              >
                Xem tất cả
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-10">
              <FeatureCategory />
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sản phẩm nổi bật</h2>
                <p className="text-muted-foreground md:text-lg">Những sản phẩm nổi bật nhất</p>
              </div>
              <Link href="#" className="group flex items-center gap-1 text-sm font-medium">
                Xem tất cả <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-10">
        <FeatureProduct />
            </div>
          </div>
        </section>

        <BlogSection />
      </div>
        <NewsletterSection />
    </>
  );
}
