import { BlogListingContent } from "@/components/blog/BlogListingContent"
import { BlogListingSkeleton } from "@/components/skeleton/BlogListingSkeleton"
import { Suspense } from "react"

export default function AllBlogsPage() {
  return (
        <Suspense fallback={<BlogListingSkeleton />}>
          <BlogListingContent />
        </Suspense>
  )
}
