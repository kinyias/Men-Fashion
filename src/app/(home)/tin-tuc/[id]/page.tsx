'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams, usePathname } from 'next/navigation';
import {
  Facebook,
  Twitter,
  Linkedin,
  Calendar,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getBlogById, increaseBlogViews } from '@/lib/api';
import { formatDate } from '@/utils/formatTime';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap/tiptap-node/table-node/table-node.scss"
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss"
import { RelatedPosts } from '@/components/blog/BlogRelate';
export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const blogId = Number(params?.id?.split('-').pop());
  const pathname = usePathname();
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Build the full URL
    setUrl(window.location.origin + pathname);
  }, [pathname]);
  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const shareToX = () => {
    const text = encodeURIComponent('Check this out!');
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };
  const shareToLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };
  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlogById(blogId),
    retry: false,
  });
  if (!blog && !isLoading) {
    notFound();
  }
  // Increase view count when blog is loaded
  useEffect(() => {
    if (!blog?.ma) return;
  
    const viewData = JSON.parse(localStorage.getItem('postViews') || '{}');
    const lastView = viewData[blog.ma];
    const now = Date.now();
  
    if (!lastView || now - lastView > 5 * 60 * 1000) {
      increaseBlogViews(blog.ma);
  
      viewData[blog.ma] = now;
      localStorage.setItem('postViews', JSON.stringify(viewData));
    }
  }, [blog?.ma, increaseBlogViews]);

  return (
    <div className="container px-4 md:px-6 py-12 mx-auto">
      {/* Hero Section */}
      <div className="relative mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-48" />
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {blog?.tieude}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog?.ngaydang || '')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blog?.soluotxem} lượt xem</span>
              </div>
              {blog?.loaitin && (
                <Badge variant="secondary">{blog.loaitin.tenloaitin}</Badge>
              )}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto">
        {/* Featured Image */}
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <Image
              src={blog?.hinhdaidien || '/placeholder.svg'}
              alt={blog?.tieude || ''}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none mb-12">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-4" />
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: blog?.noidung || '' }} />
          )}
        </div>

        {/* Share */}
        <div className="mb-12">
          <p className="text-sm font-medium mb-4">Chia sẻ bài viết</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={shareToFacebook}>
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Chia sẻ lên Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={shareToX}>
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Chia sẻ lên Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={shareToLinkedIn}>
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Chia sẻ lên LinkedIn</span>
            </Button>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link href="/tin-tuc" className="group">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Quay lại danh sách
            </div>
          </Link>
        </div>
      </div>
      <RelatedPosts currentId={blogId} />
    </div>
  );
}
