"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { categoryFormSchema } from "@/lib/validations/category.validator"



type CategoryFormValues = z.infer<typeof categoryFormSchema>

export default function CategoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      ten: "",
      mota: "",
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true)

    try {

      console.log("Form submitted:", data)
        toast.success('Tạo danh mục thành công')
     
       router.push('/admin/categories')
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error('Tạo danh mục thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="ten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục" {...field} />
                  </FormControl>
                  <FormDescription>Tên danh mục.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả cho danh mục (tùy chọn)"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Thông tin chi tiết về danh mục.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
