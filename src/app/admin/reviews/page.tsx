import { ReviewTable } from "@/components/reviews/ReviewTable"

export default function AdminReviewsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <ReviewTable />
        </div>
      </div>
    </div>
  )
}
