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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { subCategoryFormSchema } from "@/lib/validations/subCategory.validator"

type SubCategoryFormValues = z.infer<typeof subCategoryFormSchema>

// Sample categories for dropdown
const categories = [
  { ma: 1, ten: "Áo" },
  { ma: 2, ten: "Quần" },
  { ma: 3, ten: "Giày" },
  { ma: 4, ten: "Phụ kiện" },
]

export default function SubCategoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      ten: "",
      mota: "",
      hinhanh: "",
      noibat: false,
      madanhmuc: 1,
    },
  })

  async function onSubmit(data: SubCategoryFormValues) {
    setIsSubmitting(true)

    try {
      console.log("Form submitted:", data)
      toast.success('Tạo loại sản phẩm thành công')
      router.push('/admin/sub-category')
    } catch (error) {
      console.error("Error creating sub-category:", error)
      toast.error('Tạo loại sản phẩm thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin loại sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="ten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại sản phẩm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên loại sản phẩm" {...field} />
                  </FormControl>
                  <FormDescription>Tên loại sản phẩm.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="madanhmuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.ma} value={category.ma.toString()}>
                          {category.ten}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Danh mục chứa loại sản phẩm này.</FormDescription>
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
                      placeholder="Nhập mô tả cho loại sản phẩm (tùy chọn)"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Thông tin chi tiết về loại sản phẩm.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hinhanh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đường dẫn hình ảnh" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Đường dẫn hình ảnh đại diện cho loại sản phẩm.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noibat"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Nổi bật</FormLabel>
                    <FormDescription>
                      Đánh dấu loại sản phẩm này là nổi bật.
                    </FormDescription>
                  </div>
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