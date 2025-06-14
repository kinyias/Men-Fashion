import { Card, CardContent } from '@/components/ui/card';

import { useQuery } from '@tanstack/react-query';
import { getRelatedBlogs } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from './BlogCard';

export function RelatedPosts({ currentId }: { currentId: number }) {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['relatedPosts', currentId],
    queryFn: () => getRelatedBlogs(currentId, 4),
  });
  console.log(relatedPosts)
  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">
            Bài viết liên quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[16/9] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">
          Bài viết liên quan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <BlogCard key={post.ma} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
