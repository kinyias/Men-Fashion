import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/api/api-report';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export function FeatureProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getFeaturedProducts(4), // Get top 4 featured products
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="relative h-[140px] w-full overflow-hidden bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {products?.map((product) => (
        <Card key={product.ma} className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <Link href={`/san-pham/${product.ma}`}>
             
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src={product.hinhanh || '/placeholder.svg'}
                  alt={product.ten}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge
                    variant="secondary"
                    className="bg-black/60 text-white hover:bg-black/70"
                  >
                    {product.danhMuc.ten}
                  </Badge>
                </div>
              </div>
              </Link>
              <div className="p-4">
                <Link href={`/san-pham/${product.ma}`}>
                  <h3 className="font-medium line-clamp-1 hover:text-primary transition duration-300">{product.ten}</h3>
                </Link>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {formatCurrency(product.giaban)}
                    </span>
                    {product.giagiam && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.giagiam)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Đã bán {product.totalSales}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Thương hiệu</span>
                    <span className="font-medium">
                      {product.thuongHieu.ten}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
