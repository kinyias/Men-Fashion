"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Star, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { reviewFormSchema } from "@/lib/validations/review.validator"
import { useAuth } from "@/context/auth-provider"
import { createReview } from "@/lib/api/api-reviews"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DanhGiaFormValues } from "@/types"
import Image from "next/image"

interface WriteReviewModalProps {
  productId: number
  onClose: () => void
}

export function WriteReviewModal({ productId, onClose }: WriteReviewModalProps) {
  const [images, setImages] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<DanhGiaFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      sosao: 0,
      binhluan: "",
      hinhAnh: undefined,
    },
  })

  // Create review mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (data: DanhGiaFormValues) =>{ 
      const reviewData = {
        ...data,
        masp: productId,
      }
      return createReview(reviewData)},
    onSuccess: () => {
      // Invalidate and refetch reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      
      toast.success("Đánh giá của bạn đã được gửi thành công")
      onClose()
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Không thể gửi đánh giá'
      toast.error(message)
    }
  })

  const handleSubmit = (data: DanhGiaFormValues) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để đánh giá sản phẩm")
      return
    }
    
    // Prepare the review data
    const reviewData: DanhGiaFormValues = {
      sosao: data.sosao,
      binhluan: data.binhluan,
      hinhAnh: images.length > 0 ? images[0] : undefined, // Currently only supporting one image
    }
    
    // Submit using mutation
    mutate(reviewData)
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const imageUrl = URL.createObjectURL(file)
      setImages((prev) => [...prev, imageUrl])
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const renderStarRating = (value: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-200"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Viết đánh giá</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Star Rating */}
            <FormField
              control={form.control}
              name="sosao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá *</FormLabel>
                  <FormControl>
                    <div>{renderStarRating(field.value, field.onChange)}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="binhluan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá của bạn *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload */}
            <div>
              <Label>Thêm ảnh (Tùy chọn)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-gray-300"
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  handleImageUpload(e.dataTransfer.files)
                }}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Kéo thả ảnh hoặc click để tìm kiếm</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  id="photo-upload"
                />
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" className="mt-2">
                    Chọn file
                  </Button>
                </Label>
              </div>

              {images.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Hủy
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
