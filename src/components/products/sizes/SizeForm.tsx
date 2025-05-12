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
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { sizeFormSchema } from "@/lib/validations/size.validator"
import { KichCoFormValues } from "@/types"
import { createSize, getSizeById, updateSize } from "@/lib/api/api-sizes"

export default function SizeForm() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const sizeId = params?.id ? Number(params.id) : undefined
  const isEditMode = !!sizeId
  
  // Fetch size data if in edit mode
  const { data: size, isLoading: isLoadingSize } = useQuery({
    queryKey: ['size', sizeId],
    queryFn: () => getSizeById(sizeId!),
    enabled: isEditMode,
  })
  
  const form = useForm<KichCoFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      ten: size?.ten || "",
    },
  })
  
  useEffect(() => {
    if (size) {
      form.reset({
        ten: size.ten || "",
      });
    }
  }, [size, form]);
  
  // Create size mutation
  const createMutation = useMutation({
    mutationFn: (data: KichCoFormValues) => createSize(data),
    onSuccess: () => {
      toast.success('Tạo kích cỡ thành công')
      router.push('/admin/sizes')
      queryClient.invalidateQueries({ queryKey: ['sizes'] })
    },
    onError: (error) => {
      console.error("Error creating size:", error)
      toast.error('Tạo kích cỡ thất bại')
    }
  })
  
  // Update size mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: KichCoFormValues }) => 
      updateSize(id, data),
    onSuccess: () => {
      toast.success('Cập nhật kích cỡ thành công')
      router.push('/admin/sizes')
      queryClient.invalidateQueries({ queryKey: ['sizes'] })
      queryClient.invalidateQueries({ queryKey: ['size', sizeId] })
    },
    onError: (error) => {
      console.error("Error updating size:", error)
      toast.error('Cập nhật kích cỡ thất bại')
    }
  })
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  async function onSubmit(data: KichCoFormValues) {
    if (isEditMode && sizeId) {
      updateMutation.mutate({ id: sizeId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Cập nhật kích cỡ' : 'Thông tin kích cỡ'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingSize ? (
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
                      <FormLabel>Tên kích cỡ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên kích cỡ" {...field} />
                      </FormControl>
                      <FormDescription>Tên kích cỡ.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting || isLoadingSize}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingSize}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}