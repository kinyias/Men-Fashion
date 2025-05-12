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
import { thuongHieuFormSchema } from "@/lib/validations/brand.validator"
import { ThuongHieuFormValues } from "@/types"
import { createBrand, getBrandById, updateBrand } from "@/lib/api/api-brands"

export default function BrandForm() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const brandId = params?.id ? Number(params.id) : undefined
  const isEditMode = !!brandId
  
  // Fetch brand data if in edit mode
  const { data: brand, isLoading: isLoadingBrand } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => getBrandById(brandId!),
    enabled: isEditMode,
  })
  
  const form = useForm<ThuongHieuFormValues>({
    resolver: zodResolver(thuongHieuFormSchema),
    defaultValues: {
      ten: brand?.ten || "",
      mota: brand?.mota || "",
    },
  })
  
  useEffect(() => {
    if (brand) {
      form.reset({
        ten: brand.ten || "",
        mota: brand.mota || "",
      });
    }
  }, [brand, form]);
  
  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: (data: ThuongHieuFormValues) => createBrand(data),
    onSuccess: () => {
      toast.success('Tạo thương hiệu thành công')
      router.push('/admin/brands')
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onError: (error) => {
      console.error("Error creating brand:", error)
      toast.error('Tạo thương hiệu thất bại')
    }
  })
  
  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: ThuongHieuFormValues }) => 
      updateBrand(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thương hiệu thành công')
      router.push('/admin/brands')
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      queryClient.invalidateQueries({ queryKey: ['brand', brandId] })
    },
    onError: (error) => {
      console.error("Error updating brand:", error)
      toast.error('Cập nhật thương hiệu thất bại')
    }
  })
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  async function onSubmit(data: ThuongHieuFormValues) {
    if (isEditMode && brandId) {
      updateMutation.mutate({ id: brandId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Cập nhật thương hiệu' : 'Thông tin thương hiệu'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingBrand ? (
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
                      <FormLabel>Tên thương hiệu</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên thương hiệu" {...field} />
                      </FormControl>
                      <FormDescription>Tên thương hiệu.</FormDescription>
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
                          placeholder="Nhập mô tả cho thương hiệu (tùy chọn)"
                          className="min-h-32"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Thông tin chi tiết về thương hiệu.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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