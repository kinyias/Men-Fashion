import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface BlogPost {
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  category: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    title: "Tiêu đề 1",
    excerpt: "Mô tả 1.",
    image: "/assets/products/1.png",
    date: "May 15, 2025",
    author: "Admin",
    category: "Style Guide",
    slug: "essential-guide-mens-summer-wardrobe",
  },
  {
    title: "Tiêu đề 2",
    excerpt: "Mô tả 2.",
    image: "/assets/products/1.png",
    date: "April 28, 2025",
    author: "Admin",
    category: "Style Guide",
    slug: "how-to-care-for-leather-accessories",
  },
  {
    title: "Tiêu đề 3",
    excerpt: "Mô tả 3.",
    image: "/assets/products/1.png",
    date: "April 10, 2025",
    author: "Admin",
    category: "Style Guide",
    slug: "art-of-layering-fall-fashion-men",
  },
]

export function BlogSection() {
  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tin tức thời trang</h2>
            <p className="text-muted-foreground md:text-lg">Mẹo vặt về styles, hướng dẫn và hiểu biết về thời trang</p>
          </div>
          <Link href="#" className="group flex items-center gap-1 text-sm font-medium">
            Xem tất cả <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden transition-all duration-200 hover:shadow-md pt-0">
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  <h3 className="text-xl font-bold leading-tight">{post.title}</h3>
                </Link>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="text-sm">By {post.author}</div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Đọc thêm <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
