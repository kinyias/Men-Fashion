"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { categoryFormSchema } from "@/lib/validations/category.validator"
import { DanhMucFormValues } from "@/types"
import { createCategory, getCategoryById, updateCategory } from "@/lib/api/api-categories"

export default function CategoryForm() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const categoryId = params?.id ? Number(params.id) : undefined
  const isEditMode = !!categoryId
  
  
  // Fetch category data if in edit mode
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryById(categoryId!),
    enabled: isEditMode,
  })
  const form = useForm<DanhMucFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      ten: category?.ten || "",
      mota: category?.mota || "",
    },
  })
  useEffect(() => {
    if (category) {
      form.reset({
        ten: category.ten || "",
        mota: category.mota || "",
      });
    }
  }, [category, form]);
  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: DanhMucFormValues) => createCategory(data),
    onSuccess: () => {
      toast.success('Tạo danh mục thành công')
      router.push('/admin/categories')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      console.error("Error creating category:", error)
      toast.error('Tạo danh mục thất bại')
    }
  })
  
  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: DanhMucFormValues }) => 
      updateCategory(id, data),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công')
      router.push('/admin/categories')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] })
    },
    onError: (error) => {
      console.error("Error updating category:", error)
      toast.error('Cập nhật danh mục thất bại')
    }
  })
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  async function onSubmit(data: DanhMucFormValues) {
    if (isEditMode && categoryId) {
      updateMutation.mutate({ id: categoryId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Cập nhật danh mục' : 'Thông tin danh mục'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingCategory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting || isLoadingCategory}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingCategory}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
