import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Blog } from '@/types';
import { formatDate } from '@/utils/formatTime';
import { ChevronRight } from 'lucide-react';
export default function BlogCard({ post }: { post: Blog }) {
  const htmlToText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  return (
    <Card
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
          <span>{formatDate(post.ngaydang)}</span>
          <span>•</span>
          <span>{post.loaitin?.tenloaitin}</span>
        </div>
        <Link href={`/tin-tuc/${post.ma}`} className="hover:underline">
          <h3 className="text-xl font-bold leading-tight">{post.tieude}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground line-clamp-2">{htmlToText(post.noidung)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-sm">
          {post.soluotxem} lượt xem
        </div>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href={`/tin-tuc/${post.ma}`}>
            Đọc thêm <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
