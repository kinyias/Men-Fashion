"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { loaiSanPhamFormSchema } from "@/lib/validations/subCategory.validator"
import { LoaiSanPhamFormValues } from "@/types/sub-category"
import { createSubCategory, getSubCategoryById, updateSubCategory } from "@/lib/api/api-sub-categories"
import { getCategories } from "@/lib/api/api-categories"
import { UploadButton } from "@/utils/uploadthing"
import axios from "axios"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "../ui/skeleton"

export default function SubCategoryForm() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const subCategoryId = params?.id ? Number(params.id) : undefined
  const isEditMode = !!subCategoryId
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  
  // Fetch sub-category data if in edit mode
  const { data: subCategory, isLoading: isLoadingSubCategory } = useQuery({
    queryKey: ['sub-category', subCategoryId],
    queryFn: () => getSubCategoryById(subCategoryId!),
    enabled: isEditMode,
  })
  // Fetch categories for dropdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories-dropdown'],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
  })
  const categories = categoriesData?.data || []
  
  const form = useForm<LoaiSanPhamFormValues>({
    resolver: zodResolver(loaiSanPhamFormSchema),
    defaultValues: {
      ten: subCategory?.ten || "",
      mota: subCategory?.mota || "",
      hinhanh: subCategory?.hinhanh || "",
      noibat: subCategory?.noibat || false,
      madanhmuc: subCategory?.madanhmuc || undefined,
    },
  })
  
  useEffect(() => {
    if (subCategory) {
      form.reset({
        ten: subCategory.ten || "",
        mota: subCategory.mota || "",
        hinhanh: subCategory.hinhanh || "",
        noibat: subCategory.noibat || false,
        madanhmuc: subCategory.madanhmuc,
      });
    }
  }, [subCategory, form]);
  
  // Create sub-category mutation
  const createMutation = useMutation({
    mutationFn: (data: LoaiSanPhamFormValues) => createSubCategory(data),
    onSuccess: () => {
      toast.success('Tạo loại sản phẩm thành công')
      router.push('/admin/sub-category')
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
    },
    onError: (error) => {
      console.error("Error creating sub-category:", error)
      toast.error('Tạo loại sản phẩm thất bại')
    }
  })
  
  // Update sub-category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: LoaiSanPhamFormValues }) => 
      updateSubCategory(id, data),
    onSuccess: () => {
      toast.success('Cập nhật loại sản phẩm thành công')
      router.push('/admin/sub-category')
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
      queryClient.invalidateQueries({ queryKey: ['sub-category', subCategoryId] })
    },
    onError: (error) => {
      console.error("Error updating sub-category:", error)
      toast.error('Cập nhật loại sản phẩm thất bại')
    }
  })
  const handleImageDelete = (image: string) => {
    const imageKey = image.substring(image.lastIndexOf('/') + 1);

    axios
      .post('/api/uploadthing/delete', { imageKey })
      .then((res) => {
        if (res.data.success) {
          form.setValue('hinhanh', '');
          toast.success('Hình ảnh đã được xoá');
        }
      })
      .catch(() => {
        toast.error('Đã xảy ra lỗi khi xoá hình ảnh');
      })
  };
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  async function onSubmit(data: LoaiSanPhamFormValues) {
    if (isEditMode && subCategoryId) {
      updateMutation.mutate({ id: subCategoryId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Cập nhật loại sản phẩm' : 'Thông tin loại sản phẩm'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingSubCategory ? (
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
                      {isLoadingCategories ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
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
                  )}
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

              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting || isLoadingSubCategory}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingSubCategory}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu"}
            </Button>
          </CardFooter>
        </Card>
        </div>
        <div className="space-y-6">
        <Card>
          <CardContent className="space-y-6">
            {isLoadingSubCategory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="hinhanh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh đại diện</FormLabel>
                      <FormControl>
                      <div className="space-y-4">
                          {field.value && (
                            <div className="relative w-full h-full overflow-hidden rounded-md">
                              <Image 
                                src={field.value} 
                                alt="Ảnh đại diện" 
                                className="object-cover w-full h-full"
                                width={500}
                                height={300}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => field.value && handleImageDelete(field.value)}
                              >
                                Xóa
                              </Button>
                            </div>
                          )}
                          
                          {!field.value && (
                            <div className="flex flex-col items-center h-full max-w-[500px] p-6 border-2 border-dashed border-primary/50 rounded">
                              {isUploading && (
                                <div className="w-full mb-4">
                                  <p className="text-sm text-muted-foreground mb-2 text-center">
                                    Đang tải lên: {uploadProgress/100}%
                                  </p>
                                  <Progress value={uploadProgress} className="h-2" />
                                </div>
                              )}
                              
                              <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => {
                                  setIsUploading(true);
                                  setUploadProgress(0);
                                }}
                                onUploadProgress={(progress) => {
                                  setUploadProgress(Math.round(progress * 100));
                                }}
                                onClientUploadComplete={(res) => {
                                  // Update the form field with the uploaded image URL
                                  field.onChange(res[0].url);
                                  
                                  // Reset upload state
                                  setIsUploading(false);
                                  setUploadProgress(0);
                                  
                                  // Show success toast
                                  toast.success("Tải ảnh lên thành công");
                                }}
                                onUploadError={(error: Error) => {
                                  // Reset upload state
                                  setIsUploading(false);
                                  setUploadProgress(0);
                                  
                                  // Show error toast
                                  toast.error(`Lỗi tải ảnh: ${error.message}`);
                                }}
                                appearance={{
                                  button: "bg-blue-500 text-primary-foreground hover:bg-primary/90 px-5",
                                  allowedContent: "text-sm text-muted-foreground",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Hình ảnh đại diện cho loại sản phẩm.</FormDescription>
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
                          Đánh dấu loại sản phẩm này là nổi bật để hiển thị ưu tiên.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}